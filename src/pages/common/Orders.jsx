// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import DashboardLayout from '../../components/DashboardLayout';
// import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { encryptMessage, decryptMessage, parseApiResponse } from '../../utils/crypto'; // Adjust path to crypto.js
// import { getAuthToken } from '../../utils/auth'; // Adjust path
//
// const Orders = () => {
//     const [orderBook, setOrderBook] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//
//     // Fetch order book data from /user/angel/order-book
//     const fetchOrderBook = async () => {
//         try {
//             setLoading(true);
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/order-book`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             const decryptedData = parseApiResponse(response.data.data);
//             console.log('Decrypted Order Book Data:', decryptedData);
//
//             if (decryptedData?.status === '200') {
//                 const orders = decryptedData.order_book?.data || [];
//                 setOrderBook(
//                     orders.map((order) => ({
//                         orderid: order.orderid || 'N/A',
//                         transactiontype: order.transactiontype || 'UNKNOWN',
//                         symbol: order.tradingsymbol || 'N/A',
//                         quantity: Number(order.quantity) || 0,
//                         price: Number(order.price) || 0,
//                         total: (Number(order.price) || 0) * (Number(order.quantity) || 0),
//                         trade_time: order.updatetime || new Date().toISOString(),
//                         status: order.orderstatus?.toUpperCase() || 'OPEN',
//                         ordertype: order.ordertype || 'N/A',
//                         producttype: order.producttype || 'N/A',
//                         exchange: order.exchange || 'N/A',
//                         filledshares: Number(order.filledshares) || 0,
//                         unfilledshares: Number(order.unfilledshares) || 0,
//                         text: order.text || '',
//                         variety: order.variety || 'NORMAL', // Default to 'NORMAL' if not provided
//                     }))
//                 );
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch order book');
//             }
//         } catch (err) {
//             const errorMessage = 'Failed to fetch order book: ' + (err.message || 'Unknown error');
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Cancel order function
//     const cancelOrder = async (orderid, variety) => {
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const payload = {
//                 variety,
//                 orderid,
//             };
//             const encryptedPayload = encryptMessage(JSON.stringify(payload));
//             const response = await axios.post(
//                 `${import.meta.env.VITE_API_URL}/user/orders/cancel`,
//                 { data: encryptedPayload },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//
//             const decryptedData = parseApiResponse(response.data.data);
//             console.log('Decrypted Cancel Order Response:', decryptedData);
//
//             if (response.status === 200 && decryptedData.status) {
//                 toast.success('Order cancelled successfully');
//                 await fetchOrderBook(); // Refresh order book
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to cancel order');
//             }
//         } catch (err) {
//             const errorMessage = `Failed to cancel order: ${err.message || 'Unknown error'}`;
//             toast.error(errorMessage);
//             console.error('Cancel Order Error:', err);
//         }
//     };
//
//     // Memoized orders for rendering stability
//     const memoizedOrders = useMemo(() => orderBook, [orderBook]);
//
//     // Fetch data initially and poll every 30 seconds
//     useEffect(() => {
//         fetchOrderBook();
//         const interval = setInterval(fetchOrderBook, 30000); // 30 seconds polling
//         return () => clearInterval(interval);
//     }, []);
//
//     // Render status with icon and color
//     const renderStatus = (status) => {
//         const statusMap = {
//             COMPLETE: { icon: CheckCircle, color: 'text-green-600', label: 'Completed' },
//             REJECTED: { icon: XCircle, color: 'text-red-600', label: 'Rejected' },
//             OPEN: { icon: Clock, color: 'text-amber-600', label: 'Pending' },
//             FAILED: { icon: AlertCircle, color: 'text-red-600', label: 'Failed' },
//         };
//         const statusData = statusMap[status] || statusMap['OPEN'];
//         const Icon = statusData.icon;
//         return (
//             <div className="flex items-center">
//                 <Icon size={16} className={`${statusData.color} mr-1.5`} />
//                 <span className={`text-sm ${statusData.color}`}>{statusData.label}</span>
//             </div>
//         );
//     };
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-full">
//                     <p>Loading order book...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     if (error) {
//         return (
//             <DashboardLayout>
//                 <div className="text-red-600 p-4">{error}</div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
//                 <div>
//                     <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
//                     <p className="text-sm text-gray-500">Track and manage your stock orders</p>
//                 </div>
//                 <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
//                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                         New Buy Order
//                     </button>
//                     <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
//                         New Sell Order
//                     </button>
//                 </div>
//             </div>
//
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 border-b border-gray-200 bg-gray-50">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <div className="flex items-center gap-2">
//                             <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
//                                 <option>All Orders</option>
//                                 <option>Buy Orders</option>
//                                 <option>Sell Orders</option>
//                             </select>
//                             <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
//                                 <option>All Status</option>
//                                 <option>Pending</option>
//                                 <option>Completed</option>
//                                 <option>Rejected</option>
//                                 <option>Failed</option>
//                             </select>
//                         </div>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search orders..."
//                                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
//                             />
//                             <svg
//                                 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                             >
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Symbol</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Exchange</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Filled Shares</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Unfilled Shares</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reason</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
//                         </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                         {memoizedOrders.map((order, index) => (
//                             <tr key={index} data-orderid={order.orderid}>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderid}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap">
//                                         <span
//                                             className={`px-2 py-1 text-xs font-medium rounded-full ${
//                                                 order.transactiontype === 'BUY'
//                                                     ? 'bg-green-100 text-green-800'
//                                                     : 'bg-red-100 text-red-800'
//                                             }`}
//                                         >
//                                             {order.transactiontype}
//                                         </span>
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.symbol}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.quantity}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{order.price.toFixed(2)}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{order.total.toLocaleString()}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.ordertype}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.producttype}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.exchange}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.filledshares}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.unfilledshares}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                     {new Date(order.trade_time).toLocaleDateString('en-US', {
//                                         month: 'short',
//                                         day: 'numeric',
//                                         year: 'numeric',
//                                     })}
//                                 </td>
//                                 <td className="px-6 py-4 whitespace-nowrap">{renderStatus(order.status)}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.text || 'N/A'}</td>
//                                 <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                     <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
//                                     {order.status === 'OPEN' && (
//                                         <button
//                                             onClick={() => cancelOrder(order.orderid, order.variety)}
//                                             className="text-red-600 hover:text-red-800"
//                                         >
//                                             Cancel
//                                         </button>
//                                     )}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Orders;


















// import React, { useState, useEffect, useMemo, useRef } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import DashboardLayout from '../../components/DashboardLayout';
// import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { encryptMessage, parseApiResponse } from '../../utils/crypto'; // Adjust path to crypto.js
// import { getAuthToken } from '../../utils/auth'; // Adjust path
//
// const Orders = () => {
//     const [orderBook, setOrderBook] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filterType, setFilterType] = useState('All Orders');
//     const [filterStatus, setFilterStatus] = useState('All Status');
//     const [searchTerm, setSearchTerm] = useState('');
//     const lastDataRef = useRef([]); // Cache last valid data
//     const location = useLocation();
//
//     // Fetch order book data
//     const fetchOrderBook = async () => {
//         try {
//             setLoading(true);
//             setError(null); // Reset error on each fetch
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/order-book`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             const decryptedData = parseApiResponse(response.data.data);
//             console.log('Decrypted Order Book Data:', decryptedData);
//
//             if (decryptedData?.status === '200') {
//                 const orders = decryptedData.order_book?.data || [];
//
//                 if (decryptedData.message.includes("Rate limit exceeded")) {
//                     setError("Rate limit exceeded. Showing last known data.");
//                     if (lastDataRef.current.length > 0) {
//                         setOrderBook(lastDataRef.current); // Use cached data
//                     } else {
//                         setOrderBook([]); // No prior data
//                     }
//                     return;
//                 }
//
//                 const formattedOrders = orders.map((order) => ({
//                     orderid: order.orderid || 'N/A',
//                     transactiontype: order.transactiontype || 'UNKNOWN',
//                     symbol: order.tradingsymbol || 'N/A',
//                     quantity: Number(order.quantity) || 0,
//                     price: Number(order.price) || 0,
//                     total: (Number(order.price) || 0) * (Number(order.quantity) || 0),
//                     trade_time: order.updatetime || new Date().toISOString(),
//                     status: order.orderstatus?.toUpperCase() || 'OPEN',
//                     ordertype: order.ordertype || 'N/A',
//                     producttype: order.producttype || 'N/A',
//                     exchange: order.exchange || 'N/A',
//                     filledshares: Number(order.filledshares) || 0,
//                     unfilledshares: Number(order.unfilledshares) || 0,
//                     text: order.text || '',
//                     variety: order.variety || 'NORMAL',
//                 }));
//
//                 setOrderBook(formattedOrders);
//                 lastDataRef.current = formattedOrders; // Cache the data
//                 setError(null);
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch order book');
//             }
//         } catch (err) {
//             const errorMessage = 'Failed to fetch order book: ' + (err.message || 'Unknown error');
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error('Fetch Error:', err);
//             if (lastDataRef.current.length > 0) {
//                 setOrderBook(lastDataRef.current); // Fallback to cached data
//             }
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Cancel order function with enhanced logging
//     const cancelOrder = async (orderid, variety) => {
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const payload = { variety, orderid };
//             console.log('Cancel Order Payload:', payload);
//             const encryptedPayload = encryptMessage(JSON.stringify(payload));
//             console.log('Encrypted Payload:', encryptedPayload);
//
//             const response = await axios.post(
//                 `${import.meta.env.VITE_API_URL}/user/orders/cancel`,
//                 { data: encryptedPayload },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//
//             console.log('Raw Cancel Response:', response);
//             const decryptedData = parseApiResponse(response.data.data);
//             console.log('Decrypted Cancel Order Response:', decryptedData);
//
//             if (response.status === 200 && decryptedData.status) {
//                 toast.success('Order cancelled successfully');
//                 await fetchOrderBook(); // Refresh data
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to cancel order');
//             }
//         } catch (err) {
//             const errorMessage = `Failed to cancel order: ${err.message || 'Unknown error'}`;
//             toast.error(errorMessage);
//             console.error('Cancel Order Error:', err);
//         }
//     };
//
//     // Filter and search logic
//     const filteredOrders = useMemo(() => {
//         let result = [...orderBook];
//
//         // Filter by transaction type
//         if (filterType === 'Buy Orders') {
//             result = result.filter(order => order.transactiontype === 'BUY');
//         } else if (filterType === 'Sell Orders') {
//             result = result.filter(order => order.transactiontype === 'SELL');
//         }
//
//         // Filter by status
//         if (filterStatus !== 'All Status') {
//             result = result.filter(order => order.status === filterStatus.toUpperCase());
//         }
//
//         // Search by symbol or order ID
//         if (searchTerm) {
//             result = result.filter(order =>
//                 order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 order.orderid.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//
//         return result;
//     }, [orderBook, filterType, filterStatus, searchTerm]);
//
//     // Fetch data only when the Orders page is loaded
//     useEffect(() => {
//         if (location.pathname === '/orders') { // Adjust path to match your route
//             // Reset filters and search on page load
//             setFilterType('All Orders');
//             setFilterStatus('All Status');
//             setSearchTerm('');
//             fetchOrderBook();
//         }
//     }, [location.pathname]);
//
//     // Render status with icon and color
//     const renderStatus = (status) => {
//         const statusMap = {
//             COMPLETE: { icon: CheckCircle, color: 'text-green-600', label: 'Completed' },
//             REJECTED: { icon: XCircle, color: 'text-red-600', label: 'Rejected' },
//             OPEN: { icon: Clock, color: 'text-amber-600', label: 'Pending' },
//             FAILED: { icon: AlertCircle, color: 'text-red-600', label: 'Failed' },
//         };
//         const statusData = statusMap[status] || statusMap['OPEN'];
//         const Icon = statusData.icon;
//         return (
//             <div className="flex items-center">
//                 <Icon size={16} className={`${statusData.color} mr-1.5`} />
//                 <span className={`text-sm ${statusData.color}`}>{statusData.label}</span>
//             </div>
//         );
//     };
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-full">
//                     <p>Loading order book...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
//                 <div>
//                     <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
//                     <p className="text-sm text-gray-500">Track and manage your stock orders</p>
//                 </div>
//                 <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
//                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                         New Buy Order
//                     </button>
//                     <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
//                         New Sell Order
//                     </button>
//                 </div>
//             </div>
//
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 border-b border-gray-200 bg-gray-50">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={filterType}
//                                 onChange={(e) => setFilterType(e.target.value)}
//                                 className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
//                             >
//                                 <option>All Orders</option>
//                                 <option>Buy Orders</option>
//                                 <option>Sell Orders</option>
//                             </select>
//                             <select
//                                 value={filterStatus}
//                                 onChange={(e) => setFilterStatus(e.target.value)}
//                                 className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
//                             >
//                                 <option>All Status</option>
//                                 <option>Pending</option>
//                                 <option>Completed</option>
//                                 <option>Rejected</option>
//                                 <option>Failed</option>
//                             </select>
//                         </div>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search orders..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
//                             />
//                             <svg
//                                 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                             >
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//
//                 {error && (
//                     <div className="p-4 bg-yellow-100 text-yellow-700 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Symbol</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Exchange</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Filled Shares</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Unfilled Shares</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reason</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
//                         </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                         {filteredOrders.length > 0 ? (
//                             filteredOrders.map((order, index) => (
//                                 <tr key={index} data-orderid={order.orderid}>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderid}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                             <span
//                                                 className={`px-2 py-1 text-xs font-medium rounded-full ${
//                                                     order.transactiontype === 'BUY'
//                                                         ? 'bg-green-100 text-green-800'
//                                                         : 'bg-red-100 text-red-800'
//                                                 }`}
//                                             >
//                                                 {order.transactiontype}
//                                             </span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.symbol}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.quantity}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{order.price.toFixed(2)}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{order.total.toLocaleString()}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.ordertype}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.producttype}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.exchange}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.filledshares}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.unfilledshares}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                         {new Date(order.trade_time).toLocaleDateString('en-US', {
//                                             month: 'short',
//                                             day: 'numeric',
//                                             year: 'numeric',
//                                         })}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{renderStatus(order.status)}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.text || 'N/A'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                         <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
//                                         {order.status === 'OPEN' && (
//                                             <button
//                                                 onClick={() => cancelOrder(order.orderid, order.variety)}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 Cancel
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="15" className="px-6 py-4 text-center text-gray-500">
//                                     No orders match the current filters.
//                                 </td>
//                             </tr>
//                         )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Orders;











// import React, { useState, useEffect, useMemo } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import DashboardLayout from '../../components/DashboardLayout';
// import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { encryptMessage, parseApiResponse } from '../../utils/crypto'; // Adjust path to crypto.js
// import { getAuthToken } from '../../utils/auth'; // Adjust path
//
// const Orders = () => {
//     const [orderBook, setOrderBook] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filterType, setFilterType] = useState('All Orders');
//     const [filterStatus, setFilterStatus] = useState('All Status');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [hasFetched, setHasFetched] = useState(false); // Track if fetch has occurred
//     const location = useLocation();
//
//     // Fetch order book data with retry on rate limit
//     const fetchOrderBook = async (isRetry = false) => {
//         try {
//             if (!isRetry) setLoading(true); // Only show loading on initial fetch, not retries
//             setError(null); // Reset error
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/order-book`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             const decryptedData = parseApiResponse(response.data.data);
//             console.log('Decrypted Order Book Data:', decryptedData);
//
//             if (decryptedData?.status === '200') {
//                 const orders = decryptedData.order_book?.data || [];
//
//                 // Check for rate limit
//                 if (decryptedData.order_book.message.includes("Rate limit exceeded")) {
//                     setError("Rate limit exceeded. Retrying...");
//                     console.log('Rate limit detected, retrying...');
//                     setTimeout(() => fetchOrderBook(true), 1000); // Retry after 1 second
//                     return; // Exit to avoid setting state until retry succeeds
//                 }
//
//                 // Successful fetch (no rate limit)
//                 const formattedOrders = orders.map((order) => ({
//                     orderid: order.orderid || 'N/A',
//                     transactiontype: order.transactiontype || 'UNKNOWN',
//                     symbol: order.tradingsymbol || 'N/A',
//                     quantity: Number(order.quantity) || 0,
//                     price: Number(order.price) || 0,
//                     total: (Number(order.price) || 0) * (Number(order.quantity) || 0),
//                     trade_time: order.updatetime || new Date().toISOString(),
//                     status: order.orderstatus?.toUpperCase() || 'OPEN',
//                     ordertype: order.ordertype || 'N/A',
//                     producttype: order.producttype || 'N/A',
//                     exchange: order.exchange || 'N/A',
//                     filledshares: Number(order.filledshares) || 0,
//                     unfilledshares: Number(order.unfilledshares) || 0,
//                     text: order.text || '',
//                     variety: order.variety || 'NORMAL',
//                 }));
//
//                 setOrderBook(formattedOrders);
//                 setHasFetched(true); // Mark fetch as complete
//                 setError(null);
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch order book');
//             }
//         } catch (err) {
//             const errorMessage = 'Failed to fetch order book: ' + (err.message || 'Unknown error');
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error('Fetch Error:', err);
//             // If error but not rate limit, use existing data if available
//             if (!isRetry && orderBook.length > 0) {
//                 setError(errorMessage + ' (Showing last known data)');
//             }
//         } finally {
//             if (!isRetry) setLoading(false); // Only stop loading on initial fetch
//         }
//     };
//
//     // Cancel order function
//     const cancelOrder = async (orderid, variety) => {
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const payload = { variety, orderid };
//             console.log('Cancel Order Payload:', payload);
//             const encryptedPayload = encryptMessage(JSON.stringify(payload));
//             console.log('Encrypted Payload:', encryptedPayload);
//
//             const response = await axios.post(
//                 `${import.meta.env.VITE_API_URL}/user/orders/cancel`,
//                 { data: encryptedPayload },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//
//             console.log('Raw Cancel Response:', response);
//             const decryptedData = parseApiResponse(response.data.data);
//             console.log('Decrypted Cancel Order Response:', decryptedData);
//
//             if (response.status === 200 && decryptedData.status) {
//                 toast.success('Order cancelled successfully');
//                 await fetchOrderBook(); // Refresh data after cancel
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to cancel order');
//             }
//         } catch (err) {
//             const errorMessage = `Failed to cancel order: ${err.message || 'Unknown error'}`;
//             toast.error(errorMessage);
//             console.error('Cancel Order Error:', err);
//         }
//     };
//
//     // Filter and search logic
//     const filteredOrders = useMemo(() => {
//         let result = [...orderBook];
//
//         if (filterType === 'Buy Orders') {
//             result = result.filter(order => order.transactiontype === 'BUY');
//         } else if (filterType === 'Sell Orders') {
//             result = result.filter(order => order.transactiontype === 'SELL');
//         }
//
//         if (filterStatus !== 'All Status') {
//             result = result.filter(order => order.status === filterStatus.toUpperCase());
//         }
//
//         if (searchTerm) {
//             result = result.filter(order =>
//                 order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                 order.orderid.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//
//         return result;
//     }, [orderBook, filterType, filterStatus, searchTerm]);
//
//     // Fetch data only once on page load
//     useEffect(() => {
//         if (location.pathname === '/orders' && !hasFetched) { // Adjust path to your route
//             setFilterType('All Orders');
//             setFilterStatus('All Status');
//             setSearchTerm('');
//             fetchOrderBook();
//         }
//     }, [location.pathname, hasFetched]);
//
//     // Render status with icon and color
//     const renderStatus = (status) => {
//         const statusMap = {
//             COMPLETE: { icon: CheckCircle, color: 'text-green-600', label: 'Completed' },
//             REJECTED: { icon: XCircle, color: 'text-red-600', label: 'Rejected' },
//             OPEN: { icon: Clock, color: 'text-amber-600', label: 'Pending' },
//             FAILED: { icon: AlertCircle, color: 'text-red-600', label: 'Failed' },
//         };
//         const statusData = statusMap[status] || statusMap['OPEN'];
//         const Icon = statusData.icon;
//         return (
//             <div className="flex items-center">
//                 <Icon size={16} className={`${statusData.color} mr-1.5`} />
//                 <span className={`text-sm ${statusData.color}`}>{statusData.label}</span>
//             </div>
//         );
//     };
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-full">
//                     <p>Loading order book...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
//                 <div>
//                     <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
//                     <p className="text-sm text-gray-500">Track and manage your stock orders</p>
//                 </div>
//                 <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
//                     <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
//                         New Buy Order
//                     </button>
//                     <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
//                         New Sell Order
//                     </button>
//                 </div>
//             </div>
//
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
//                 <div className="p-4 border-b border-gray-200 bg-gray-50">
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={filterType}
//                                 onChange={(e) => setFilterType(e.target.value)}
//                                 className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
//                             >
//                                 <option>All Orders</option>
//                                 <option>Buy Orders</option>
//                                 <option>Sell Orders</option>
//                             </select>
//                             <select
//                                 value={filterStatus}
//                                 onChange={(e) => setFilterStatus(e.target.value)}
//                                 className="text-sm border border-gray-300 rounded-md px-3 py-1.5"
//                             >
//                                 <option>All Status</option>
//                                 <option>Pending</option>
//                                 <option>Completed</option>
//                                 <option>Rejected</option>
//                                 <option>Failed</option>
//                             </select>
//                         </div>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search orders..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
//                             />
//                             <svg
//                                 className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                             >
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//
//                 {error && (
//                     <div className="p-4 bg-yellow-100 text-yellow-700 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-100">
//                         <tr>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order ID</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Symbol</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Quantity</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Price</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Total</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Order Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Product Type</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Exchange</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Filled Shares</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Unfilled Shares</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Date</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Status</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Reason</th>
//                             <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Actions</th>
//                         </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                         {filteredOrders.length > 0 ? (
//                             filteredOrders.map((order, index) => (
//                                 <tr key={index} data-orderid={order.orderid}>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.orderid}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                             <span
//                                                 className={`px-2 py-1 text-xs font-medium rounded-full ${
//                                                     order.transactiontype === 'BUY'
//                                                         ? 'bg-green-100 text-green-800'
//                                                         : 'bg-red-100 text-red-800'
//                                                 }`}
//                                             >
//                                                 {order.transactiontype}
//                                             </span>
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.symbol}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.quantity}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{order.price.toFixed(2)}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">₹{order.total.toLocaleString()}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.ordertype}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.producttype}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.exchange}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.filledshares}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.unfilledshares}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                         {new Date(order.trade_time).toLocaleDateString('en-US', {
//                                             month: 'short',
//                                             day: 'numeric',
//                                             year: 'numeric',
//                                         })}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">{renderStatus(order.status)}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{order.text || 'N/A'}</td>
//                                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                                         <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
//                                         {order.status === 'OPEN' && (
//                                             <button
//                                                 onClick={() => cancelOrder(order.orderid, order.variety)}
//                                                 className="text-red-600 hover:text-red-800"
//                                             >
//                                                 Cancel
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="15" className="px-6 py-4 text-center text-gray-500">
//                                     No orders match the current filters.
//                                 </td>
//                             </tr>
//                         )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Orders;






// import React, { useState, useEffect, useMemo, useContext } from 'react';
// import axios from 'axios';
// import { useLocation } from 'react-router-dom';
// import DashboardLayout from '../../components/DashboardLayout';
// import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
// import { toast } from 'react-toastify';
// import { encryptMessage, parseApiResponse } from '../../utils/crypto';
// import { getAuthToken } from '../../utils/auth';
// import { ThemeContext } from '../../context/ThemeContext';
//
// const Orders = () => {
//     const [orderBook, setOrderBook] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [filterType, setFilterType] = useState('All Orders');
//     const [filterStatus, setFilterStatus] = useState('All Status');
//     const [searchTerm, setSearchTerm] = useState('');
//     const [hasFetched, setHasFetched] = useState(false);
//     const location = useLocation();
//     const { theme } = useContext(ThemeContext);
//
//     // Fetch order book data with retry on rate limit
//     const fetchOrderBook = async (isRetry = false) => {
//         try {
//             if (!isRetry) setLoading(true);
//             setError(null);
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/order-book`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             const decryptedData = parseApiResponse(response.data.data);
//             console.log('Decrypted Order Book Data:', decryptedData);
//
//             if (decryptedData?.status === '200') {
//                 const orders = decryptedData.order_book?.data || [];
//
//                 if (decryptedData.order_book.message.includes("Rate limit exceeded")) {
//                     setError("Rate limit exceeded. Retrying...");
//                     console.log('Rate limit detected, retrying...');
//                     setTimeout(() => fetchOrderBook(true), 1000);
//                     return;
//                 }
//
//                 const formattedOrders = orders.map((order) => ({
//                     orderid: order.orderid || 'N/A',
//                     transactiontype: (order.transactiontype || 'UNKNOWN').toUpperCase(), // Normalize to uppercase
//                     symbol: order.tradingsymbol || 'N/A',
//                     quantity: Number(order.quantity) || 0,
//                     price: Number(order.price) || 0,
//                     total: (Number(order.price) || 0) * (Number(order.quantity) || 0),
//                     trade_time: order.updatetime || new Date().toISOString(),
//                     status: order.orderstatus?.toUpperCase() || 'OPEN',
//                     ordertype: order.ordertype || 'N/A',
//                     producttype: order.producttype || 'N/A',
//                     exchange: order.exchange || 'N/A',
//                     filledshares: Number(order.filledshares) || 0,
//                     unfilledshares: Number(order.unfilledshares) || 0,
//                     text: order.text || '',
//                     variety: order.variety || 'NORMAL',
//                 }));
//
//                 setOrderBook(formattedOrders);
//                 setHasFetched(true);
//                 setError(null);
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch order book');
//             }
//         } catch (err) {
//             const errorMessage = 'Failed to fetch order book: ' + (err.message || 'Unknown error');
//             setError(errorMessage);
//             toast.error(errorMessage);
//             console.error('Fetch Error:', err);
//             if (!isRetry && orderBook.length > 0) {
//                 setError(errorMessage + ' (Showing last known data)');
//             }
//         } finally {
//             if (!isRetry) setLoading(false);
//         }
//     };
//
//     // Cancel order function
//     const cancelOrder = async (orderid, variety) => {
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 throw new Error('No authentication token found. Please log in.');
//             }
//
//             const payload = { variety, orderid };
//             const encryptedPayload = encryptMessage(JSON.stringify(payload));
//
//             const response = await axios.post(
//                 `${import.meta.env.VITE_API_URL}/user/orders/cancel`,
//                 { data: encryptedPayload },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//
//             const decryptedData = parseApiResponse(response.data.data);
//
//             if (response.status === 200 && decryptedData.status) {
//                 toast.success('Order cancelled successfully');
//                 await fetchOrderBook();
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to cancel order');
//             }
//         } catch (err) {
//             const errorMessage = `Failed to cancel order: ${err.message || 'Unknown error'}`;
//             toast.error(errorMessage);
//             console.error('Cancel Order Error:', err);
//         }
//     };
//
//     // Get unique statuses for the filter dropdown
//     const uniqueStatuses = useMemo(() => {
//         const statuses = [...new Set(orderBook.map((order) => order.status))];
//         // Convert statuses to title case for display
//         return statuses.map((status) =>
//             status
//                 .toLowerCase()
//                 .split('_')
//                 .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
//                 .join(' ')
//         );
//     }, [orderBook]);
//
//     // Filter and search logic
//     const filteredOrders = useMemo(() => {
//         let result = [...orderBook];
//
//         if (filterType === 'Buy Orders') {
//             result = result.filter((order) => order.transactiontype === 'BUY');
//         } else if (filterType === 'Sell Orders') {
//             result = result.filter((order) => order.transactiontype === 'SELL');
//         }
//
//         if (filterStatus !== 'All Status') {
//             // Convert filterStatus back to uppercase for comparison
//             const statusToFilter = filterStatus
//                 .toUpperCase()
//                 .split(' ')
//                 .join('_');
//             result = result.filter((order) => order.status === statusToFilter);
//         }
//
//         if (searchTerm) {
//             result = result.filter(
//                 (order) =>
//                     order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     order.orderid.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     order.ordertype.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     order.producttype.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                     order.exchange.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//
//         return result;
//     }, [orderBook, filterType, filterStatus, searchTerm]);
//
//     // Fetch data only once on page load
//     useEffect(() => {
//         if (location.pathname === '/orders' && !hasFetched) {
//             setFilterType('All Orders');
//             setFilterStatus('All Status');
//             setSearchTerm('');
//             fetchOrderBook();
//         }
//     }, [location.pathname, hasFetched]);
//
//     // Render status with icon and color
//     const renderStatus = (status) => {
//         const statusMap = {
//             COMPLETE: {
//                 icon: CheckCircle,
//                 color: theme === 'dark' ? 'text-green-400' : 'text-green-600',
//                 label: 'Completed',
//             },
//             REJECTED: {
//                 icon: XCircle,
//                 color: theme === 'dark' ? 'text-red-400' : 'text-red-600',
//                 label: 'Rejected',
//             },
//             OPEN: {
//                 icon: Clock,
//                 color: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
//                 label: 'Pending',
//             },
//             FAILED: {
//                 icon: AlertCircle,
//                 color: theme === 'dark' ? 'text-red-400' : 'text-red-600',
//                 label: 'Failed',
//             },
//         };
//         const statusData = statusMap[status] || statusMap['OPEN'];
//         const Icon = statusData.icon;
//         return (
//             <div className="flex items-center">
//                 <Icon size={16} className={`${statusData.color} mr-1.5`} />
//                 <span className={`text-sm ${statusData.color}`}>{statusData.label}</span>
//             </div>
//         );
//     };
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div
//                     className={`flex justify-center items-center h-full ${
//                         theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
//                     }`}
//                 >
//                     <p>Loading order book...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
//                 <div>
//                     <h3
//                         className={`text-lg font-medium ${
//                             theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                         }`}
//                     >
//                         Recent Orders
//                     </h3>
//                     <p
//                         className={`text-sm ${
//                             theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                         }`}
//                     >
//                         Track and manage your stock orders
//                     </p>
//                 </div>
//             </div>
//
//             <div
//                 className={`rounded-lg shadow-sm border overflow-hidden ${
//                     theme === 'dark'
//                         ? 'bg-gray-900 border-gray-800'
//                         : 'bg-white border-gray-200'
//                 }`}
//             >
//                 <div
//                     className={`p-4 border-b ${
//                         theme === 'dark'
//                             ? 'border-gray-800 bg-gray-800'
//                             : 'border-gray-200 bg-gray-50'
//                     }`}
//                 >
//                     <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                         <div className="flex items-center gap-2">
//                             <select
//                                 value={filterType}
//                                 onChange={(e) => setFilterType(e.target.value)}
//                                 className={`text-sm border rounded-md px-3 py-1.5 ${
//                                     theme === 'dark'
//                                         ? 'bg-gray-800 border-gray-700 text-gray-200'
//                                         : 'bg-white border-gray-300 text-gray-700'
//                                 }`}
//                             >
//                                 <option>All Orders</option>
//                                 <option>Buy Orders</option>
//                                 <option>Sell Orders</option>
//                             </select>
//                             <select
//                                 value={filterStatus}
//                                 onChange={(e) => setFilterStatus(e.target.value)}
//                                 className={`text-sm border rounded-md px-3 py-1.5 ${
//                                     theme === 'dark'
//                                         ? 'bg-gray-800 border-gray-700 text-gray-200'
//                                         : 'bg-white border-gray-300 text-gray-700'
//                                 }`}
//                             >
//                                 <option>All Status</option>
//                                 {uniqueStatuses.map((status) => (
//                                     <option key={status} value={status}>
//                                         {status}
//                                     </option>
//                                 ))}
//                             </select>
//                         </div>
//                         <div className="relative">
//                             <input
//                                 type="text"
//                                 placeholder="Search orders..."
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                                 className={`pl-10 pr-4 py-2 border rounded-md w-full md:w-64 ${
//                                     theme === 'dark'
//                                         ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400'
//                                         : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
//                                 }`}
//                             />
//                             <svg
//                                 className={`absolute left-3 top-2.5 h-5 w-5 ${
//                                     theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
//                                 }`}
//                                 xmlns="http://www.w3.org/2000/svg"
//                                 viewBox="0 0 20 20"
//                                 fill="currentColor"
//                             >
//                                 <path
//                                     fillRule="evenodd"
//                                     d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
//                                     clipRule="evenodd"
//                                 />
//                             </svg>
//                         </div>
//                     </div>
//                 </div>
//
//                 {error && (
//                     <div
//                         className={`p-4 rounded mb-4 ${
//                             theme === 'dark'
//                                 ? 'bg-yellow-900 text-yellow-300'
//                                 : 'bg-yellow-100 text-yellow-700'
//                         }`}
//                     >
//                         {error}
//                     </div>
//                 )}
//
//                 <div className="overflow-x-auto">
//                     <table
//                         className={`min-w-full divide-y ${
//                             theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'
//                         }`}
//                     >
//                         <thead
//                             className={`${
//                                 theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
//                             }`}
//                         >
//                         <tr className={`${
//                             theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
//                         }`}>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Order ID
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Type
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Symbol
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Quantity
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Price
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Total
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Order Type
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Product Type
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Exchange
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Filled Shares
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Unfilled Shares
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Date & Time
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Status
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Reason
//                             </th>
//                             <th
//                                 scope="col"
//                                 className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
//                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                 }`}
//                             >
//                                 Actions
//                             </th>
//                         </tr>
//                         </thead>
//                         <tbody
//                             className={`divide-y ${
//                                 theme === 'dark'
//                                     ? 'bg-gray-900 divide-gray-800'
//                                     : 'bg-white divide-gray-200'
//                             }`}
//                         >
//                         {filteredOrders.length > 0 ? (
//                             filteredOrders.map((order, index) => (
//                                 <tr key={index} data-orderid={order.orderid}>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
//                                         }`}
//                                     >
//                                         {order.orderid}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                             <span
//                                                 className={`px-2 py-1 text-xs font-medium rounded-full ${
//                                                     order.transactiontype === 'BUY'
//                                                         ? theme === 'dark'
//                                                             ? 'bg-green-800 text-green-200'
//                                                             : 'bg-green-100 text-green-800'
//                                                         : theme === 'dark'
//                                                             ? 'bg-red-800 text-red-200'
//                                                             : 'bg-red-100 text-red-800'
//                                                 }`}
//                                             >
//                                                 {order.transactiontype}
//                                             </span>
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.symbol}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.quantity}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         ₹{order.price.toFixed(2)}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         ₹{order.total.toLocaleString()}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.ordertype}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.producttype}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.exchange}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.filledshares}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.unfilledshares}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.trade_time}
//                                     </td>
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         {renderStatus(order.status)}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {order.text || 'N/A'}
//                                     </td>
//                                     <td
//                                         className={`px-6 py-4 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         <button
//                                             className={`mr-3 ${
//                                                 theme === 'dark'
//                                                     ? 'text-blue-400 hover:text-blue-300'
//                                                     : 'text-blue-600 hover:text-blue-800'
//                                             }`}
//                                         >
//                                             View
//                                         </button>
//                                         {order.status === 'OPEN' && (
//                                             <button
//                                                 onClick={() =>
//                                                     cancelOrder(order.orderid, order.variety)
//                                                 }
//                                                 className={`${
//                                                     theme === 'dark'
//                                                         ? 'text-red-400 hover:text-red-300'
//                                                         : 'text-red-600 hover:text-red-800'
//                                                 }`}
//                                             >
//                                                 Cancel
//                                             </button>
//                                         )}
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td
//                                     colSpan="15"
//                                     className={`px-6 py-4 text-center ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
//                                     }`}
//                                 >
//                                     No orders match the current filters.
//                                 </td>
//                             </tr>
//                         )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Orders;





import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import DashboardLayout from '../../components/DashboardLayout';
import { Clock, CheckCircle, XCircle, AlertCircle, Ban } from 'lucide-react'; // Added Ban for Cancelled
import { toast } from 'react-toastify';
import { encryptMessage, parseApiResponse } from '../../utils/crypto';
import { getAuthToken } from '../../utils/auth';
import { ThemeContext } from '../../context/ThemeContext';

const Orders = () => {
    const [orderBook, setOrderBook] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterType, setFilterType] = useState('All Orders');
    const [filterStatus, setFilterStatus] = useState('All Status');
    const [searchTerm, setSearchTerm] = useState('');
    const [hasFetched, setHasFetched] = useState(false);
    const location = useLocation();
    const { theme } = useContext(ThemeContext);

    // Fetch order book data with retry on rate limit
    const fetchOrderBook = async (isRetry = false) => {
        try {
            if (!isRetry) setLoading(true);
            setError(null);
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/order-book`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const decryptedData = parseApiResponse(response.data.data);
            console.log('Decrypted Order Book Data:', decryptedData);

            if (decryptedData?.status === '200') {
                const orders = decryptedData.order_book?.data || [];

                if (decryptedData.order_book.message.includes("Rate limit exceeded")) {
                    setError("Rate limit exceeded. Retrying...");
                    console.log('Rate limit detected, retrying...');
                    setTimeout(() => fetchOrderBook(true), 1000);
                    return;
                }

                const formattedOrders = orders.map((order) => ({
                    orderid: order.orderid || 'N/A',
                    transactiontype: (order.transactiontype || 'UNKNOWN').toUpperCase(),
                    symbol: order.tradingsymbol || 'N/A',
                    quantity: Number(order.quantity) || 0,
                    price: Number(order.price) || 0,
                    total: (Number(order.price) || 0) * (Number(order.quantity) || 0),
                    trade_time: order.updatetime || new Date().toISOString(),
                    status: order.orderstatus?.toUpperCase() || 'OPEN',
                    ordertype: order.ordertype || 'N/A',
                    producttype: order.producttype || 'N/A',
                    exchange: order.exchange || 'N/A',
                    filledshares: Number(order.filledshares) || 0,
                    unfilledshares: Number(order.unfilledshares) || 0,
                    text: order.text || '',
                    variety: order.variety || 'NORMAL',
                }));

                setOrderBook(formattedOrders);
                setHasFetched(true);
                setError(null);
            } else {
                throw new Error(decryptedData?.message || 'Failed to fetch order book');
            }
        } catch (err) {
            const errorMessage = 'Failed to fetch order book: ' + (err.message || 'Unknown error');
            setError(errorMessage);
            toast.error(errorMessage);
            console.error('Fetch Error:', err);
            if (!isRetry && orderBook.length > 0) {
                setError(errorMessage + ' (Showing last known data)');
            }
        } finally {
            if (!isRetry) setLoading(false);
        }
    };

    // Cancel order function
    const cancelOrder = async (orderid, variety) => {
        try {
            const token = getAuthToken();
            if (!token) {
                throw new Error('No authentication token found. Please log in.');
            }

            const payload = { variety, orderid };
            const encryptedPayload = encryptMessage(JSON.stringify(payload));

            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/orders/cancel`,
                { data: encryptedPayload },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            const decryptedData = parseApiResponse(response.data.data);

            if (response.status === 200 && decryptedData.status) {
                toast.success('Order cancelled successfully');
                await fetchOrderBook();
            } else {
                throw new Error(decryptedData.message || 'Failed to cancel order');
            }
        } catch (err) {
            const errorMessage = `Failed to cancel order: ${err.message || 'Unknown error'}`;
            toast.error(errorMessage);
            console.error('Cancel Order Error:', err);
        }
    };

    // Get unique statuses for the filter dropdown
    const uniqueStatuses = useMemo(() => {
        const statuses = [...new Set(orderBook.map((order) => order.status))];
        return statuses.map((status) =>
            status
                .toLowerCase()
                .split('_')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')
        );
    }, [orderBook]);

    // Filter and search logic
    const filteredOrders = useMemo(() => {
        let result = [...orderBook];

        if (filterType === 'Buy Orders') {
            result = result.filter((order) => order.transactiontype === 'BUY');
        } else if (filterType === 'Sell Orders') {
            result = result.filter((order) => order.transactiontype === 'SELL');
        }

        if (filterStatus !== 'All Status') {
            const statusToFilter = filterStatus
                .toUpperCase()
                .split(' ')
                .join('_');
            result = result.filter((order) => order.status === statusToFilter);
        }

        if (searchTerm) {
            result = result.filter(
                (order) =>
                    order.symbol.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.orderid.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.ordertype.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.producttype.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.exchange.toLowerCase().includes(searchTerm.toLowerCase())
        );
        }

        return result;
    }, [orderBook, filterType, filterStatus, searchTerm]);

    // Fetch data only once on page load
    useEffect(() => {
        if (location.pathname === '/orders' && !hasFetched) {
            setFilterType('All Orders');
            setFilterStatus('All Status');
            setSearchTerm('');
            fetchOrderBook();
        }
    }, [location.pathname, hasFetched]);

    // Render status with icon and color
    const renderStatus = (status) => {
        const statusMap = {
            COMPLETE: {
                icon: CheckCircle,
                color: theme === 'dark' ? 'text-green-400' : 'text-green-600',
                label: 'Completed',
            },
            REJECTED: {
                icon: XCircle,
                color: theme === 'dark' ? 'text-red-400' : 'text-red-600',
                label: 'Rejected',
            },
            OPEN: {
                icon: Clock,
                color: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
                label: 'Pending',
            },
            FAILED: {
                icon: AlertCircle,
                color: theme === 'dark' ? 'text-red-400' : 'text-red-600',
                label: 'Failed',
            },
            CANCELLED: {
                icon: Ban, // Using Ban icon for Cancelled
                color: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
                label: 'Cancelled',
            },
            // Add more statuses as needed based on your API possibilities
            PENDING: { // In case API returns "PENDING" instead of "OPEN"
                icon: Clock,
                color: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
                label: 'Pending',
            },
            EXECUTED: { // Additional common status
                icon: CheckCircle,
                color: theme === 'dark' ? 'text-green-400' : 'text-green-600',
                label: 'Executed',
            },
        };
        const statusData = statusMap[status] || {
            icon: Clock,
            color: theme === 'dark' ? 'text-amber-400' : 'text-amber-600',
            label: 'Unknown', // Default for unrecognized statuses
        };
        const Icon = statusData.icon;
        return (
            <div className="flex items-center">
                <Icon size={16} className={`${statusData.color} mr-1.5`} />
                <span className={`text-sm ${statusData.color}`}>{statusData.label}</span>
            </div>
        );
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div
                    className={`flex justify-center items-center h-full ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}
                >
                    <p>Loading order book...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h3
                        className={`text-lg font-medium ${
                            theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                        }`}
                    >
                        Recent Orders
                    </h3>
                    <p
                        className={`text-sm ${
                            theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        }`}
                    >
                        Track and manage your stock orders
                    </p>
                </div>
            </div>

            <div
                className={`rounded-lg shadow-sm border overflow-hidden ${
                    theme === 'dark'
                        ? 'bg-gray-900 border-gray-800'
                        : 'bg-white border-gray-200'
                }`}
            >
                <div
                    className={`p-4 border-b ${
                        theme === 'dark'
                            ? 'border-gray-800 bg-gray-800'
                            : 'border-gray-200 bg-gray-50'
                    }`}
                >
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <select
                                value={filterType}
                                onChange={(e) => setFilterType(e.target.value)}
                                className={`text-sm border rounded-md px-3 py-1.5 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-gray-200'
                                        : 'bg-white border-gray-300 text-gray-700'
                                }`}
                            >
                                <option>All Orders</option>
                                <option>Buy Orders</option>
                                <option>Sell Orders</option>
                            </select>
                            <select
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                                className={`text-sm border rounded-md px-3 py-1.5 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-gray-200'
                                        : 'bg-white border-gray-300 text-gray-700'
                                }`}
                            >
                                <option>All Status</option>
                                {uniqueStatuses.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={`pl-10 pr-4 py-2 border rounded-md w-full md:w-64 ${
                                    theme === 'dark'
                                        ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400'
                                        : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500'
                                }`}
                            />
                            <svg
                                className={`absolute left-3 top-2.5 h-5 w-5 ${
                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-400'
                                }`}
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>
                </div>

                {error && (
                    <div
                        className={`p-4 rounded mb-4 ${
                            theme === 'dark'
                                ? 'bg-yellow-900 text-yellow-300'
                                : 'bg-yellow-100 text-yellow-700'
                        }`}
                    >
                        {error}
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table
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
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Order ID
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Type
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Symbol
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Quantity
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Price
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Total
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Order Type
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Product Type
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Exchange
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Filled Shares
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Unfilled Shares
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Date & Time
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Status
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Reason
                            </th>
                            <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                                }`}
                            >
                                Actions
                            </th>
                        </tr>
                        </thead>
                        <tbody
                            className={`divide-y ${
                                theme === 'dark'
                                    ? 'bg-gray-900 divide-gray-800'
                                    : 'bg-white divide-gray-200'
                            }`}
                        >
                        {filteredOrders.length > 0 ? (
                            filteredOrders.map((order, index) => (
                                <tr key={index} data-orderid={order.orderid}>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                        }`}
                                    >
                                        {order.orderid}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span
                                            className={`px-2 py-1 text-xs font-medium rounded-full ${
                                                order.transactiontype === 'BUY'
                                                    ? theme === 'dark'
                                                        ? 'bg-green-800 text-green-200'
                                                        : 'bg-green-100 text-green-800'
                                                    : theme === 'dark'
                                                        ? 'bg-red-800 text-red-200'
                                                        : 'bg-red-100 text-red-800'
                                            }`}
                                        >
                                            {order.transactiontype}
                                        </span>
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.symbol}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.quantity}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        ₹{order.price.toFixed(2)}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        ₹{order.total.toLocaleString()}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.ordertype}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.producttype}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.exchange}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.filledshares}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.unfilledshares}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.trade_time}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {renderStatus(order.status)}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
                                        {order.text || 'N/A'}
                                    </td>
                                    <td
                                        className={`px-6 py-4 whitespace-nowrap text-sm ${
                                            theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
                                        }`}
                                    >
 {/*                                       <button
                                            className={`mr-3 ${
                                                theme === 'dark'
                                                    ? 'text-blue-400 hover:text-blue-300'
                                                    : 'text-blue-600 hover:text-blue-800'
                                            }`}
                                        >
                                            View
                                        </button>*/}
                                        {order.status === 'OPEN' && (
                                            <button
                                                onClick={() =>
                                                    cancelOrder(order.orderid, order.variety)
                                                }
                                                className={`${
                                                    theme === 'dark'
                                                        ? 'text-red-400 hover:text-red-300'
                                                        : 'text-red-600 hover:text-red-800'
                                                }`}
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td
                                    colSpan="15"
                                    className={`px-6 py-4 text-center ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
                                    }`}
                                >
                                    No orders match the current filters.
                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Orders;
