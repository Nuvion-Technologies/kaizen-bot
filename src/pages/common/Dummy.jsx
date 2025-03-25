import React, { useEffect, useState, useRef } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify'; // Assuming you use react-toastify for notifications
import 'react-toastify/dist/ReactToastify.css';

const StockStreamComponent = () => {
    const [socketConnected, setSocketConnected] = useState(false);
    const [liveStockData, setLiveStockData] = useState({});
    const socketRef = useRef(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No authentication token found. Please log in.');
            console.error('No JWT token found in localStorage');
            return;
        }
        console.log('JWT Token:', token);

        const apiUrl = import.meta.env.VITE_API_URL;
        if (!apiUrl) {
            toast.error('API URL not defined in environment variables');
            console.error('VITE_API_URL is undefined. Check .env file');
            return;
        }
        const wsUrl = `${apiUrl}/stream`;
        console.log('Attempting to connect to WebSocket at:', wsUrl);

        // Initialize Socket.IO client
        const socket = io(wsUrl, {
            auth: { token }, // Send JWT token for authentication
            transports: ['websocket'],
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });
        socketRef.current = socket;

        // Handle successful connection
        socket.on('connect', () => {
            console.log('WebSocket connected successfully');
            setSocketConnected(true);
            toast.success('Connected to stock stream');
        });

        // Handle connection errors
        socket.on('connect_error', (error) => {
            console.error('WebSocket connection error:', error.message);
            toast.error(`Connection failed: ${error.message}`);
            setSocketConnected(false);
        });

        // Handle stock stream events from backend
        socket.on('stock_stream', (data) => {
            console.log('Received stock stream data:', JSON.stringify(data, null, 2));

            switch (data.message) {
                case 'New tick':
                    if (data.data) {
                        const { token, last_traded_price, exchange_timestamp } = data.data;
                        setLiveStockData((prev) => {
                            const updated = {
                                ...prev,
                                [token]: {
                                    ltp: last_traded_price ? last_traded_price / 100 : prev[token]?.ltp, // Convert paisa to rupees
                                    lastTradeTime: exchange_timestamp
                                        ? new Date(exchange_timestamp).toLocaleString('en-IN')
                                        : prev[token]?.lastTradeTime,
                                },
                            };
                            console.log('Updated liveStockData:', updated);
                            return updated;
                        });
                    }
                    break;

                case 'Connected to stock stream':
                    console.log('Connection confirmed with server');
                    toast.info('WebSocket connection established');
                    break;

                case 'No stocks subscribed':
                    toast.info('No active stocks subscribed');
                    console.log('No stocks to stream');
                    break;

                case 'WebSocket error':
                    toast.error(`Stream error: ${data.error}`);
                    console.error('WebSocket error:', data.error);
                    break;

                case 'WebSocket closed':
                    toast.warn('WebSocket connection closed');
                    console.log('WebSocket closed by server');
                    break;

                case 'WebSocket setup failed':
                    toast.error(`Setup failed: ${data.error}`);
                    console.error('WebSocket setup error:', data.error);
                    break;

                default:
                    if (data.message && data.message.includes('Unauthorized')) {
                        toast.error(data.message);
                        console.error('Authorization error:', data.message);
                        socket.disconnect();
                    } else {
                        console.log('Unhandled message:', data.message);
                    }
            }
        });

        // Handle disconnection
        socket.on('disconnect', (reason) => {
            console.log('WebSocket disconnected. Reason:', reason);
            setSocketConnected(false);
            toast.warn(`Disconnected from stock stream: ${reason}`);
        });

        // Cleanup on unmount
        return () => {
            console.log('Disconnecting WebSocket');
            if (socketRef.current) {
                socketRef.current.disconnect();
            }
        };
    }, []);


    console.log("WebSocket connecting...");

    return (
        <div style={{ padding: '20px' }}>
            <h1>Live Stock Stream</h1>
            <p>Socket Status: {socketConnected ? 'Connected' : 'Disconnected'}</p>
            {Object.keys(liveStockData).length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Token</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Traded Price (₹)</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Trade Time</th>
                    </tr>
                    </thead>
                    <tbody>
                    {Object.entries(liveStockData).map(([token, data]) => (
                        <tr key={token}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{token}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.ltp.toFixed(2)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{data.lastTradeTime}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            ) : (
                <p>No stock data available yet</p>
            )}
        </div>
    );
};

export default StockStreamComponent;
