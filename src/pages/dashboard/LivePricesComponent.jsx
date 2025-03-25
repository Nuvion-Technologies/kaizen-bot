// import React,{ useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
//
// const LivePricesComponent = () => {
//     const [livePrices, setLivePrices] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     // Function to fetch live prices from the backend
//     const fetchLivePrices = async () => {
//         const token = localStorage.getItem('token'); // Assuming token is stored as 'token'
//         if (!token) {
//             toast.error('No authentication token found. Please log in.');
//             setError('No token found');
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             const data = await response.json();
//             console.log(data);
//             if (data.status === 'success') {
//                 setLivePrices(data.data); // Update state with live prices
//                 setError(null);
//                 console.log('Fetched live prices:', data.data);
//             } else {
//                 throw new Error(data.message || 'Failed to fetch live prices');
//             }
//         } catch (err) {
//             console.error('Error fetching live prices:', err.message);
//             setError(err.message);
//             toast.error(`Failed to fetch live prices: ${err.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//
//     // Effect to fetch data every 1 second
//     useEffect(() => {
//         // Initial fetch
//         fetchLivePrices();
//
//         // Set up interval to fetch every 1 second
//         const intervalId = setInterval(() => {
//             fetchLivePrices();
//         }, 1000); // 1000 ms = 1 second
//
//         // Cleanup interval on component unmount
//         return () => {
//             console.log('Cleaning up live prices interval');
//             clearInterval(intervalId);
//         };
//     }, []); // Empty dependency array to run once on mount
//
//     // Render the live prices
//     return (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Live Prices {loading ? '(Loading...)' : ''}
//             </h3>
//             {error && (
//                 <p className="text-red-600 mb-4">{error}</p>
//             )}
//             {Object.keys(livePrices).length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Symbol</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
//                             {/* Add more headers based on live_prices structure */}
//                         </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                         {Object.entries(livePrices).map(([symbol, price]) => (
//                             <tr key={symbol} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{symbol}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{(price / 100).toLocaleString('en-IN', { minimumFractionDigits: 2 })} {/* Assuming price in paisa */}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No live prices available yet.</p>
//             )}
//         </div>
//     );
// };
//
// export default LivePricesComponent;


// import React,{ useEffect, useState } from 'react';
// import { toast } from 'react-toastify';
//
// const LivePricesComponent = () => {
//     const [livePrices, setLivePrices] = useState({});
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState(null);
//
//     // Function to fetch live prices from the backend
//     const fetchLivePrices = async () => {
//         const token = localStorage.getItem('token'); // Adjust if your token key differs
//         if (!token) {
//             toast.error('No authentication token found. Please log in.');
//             setError('No token found');
//             return;
//         }
//
//         setLoading(true);
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
//                 method: 'GET',
//                 headers: {
//                     'Authorization': `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             const data = await response.json();
//             if (data.status === 'success') {
//                 setLivePrices(data.data); // Update state with live prices object
//                 setError(null);
//                 console.log('Fetched live prices:', data.data);
//             } else {
//                 throw new Error(data.message || 'Failed to fetch live prices');
//             }
//         } catch (err) {
//             console.error('Error fetching live prices:', err.message);
//             setError(err.message);
//             toast.error(`Failed to fetch live prices: ${err.message}`);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Effect to fetch data every 1 second
//     useEffect(() => {
//         // Initial fetch
//         fetchLivePrices();
//
//         // Set up interval to fetch every 1 second
//         const intervalId = setInterval(() => {
//             fetchLivePrices();
//         }, 1000); // 1000 ms = 1 second
//
//         // Cleanup interval on component unmount
//         return () => {
//             console.log('Cleaning up live prices interval');
//             clearInterval(intervalId);
//         };
//     }, []); // Empty dependency array to run once on mount
//
//     // Render the live prices
//     return (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Live Prices {loading ? '(Loading...)' : ''}
//             </h3>
//             {error && (
//                 <p className="text-red-600 mb-4">{error}</p>
//             )}
//             {Object.keys(livePrices).length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Token</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Name</th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Price</th>
//                         </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                         {Object.entries(livePrices).map(([token, { name, price }]) => (
//                             <tr key={token} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{token}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No live prices available yet.</p>
//             )}
//         </div>
//     );
// };
//
// export default LivePricesComponent;






// import React, { useEffect, useState, useRef } from 'react';
// import { toast } from 'react-toastify';
//
// const LivePricesComponent = () => {
//     const [livePrices, setLivePrices] = useState({});
//     const [initialLoading, setInitialLoading] = useState(true); // For initial load only
//     const [error, setError] = useState(null);
//     const [hasData, setHasData] = useState(true); // Track if there’s data to fetch
//     const intervalRef = useRef(null); // Store interval ID
//
//     // Function to fetch live prices from the backend
//     const fetchLivePrices = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             toast.error('No authentication token found. Please log in.');
//             setError('No token found');
//             setHasData(false); // Stop further requests
//             return;
//         }
//
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             const data = await response.json();
//             if (data.status === 'success') {
//                 if (Object.keys(data.data).length === 0) {
//                     setHasData(false); // No stocks subscribed, stop polling
//                     setLivePrices({});
//                     setError('No stocks subscribed');
//                     console.log('No live price data available');
//                 } else {
//                     setHasData(true);
//                     setLivePrices(data.data);
//                     setError(null);
//                     console.log('Fetched live prices:', data.data);
//                 }
//             } else {
//                 throw new Error(data.message || 'Failed to fetch live prices');
//             }
//         } catch (err) {
//             console.error('Error fetching live prices:', err.message);
//             setError(err.message);
//             toast.error(`Failed to fetch live prices: ${err.message}`);
//             setHasData(false); // Stop polling on error
//         } finally {
//             setInitialLoading(false); // Only affects initial load
//         }
//     };
//
//     // Effect to fetch data and manage polling
//     useEffect(() => {
//         // Initial fetch
//         fetchLivePrices();
//
//         // Set up polling only if there’s data
//         intervalRef.current = setInterval(() => {
//             if (hasData) {
//                 fetchLivePrices(); // Only fetch if there’s data
//             }
//         }, 1000); // 1-second polling
//
//         // Cleanup interval on unmount
//         return () => {
//             console.log('Cleaning up live prices interval');
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//             }
//         };
//     }, []); // Empty dependency array for mount only
//
//     // Render the live prices
//     return (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Live Prices {initialLoading ? '(Loading...)' : ''}
//             </h3>
//             {error && <p className="text-red-600 mb-4">{error}</p>}
//             {initialLoading ? (
//                 <p className="text-gray-500">Fetching initial prices...</p>
//             ) : Object.keys(livePrices).length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Token
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Price
//                             </th>
//                         </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                         {Object.entries(livePrices).map(([token, { name, price }]) => (
//                             <tr key={token} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     {token}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No live prices available yet.</p>
//             )}
//         </div>
//     );
// };
//
// export default LivePricesComponent;



// import React, { useEffect, useState, useRef } from 'react';
// import { toast } from 'react-toastify';
//
// const LivePricesComponent = () => {
//     const [livePrices, setLivePrices] = useState({});
//     const [initialLoading, setInitialLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [hasData, setHasData] = useState(false); // Start with false, only true when stocks exist
//     const intervalRef = useRef(null);
//
//     // Function to fetch live prices from the backend
//     const fetchLivePrices = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             toast.error('No authentication token found. Please log in.');
//             setError('No token found');
//             setHasData(false);
//             return;
//         }
//
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             console.log("live lridihdbdbdbdf",response);
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             const data = await response.json();
//             if (data.status === 'success') {
//                 if (Object.keys(data.data).length === 0) {
//                     setHasData(false); // No stocks, don't poll
//                     setLivePrices({});
//                     setError('No stocks subscribed');
//                     console.log('No live price data available');
//                 } else {
//                     setHasData(true); // Stocks exist, enable polling
//                     setLivePrices(data.data);
//                     setError(null);
//                     console.log('Fetched live prices:', data.data);
//                 }
//             } else {
//                 throw new Error(data.message || 'Failed to fetch live prices');
//             }
//         } catch (err) {
//             console.error('Error fetching live prices:', err.message);
//             setError(err.message);
//             toast.error(`Failed to fetch live prices: ${err.message}`);
//             setHasData(false);
//         } finally {
//             setInitialLoading(false);
//         }
//     };
//
//     // Effect to fetch data and manage polling
//     useEffect(() => {
//         // Initial fetch
//         fetchLivePrices();
//
//         // Set up polling
//         intervalRef.current = setInterval(() => {
//             if (hasData) { // Only fetch if there’s stock data
//                 fetchLivePrices();
//             }
//         }, 500);
//
//         // Cleanup interval on unmount
//         return () => {
//             console.log('Cleaning up live prices interval');
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//             }
//         };
//     }, []); // Empty dependency array for mount only
//
//     // Render the live prices
//     return (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Live Prices {initialLoading ? '(Loading...)' : ''}
//             </h3>
//             {error && <p className="text-red-600 mb-4">{error}</p>}
//             {initialLoading ? (
//                 <p className="text-gray-500">Fetching initial prices...</p>
//             ) : Object.keys(livePrices).length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Token
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Price
//                             </th>
//                         </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                         {Object.entries(livePrices).map(([token, { name, price }]) => (
//                             <tr key={token} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     {token}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No live prices available yet.</p>
//             )}
//         </div>
//     );
// };
//
// export default LivePricesComponent;










// import React, { useEffect, useState, useRef, useMemo } from 'react';
// import { toast } from 'react-toastify';
//
// const LivePricesComponent = () => {
//     const [livePrices, setLivePrices] = useState({});
//     const [initialLoading, setInitialLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [hasData, setHasData] = useState(false);
//     const intervalRef = useRef(null);
//     const tableRef = useRef(null);
//
//     // Fetch live prices from API
//     const fetchLivePrices = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             toast.error('No authentication token found. Please log in.');
//             setError('No token found');
//             setHasData(false);
//             return;
//         }
//
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             const data = await response.json();
//             if (data.status === 'success') {
//                 if (Object.keys(data.data).length === 0) {
//                     setHasData(false);
//                     setLivePrices({});
//                     setError('No stocks subscribed');
//                 } else {
//                     setHasData(true);
//                     setLivePrices(data.data);
//                     setError(null);
//                     console.log('Fetched live prices:', data.data);
//                 }
//             } else {
//                 throw new Error(data.message || 'Failed to fetch live prices');
//             }
//         } catch (err) {
//             console.error('Error fetching live prices:', err.message);
//             setError(err.message);
//             toast.error(`Failed to fetch live prices: ${err.message}`);
//             setHasData(false);
//         } finally {
//             setInitialLoading(false);
//         }
//     };
//
//     // Memoized price formatting function
//     const formatPrice = useMemo(() => {
//         return (price) =>
//             price.toLocaleString('en-IN', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2
//             });
//     }, []);
//
//     // Effect for initial fetch and polling setup
//     useEffect(() => {
//         fetchLivePrices();
//
//         intervalRef.current = setInterval(() => {
//             if (hasData) {
//                 fetchLivePrices();
//             }
//         }, 500);
//
//         return () => {
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//             }
//         };
//     }, [hasData]); // Depend on hasData to control polling
//
//     // Memoized table data to prevent unnecessary re-renders
//     const tableData = useMemo(() => {
//         return Object.entries(livePrices).map(([token, stockData]) => ({
//             token,
//             name: stockData.name,
//             price: stockData.price,
//             high: stockData.high_price_of_the_day,
//             low: stockData.low_price_of_the_day,
//             open: stockData.open_price,
//             volume: stockData.volume_trade_for_the_day,
//             week_high : stockData.week_high,
//             week_low: stockData.week_low,
//             total_buy_quantity: stockData.total_buy_quantity,
//             total_sell_quantity: stockData.total_sell_quantity,
//
//         }));
//     }, [livePrices]);
//
//     return (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Live Prices {initialLoading ? '(Loading...)' : ''}
//             </h3>
//             {error && <p className="text-red-600 mb-4">{error}</p>}
//             {initialLoading ? (
//                 <p className="text-gray-500">Fetching initial prices...</p>
//             ) : tableData.length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Token
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Price
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Open
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 High
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Low
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Volume
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 52 Week High
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 52 Week Low
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Total Buy Quantity
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Total sell quantity
//                             </th>
//                         </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                         {tableData.map((stock) => (
//                             <tr key={stock.token} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     {stock.token}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {stock.name}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{formatPrice(stock.price)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{formatPrice(stock.open)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
//                                     ₹{formatPrice(stock.high)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                                     ₹{formatPrice(stock.low)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {stock.volume.toLocaleString('en-IN')}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
//                                     ₹{formatPrice(stock.week_high)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                                     ₹{formatPrice(stock.week_low)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {formatPrice(stock.total_buy_quantity)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {formatPrice(stock.total_sell_quantity)}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No live prices available yet.</p>
//             )}
//         </div>
//     );
// };
//
// export default LivePricesComponent;










//
// import React, { useEffect, useState, useRef, useMemo } from 'react';
// import { toast } from 'react-toastify';
// import axios from "axios";
//
// const LivePricesComponent = () => {
//     const [livePrices, setLivePrices] = useState({});
//     const [initialLoading, setInitialLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [hasData, setHasData] = useState(false);
//     const intervalRef = useRef(null);
//     const tableRef = useRef(null);
//
//     // Fetch live prices from API
//     const fetchLivePrices = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             toast.error('No authentication token found. Please log in.');
//             setError('No token found');
//             setHasData(false);
//             return;
//         }
//
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             console.log("Tempulinddddd",response.data.data);
//
//             // if (!response.ok) {
//             //     throw new Error(`HTTP error! Status: ${response.status}`);
//             // }
//
//             const data = await response.json();
//             console.log("Gandu",data);
//             if (data.status === 'success') {
//                 if (Object.keys(data.data).length === 0) {
//                     setHasData(false);
//                     setLivePrices({});
//                     setError('No stocks subscribed');
//                 } else {
//                     setHasData(true);
//                     setLivePrices(data.data);
//                     setError(null);
//                     console.log('Fetched live prices:', data.data);
//                 }
//             } else {
//                 throw new Error(data.message || 'Failed to fetch live prices');
//             }
//         } catch (err) {
//             console.error('Error fetching live prices:', err.message);
//             setError(err.message);
//             toast.error(`Failed to fetch live prices: ${err.message}`);
//             setHasData(false);
//         } finally {
//             setInitialLoading(false);
//         }
//     };
//
//     // Memoized formatting functions
//     const formatPrice = useMemo(() => {
//         return (price) => price.toLocaleString('en-IN', {
//             minimumFractionDigits: 2,
//             maximumFractionDigits: 2
//         });
//     }, []);
//
//     const formatPercentage = useMemo(() => {
//         return (value) => value.toFixed(2) + '%';
//     }, []);
//
//     // Effect for initial fetch and polling setup
//     useEffect(() => {
//         fetchLivePrices();
//
//         intervalRef.current = setInterval(() => {
//             if (hasData) {
//                 fetchLivePrices();
//             }
//         }, 500);
//
//         return () => {
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//             }
//         };
//     }, [hasData]);
//
//     // Memoized table data with LTP % calculation
//     const tableData = useMemo(() => {
//         return Object.entries(livePrices).map(([token, stockData]) => {
//             // Calculate percentage difference from 52-week high
//             const ltpPercentFromHigh = ((stockData.week_high - stockData.price) / stockData.week_high) * 100;
//
//             return {
//                 token,
//                 name: stockData.name,
//                 price: stockData.price,
//                 high: stockData.high_price_of_the_day,
//                 low: stockData.low_price_of_the_day,
//                 open: stockData.open_price,
//                 volume: stockData.volume_trade_for_the_day,
//                 week_high: stockData.week_high,
//                 week_low: stockData.week_low,
//                 total_buy_quantity: stockData.total_buy_quantity,
//                 total_sell_quantity: stockData.total_sell_quantity,
//                 ltpPercentFromHigh: ltpPercentFromHigh
//             };
//         });
//     }, [livePrices]);
//
//     return (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Live Prices {initialLoading ? '(Loading...)' : ''}
//             </h3>
//             {error && <p className="text-red-600 mb-4">{error}</p>}
//             {initialLoading ? (
//                 <p className="text-gray-500">Fetching initial prices...</p>
//             ) : tableData.length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Token
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Price
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Open
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 High
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Low
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Volume
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 52 Week High
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 52 Week Low
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 LTP % from 52W High
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Total Buy Qty
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Total Sell Qty
//                             </th>
//                         </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                         {tableData.map((stock) => (
//                             <tr key={stock.token} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     {stock.token}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {stock.name}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{formatPrice(stock.price)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{formatPrice(stock.open)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
//                                     ₹{formatPrice(stock.high)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                                     ₹{formatPrice(stock.low)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {stock.volume.toLocaleString('en-IN')}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
//                                     ₹{formatPrice(stock.week_high)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                                     ₹{formatPrice(stock.week_low)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {formatPercentage(stock.ltpPercentFromHigh)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {formatPrice(stock.total_buy_quantity)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {formatPrice(stock.total_sell_quantity)}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No live prices available yet.</p>
//             )}
//         </div>
//     );
// };
//
// export default LivePricesComponent;

// import React, { useEffect, useState, useRef, useMemo } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
//
// const LivePricesComponent = () => {
//     const [livePrices, setLivePrices] = useState({});
//     const [initialLoading, setInitialLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [hasData, setHasData] = useState(false);
//     const intervalRef = useRef(null);
//     const tableRef = useRef(null);
//
//     // Fetch live prices from API
//     const fetchLivePrices = async () => {
//         const token = localStorage.getItem('token');
//         if (!token) {
//             toast.error('No authentication token found. Please log in.');
//             setError('No token found');
//             setHasData(false);
//             return;
//         }
//
//         try {
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//             // console.log('Live Prices Response:', response.data);
//
//             const data = response.data; // axios already parses JSON
//             if (data.status === 'success') {
//                 if (Object.keys(data.data || {}).length === 0) {
//                     setHasData(false);
//                     setLivePrices({});
//                     setError('No stocks subscribed');
//                 } else {
//                     setHasData(true);
//                     setLivePrices(data.data);
//                     setError(null);
//                     // console.log('Fetched live prices:', data.data);
//                 }
//             } else {
//                 throw new Error(data.message || 'Failed to fetch live prices');
//             }
//         } catch (err) {
//             console.error('Error fetching live prices:', err.message);
//             setError(err.message);
//             toast.error(`Failed to fetch live prices: ${err.message}`);
//             setHasData(false);
//         } finally {
//             setInitialLoading(false);
//         }
//     };
//
//     // Memoized formatting functions
//     const formatPrice = useMemo(() => {
//         return (price) =>
//             Number(price).toLocaleString('en-IN', {
//                 minimumFractionDigits: 2,
//                 maximumFractionDigits: 2,
//             });
//     }, []);
//
//     const formatPercentage = useMemo(() => {
//         return (value) => (isNaN(value) ? 'N/A' : value.toFixed(2) + '%');
//     }, []);
//
//     // Effect for initial fetch and polling setup
//     useEffect(() => {
//         fetchLivePrices();
//
//         intervalRef.current = setInterval(() => {
//             if (hasData) {
//                 fetchLivePrices();
//             }
//         }, 2000);
//
//         return () => {
//             if (intervalRef.current) {
//                 console.log('Cleaning up live prices interval');
//                 clearInterval(intervalRef.current);
//             }
//         };
//     }, [hasData]);
//
//     // Memoized table data with LTP % calculation
//     const tableData = useMemo(() => {
//         return Object.entries(livePrices).map(([token, stockData]) => {
//             const ltpPercentFromHigh = stockData.week_high
//                 ? ((stockData.week_high - stockData.price) / stockData.week_high) * 100
//                 : 0;
//
//             return {
//                 token,
//                 name: stockData.name || 'N/A',
//                 price: stockData.price || 0,
//                 high: stockData.high_price_of_the_day || 0,
//                 low: stockData.low_price_of_the_day || 0,
//                 open: stockData.open_price || 0,
//                 volume: stockData.volume_trade_for_the_day || 0,
//                 week_high: stockData.week_high || 0,
//                 week_low: stockData.week_low || 0,
//                 total_buy_quantity: stockData.total_buy_quantity || 0,
//                 total_sell_quantity: stockData.total_sell_quantity || 0,
//                 ltpPercentFromHigh,
//             };
//         });
//     }, [livePrices]);
//
//     return (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Live Prices {initialLoading ? '(Loading...)' : ''}
//             </h3>
//             {error && <p className="text-red-600 mb-4">{error}</p>}
//             {initialLoading ? (
//                 <p className="text-gray-500">Fetching initial prices...</p>
//             ) : tableData.length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table ref={tableRef} className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Token
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Price
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Open
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 High
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Low
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Volume
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 52 Week High
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 52 Week Low
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 LTP % from 52W High
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Total Buy Qty
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Total Sell Qty
//                             </th>
//                         </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                         {tableData.map((stock) => (
//                             <tr key={stock.token} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     {stock.token}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {stock.name}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{formatPrice(stock.price)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{formatPrice(stock.open)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
//                                     ₹{formatPrice(stock.high)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                                     ₹{formatPrice(stock.low)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {stock.volume.toLocaleString('en-IN')}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
//                                     ₹{formatPrice(stock.week_high)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
//                                     ₹{formatPrice(stock.week_low)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {formatPercentage(stock.ltpPercentFromHigh)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {formatPrice(stock.total_buy_quantity)}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     {formatPrice(stock.total_sell_quantity)}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No live prices available yet.</p>
//             )}
//         </div>
//     );
// };
//
// export default LivePricesComponent;



import React, { useEffect, useState, useRef, useMemo, useContext } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { ThemeContext } from '../../context/ThemeContext';

const LivePricesComponent = () => {
    const [livePrices, setLivePrices] = useState({});
    const [initialLoading, setInitialLoading] = useState(true);
    const [error, setError] = useState(null);
    const [hasData, setHasData] = useState(false);
    const intervalRef = useRef(null);
    const tableRef = useRef(null);
    const { theme } = useContext(ThemeContext);

    // Fetch live prices from API
    const fetchLivePrices = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            toast.error('No authentication token found. Please log in.');
            setError('No token found');
            setHasData(false);
            return;
        }

        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            // console.log("Liveveve",response);

            const data = response.data; // axios already parses JSON
            if (data.status === 'success') {
                if (Object.keys(data.data || {}).length === 0) {
                    setHasData(false);
                    setLivePrices({});
                    setError('No stocks subscribed');
                } else {
                    setHasData(true);
                    setLivePrices(data.data);
                    setError(null);
                }
            } else {
                throw new Error(data.message || 'Failed to fetch live prices');
            }
        } catch (err) {
            // console.error('Error fetching live prices:', err.message);
            setError(err.message);
            // toast.error(`Failed to fetch live prices: ${err.message}`);
            setHasData(false);
        } finally {
            setInitialLoading(false);
        }
    };

    // Memoized formatting functions
    const formatPrice = useMemo(() => {
        return (price) =>
            Number(price).toLocaleString('en-IN', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
            });
    }, []);

    const formatPercentage = useMemo(() => {
        return (value) => (isNaN(value) ? 'N/A' : value.toFixed(2) + '%');
    }, []);

    // Effect for initial fetch and polling setup
    useEffect(() => {
        fetchLivePrices();

        intervalRef.current = setInterval(() => {
            if (hasData) {
                fetchLivePrices();
            }
        }, 2000);

        return () => {
            if (intervalRef.current) {
                // console.log('Cleaning up live prices interval');
                clearInterval(intervalRef.current);
            }
        };
    }, [hasData]);

    // Memoized table data with LTP % calculation
    const tableData = useMemo(() => {
        return Object.entries(livePrices).map(([token, stockData]) => {
            const ltpPercentFromHigh = stockData.week_high
                ? ((stockData.week_high - stockData.price) / stockData.week_high) * 100
                : 0;

            return {
                token,
                name: stockData.name || 'N/A',
                price: stockData.price || 0,
                high: stockData.high_price_of_the_day || 0,
                low: stockData.low_price_of_the_day || 0,
                open: stockData.open_price || 0,
                volume: stockData.volume_trade_for_the_day || 0,
                week_high: stockData.week_high || 0,
                week_low: stockData.week_low || 0,
                total_buy_quantity: stockData.total_buy_quantity || 0,
                total_sell_quantity: stockData.total_sell_quantity || 0,
                ltpPercentFromHigh,
            };
        });
    }, [livePrices]);

    return (
        <div
            className={`p-6 rounded-xl shadow-md border ${
                theme === 'dark'
                    ? 'bg-gray-900 border-gray-800'
                    : 'bg-white border-gray-100'
            }`}
        >
            <h3
                className={`text-xl font-semibold mb-4 ${
                    theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                }`}
            >
                Live Prices {initialLoading ? '(Loading...)' : ''}
            </h3>
            {/*{error && (*/}
            {/*    <p*/}
            {/*        className={`mb-4 ${*/}
            {/*            theme === 'dark' ? 'text-red-400' : 'text-red-600'*/}
            {/*        }`}*/}
            {/*    >*/}
            {/*        {error}*/}
            {/*    </p>*/}
            {/*)}*/}
            {initialLoading ? (
                <p
                    className={`${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                >
                    Fetching initial prices...
                </p>
            ) : tableData.length > 0 ? (
                <div className="overflow-x-auto">
                    <table
                        ref={tableRef}
                        className={`min-w-full divide-y ${
                            theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'
                        }`}
                    >
                        <thead
                            className={`${
                                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
                            }`}
                        >
                        <tr>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Token
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Name
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Price
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Open
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                High
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Low
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Volume
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                52 Week High
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                52 Week Low
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                LTP % from 52W High
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Total Buy Qty
                            </th>
                            <th
                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Total Sell Qty
                            </th>
                        </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${
                                theme === 'dark'
                                    ? 'divide-gray-800'
                                    : 'divide-gray-200'
                            }`}
                        >
                        {tableData.map((stock) => (
                            <tr
                                key={stock.token}
                                className={`transition ${
                                    theme === 'dark'
                                        ? 'bg-gray-900 hover:bg-gray-800'
                                        : 'bg-white hover:bg-gray-50'
                                }`}
                            >
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    {stock.token}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    {stock.name}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    ₹{formatPrice(stock.price)}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    ₹{formatPrice(stock.open)}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                    }`}
                                >
                                    ₹{formatPrice(stock.high)}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                    }`}
                                >
                                    ₹{formatPrice(stock.low)}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    {stock.volume.toLocaleString('en-IN')}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-green-400' : 'text-green-600'
                                    }`}
                                >
                                    ₹{formatPrice(stock.week_high)}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-red-400' : 'text-red-600'
                                    }`}
                                >
                                    ₹{formatPrice(stock.week_low)}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    {formatPercentage(stock.ltpPercentFromHigh)}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    {formatPrice(stock.total_buy_quantity)}
                                </td>
                                <td
                                    className={`px-6 py-4 whitespace-nowrap text-sm ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    {formatPrice(stock.total_sell_quantity)}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            ) : (
                <p
                    className={`${
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                    }`}
                >
                    No live prices available yet.
                </p>
            )}
        </div>
    );
};

export default LivePricesComponent;


// import React, { useEffect, useState, useRef } from 'react';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import {parseApiResponse} from '../../utils/crypto.js'; // Adjust the import path as needed
//
// const LivePricesComponent = () => {
//     const [livePrices, setLivePrices] = useState({});
//     const [initialLoading, setInitialLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [hasData, setHasData] = useState(false); // Tracks if user has subscribed stocks
//     const [stocks, setStocks] = useState([]); // Store user's subscribed stocks
//     const intervalRef = useRef(null);
//
//     // Helper to get auth token from localStorage
//     const getAuthToken = () => localStorage.getItem('token');
//
//     // Fetch user's subscribed stocks (called only once)
//     const fetchStocksData = async () => {
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/stocks`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             const decryptedData = parseApiResponse(response.data.data);
//             console.log('Fetch Stocks Response:', decryptedData);
//
//             if (decryptedData?.status === '200') {
//                 const userStocks = decryptedData.stocks || [];
//                 setStocks(userStocks);
//                 setHasData(userStocks.length > 0); // Only true if stocks exist
//                 setError(null);
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch stocks');
//             }
//         } catch (err) {
//             console.error('Error fetching stocks:', err.message);
//             setError(err.message);
//             toast.error(`Failed to load stocks: ${err.message}`);
//             setStocks([]);
//             setHasData(false);
//         } finally {
//             setInitialLoading(false);
//         }
//     };
//
//     // Fetch live prices from the backend
//     const fetchLivePrices = async () => {
//         const token = getAuthToken();
//         if (!token) {
//             setError('No token found');
//             setHasData(false);
//             return;
//         }
//
//         try {
//             const response = await fetch(`${import.meta.env.VITE_API_URL}/api/live-prices`, {
//                 method: 'GET',
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             if (!response.ok) {
//                 throw new Error(`HTTP error! Status: ${response.status}`);
//             }
//
//             const data = await response.json();
//             if (data.status === 'success') {
//                 if (Object.keys(data.data).length === 0) {
//                     setLivePrices({});
//                     setError('No live price data available');
//                 } else {
//                     setLivePrices(data.data);
//                     setError(null);
//                     console.log('Fetched live prices:', data.data);
//                 }
//             } else {
//                 throw new Error(data.message || 'Failed to fetch live prices');
//             }
//         } catch (err) {
//             console.error('Error fetching live prices:', err.message);
//             setError(err.message);
//             toast.error(`Failed to fetch live prices: ${err.message}`);
//         }
//     };
//
//     // Effect to fetch data and manage polling
//     useEffect(() => {
//         // Initial fetch of stocks (only once)
//         fetchStocksData().then(() => {
//             if (hasData) {
//                 fetchLivePrices(); // Fetch prices immediately if stocks exist
//             }
//         });
//
//         // Set up polling for live prices only
//         if (hasData) {
//             intervalRef.current = setInterval(() => {
//                 fetchLivePrices(); // Fetch prices only if stocks exist
//             }, 1000);
//         }
//
//         // Cleanup interval on unmount
//         return () => {
//             console.log('Cleaning up live prices interval');
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//             }
//         };
//     }, []); // Empty dependency array for mount only
//
//     // Render the live prices
//     return (
//         <div className="p-6 bg-white rounded-xl shadow-md border border-gray-100">
//             <h3 className="text-xl font-semibold text-gray-900 mb-4">
//                 Live Prices {initialLoading ? '(Loading...)' : ''}
//             </h3>
//             {error && <p className="text-red-600 mb-4">{error}</p>}
//             {initialLoading ? (
//                 <p className="text-gray-500">Fetching initial data...</p>
//             ) : stocks.length === 0 ? (
//                 <p className="text-gray-500">No stocks subscribed yet.</p>
//             ) : Object.keys(livePrices).length > 0 ? (
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Token
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Name
//                             </th>
//                             <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
//                                 Price
//                             </th>
//                         </tr>
//                         </thead>
//                         <tbody className="divide-y divide-gray-200">
//                         {Object.entries(livePrices).map(([token, { name, price }]) => (
//                             <tr key={token} className="hover:bg-gray-50 transition">
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                                     {token}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{name}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                                     ₹{price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             ) : (
//                 <p className="text-gray-500">No live prices available yet.</p>
//             )}
//         </div>
//     );
// };
//
// export default LivePricesComponent;
