// import React, { useState, useEffect } from 'react';
// import { Bot, Plus, Trash2 } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from '../../utils/api'; // Your axios instance with interceptors
// import { getAuthToken } from '../../utils/auth'; // Token retrieval utility
// import DashboardLayout from '../../components/DashboardLayout'; // Assuming this exists
//
// const BotOrder = () => {
//     const [orders, setOrders] = useState([]);
//     const [tradeHistory, setTradeHistory] = useState([]);
//     const [tradeCycleHistory, setTradeCycleHistory] = useState([]);
//     const [newOrder, setNewOrder] = useState({ symbol: '', quantity: '', price: '' });
//     const [loading, setLoading] = useState(true);
//     const [theme] = useState('dark'); // Hardcoded theme; replace with ThemeContext if needed
//
//     // Fetch Order History
//     const fetchOrderHistory = async () => {
//         try {
//             const token = getAuthToken();
//             const response = await api.get('/api/get-order-history', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             if (response.decryptedData && response.decryptedData.status === "200") {
//                 setOrders(response.decryptedData.order_history);
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to fetch order history');
//             }
//         } catch (error) {
//             console.error('Error fetching order history:', error);
//             toast.error('Failed to fetch order history: ' + error.message);
//         }
//     };
//
//     // Fetch Trade History
//     const fetchTradeHistory = async () => {
//         try {
//             const token = getAuthToken();
//             const response = await api.get('/api/trade-history', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             if (response.decryptedData && response.decryptedData.status === "200") {
//                 setTradeHistory(response.decryptedData.trade_history);
//             } else if (response.decryptedData?.status === "404") {
//                 setTradeHistory([]);
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to fetch trade history');
//             }
//         } catch (error) {
//             console.error('Error fetching trade history:', error);
//             toast.error('Failed to fetch trade history: ' + error.message);
//         }
//     };
//
//     // Fetch Trade Cycle History
//     const fetchTradeCycleHistory = async () => {
//         try {
//             const token = getAuthToken();
//             const response = await api.get('/api/trade-cycle-history', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             console.log("nsjnsjns",response.decryptedData)
//
//             if (response.decryptedData && response.decryptedData.status === "200") {
//                 setTradeCycleHistory(response.decryptedData.trade_cycle_history);
//             } else if (response.decryptedData?.status === "404") {
//                 setTradeCycleHistory([]);
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to fetch trade cycle history');
//             }
//         } catch (error) {
//             console.error('Error fetching trade cycle history:', error);
//             toast.error('Failed to fetch trade cycle history: ' + error.message);
//         }
//     };
//
//     // Initial data fetch
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             await Promise.all([
//                 fetchOrderHistory(),
//                 fetchTradeHistory(),
//                 fetchTradeCycleHistory(),
//             ]);
//             setLoading(false);
//         };
//         fetchData();
//     }, []);
//
//
//
//     return (
//         <DashboardLayout>
//             <div className="space-y-6">
//                 {/* Header and Form */}
//                 <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                              Bot Orders
//                         </h3>
//                     </div>
//
//                     {/* Order History Table */}
//                     <div className="mb-6">
//                         <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
//                             Order History
//                         </h4>
//                         {loading ? (
//                             <div className="flex justify-center items-center py-8">
//                                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                             </div>
//                         ) : (
//                             <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                                 <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                                     <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
//                                     <tr>
//                                         {['Order ID', 'Symbol', 'Quantity', 'Price', 'Status', 'Buy/Sell', 'Created At', 'Updated At', 'Actions'].map((header) => (
//                                             <th
//                                                 key={header}
//                                                 className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
//                                             >
//                                                 {header}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                     </thead>
//                                     <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                                     {orders.length > 0 ? (
//                                         orders.map((order) => (
//                                             <tr key={order.order_id} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`}>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {order.order_id}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {order.symbol}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {order.quantity}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     ₹{parseFloat(order.price).toLocaleString()}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                         <span
//                                                             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                                                 order.status === 'completed'
//                                                                     ? 'bg-green-100 text-green-800'
//                                                                     : 'bg-yellow-100 text-yellow-800'
//                                                             }`}
//                                                         >
//                                                             {order.status}
//                                                         </span>
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {order.buy_sell}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {order.created_at}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {order.updated_at}
//                                                 </td>
//                                                 <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                                     <button
//                                                         onClick={() => handleDeleteOrder(order.order_id)}
//                                                         className={`${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
//                                                     >
//                                                         <Trash2 size={16} />
//                                                     </button>
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={9} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 No order history available.
//                                             </td>
//                                         </tr>
//                                     )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Trade History Table */}
//                     <div className="mb-6">
//                         <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
//                             Trade History
//                         </h4>
//                         {loading ? (
//                             <div className="flex justify-center items-center py-8">
//                                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                             </div>
//                         ) : (
//                             <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                                 <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                                     <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
//                                     <tr>
//                                         {['Stock Symbol', 'Sr No', 'Entry Price', 'Quantity', 'Status', 'Last Updated'].map((header) => (
//                                             <th
//                                                 key={header}
//                                                 className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
//                                             >
//                                                 {header}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                     </thead>
//                                     <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                                     {tradeHistory.length > 0 ? (
//                                         tradeHistory.map((trade) => (
//                                             <tr key={trade.order_id} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`}>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {trade.stock_symbol}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {trade.sr_no}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     ₹{parseFloat(trade.entry_price).toLocaleString()}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {trade.quantity}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                         <span
//                                                             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                                                 trade.status === 'completed'
//                                                                     ? 'bg-green-100 text-green-800'
//                                                                     : 'bg-yellow-100 text-yellow-800'
//                                                             }`}
//                                                         >
//                                                             {trade.status}
//                                                         </span>
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {trade.last_updated || 'N/A'}
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={6} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 No trade history available.
//                                             </td>
//                                         </tr>
//                                     )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Trade Cycle History Table */}
//                     <div className="mb-6">
//                         <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
//                             Trade Cycle History
//                         </h4>
//                         {loading ? (
//                             <div className="flex justify-center items-center py-8">
//                                 <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                             </div>
//                         ) : (
//                             <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                                 <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                                     <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
//                                     <tr>
//                                         {['ID', 'Stock Symbol', 'Cycle Start', 'Cycle End', 'Total Bought', 'Total Sold', 'Profit', 'Status'].map((header) => (
//                                             <th
//                                                 key={header}
//                                                 className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
//                                             >
//                                                 {header}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                     </thead>
//                                     <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                                     {tradeCycleHistory.length > 0 ? (
//                                         tradeCycleHistory.map((cycle) => (
//                                             <tr key={cycle.id} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`}>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {cycle.id}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {cycle.stock_symbol}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {cycle.cycle_start || 'N/A'}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {cycle.cycle_end || 'N/A'}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     ₹{parseFloat(cycle.total_bought_amount).toLocaleString()}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     ₹{parseFloat(cycle.total_sold_amount).toLocaleString()}
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                         <span
//                                                             className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                                                 cycle.profit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                                                             }`}
//                                                         >
//                                                             {cycle.profit >= 0 ? '+' : '-'}₹{Math.abs(cycle.profit).toLocaleString()}
//                                                         </span>
//                                                 </td>
//                                                 <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {cycle.status}
//                                                 </td>
//                                             </tr>
//                                         ))
//                                     ) : (
//                                         <tr>
//                                             <td colSpan={8} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 No trade cycle history available.
//                                             </td>
//                                         </tr>
//                                     )}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//
//                 {/* Toast Container */}
//                 <ToastContainer
//                     position="top-right"
//                     autoClose={3000}
//                     hideProgressBar={false}
//                     newestOnTop={false}
//                     closeOnClick
//                     rtl={false}
//                     pauseOnFocusLoss
//                     draggable
//                     pauseOnHover
//                     theme="colored"
//                 />
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default BotOrder;









import React, {useState, useEffect, useContext} from 'react';
import { Bot, Plus, Trash2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../utils/api'; // Your axios instance with interceptors
import { getAuthToken } from '../../utils/auth'; // Token retrieval utility
import DashboardLayout from '../../components/DashboardLayout'; // Assuming this exists
import { ThemeContext } from '../../context/ThemeContext';

const BotOrder = () => {
    const [orders, setOrders] = useState([]);
    const [tradeHistory, setTradeHistory] = useState([]);
    const [tradeCycleHistory, setTradeCycleHistory] = useState([]);
    const [newOrder, setNewOrder] = useState({ symbol: '', quantity: '', price: '' });
    const [loading, setLoading] = useState(true);
    const { theme } = useContext(ThemeContext);

    
    // Fetch Order History
    const fetchOrderHistory = async () => {
        try {
            const token = getAuthToken();
            const response = await api.get('/api/get-order-history', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.decryptedData && response.decryptedData.status === "200") {
                setOrders(response.decryptedData.order_history);
            } else {
                throw new Error(response.decryptedData?.message || 'Failed to fetch order history');
            }
        } catch (error) {
            console.error('Error fetching order history:', error);
            toast.error('Failed to fetch order history: ' + error.message);
        }
    };

    // Fetch Trade History
    const fetchTradeHistory = async () => {
        try {
            const token = getAuthToken();
            const response = await api.get('/api/trade-history', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.decryptedData && response.decryptedData.status === "200") {
                setTradeHistory(response.decryptedData.trade_history);
            } else if (response.decryptedData?.status === "404") {
                setTradeHistory([]);
            } else {
                throw new Error(response.decryptedData?.message || 'Failed to fetch trade history');
            }
        } catch (error) {
            console.error('Error fetching trade history:', error);
            toast.error('Failed to fetch trade history: ' + error.message);
        }
    };

    // Fetch Trade Cycle History
    const fetchTradeCycleHistory = async () => {
        try {
            const token = getAuthToken();
            const response = await api.get('/api/trade-cycle-history', {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.decryptedData && response.decryptedData.status === "200") {
                setTradeCycleHistory(response.decryptedData.trade_cycle_history);
            } else if (response.decryptedData?.status === "404") {
                setTradeCycleHistory([]);
            } else {
                throw new Error(response.decryptedData?.message || 'Failed to fetch trade cycle history');
            }
        } catch (error) {
            console.error('Error fetching trade cycle history:', error);
            toast.error('Failed to fetch trade cycle history: ' + error.message);
        }
    };

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            await Promise.all([
                fetchOrderHistory(),
                fetchTradeHistory(),
                fetchTradeCycleHistory(),
            ]);
            setLoading(false);
        };
        fetchData();
    }, []);

    // Status color mapping function
    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'complete':
                return 'bg-green-100 text-green-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'rejected':
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            case 'open':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                {/* Header and Form */}
                <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            <Bot size={28} className="inline mr-2" /> Bot Orders
                        </h3>
                    </div>



                    {/* Order History Table */}
                    <div className="mb-6">
                        <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                            Order History
                        </h4>
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                                    <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <tr>
                                        {[
                                            'Order ID',
                                            'Unique Order ID',
                                            'Symbol',
                                            'Status',
                                            'Message',
                                            'Quantity',
                                            'Price',
                                            'Buy/Sell',
                                            'Created At',
                                            'Updated At',
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                                    {orders.length > 0 ? (
                                        orders.map((order) => (
                                            <tr key={order.order_id} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`}>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {order.order_id}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {order.unique_order_id}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {order.symbol}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                                                            {order.status}
                                                        </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {order.message || 'N/A'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {order.quantity}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    ₹{parseFloat(order.price).toLocaleString()}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {order.buy_sell}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {order.created_at}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {order.updated_at}
                                                </td>

                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={11} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                No order history available.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Trade History Table */}
                    <div className="mb-6">
                        <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                            Trade History
                        </h4>
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                                    <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <tr>
                                        {[
                                            'Stock Symbol',
                                            'Sr No',
                                            'Trade Cycle ID',
                                            'Entry Price',
                                            'Quantity',
                                            'Status',
                                            'Base Price',
                                            'Last Updated',
                                            'Total Quantity',
                                            'Total Sold Quantity',
                                            'Cycle Count',
                                            'Order ID',
                                            'Unique Order ID',
                                            'Description',

                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                                    {tradeHistory.length > 0 ? (
                                        tradeHistory.map((trade) => (
                                            <tr key={trade.order_id} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`}>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.stock_symbol}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.sr_no}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.trade_cycle_id}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    ₹{parseFloat(trade.entry_price).toLocaleString()}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.quantity}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(trade.status)}`}>
                                                            {trade.status}
                                                        </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    ₹{parseFloat(trade.base_price).toLocaleString()}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.last_updated || 'N/A'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.total_quantity}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.total_sold_quantity}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.cycle_count}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.order_id ? trade.order_id : 'NaN'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.unique_order_id}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {trade.description || 'N/A'}
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={14} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                No trade history available.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>

                    {/* Trade Cycle History Table */}
                    <div className="mb-6">
                        <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                            Trade Cycle History
                        </h4>
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                            </div>
                        ) : (
                            <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                                <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                                    <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <tr>
                                        {[
                                            'ID',
                                            'Stock Symbol',
                                            'Cycle Start',
                                            'Cycle End',
                                            'Total Bought',
                                            'Total Sold',
                                            'Profit',
                                            'Status',
                                        ].map((header) => (
                                            <th
                                                key={header}
                                                className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
                                            >
                                                {header}
                                            </th>
                                        ))}
                                    </tr>
                                    </thead>
                                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                                    {tradeCycleHistory.length > 0 ? (
                                        tradeCycleHistory.map((cycle) => (
                                            <tr key={cycle.id} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`}>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {cycle.id}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {cycle.stock_symbol}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {cycle.cycle_start || 'N/A'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {cycle.cycle_end || 'N/A'}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    ₹{parseFloat(cycle.total_bought_amount).toLocaleString()}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    ₹{parseFloat(cycle.total_sold_amount).toLocaleString()}
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        <span
                                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                cycle.profit >= 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                            }`}
                                                        >
                                                            {cycle.profit >= 0 ? '+' : '-'}₹{Math.abs(cycle.profit).toLocaleString()}
                                                        </span>
                                                </td>
                                                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(cycle.status)}`}>
                                                            {cycle.status}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan={8} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                No trade cycle history available.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>

                {/* Toast Container */}
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />
            </div>
        </DashboardLayout>
    );
};

export default BotOrder;
