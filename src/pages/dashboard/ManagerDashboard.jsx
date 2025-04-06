// import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
// import axios from 'axios';
// import DashboardLayout from '../../components/DashboardLayout';
// import AddMemberForm from '../../components/AddMemberForm';
// import {
//     Users,
//     TrendingUp,
//     DollarSign,
//     BarChart2,
//     UserPlus,
//     Eye,
//     EyeOff,
//     Plus,
//     Search,
//     Trash2,
// } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import LivePricesComponent from './LivePricesComponent.jsx';
// import { encryptMessage, decryptMessage, parseApiResponse } from '../../utils/crypto';
// import { getAuthToken } from '../../utils/auth';
// import { ThemeContext } from '../../context/ThemeContext';
//
// const ManagerDashboard = () => {
//     const [activeTab, setActiveTab] = useState('dashboard');
//     const [showAddMemberForm, setShowAddMemberForm] = useState(false);
//     const [refreshTrigger, setRefreshTrigger] = useState(0);
//     const [users, setUsers] = useState([]);
//     const [tradeBook, setTradeBook] = useState([]);
//     const [stocks, setStocks] = useState([]);
//     const [loading, setLoading] = useState(false);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [stockSearchQuery, setStockSearchQuery] = useState('');
//     const [stockSearchResults, setStockSearchResults] = useState([]);
//     const [selectedStock, setSelectedStock] = useState(null);
//     const [exchange, setExchange] = useState('NSE');
//     const [newUser, setNewUser] = useState({
//         name: '',
//         email: '',
//         mobile: '',
//         password: '',
//     });
//     const [symbols, setSymbols] = useState([]);
//     const [activePLView, setActivePLView] = useState('combined');
//     const [liveStockData, setLiveStockData] = useState({});
//     const [isSearchLoading, setIsSearchLoading] = useState(false);
//     const portfolioRef = useRef({ holdings: [], totalholding: {} });
//     const rmsRef = useRef({});
//     const tradeBookRef = useRef([]);
//     const [error, setError] = useState(null);
//     const [portfolioData, setPortfolioData] = useState({
//         holdings: [],
//         totalholding: {
//             totalholdingvalue: 0,
//             totalinvvalue: 0,
//             totalprofitandloss: 0,
//             totalpnlpercentage: 0,
//             today_profit_and_loss: 0,
//         },
//     });
//     const [rmsData, setRmsData] = useState({
//         net: "0",
//         availablecash: "0",
//         collateral: "0",
//         m2munrealized: "0",
//         m2mrealized: "0"
//     });
//     const [portfolioLoading, setPortfolioLoading] = useState(true);
//     const [portfolioError, setPortfolioError] = useState(null);
//     const holdingsRef = useRef(new Map());
//     const totalHoldingRef = useRef({});
//     const updateCounter = useRef(0);
//     const [rmsLoading, setRmsLoading] = useState(true);
//     const [rmsError, setRmsError] = useState(null);
//     const { theme } = useContext(ThemeContext);
//
//     // New state for Symbol Settings
//     // const [dashboardStats, setDashboardStats] = useState({ total_connected_users: 0, active_stock_data: [] });
//     const [baseCapitalOptions, setBaseCapitalOptions] = useState([]);
//     const [showConfigModal, setShowConfigModal] = useState(false);
//     const [selectedSymbol, setSelectedSymbol] = useState(null);
//     const [selectedCapital, setSelectedCapital] = useState('');
//     const [selectedPhase, setSelectedPhase] = useState(1);
//     const [selectedDownIncrement, setSelectedDownIncrement] = useState(0.25);
//     const [dashboardStats, setDashboardStats] = useState({ total_connected_users: 0, active_stock_data: [], status: '', message: '' });
//     const [hasData, setHasData] = useState(false); // New state to track if there is data
//     const intervalRef = useRef(null)
//
//     const filteredUsers = users.filter((user) =>
//         [user.name, user.email].some((field) =>
//             field.toLowerCase().includes(searchTerm.toLowerCase())
//         )
//     );
//
//     useEffect(() => {
//         if (activeTab === 'dashboard') {
//             fetchPortfolioData();
//             fetchStocksData();
//             fetchRmsLimit();
//             fetchDashboardStats();
//             fetchBaseCapitalOptions();
//         } else if (activeTab === 'users') {
//             fetchUserData();
//         } else if (activeTab === 'tradeBook') {
//             fetchTradeBookData();
//         } else if (activeTab === 'stocks') {
//             fetchStocksData();
//         }
//     }, [activeTab, refreshTrigger]);
//
//     useEffect(() => {
//         const updatedSymbols = stocks.map((stock) => ({
//             symbol: stock.tradingsymbol,
//             quantity: stock.quantity || 10,
//             symboltoken: stock.symboltoken,
//             ltp: liveStockData[stock.symboltoken]?.ltp || stock.ltp || 0,
//         }));
//         setSymbols(updatedSymbols);
//     }, [stocks, liveStockData]);
//
//     const fetchUserData = async () => {
//         setLoading(true);
//         try {
//             const token = getAuthToken();
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData?.status === '200') {
//                 const usersData = decryptedData.users || [];
//                 const uniqueUsers = usersData.filter(
//                     (user, index, self) => index === self.findIndex((u) => u.email === user.email)
//                 );
//                 setUsers(uniqueUsers);
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch users');
//             }
//         } catch (err) {
//             console.error('Error fetching users:', err);
//             toast.error('Failed to load users');
//             setUsers([]);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const fetchTradeBookData = async () => {
//         try {
//             const token = getAuthToken();
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/trade-book`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData?.status === '200') {
//                 tradeBookRef.current = decryptedData.trade_book?.data || [];
//                 setError(null);
//                 updateTradeBookDOM();
//             } else {
//                 setTimeout(fetchTradeBookData, 2000);
//             }
//         } catch (err) {
//             setTimeout(fetchTradeBookData, 2000);
//         }
//     };
//
//     const updateTradeBookDOM = () => {
//         const tbody = document.querySelector('.trade-book-table tbody');
//         if (!tbody) return;
//
//         tbody.innerHTML = '';
//         const trades = tradeBookRef.current;
//
//         if (trades.length > 0) {
//             trades.forEach((trade) => {
//                 const row = document.createElement('tr');
//                 row.className = `${theme === 'dark' ? 'hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`;
//                 row.innerHTML = `
//                     <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
//                         ${trade.filltime || 'N/A'}
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
//                         ${trade.tradingsymbol || 'N/A'}
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap">
//                         <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
//                     trade.transactiontype === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
//                 }">
//                             ${trade.transactiontype || 'N/A'}
//                         </span>
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
//                         ${trade.fillsize || 0}
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
//                         ₹${(Number(trade.fillprice) || 0).toFixed(2)}
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
//                         ₹${((Number(trade.fillprice) || 0) * (Number(trade.fillsize) || 0)).toLocaleString()}
//                     </td>
//                     <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
//                         ${trade.orderid || 'N/A'}
//                     </td>
//                 `;
//                 tbody.appendChild(row);
//             });
//         } else {
//             tbody.innerHTML = `
//                 <tr>
//                     <td colspan="7" class="px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}">
//                         No trades available.
//                     </td>
//                 </tr>
//             `;
//         }
//     };
//
//     useEffect(() => {
//         fetchTradeBookData();
//     }, []);
//
//     const fetchStocksData = async () => {
//         setLoading(true);
//         try {
//             const token = getAuthToken();
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/stocks`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             // console.log("User Stock",decryptedData);
//             if (decryptedData?.status === '200') {
//                 setStocks(decryptedData.stocks || []);
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch stocks');
//             }
//         } catch (err) {
//             console.error('Error fetching stocks:', err);
//             toast.error('Failed to load stocks: ' + err.message);
//             setStocks([]);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     const removeStock = async (symboltoken) => {
//         try {
//             const token = localStorage.getItem('token');
//             const payload = { symboltoken };
//             const encryptedPayload = encryptMessage(JSON.stringify(payload));
//             const response = await axios.post(
//                 `${import.meta.env.VITE_API_URL}/user/stocks/remove`,
//                 { data: encryptedPayload },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData?.status === '200') {
//                 toast.success(decryptedData.message || 'Stock removed successfully');
//                 await fetchStocksData();
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to remove stock');
//             }
//         } catch (err) {
//             console.error('Error removing stock:', err);
//             toast.error('Failed to remove stock: ' + err.message);
//         }
//     };
//
//     const fetchDashboardStats = async () => {
//         try {
//             const token = getAuthToken();
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard_stats`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             // console.log("Dashboarrdstatststtstst",decryptedData);
//             if (decryptedData?.status === '200') {
//                 setDashboardStats({
//                     total_connected_users: decryptedData.total_connected_users || 0,
//                     active_stock_data: decryptedData.active_stock_data || [],
//                 });
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch dashboard stats');
//             }
//         } catch (err) {
//             console.error('Error fetching dashboard stats:', err);
//             toast.error('Failed to load dashboard stats');
//             setDashboardStats({ total_connected_users: 0, active_stock_data: [] });
//         }
//     };
//
//     const fetchBaseCapitalOptions = async () => {
//         try {
//             const token = getAuthToken();
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/base_capital_options`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (response.status === 200) {
//                 setBaseCapitalOptions(response.data.base_capital_options || []);
//             } else {
//                 throw new Error(response.data?.error || 'Failed to fetch base capital options');
//             }
//         } catch (err) {
//             // console.error('Error fetching base capital options:', err);
//             // toast.error('Failed to load base capital options');
//             setBaseCapitalOptions([]);
//         }
//     };
//
//     const toggleTradingStatus = async (tradingsymbol, tradingStatus) => {
//         if (tradingStatus) {
//             // When enabling trading, open the popup
//             setSelectedSymbol({ tradingsymbol });
//             setShowConfigModal(true);
//         } else {
//             // When disabling trading, send the request immediately
//             try {
//                 const token = getAuthToken();
//                 const payload = {
//                     tradingsymbol,
//                     trading_status: tradingStatus,
//                     wallet_value: null,
//                     phase: null,
//                     down_increment: null,
//                 };
//                 const encryptedPayload = encryptMessage(JSON.stringify(payload));
//                 const response = await axios.post(
//                     `${import.meta.env.VITE_API_URL}/api/toggle-trading-status`,
//                     { data: encryptedPayload },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             'Content-Type': 'application/json',
//                         },
//                     }
//                 );
//                 const decryptedData = parseApiResponse(response.data.data);
//                 if (decryptedData?.status === 'success') {
//                     toast.success(decryptedData.message);
//                     fetchDashboardStats(); // Refetch dashboard stats to update frontend state
//                 } else if (decryptedData?.status === 'error') {
//                     toast.error(decryptedData.message);
//                 } else {
//                     throw new Error(decryptedData?.message || 'Failed to toggle trading status');
//                 }
//             } catch (err) {
//                 console.error('Error toggling trading status:', err);
//                 toast.error('Failed to toggle trading status: ' + err.message);
//             }
//         }
//     };
//
//     const startStrategy = async () => {
//         if (!selectedCapital || !selectedPhase || selectedDownIncrement === null) {
//             toast.error('Please select capital, phase, and down increment to start the strategy.');
//             return;
//         }
//
//         try {
//             const token = getAuthToken();
//             const payload = {
//                 tradingsymbol: selectedSymbol.tradingsymbol,
//                 trading_status: true,
//                 wallet_value: parseFloat(selectedCapital),
//                 phase: parseInt(selectedPhase),
//                 down_increment: parseFloat(selectedDownIncrement),
//             };
//             const encryptedPayload = encryptMessage(JSON.stringify(payload));
//             const response = await axios.post(
//                 `${import.meta.env.VITE_API_URL}/api/toggle-trading-status`,
//                 { data: encryptedPayload },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                         'Content-Type': 'application/json',
//                     },
//                 }
//             );
//             const decryptedData = parseApiResponse(response.data.data);
//             // console.log("Succeess",decryptedData?.status === 'success');
//             // console.log("Message",decryptedData?.message);
//             // console.log("DATATATAT",decryptedData);
//             if (decryptedData?.status === 'success') {
//                 toast.success(decryptedData.message);
//                 fetchDashboardStats(); // Refetch dashboard stats to update frontend state
//                 fetchBaseCapitalOptions();
//                 setShowConfigModal(false); // Close the popup
//                 setSelectedCapital('');
//                 setSelectedPhase(1);
//                 setSelectedDownIncrement(0.25);
//             } else if (decryptedData?.status === 'error') {
//                 toast.error(decryptedData.message);
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to start strategy');
//             }
//         } catch (err) {
//             // console.error('Error starting strategy:', err);
//             toast.error('Failed to start strategy: ' + err.message);
//         }
//     };
//
//     const API_URL = import.meta.env.VITE_API_URL;
//     const api = axios.create({
//         baseURL: API_URL,
//         headers: {
//             'Content-Type': 'application/json',
//         },
//     });
//
//     const handleActivateUser = async (email) => {
//         try {
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify({ email }));
//             const response = await api.post('/user/activate', { data: encryptedData }, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData?.status === '200') {
//                 toast.success(decryptedData.message || 'User activated successfully');
//                 setUsers((prevUsers) =>
//                     prevUsers.map((user) =>
//                         user.email === email ? { ...user, is_active: 'True' } : user
//                     )
//                 );
//             } else {
//                 throw new Error(decryptedData?.message || 'User activation failed');
//             }
//         } catch (error) {
//             // console.error('Error activating user:', error);
//             toast.error('Failed to activate user: ' + error.message);
//         }
//     };
//
//     const handleDeactivateUser = async (email) => {
//         try {
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify({ email }));
//             const response = await api.post('/user/deactivate', { data: encryptedData }, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData?.status === '200') {
//                 toast.success(decryptedData.message || 'User deactivated successfully');
//                 setUsers((prevUsers) =>
//                     prevUsers.map((user) =>
//                         user.email === email ? { ...user, is_active: 'False' } : user
//                     )
//                 );
//             } else {
//                 throw new Error(decryptedData?.message || 'User deactivation failed');
//             }
//         } catch (error) {
//             // console.error('Error deactivating user:', error);
//             toast.error('Failed to deactivate user: ' + error.message);
//         }
//     };
//
//     const fetchRmsLimit = async () => {
//         setRmsLoading(true);
//         try {
//             const token = getAuthToken();
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/rms-limit`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData.status === "200") {
//                 rmsRef.current = decryptedData.rms.data || {};
//                 setRmsError(null);
//                 updateRmsDOM();
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to fetch RMS limit');
//             }
//         } catch (err) {
//             // console.error('RMS Limit Error:', err);
//         }
//     };
//
//     const fetchPortfolioData = async () => {
//         try {
//             const token = getAuthToken();
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/all-holding`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             if (response.status === 200 && response.data.data?.status === "200") {
//                 const allHoldingData = response.data.data.all_holding.data;
//                 const holdings = allHoldingData.holdings || [];
//                 const totalholding = allHoldingData.totalholding || {
//                     totalholdingvalue: 0,
//                     totalinvvalue: 0,
//                     totalprofitandloss: 0,
//                     totalpnlpercentage: 0,
//                     today_profit_and_loss: allHoldingData.today_profit_and_loss || 0,
//                 };
//
//                 const updatedHoldings = holdings.map(holding => ({
//                     ...holding,
//                     marketValue: holding.ltp * holding.quantity,
//                     profitandloss: (holding.ltp - holding.averageprice) * holding.quantity,
//                     pnlpercentage: holding.averageprice !== 0
//                         ? ((holding.ltp - holding.averageprice) / holding.averageprice) * 100
//                         : 0,
//                     today_pnl: (holding.ltp - (holding.close || holding.ltp)) * holding.quantity,
//                 }));
//
//                 const updatedTotalHolding = {
//                     totalholdingvalue: updatedHoldings.reduce((sum, h) => sum + h.marketValue, 0),
//                     totalinvvalue: totalholding.totalinvvalue || 0,
//                     totalprofitandloss: updatedHoldings.reduce((sum, h) => sum + h.profitandloss, 0),
//                     totalpnlpercentage: totalholding.totalinvvalue !== 0
//                         ? (updatedHoldings.reduce((sum, h) => sum + h.profitandloss, 0) / totalholding.totalinvvalue) * 100
//                         : 0,
//                     today_profit_and_loss: updatedHoldings.reduce((sum, h) => sum + h.today_pnl, 0),
//                 };
//
//                 portfolioRef.current = { holdings: updatedHoldings, totalholding: updatedTotalHolding };
//                 setPortfolioError(null);
//                 updatePortfolioDOM();
//             } else {
//                 throw new Error(response.data?.message || 'Failed to fetch portfolio data');
//             }
//         } catch (err) {
//             setPortfolioError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
//             // console.error('Fetch Error:', err);
//         }
//     };
//
//     const updatePortfolioDOM = () => {
//         const { holdings, totalholding } = portfolioRef.current;
//
//         if (activePLView === 'combined') {
//             const summary = document.querySelector('.portfolio-summary');
//             if (summary) {
//                 summary.querySelector('.invested-amount').textContent =
//                     `₹${Number(totalholding.totalinvvalue).toLocaleString()}`;
//                 summary.querySelector('.current-value').textContent =
//                     `₹${Number(totalholding.totalholdingvalue).toLocaleString()}`;
//                 summary.querySelector('.overall-gain-loss').textContent =
//                     `${totalholding.totalprofitandloss >= 0 ? '+' : '-'}₹${Math.abs(totalholding.totalprofitandloss).toLocaleString()} (${Number(totalholding.totalpnlpercentage).toFixed(2)}%)`;
//                 summary.querySelector('.overall-gain-loss').className =
//                     `text-lg font-bold ${totalholding.totalprofitandloss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} overall-gain-loss`;
//                 summary.querySelector('.today-gain-loss').textContent =
//                     totalholding.today_profit_and_loss === 0
//                         ? '₹0 (0%)'
//                         : `${totalholding.today_profit_and_loss >= 0 ? '+' : '-'}₹${Math.abs(totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(totalholding.today_profit_and_loss) / (totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`;
//                 summary.querySelector('.today-gain-loss').className =
//                     `text-lg font-bold ${totalholding.today_profit_and_loss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} today-gain-loss`;
//             }
//         }
//
//         if (activePLView === 'individual') {
//             holdings.forEach(holding => {
//                 const row = document.querySelector(`div[data-symbol="${holding.tradingsymbol}"]`);
//                 if (row) {
//                     row.querySelector('.quantity').textContent = holding.quantity;
//                     row.querySelector('.avg-price').textContent = `₹${Number(holding.averageprice).toFixed(2)}`;
//                     row.querySelector('.ltp').textContent = `₹${Number(holding.ltp).toFixed(2)}`;
//                     row.querySelector('.market-value').textContent = `₹${holding.marketValue.toLocaleString()}`;
//                     row.querySelector('.gain-loss').textContent =
//                         `${holding.profitandloss >= 0 ? '+' : '-'}₹${Math.abs(holding.profitandloss).toLocaleString()} (${Number(holding.pnlpercentage).toFixed(2)}%)`;
//                     row.querySelector('.gain-loss').className =
//                         `text-sm ${holding.profitandloss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} gain-loss`;
//                     row.querySelector('.today-pnl').textContent =
//                         `${holding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(holding.today_pnl).toLocaleString()}`;
//                     row.querySelector('.today-pnl').className =
//                         `text-sm ${holding.today_pnl >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} today-pnl`;
//                 }
//             });
//         }
//     };
//
//     const updateRmsDOM = () => {
//         const summary = document.querySelector('.portfolio-summary');
//         if (summary) {
//             summary.querySelector('.available-cash').textContent =
//                 `₹${Number(rmsRef.current.availablecash || 0).toLocaleString()}`;
//             summary.querySelector('.net-capital').textContent =
//                 `₹${Number(rmsRef.current.net || 0).toLocaleString()}`;
//             summary.querySelector('.collateral').textContent =
//                 `₹${Number(rmsRef.current.collateral || 0).toLocaleString()}`;
//             summary.querySelector('.m2m-total').textContent =
//                 `₹${(Number(rmsRef.current.m2munrealized || 0) + Number(rmsRef.current.m2mrealized || 0)).toLocaleString()}`;
//         }
//     };
//
//     const memoizedHoldings = useMemo(() => portfolioData.holdings, [portfolioData.holdings]);
//
//     useEffect(() => {
//         const fetchData = async () => {
//             await Promise.all([
//                 fetchPortfolioData(),
//                 fetchRmsLimit(),
//             ]);
//         };
//         fetchData();
//
//         const interval = setInterval(() => {
//             fetchPortfolioData();
//             fetchRmsLimit();
//         }, 3000);
//
//         return () => clearInterval(interval);
//     }, []);
//
//     const renderDashboard = () => {
//         return (
//             <div className="space-y-6">
//                 <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                             Live P&L and Capital
//                         </h3>
//                         <div className="flex gap-2">
//                             <button
//                                 onClick={() => { setActivePLView('combined'); updatePortfolioDOM(); }}
//                                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
//                                     activePLView === 'combined'
//                                         ? 'bg-blue-600 text-white shadow-lg'
//                                         : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
//                                 }`}
//                             >
//                                 Combined
//                             </button>
//                             <button
//                                 onClick={() => { setActivePLView('individual'); updatePortfolioDOM(); }}
//                                 className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
//                                     activePLView === 'individual'
//                                         ? 'bg-blue-600 text-white shadow-lg'
//                                         : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
//                                 }`}
//                             >
//                                 Individual
//                             </button>
//                         </div>
//                     </div>
//
//                     {(portfolioError || rmsError) ? (
//                         <div className={`p-4 rounded mb-4 ${theme === 'dark' ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-700'}`}>
//                             {portfolioError || rmsError}
//                         </div>
//                     ) : (
//                         <>
//                             {activePLView === 'combined' && (
//                                 <div className="portfolio-summary mb-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
//                                         <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 Invested Amount
//                                             </p>
//                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} invested-amount`}>
//                                                 ₹0
//                                             </p>
//                                         </div>
//                                         <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 Current Value
//                                             </p>
//                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} current-value`}>
//                                                 ₹0
//                                             </p>
//                                         </div>
//                                         <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 Overall G/L
//                                             </p>
//                                             <p className="text-lg font-bold overall-gain-loss">
//                                                 ₹0 (0%)
//                                             </p>
//                                         </div>
//                                         <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 Today’s G/L
//                                             </p>
//                                             <p className="text-lg font-bold today-gain-loss">
//                                                 ₹0 (0%)
//                                             </p>
//                                         </div>
//                                         <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 Available Cash
//                                             </p>
//                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} available-cash`}>
//                                                 ₹0
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
//                                         <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 Net Capital
//                                             </p>
//                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} net-capital`}>
//                                                 ₹0
//                                             </p>
//                                         </div>
//                                         <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 Collateral
//                                             </p>
//                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} collateral`}>
//                                                 ₹0
//                                             </p>
//                                         </div>
//                                         <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                             <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                 M2M Total
//                                             </p>
//                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} m2m-total`}>
//                                                 ₹0
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>
//                             )}
//
//                             {activePLView === 'individual' && (
//                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                                     {portfolioRef.current.holdings.map((holding, index) => (
//                                         <div
//                                             key={index}
//                                             data-symbol={holding.tradingsymbol}
//                                             className={`p-6 rounded-lg shadow-md border ${theme === 'dark' ? 'bg-gray-900 border-gray-800 hover:shadow-xl' : 'bg-white border-gray-200 hover:shadow-lg'} transition-all duration-300`}
//                                         >
//                                             <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-4`}>
//                                                 {holding.tradingsymbol}
//                                             </h4>
//                                             <div className="space-y-2">
//                                                 <div className="flex justify-between">
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                         Quantity:
//                                                     </span>
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} quantity`}>
//                                                         0
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                         Avg. Price:
//                                                     </span>
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} avg-price`}>
//                                                         ₹0
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                         LTP:
//                                                     </span>
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} ltp`}>
//                                                         ₹0
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                         Market Value:
//                                                     </span>
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} market-value`}>
//                                                         ₹0
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                         Overall G/L:
//                                                     </span>
//                                                     <span className="text-sm gain-loss">
//                                                         ₹0 (0%)
//                                                     </span>
//                                                 </div>
//                                                 <div className="flex justify-between">
//                                                     <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                         Today’s P&L:
//                                                     </span>
//                                                     <span className="text-sm today-pnl">
//                                                         ₹0
//                                                     </span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </>
//                     )}
//                 </div>
//
//                 <div className={`rounded-xl shadow-lg p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                             Symbol Settings (Strategy)
//                         </h3>
//                         <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
//                             Connected Users: <span className="text-blue-600">{dashboardStats.total_connected_users}</span>
//                         </p>
//                     </div>
//                     <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                         <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                             <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
//                             <tr>
//                                 {[
//                                     'Sr No',
//                                     'Symbol',
//                                     'Phase',
//                                     'Quantity',
//                                     'Down %',
//                                     'Strategy Status',
//                                     'Toggle',
//                                 ].map((header) => (
//                                     <th
//                                         key={header}
//                                         className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
//                                     >
//                                         {header}
//                                     </th>
//                                 ))}
//                             </tr>
//                             </thead>
//                             <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                             {dashboardStats.active_stock_data.length > 0 ? (
//                                 dashboardStats.active_stock_data.map((stock, index) => {
//                                     const isLive = stock.activation_status; // Ensure this uses activation_status
//                                     const downIncrement = stock.phase_drop || 0.25;
//                                     return (
//                                         <tr key={index} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`}>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {stock.current_sr_no}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {stock.stock_symbol}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {stock.phase}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {stock.total_open_quantity}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 -{downIncrement}%
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm">
//                                     <span
//                                         className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
//                                             isLive
//                                                 ? 'bg-green-100 text-green-800'
//                                                 : 'bg-red-100 text-red-800'
//                                         }`}
//                                     >
//                                         {isLive ? 'Live' : 'Not Live'}
//                                     </span>
//                                             </td>
//                                             <td className="px-6 py-4 whitespace-nowrap">
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input
//                                                         type="checkbox"
//                                                         checked={isLive}
//                                                         onChange={() => toggleTradingStatus(stock.stock_symbol, !isLive)}
//                                                         className="sr-only peer"
//                                                     />
//                                                     <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
//                                                 </label>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr>
//                                     <td colSpan={7} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                         No active stocks found.
//                                     </td>
//                                 </tr>
//                             )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//
//                 {showConfigModal && (
//                     <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
//                         <div className={`rounded-2xl shadow-xl w-full max-w-md p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
//                             <div className="flex justify-between items-center mb-6">
//                                 <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                     Configure Trading for {selectedSymbol?.tradingsymbol}
//                                 </h3>
//                                 <button
//                                     onClick={() => setShowConfigModal(false)}
//                                     className={`transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
//                                 >
//                                     <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="h-6 w-6"
//                                         fill="none"
//                                         viewBox="0 0 24 24"
//                                         stroke="currentColor"
//                                     >
//                                         <path
//                                             strokeLinecap="round"
//                                             strokeLinejoin="round"
//                                             strokeWidth={2}
//                                             d="M6 18L18 6M6 6l12 12"
//                                         />
//                                     </svg>
//                                 </button>
//                             </div>
//                             <div className="space-y-4">
//                                 <div>
//                                     <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
//                                         Select Capital
//                                     </label>
//                                     <select
//                                         value={selectedCapital}
//                                         onChange={(e) => setSelectedCapital(e.target.value)}
//                                         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
//                                     >
//                                         <option value="">Select Capital</option>
//                                         {baseCapitalOptions.map((option) => (
//                                             <option key={option} value={option}>
//                                                 ₹{option.toLocaleString()}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
//                                         Select Phase
//                                     </label>
//                                     <select
//                                         value={selectedPhase}
//                                         onChange={(e) => setSelectedPhase(parseInt(e.target.value))}
//                                         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
//                                     >
//                                         {[1, 2, 3, 4, 5].map((phase) => (
//                                             <option key={phase} value={phase}>
//                                                 Phase {phase}
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <div>
//                                     <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
//                                         Down Increment (%)
//                                     </label>
//                                     <select
//                                         value={selectedDownIncrement}
//                                         onChange={(e) => setSelectedDownIncrement(parseFloat(e.target.value))}
//                                         className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
//                                     >
//                                         <option value="">Select Down Increment</option>
//                                         {[0.25, 0.50, 0.75, 1.00, 1.25].map((val) => (
//                                             <option key={val} value={val}>
//                                                 {val}%
//                                             </option>
//                                         ))}
//                                     </select>
//                                 </div>
//                                 <button
//                                     onClick={startStrategy}
//                                     className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
//                                     disabled={!selectedCapital || !selectedPhase || selectedDownIncrement === null}
//                                 >
//                                     Start Strategy
//                                 </button>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//
//                 <LivePricesComponent symbols={symbols} liveStockData={liveStockData} />
//             </div>
//         );
//     };
//
//     const renderUsers = () => {
//         return (
//             <div className={`rounded-2xl shadow-lg border overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-50'}`}>
//                 <div className={`p-6 border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-50'}`}>
//                     <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                         User Management
//                     </h3>
//                     <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
//                         Manage your team: add, activate, or deactivate users
//                     </p>
//                 </div>
//                 <div className="p-8">
//                     <div className="flex justify-between items-center mb-8">
//                         {/*<h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>*/}
//                         {/*    Dashboard Overview*/}
//                         {/*</h2>*/}
//                         <button
//                             onClick={() => setShowAddMemberForm(true)}
//                             className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl transition-colors"
//                         >
//                             <UserPlus size={18} />
//                             <span className="text-sm font-medium">Add New Member</span>
//                         </button>
//                     </div>
//                     {showAddMemberForm && (
//                         <div className="fixed inset-0 bg-gray-900/50 bg-opacity-40 flex items-center justify-center z-50">
//                             <div className={`rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
//                                 <div className="p-8">
//                                     <div className="flex justify-between items-center mb-6">
//                                         <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                             Add New Member
//                                         </h3>
//                                         <button
//                                             onClick={() => setShowAddMemberForm(false)}
//                                             className={`transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
//                                         >
//                                             <svg
//                                                 xmlns="http://www.w3.org/2000/svg"
//                                                 className="h-6 w-6"
//                                                 fill="none"
//                                                 viewBox="0 0 24 24"
//                                                 stroke="currentColor"
//                                             >
//                                                 <path
//                                                     strokeLinecap="round"
//                                                     strokeLinejoin="round"
//                                                     strokeWidth={2}
//                                                     d="M6 18L18 6M6 6l12 12"
//                                                 />
//                                             </svg>
//                                         </button>
//                                     </div>
//                                     <AddMemberForm
//                                         onClose={() => {
//                                             setShowAddMemberForm(false);
//                                             setRefreshTrigger((prev) => prev + 1);
//                                         }}
//                                     />
//                                 </div>
//                             </div>
//                         </div>
//                     )}
//                     <div>
//                         <div className="flex justify-between items-center mb-8">
//                             <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                 Users List
//                             </h4>
//                             <div className="relative w-72">
//                                 <input
//                                     type="text"
//                                     placeholder="Search users..."
//                                     value={searchTerm}
//                                     onChange={(e) => setSearchTerm(e.target.value)}
//                                     className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-100 text-gray-900'}`}
//                                 />
//                                 <Search
//                                     size={16}
//                                     className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
//                                 />
//                             </div>
//                         </div>
//                         <div className="overflow-x-auto">
//                             <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-100'}`}>
//                                 <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
//                                 <tr>
//                                     {['Name', 'Email', 'Mobile', 'Status', 'Actions'].map((header) => (
//                                         <th
//                                             key={header}
//                                             scope="col"
//                                             className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
//                                         >
//                                             {header}
//                                         </th>
//                                     ))}
//                                 </tr>
//                                 </thead>
//                                 <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-50'}`}>
//                                 {filteredUsers.length > 0 ? (
//                                     filteredUsers.map((user) => (
//                                         <tr key={user.id} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition-colors' : 'hover:bg-gray-25 transition-colors'}`}>
//                                             <td className="px-6 py-5 whitespace-nowrap">
//                                                 <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {user.name}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-5 whitespace-nowrap">
//                                                 <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                     {user.email}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-5 whitespace-nowrap">
//                                                 <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                     {user.phone}
//                                                 </div>
//                                             </td>
//                                             <td className="px-6 py-5 whitespace-nowrap">
//                                                     <span
//                                                         className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
//                                                             user.is_active === 'True'
//                                                                 ? 'bg-green-50 text-green-700'
//                                                                 : 'bg-red-50 text-red-700'
//                                                         }`}
//                                                     >
//                                                         {user.is_active === 'True' ? 'Active' : 'Inactive'}
//                                                     </span>
//                                             </td>
//                                             <td className="px-6 py-5 whitespace-nowrap text-sm">
//                                                 <div className="flex space-x-4">
//                                                     {user.is_active === 'True' ? (
//                                                         <button
//                                                             onClick={() => handleDeactivateUser(user.email)}
//                                                             className={`flex items-center gap-1 transition-colors ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
//                                                         >
//                                                             <EyeOff size={16} />
//                                                             <span>Deactivate</span>
//                                                         </button>
//                                                     ) : (
//                                                         <button
//                                                             onClick={() => handleActivateUser(user.email)}
//                                                             className={`flex items-center gap-1 transition-colors ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-500 hover:text-green-700'}`}
//                                                         >
//                                                             <Eye size={16} />
//                                                             <span>Activate</span>
//                                                         </button>
//                                                     )}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 ) : (
//                                     <tr>
//                                         <td colSpan={5} className={`px-6 py-5 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
//                                             No users found matching your search.
//                                         </td>
//                                     </tr>
//                                 )}
//                                 </tbody>
//                             </table>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         );
//     };
//
//     const renderTradeBook = () => {
//         return (
//             <div className={`rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
//                 <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                     <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//                         Trade Book
//                     </h3>
//                     <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                         View all trading activity
//                     </p>
//                 </div>
//                 <div className="p-6">
//                     {error && (
//                         <div className={`p-4 rounded mb-4 ${theme === 'dark' ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-700'}`}>
//                             {error}
//                         </div>
//                     )}
//                     <div className="overflow-x-auto">
//                         <table className={`min-w-full divide-y trade-book-table ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
//                             <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
//                             <tr>
//                                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
//                                     Trade Time
//                                 </th>
//                                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
//                                     Symbol
//                                 </th>
//                                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
//                                     Type
//                                 </th>
//                                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
//                                     Quantity
//                                 </th>
//                                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
//                                     Price
//                                 </th>
//                                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
//                                     Total
//                                 </th>
//                                 <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
//                                     Order ID
//                                 </th>
//                             </tr>
//                             </thead>
//                             <tbody className={`${theme === 'dark' ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'}`}>
//                             <tr>
//                                 <td colSpan={7} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                     No trades available.
//                                 </td>
//                             </tr>
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         );
//     };
//
//     const renderStocks = () => {
//         const handleSearchStock = async (query) => {
//             if (!query || query.length < 1) {
//                 setStockSearchResults([]);
//                 return;
//             }
//
//             setIsSearchLoading(true);
//             try {
//                 const token = getAuthToken();
//                 const response = await axios.get(
//                     `${import.meta.env.VITE_API_URL}/user/angel/searchstock/${exchange}/${query}`,
//                     {
//                         headers: { Authorization: `Bearer ${token}` },
//                     }
//                 );
//                 const decryptedData = parseApiResponse(response.data.data);
//                 if (decryptedData?.status === '200') {
//                     setStockSearchResults(decryptedData.search_result || []);
//                 } else {
//                     throw new Error(decryptedData?.message || 'Search failed');
//                 }
//             } catch (err) {
//                 // console.error('Error searching stock:', err);
//                 toast.error('Failed to search stock: ' + err.message);
//                 setStockSearchResults([]);
//             } finally {
//                 setIsSearchLoading(false);
//             }
//         };
//
//         const handleStockQueryChange = (e) => {
//             const value = e.target.value;
//             setStockSearchQuery(value);
//
//             if (window.stockSearchTimeout) {
//                 clearTimeout(window.stockSearchTimeout);
//             }
//
//             if (value.trim() === '' || value.endsWith(' ')) {
//                 handleSearchStock(value.trim());
//             } else {
//                 window.stockSearchTimeout = setTimeout(() => {
//                     handleSearchStock(value.trim());
//                 }, 2000);
//             }
//         };
//
//         const handleAddStock = async (e) => {
//             e.preventDefault();
//             if (!selectedStock) {
//                 toast.error('Please select a stock to add');
//                 return;
//             }
//
//             try {
//                 const token = getAuthToken();
//                 const stockData = {
//                     exchange: selectedStock.exchange,
//                     tradingsymbol: selectedStock.tradingsymbol,
//                     symboltoken: selectedStock.symboltoken,
//                 };
//                 const encryptedData = encryptMessage(JSON.stringify(stockData));
//                 const response = await axios.post(
//                     `${import.meta.env.VITE_API_URL}/user/stocks/add`,
//                     { data: encryptedData },
//                     {
//                         headers: {
//                             Authorization: `Bearer ${token}`,
//                             'Content-Type': 'application/json',
//                         },
//                     }
//                 );
//                 const decryptedData = parseApiResponse(response.data.data);
//                 if (decryptedData?.status === '201') {
//                     toast.success(decryptedData.message || 'Stock added successfully');
//                     await fetchStocksData();
//                     setSelectedStock(null);
//                     setStockSearchQuery('');
//                     setStockSearchResults([]);
//                 } else if (decryptedData?.status === '429') {
//                     toast.error('Add stock limit exceeds');
//                 } else {
//                     throw new Error(decryptedData?.message || 'Failed to add stock');
//                 }
//             } catch (err) {
//                 // console.error('Error adding stock:', err);
//                 const errorMessage = err.response?.data?.message || err.message || 'Failed to add stock';
//                 toast.error('Failed to add stock: ' + errorMessage);
//             }
//         };
//
//         return (
//             <div className="space-y-6">
//                 <div className={`rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
//                     <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                         <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//                             Add New Stock
//                         </h3>
//                         <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                             Search and add stocks to the system
//                         </p>
//                     </div>
//                     <div className="p-6">
//                         <div className="flex items-center gap-4 mb-4">
//                             <select
//                                 value={exchange}
//                                 onChange={(e) => setExchange(e.target.value)}
//                                 className={`w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
//                             >
//                                 <option value="NSE">NSE</option>
//                                 <option value="BSE">BSE</option>
//                             </select>
//                             <div className="relative w-full max-w-md">
//                                 <input
//                                     type="text"
//                                     placeholder={`Search ${exchange} stocks (e.g., RPOWER)`}
//                                     value={stockSearchQuery}
//                                     onChange={handleStockQueryChange}
//                                     className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
//                                     disabled={isSearchLoading}
//                                 />
//                                 <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
//                                 {isSearchLoading && (
//                                     <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
//                                         <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
//                                     </div>
//                                 )}
//                                 {isSearchLoading && stockSearchQuery && (
//                                     <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg p-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//                                         <p className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                             Searching...
//                                         </p>
//                                     </div>
//                                 )}
//                                 {!isSearchLoading && stockSearchResults.length > 0 && stockSearchQuery && (
//                                     <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
//                                         {stockSearchResults.map((result) => (
//                                             <div
//                                                 key={result.symboltoken}
//                                                 className={`p-2 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${
//                                                     selectedStock?.symboltoken === result.symboltoken ? 'bg-blue-50' : ''
//                                                 }`}
//                                                 onClick={() => {
//                                                     setSelectedStock(result);
//                                                     setStockSearchQuery(result.tradingsymbol);
//                                                     setStockSearchResults([]);
//                                                 }}
//                                             >
//                                                 <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {result.tradingsymbol} (Token: {result.symboltoken})
//                                                 </p>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 )}
//                             </div>
//                         </div>
//                         {selectedStock && (
//                             <button
//                                 onClick={handleAddStock}
//                                 className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
//                             >
//                                 <Plus size={16} className="mr-2" />
//                                 Add Selected Stock
//                             </button>
//                         )}
//                     </div>
//                 </div>
//
//                 <div className={`rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
//                     <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                         <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
//                             All Stocks
//                         </h3>
//                         <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                             View and manage stored stocks
//                         </p>
//                     </div>
//                     <div className="p-6">
//                         {stocks.length > 0 ? (
//                             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//                                 {stocks.map((stock) => (
//                                     <div
//                                         key={stock.symboltoken}
//                                         className={`rounded-lg p-4 border transition-shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:shadow-xl' : 'bg-gray-50 border-gray-100 hover:shadow-md'}`}
//                                     >
//                                         <div className="flex justify-between items-start">
//                                             <div>
//                                                 <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                     {stock.tradingsymbol}
//                                                 </h4>
//                                                 <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                                     {stock.exchange}
//                                                 </p>
//                                             </div>
//                                             <button
//                                                 onClick={() => removeStock(stock.symboltoken)}
//                                                 className={`flex items-center gap-1 ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
//                                             >
//                                                 <Trash2 size={16} />
//                                             </button>
//                                         </div>
//                                         <div className="mt-3 space-y-1">
//                                             <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                                                 <span className="font-medium">Token:</span> {stock.symboltoken}
//                                             </p>
//                                             <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
//                                                 <span className="font-medium">Added:</span>{' '}
//                                                 {new Date(stock.added_at).toLocaleString()}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 ))}
//                             </div>
//                         ) : (
//                             <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                 No stocks added yet.
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         );
//     };
//
//     return (
//         <DashboardLayout>
//             <div className={`mb-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                 <nav className="-mb-px flex space-x-8">
//                     <button
//                         onClick={() => setActiveTab('dashboard')}
//                         className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                             activeTab === 'dashboard'
//                                 ? 'border-blue-500 text-blue-600'
//                                 : (theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
//                         }`}
//                     >
//                         Dashboard
//                     </button>
//                     <button
//                         onClick={() => setActiveTab('users')}
//                         className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                             activeTab === 'users'
//                                 ? 'border-blue-500 text-blue-600'
//                                 : (theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
//                         }`}
//                     >
//                         Users
//                     </button>
//                     <button
//                         onClick={() => setActiveTab('tradeBook')}
//                         className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                             activeTab === 'tradeBook'
//                                 ? 'border-blue-500 text-blue-600'
//                                 : (theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
//                         }`}
//                     >
//                         Trade Book
//                     </button>
//                     <button
//                         onClick={() => setActiveTab('stocks')}
//                         className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                             activeTab === 'stocks'
//                                 ? 'border-blue-500 text-blue-600'
//                                 : (theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
//                         }`}
//                     >
//                         Stocks
//                     </button>
//                 </nav>
//             </div>
//
//             <ToastContainer
//                 position="top-right"
//                 autoClose={3000}
//                 hideProgressBar={false}
//                 newestOnTop={false}
//                 closeOnClick
//                 rtl={false}
//                 pauseOnFocusLoss
//                 draggable
//                 pauseOnHover
//                 theme="colored"
//             />
//
//             {loading && (
//                 <div className="flex justify-center items-center py-8">
//                     <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
//                 </div>
//             )}
//
//             {!loading && (
//                 <>
//                     {activeTab === 'dashboard' && renderDashboard()}
//                     {activeTab === 'users' && renderUsers()}
//                     {activeTab === 'tradeBook' && renderTradeBook()}
//                     {activeTab === 'stocks' && renderStocks()}
//                 </>
//             )}
//         </DashboardLayout>
//     );
// };
//
// export default ManagerDashboard;

//
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import axios from 'axios';
import DashboardLayout from '../../components/DashboardLayout';
import AddMemberForm from '../../components/AddMemberForm';
import {
    Users,
    TrendingUp,
    DollarSign,
    BarChart2,
    UserPlus,
    Eye,
    EyeOff,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LivePricesComponent from './LivePricesComponent.jsx';
import { encryptMessage, decryptMessage, parseApiResponse } from '../../utils/crypto';
import { getAuthToken } from '../../utils/auth';
import { ThemeContext } from '../../context/ThemeContext';
import { useNavigate } from 'react-router-dom'; // Add this import

const ManagerDashboard = () => {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0);
    const [users, setUsers] = useState([]);
    const [tradeBook, setTradeBook] = useState([]);
    const [stocks, setStocks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [stockSearchQuery, setStockSearchQuery] = useState('');
    const [stockSearchResults, setStockSearchResults] = useState([]);
    const [selectedStock, setSelectedStock] = useState(null);
    const [exchange, setExchange] = useState('NSE');
    const [newUser, setNewUser] = useState({
        name: '',
        email: '',
        mobile: '',
        password: '',
    });
    const [symbols, setSymbols] = useState([]);
    const [activePLView, setActivePLView] = useState('combined');
    const [liveStockData, setLiveStockData] = useState({});
    const [isSearchLoading, setIsSearchLoading] = useState(false);
    const portfolioRef = useRef({ holdings: [], totalholding: {} });
    const rmsRef = useRef({});
    const tradeBookRef = useRef([]);
    const [error, setError] = useState(null);
    const [portfolioData, setPortfolioData] = useState({
        holdings: [],
        totalholding: {
            totalholdingvalue: 0,
            totalinvvalue: 0,
            totalprofitandloss: 0,
            totalpnlpercentage: 0,
            today_profit_and_loss: 0,
        },
    });
    const [rmsData, setRmsData] = useState({
        net: "0",
        availablecash: "0",
        collateral: "0",
        m2munrealized: "0",
        m2mrealized: "0",
    });
    const [portfolioLoading, setPortfolioLoading] = useState(true);
    const [portfolioError, setPortfolioError] = useState(null);
    const holdingsRef = useRef(new Map());
    const totalHoldingRef = useRef({});
    const updateCounter = useRef(0);
    const [rmsLoading, setRmsLoading] = useState(true);
    const [rmsError, setRmsError] = useState(null);
    const { theme } = useContext(ThemeContext);
    const navigate = useNavigate()
    const hasInitialData = useRef(false);



    // Visibility states with localStorage initialization
    const [showInvestedAmount, setShowInvestedAmount] = useState(() =>
        localStorage.getItem('showInvestedAmount') === 'false' ? false : true
    );
    const [showCurrentValue, setShowCurrentValue] = useState(() =>
        localStorage.getItem('showCurrentValue') === 'false' ? false : true
    );
    const [showAvailableCash, setShowAvailableCash] = useState(() =>
        localStorage.getItem('showAvailableCash') === 'false' ? false : true
    );
    const [showNetCapital, setShowNetCapital] = useState(() =>
        localStorage.getItem('showNetCapital') === 'false' ? false : true
    );

    // Sync visibility states to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem('showInvestedAmount', showInvestedAmount);
    }, [showInvestedAmount]);

    useEffect(() => {
        localStorage.setItem('showCurrentValue', showCurrentValue);
    }, [showCurrentValue]);

    useEffect(() => {
        localStorage.setItem('showAvailableCash', showAvailableCash);
    }, [showAvailableCash]);

    useEffect(() => {
        localStorage.setItem('showNetCapital', showNetCapital);
    }, [showNetCapital]);



    // const [dashboardStats, setDashboardStats] = useState({ total_connected_users: 0, active_stock_data: [] });
    const [baseCapitalOptions, setBaseCapitalOptions] = useState([]);
    const [showConfigModal, setShowConfigModal] = useState(false);
    const [selectedSymbol, setSelectedSymbol] = useState(null);
    const [selectedCapital, setSelectedCapital] = useState('');
    const [selectedPhase, setSelectedPhase] = useState(1);
    const [selectedDownIncrement, setSelectedDownIncrement] = useState(0.25);
    const [dashboardStats, setDashboardStats] = useState({ total_connected_users: 0, active_stock_data: [], status: '', message: '' });
    const [hasData, setHasData] = useState(false); // New state to track if there is data
    const intervalRef = useRef(null)

    const [isAngelCheckDone, setIsAngelCheckDone] = useState(false);

    const filteredUsers = users.filter((user) =>
        [user.name, user.email].some((field) =>
            field.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );


    // Function to check Angel One credentials
    const checkAngelOneCredentials = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                toast.error('No authentication token found. Please log in.');
                navigate('/login');
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/check-angle-status`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const decryptedData = parseApiResponse(response.data.data);
            if (response.status === 200 && decryptedData.status === "200") {
                // Credentials are linked, stay on the dashboard
                setIsAngelCheckDone(true);
            } else if (response.status === 400 && decryptedData.status === "400") {
                // Credentials not linked, redirect to profile page
                toast.warn('Angel One credentials are not linked. Redirecting to profile...');
                navigate('/profile#angleone');
            } else if (response.status === 403 && decryptedData.status === "403") {
                toast.error('Unauthorized access. Please log in again.');
                navigate('/login');
            } else {
                throw new Error(decryptedData.message || 'Failed to check Angel One status');
            }
        } catch (err) {
            // console.error('Error checking Angel One status:', err);
            toast.error('Failed to check Angel One status: ' + err.message);
            // In case of an error, redirect to profile as a fallback
            navigate('/profile#angleone');
        }
    };

    // Run the Angel One credentials check on component mount
    useEffect(() => {
        checkAngelOneCredentials();
    }, []); //



    useEffect(() => {
        if (!isAngelCheckDone) return;
        if (activeTab === 'dashboard') {
            fetchPortfolioData();
            fetchStocksData();
            fetchRmsLimit();
            fetchDashboardStats();
            fetchBaseCapitalOptions();
        } else if (activeTab === 'users') {
            fetchUserData();
        } else if (activeTab === 'tradeBook') {
            fetchTradeBookData();
        } else if (activeTab === 'stocks') {
            fetchStocksData();
        }
    }, [activeTab, refreshTrigger,isAngelCheckDone]);

    useEffect(() => {
        const updatedSymbols = stocks.map((stock) => ({
            symbol: stock.tradingsymbol,
            quantity: stock.quantity || 10,
            symboltoken: stock.symboltoken,
            ltp: liveStockData[stock.symboltoken]?.ltp || stock.ltp || 0,
        }));
        setSymbols(updatedSymbols);
    }, [stocks, liveStockData]);

    const fetchUserData = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData?.status === '200') {
                const usersData = decryptedData.users || [];
                const uniqueUsers = usersData.filter(
                    (user, index, self) => index === self.findIndex((u) => u.email === user.email)
                );
                setUsers(uniqueUsers);
            } else {
                throw new Error(decryptedData?.message || 'Failed to fetch users');
            }
        } catch (err) {
            console.error('Error fetching users:', err);
            toast.error('Failed to load users');
            setUsers([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchTradeBookData = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/trade-book`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData?.status === '200') {
                tradeBookRef.current = decryptedData.trade_book?.data || [];
                setError(null);
                updateTradeBookDOM();
            } else {
                setTimeout(fetchTradeBookData, 2000);
            }
        } catch (err) {
            setTimeout(fetchTradeBookData, 2000);
        }
        finally {
            setLoading(false);
        }
    };

    const updateTradeBookDOM = () => {
        const tbody = document.querySelector('.trade-book-table tbody');
        if (!tbody) return;

        tbody.innerHTML = '';
        const trades = tradeBookRef.current;

        if (trades.length > 0) {
            trades.forEach((trade) => {
                const row = document.createElement('tr');
                row.className = `${theme === 'dark' ? 'hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`;
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
                        ${trade.filltime || 'N/A'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
                        ${trade.tradingsymbol || 'N/A'}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    trade.transactiontype === 'BUY' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }">
                            ${trade.transactiontype || 'N/A'}
                        </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
                        ${trade.fillsize || 0}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
                        ₹${(Number(trade.fillprice) || 0).toFixed(2)}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
                        ₹${((Number(trade.fillprice) || 0) * (Number(trade.fillsize) || 0)).toLocaleString()}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}">
                        ${trade.orderid || 'N/A'}
                    </td>
                `;
                tbody.appendChild(row);
            });
        } else {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" class="px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}">
                        No trades available.
                    </td>
                </tr>
            `;
        }
    };

    useEffect(() => {
        fetchTradeBookData();
    }, []);

    const fetchStocksData = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/stocks`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            // console.log("User Stock",decryptedData);
            if (decryptedData?.status === '200') {
                setStocks(decryptedData.stocks || []);
            } else {
                throw new Error(decryptedData?.message || 'Failed to fetch stocks');
            }
        } catch (err) {
            console.error('Error fetching stocks:', err);
            toast.error('Failed to load stocks: ' + err.message);
            setStocks([]);
        } finally {
            setLoading(false);
        }
    };

    const removeStock = async (symboltoken) => {
        try {
            const token = localStorage.getItem('token');
            const payload = { symboltoken };
            const encryptedPayload = encryptMessage(JSON.stringify(payload));
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/user/stocks/remove`,
                { data: encryptedPayload },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData?.status === '200') {
                toast.success(decryptedData.message || 'Stock removed successfully');
                await fetchStocksData();
            } else {
                throw new Error(decryptedData?.message || 'Failed to remove stock');
            }
        } catch (err) {
            console.error('Error removing stock:', err);
            toast.error('Failed to remove stock: ' + err.message);
        }
    };

    const fetchDashboardStats = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/dashboard_stats`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            // console.log("Dashboarrdstatststtstst",decryptedData);
            if (decryptedData?.status === '200') {
                setDashboardStats({
                    total_connected_users: decryptedData.total_connected_users || 0,
                    active_stock_data: decryptedData.active_stock_data || [],
                });
            } else {
                throw new Error(decryptedData?.message || 'Failed to fetch dashboard stats');
            }
        } catch (err) {
            console.error('Error fetching dashboard stats:', err);
            toast.error('Failed to load dashboard stats');
            setDashboardStats({ total_connected_users: 0, active_stock_data: [] });
        }
    };

    const fetchBaseCapitalOptions = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/base_capital_options`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200) {
                setBaseCapitalOptions(response.data.base_capital_options || []);
            } else {
                throw new Error(response.data?.error || 'Failed to fetch base capital options');
            }
        } catch (err) {
            // console.error('Error fetching base capital options:', err);
            // toast.error('Failed to load base capital options');
            setBaseCapitalOptions([]);
        }
    };

    const toggleTradingStatus = async (tradingsymbol, tradingStatus) => {
        if (tradingStatus) {
            // When enabling trading, open the popup
            setSelectedSymbol({ tradingsymbol });
            setShowConfigModal(true);
        } else {
            // When disabling trading, send the request immediately
            try {
                const token = getAuthToken();
                const payload = {
                    tradingsymbol,
                    trading_status: tradingStatus,
                    wallet_value: null,
                    phase: null,
                    down_increment: null,
                };
                const encryptedPayload = encryptMessage(JSON.stringify(payload));
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/api/toggle-trading-status`,
                    { data: encryptedPayload },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const decryptedData = parseApiResponse(response.data.data);
                if (decryptedData?.status === 'success') {
                    toast.success(decryptedData.message);
                    fetchDashboardStats(); // Refetch dashboard stats to update frontend state
                } else if (decryptedData?.status === 'error') {
                    toast.error(decryptedData.message);
                } else {
                    throw new Error(decryptedData?.message || 'Failed to toggle trading status');
                }
            } catch (err) {
                console.error('Error toggling trading status:', err);
                toast.error('Failed to toggle trading status: ' + err.message);
            }
        }
    };

    const startStrategy = async () => {
        if (!selectedCapital || !selectedPhase || selectedDownIncrement === null) {
            toast.error('Please select capital, phase, and down increment to start the strategy.');
            return;
        }

        try {
            const token = getAuthToken();
            const payload = {
                tradingsymbol: selectedSymbol.tradingsymbol,
                trading_status: true,
                wallet_value: parseFloat(selectedCapital),
                phase: parseInt(selectedPhase),
                down_increment: parseFloat(selectedDownIncrement),
            };
            const encryptedPayload = encryptMessage(JSON.stringify(payload));
            const response = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/toggle-trading-status`,
                { data: encryptedPayload },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );
            const decryptedData = parseApiResponse(response.data.data);
            // console.log("Succeess",decryptedData?.status === 'success');
            // console.log("Message",decryptedData?.message);
            // console.log("DATATATAT",decryptedData);
            if (decryptedData?.status === 'success') {
                toast.success(decryptedData.message);
                fetchDashboardStats(); // Refetch dashboard stats to update frontend state
                fetchBaseCapitalOptions();
                setShowConfigModal(false); // Close the popup
                setSelectedCapital('');
                setSelectedPhase(1);
                setSelectedDownIncrement(0.25);
            } else if (decryptedData?.status === 'error') {
                toast.error(decryptedData.message);
            } else {
                throw new Error(decryptedData?.message || 'Failed to start strategy');
            }
        } catch (err) {
            // console.error('Error starting strategy:', err);
            toast.error('Failed to start strategy: ' + err.message);
        }
    };

    const API_URL = import.meta.env.VITE_API_URL;
    const api = axios.create({
        baseURL: API_URL,
        headers: {
            'Content-Type': 'application/json',
        },
    });

    const handleActivateUser = async (email) => {
        try {
            const token = getAuthToken();
            const encryptedData = encryptMessage(JSON.stringify({ email }));
            const response = await api.post('/user/activate', { data: encryptedData }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData?.status === '200') {
                toast.success(decryptedData.message || 'User activated successfully');
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.email === email ? { ...user, is_active: 'True' } : user
                    )
                );
            } else {
                throw new Error(decryptedData?.message || 'User activation failed');
            }
        } catch (error) {
            // console.error('Error activating user:', error);
            toast.error('Failed to activate user: ' + error.message);
        }
    };

    const handleDeactivateUser = async (email) => {
        try {
            const token = getAuthToken();
            const encryptedData = encryptMessage(JSON.stringify({ email }));
            const response = await api.post('/user/deactivate', { data: encryptedData }, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData?.status === '200') {
                toast.success(decryptedData.message || 'User deactivated successfully');
                setUsers((prevUsers) =>
                    prevUsers.map((user) =>
                        user.email === email ? { ...user, is_active: 'False' } : user
                    )
                );
            } else {
                throw new Error(decryptedData?.message || 'User deactivation failed');
            }
        } catch (error) {
            // console.error('Error deactivating user:', error);
            toast.error('Failed to deactivate user: ' + error.message);
        }
    };


    const fetchPortfolioData = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/all-holding`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.status === 200 && response.data.data?.status === "200") {
                const allHoldingData = response.data.data.all_holding.data;
                const holdings = allHoldingData.holdings || [];
                const totalholding = allHoldingData.totalholding || {
                    totalholdingvalue: 0,
                    totalinvvalue: 0,
                    totalprofitandloss: 0,
                    totalpnlpercentage: 0,
                    today_profit_and_loss: allHoldingData.today_profit_and_loss || 0,
                };

                const updatedHoldings = holdings.map(holding => ({
                    ...holding,
                    marketValue: holding.ltp * holding.quantity,
                    profitandloss: (holding.ltp - holding.averageprice) * holding.quantity,
                    pnlpercentage: holding.averageprice !== 0
                        ? ((holding.ltp - holding.averageprice) / holding.averageprice) * 100
                        : 0,
                    today_pnl: (holding.ltp - (holding.close || holding.ltp)) * holding.quantity,
                }));

                const updatedTotalHolding = {
                    totalholdingvalue: updatedHoldings.reduce((sum, h) => sum + h.marketValue, 0),
                    totalinvvalue: totalholding.totalinvvalue || 0,
                    totalprofitandloss: updatedHoldings.reduce((sum, h) => sum + h.profitandloss, 0),
                    totalpnlpercentage: totalholding.totalinvvalue !== 0
                        ? (updatedHoldings.reduce((sum, h) => sum + h.profitandloss, 0) / totalholding.totalinvvalue) * 100
                        : 0,
                    today_profit_and_loss: updatedHoldings.reduce((sum, h) => sum + h.today_pnl, 0),
                };

                setPortfolioData({ holdings: updatedHoldings, totalholding: updatedTotalHolding });
                setLoading(false); // Only needed for initial load, could be removed if initial load is handled elsewhere
            }
        } catch (err) {
            console.error('Portfolio fetch error:', err);
            if (loading) toast.error('Failed to load initial portfolio data');
        }
    };

    const fetchRmsLimit = async () => {
        try {
            const token = getAuthToken();
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/rms-limit`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData.status === "200") {
                setRmsData(decryptedData.rms.data || {});
                setLoading(false);
            }
        } catch (err) {
            console.error('RMS fetch error:', err);
            if (loading) toast.error('Failed to load initial RMS data');
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            await Promise.all([fetchPortfolioData(), fetchRmsLimit()]);
        };
        fetchData();

        const interval = setInterval(() => {
            fetchPortfolioData();
            fetchRmsLimit();
        }, 3000);

        return () => clearInterval(interval);
    }, []);




    // const fetchRmsLimit = async () => {
    //     setRmsLoading(true);
    //     try {
    //         const token = getAuthToken();
    //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/rms-limit`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         const decryptedData = parseApiResponse(response.data.data);
    //         if (decryptedData.status === "200") {
    //             rmsRef.current = decryptedData.rms.data || {};
    //             setRmsError(null);
    //             updateRmsDOM();
    //         } else {
    //             throw new Error(decryptedData.message || 'Failed to fetch RMS limit');
    //         }
    //     } catch (err) {
    //         // console.error('RMS Limit Error:', err);
    //     }
    // };

    // const fetchPortfolioData = async () => {
    //     try {
    //         const token = getAuthToken();
    //         const response = await axios.get(`${import.meta.env.VITE_API_URL}/user/angel/all-holding`, {
    //             headers: { Authorization: `Bearer ${token}` },
    //         });
    //         if (response.status === 200 && response.data.data?.status === "200") {
    //             const allHoldingData = response.data.data.all_holding.data;
    //             const holdings = allHoldingData.holdings || [];
    //             const totalholding = allHoldingData.totalholding || {
    //                 totalholdingvalue: 0,
    //                 totalinvvalue: 0,
    //                 totalprofitandloss: 0,
    //                 totalpnlpercentage: 0,
    //                 today_profit_and_loss: allHoldingData.today_profit_and_loss || 0,
    //             };
    //
    //             const updatedHoldings = holdings.map(holding => ({
    //                 ...holding,
    //                 marketValue: holding.ltp * holding.quantity,
    //                 profitandloss: (holding.ltp - holding.averageprice) * holding.quantity,
    //                 pnlpercentage: holding.averageprice !== 0
    //                     ? ((holding.ltp - holding.averageprice) / holding.averageprice) * 100
    //                     : 0,
    //                 today_pnl: (holding.ltp - (holding.close || holding.ltp)) * holding.quantity,
    //             }));
    //
    //             const updatedTotalHolding = {
    //                 totalholdingvalue: updatedHoldings.reduce((sum, h) => sum + h.marketValue, 0),
    //                 totalinvvalue: totalholding.totalinvvalue || 0,
    //                 totalprofitandloss: updatedHoldings.reduce((sum, h) => sum + h.profitandloss, 0),
    //                 totalpnlpercentage: totalholding.totalinvvalue !== 0
    //                     ? (updatedHoldings.reduce((sum, h) => sum + h.profitandloss, 0) / totalholding.totalinvvalue) * 100
    //                     : 0,
    //                 today_profit_and_loss: updatedHoldings.reduce((sum, h) => sum + h.today_pnl, 0),
    //             };
    //
    //             portfolioRef.current = { holdings: updatedHoldings, totalholding: updatedTotalHolding };
    //             setPortfolioError(null);
    //             updatePortfolioDOM();
    //         } else {
    //             throw new Error(response.data?.message || 'Failed to fetch portfolio data');
    //         }
    //     } catch (err) {
    //         setPortfolioError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
    //         // console.error('Fetch Error:', err);
    //     }
    // };

    // const updatePortfolioDOM = () => {
    //     const { holdings, totalholding } = portfolioRef.current;
    //
    //     if (activePLView === 'combined') {
    //         const summary = document.querySelector('.portfolio-summary');
    //         if (summary) {
    //             summary.querySelector('.invested-amount').textContent =
    //                 `₹${Number(totalholding.totalinvvalue).toLocaleString()}`;
    //             summary.querySelector('.current-value').textContent =
    //                 `₹${Number(totalholding.totalholdingvalue).toLocaleString()}`;
    //             summary.querySelector('.overall-gain-loss').textContent =
    //                 `${totalholding.totalprofitandloss >= 0 ? '+' : '-'}₹${Math.abs(totalholding.totalprofitandloss).toLocaleString()} (${Number(totalholding.totalpnlpercentage).toFixed(2)}%)`;
    //             summary.querySelector('.overall-gain-loss').className =
    //                 `text-lg font-bold ${totalholding.totalprofitandloss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} overall-gain-loss`;
    //             summary.querySelector('.today-gain-loss').textContent =
    //                 totalholding.today_profit_and_loss === 0
    //                     ? '₹0 (0%)'
    //                     : `${totalholding.today_profit_and_loss >= 0 ? '+' : '-'}₹${Math.abs(totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(totalholding.today_profit_and_loss) / (totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`;
    //             summary.querySelector('.today-gain-loss').className =
    //                 `text-lg font-bold ${totalholding.today_profit_and_loss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} today-gain-loss`;
    //         }
    //     }
    //
    //     if (activePLView === 'individual') {
    //         holdings.forEach(holding => {
    //             const row = document.querySelector(`div[data-symbol="${holding.tradingsymbol}"]`);
    //             if (row) {
    //                 row.querySelector('.quantity').textContent = holding.quantity;
    //                 row.querySelector('.avg-price').textContent = `₹${Number(holding.averageprice).toFixed(2)}`;
    //                 row.querySelector('.ltp').textContent = `₹${Number(holding.ltp).toFixed(2)}`;
    //                 row.querySelector('.market-value').textContent = `₹${holding.marketValue.toLocaleString()}`;
    //                 row.querySelector('.gain-loss').textContent =
    //                     `${holding.profitandloss >= 0 ? '+' : '-'}₹${Math.abs(holding.profitandloss).toLocaleString()} (${Number(holding.pnlpercentage).toFixed(2)}%)`;
    //                 row.querySelector('.gain-loss').className =
    //                     `text-sm ${holding.profitandloss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} gain-loss`;
    //                 row.querySelector('.today-pnl').textContent =
    //                     `${holding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(holding.today_pnl).toLocaleString()}`;
    //                 row.querySelector('.today-pnl').className =
    //                     `text-sm ${holding.today_pnl >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} today-pnl`;
    //             }
    //         });
    //     }
    // };
    //
    // const updateRmsDOM = () => {
    //     const summary = document.querySelector('.portfolio-summary');
    //     if (summary) {
    //         summary.querySelector('.available-cash').textContent =
    //             `₹${Number(rmsRef.current.availablecash || 0).toLocaleString()}`;
    //         summary.querySelector('.net-capital').textContent =
    //             `₹${Number(rmsRef.current.net || 0).toLocaleString()}`;
    //         summary.querySelector('.collateral').textContent =
    //             `₹${Number(rmsRef.current.collateral || 0).toLocaleString()}`;
    //         summary.querySelector('.m2m-total').textContent =
    //             `₹${(Number(rmsRef.current.m2munrealized || 0) + Number(rmsRef.current.m2mrealized || 0)).toLocaleString()}`;
    //     }
    // };

    // const memoizedHoldings = useMemo(() => portfolioData.holdings, [portfolioData.holdings]);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         await Promise.all([
    //             fetchPortfolioData(),
    //             fetchRmsLimit(),
    //         ]);
    //     };
    //     fetchData();
    //
    //     const interval = setInterval(() => {
    //         fetchPortfolioData();
    //         fetchRmsLimit();
    //     }, 1000);
    //
    //     return () => clearInterval(interval);
    // }, []);

    // const renderDashboard = () => {
    //     return (
    //         <div className="space-y-6">
    //             <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
    //                 <div className="flex items-center justify-between mb-6">
    //                     <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
    //                         Live P&L and Capital
    //                     </h3>
    //                     <div className="flex gap-2">
    //                         <button
    //                             onClick={() => { setActivePLView('combined'); updatePortfolioDOM(); }}
    //                             className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
    //                                 activePLView === 'combined'
    //                                     ? 'bg-blue-600 text-white shadow-lg'
    //                                     : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
    //                             }`}
    //                         >
    //                             Combined
    //                         </button>
    //                         <button
    //                             onClick={() => { setActivePLView('individual'); updatePortfolioDOM(); }}
    //                             className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
    //                                 activePLView === 'individual'
    //                                     ? 'bg-blue-600 text-white shadow-lg'
    //                                     : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
    //                             }`}
    //                         >
    //                             Individual
    //                         </button>
    //                     </div>
    //                 </div>
    //
    //                 {(portfolioError || rmsError) ? (
    //                     <div className={`p-4 rounded mb-4 ${theme === 'dark' ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-700'}`}>
    //                         {portfolioError || rmsError}
    //                     </div>
    //                 ) : (
    //                     <>
    //                         {activePLView === 'combined' && (
    //                             <div className="portfolio-summary mb-6">
    //                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Invested Amount
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} invested-amount`}>
    //                                             ₹0
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Current Value
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} current-value`}>
    //                                             ₹0
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Overall G/L
    //                                         </p>
    //                                         <p className="text-lg font-bold overall-gain-loss">
    //                                             ₹0 (0%)
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Today’s G/L
    //                                         </p>
    //                                         <p className="text-lg font-bold today-gain-loss">
    //                                             ₹0 (0%)
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Available Cash
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} available-cash`}>
    //                                             ₹0
    //                                         </p>
    //                                     </div>
    //                                 </div>
    //                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Net Capital
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} net-capital`}>
    //                                             ₹0
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Collateral
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} collateral`}>
    //                                             ₹0
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             M2M Total
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} m2m-total`}>
    //                                             ₹0
    //                                         </p>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         )}
    //
    //                         {activePLView === 'individual' && (
    //                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //                                 {portfolioRef.current.holdings.map((holding, index) => (
    //                                     <div
    //                                         key={index}
    //                                         data-symbol={holding.tradingsymbol}
    //                                         className={`p-6 rounded-lg shadow-md border ${theme === 'dark' ? 'bg-gray-900 border-gray-800 hover:shadow-xl' : 'bg-white border-gray-200 hover:shadow-lg'} transition-all duration-300`}
    //                                     >
    //                                         <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-4`}>
    //                                             {holding.tradingsymbol}
    //                                         </h4>
    //                                         <div className="space-y-2">
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Quantity:
    //                                                 </span>
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} quantity`}>
    //                                                     0
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Avg. Price:
    //                                                 </span>
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} avg-price`}>
    //                                                     ₹0
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     LTP:
    //                                                 </span>
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} ltp`}>
    //                                                     ₹0
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Market Value:
    //                                                 </span>
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} market-value`}>
    //                                                     ₹0
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Overall G/L:
    //                                                 </span>
    //                                                 <span className="text-sm gain-loss">
    //                                                     ₹0 (0%)
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Today’s P&L:
    //                                                 </span>
    //                                                 <span className="text-sm today-pnl">
    //                                                     ₹0
    //                                                 </span>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         )}
    //                     </>
    //                 )}
    //             </div>



    // const renderDashboard = () => {
    //     return (
    //         <div className="space-y-6">
    //             <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
    //                 <div className="flex items-center justify-between mb-6">
    //                     <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
    //                         Live P&L and Capital
    //                     </h3>
    //                     <div className="flex gap-2">
    //                         <button
    //                             onClick={() => setActivePLView('combined')}
    //                             className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
    //                                 activePLView === 'combined'
    //                                     ? 'bg-blue-600 text-white shadow-lg'
    //                                     : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
    //                             }`}
    //                         >
    //                             Combined
    //                         </button>
    //                         <button
    //                             onClick={() => setActivePLView('individual')}
    //                             className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
    //                                 activePLView === 'individual'
    //                                     ? 'bg-blue-600 text-white shadow-lg'
    //                                     : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
    //                             }`}
    //                         >
    //                             Individual
    //                         </button>
    //                     </div>
    //                 </div>
    //
    //                 {loading ? (
    //                     <div className="flex justify-center items-center py-8">
    //                         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    //                     </div>
    //                 ) : (
    //                     <>
    //                         {activePLView === 'combined' && (
    //                             <div className="portfolio-summary mb-6">
    //                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Invested Amount
    //                                         </p>
    //                                         <div className="flex items-center justify-between">
    //                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
    //                                                 {showInvestedAmount
    //                                                     ? `₹${Number(portfolioRef.current.totalholding.totalinvvalue || 0).toLocaleString()}`
    //                                                     : '••••'}
    //                                             </p>
    //                                             <button
    //                                                 onClick={() => setShowInvestedAmount(!showInvestedAmount)}
    //                                                 className="ml-2 text-gray-500"
    //                                             >
    //                                                 {showInvestedAmount ? <EyeOff size={20} /> : <Eye size={20} />}
    //                                             </button>
    //                                         </div>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Current Value
    //                                         </p>
    //                                         <div className="flex items-center justify-between">
    //                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
    //                                                 {showCurrentValue
    //                                                     ? `₹${Number(portfolioRef.current.totalholding.totalholdingvalue || 0).toLocaleString()}`
    //                                                     : '••••'}
    //                                             </p>
    //                                             <button
    //                                                 onClick={() => setShowCurrentValue(!showCurrentValue)}
    //                                                 className="ml-2 text-gray-500"
    //                                             >
    //                                                 {showCurrentValue ? <EyeOff size={20} /> : <Eye size={20} />}
    //                                             </button>
    //                                         </div>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Overall G/L
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${portfolioRef.current.totalholding.totalprofitandloss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
    //                                             {portfolioRef.current.totalholding.totalprofitandloss >= 0 ? '+' : '-'}
    //                                             ₹{Math.abs(portfolioRef.current.totalholding.totalprofitandloss || 0).toLocaleString()}
    //                                             ({Number(portfolioRef.current.totalholding.totalpnlpercentage || 0).toFixed(2)}%)
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Today’s G/L
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${portfolioRef.current.totalholding.today_profit_and_loss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
    //                                             {portfolioRef.current.totalholding.today_profit_and_loss === 0
    //                                                 ? '₹0 (0%)'
    //                                                 : `${portfolioRef.current.totalholding.today_profit_and_loss >= 0 ? '+' : '-'}₹${Math.abs(portfolioRef.current.totalholding.today_profit_and_loss || 0).toLocaleString()} (${((Math.abs(portfolioRef.current.totalholding.today_profit_and_loss || 0) / (portfolioRef.current.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Available Cash
    //                                         </p>
    //                                         <div className="flex items-center justify-between">
    //                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
    //                                                 {showAvailableCash
    //                                                     ? `₹${Number(rmsRef.current.availablecash || 0).toLocaleString()}`
    //                                                     : '••••'}
    //                                             </p>
    //                                             <button
    //                                                 onClick={() => setShowAvailableCash(!showAvailableCash)}
    //                                                 className="ml-2 text-gray-500"
    //                                             >
    //                                                 {showAvailableCash ? <EyeOff size={20} /> : <Eye size={20} />}
    //                                             </button>
    //                                         </div>
    //                                     </div>
    //                                 </div>
    //                                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Net Capital
    //                                         </p>
    //                                         <div className="flex items-center justify-between">
    //                                             <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
    //                                                 {showNetCapital
    //                                                     ? `₹${Number(rmsRef.current.net || 0).toLocaleString()}`
    //                                                     : '••••'}
    //                                             </p>
    //                                             <button
    //                                                 onClick={() => setShowNetCapital(!showNetCapital)}
    //                                                 className="ml-2 text-gray-500"
    //                                             >
    //                                                 {showNetCapital ? <EyeOff size={20} /> : <Eye size={20} />}
    //                                             </button>
    //                                         </div>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             Collateral
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
    //                                             ₹{Number(rmsRef.current.collateral || 0).toLocaleString()}
    //                                         </p>
    //                                     </div>
    //                                     <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
    //                                         <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                             M2M Total
    //                                         </p>
    //                                         <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
    //                                             ₹{(Number(rmsRef.current.m2munrealized || 0) + Number(rmsRef.current.m2mrealized || 0)).toLocaleString()}
    //                                         </p>
    //                                     </div>
    //                                 </div>
    //                             </div>
    //                         )}
    //
    //
    //                         {activePLView === 'individual' && (
    //                             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    //                                 {portfolioRef.current.holdings.map((holding, index) => (
    //                                     <div
    //                                         key={index}
    //                                         data-symbol={holding.tradingsymbol}
    //                                         className={`p-6 rounded-lg shadow-md border ${theme === 'dark' ? 'bg-gray-900 border-gray-800 hover:shadow-xl' : 'bg-white border-gray-200 hover:shadow-lg'} transition-all duration-300`}
    //                                     >
    //                                         <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-4`}>
    //                                             {holding.tradingsymbol}
    //                                         </h4>
    //                                         <div className="space-y-2">
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Quantity:
    //                                                 </span>
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} quantity`}>
    //                                                     {holding.quantity}
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Avg. Price:
    //                                                 </span>
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} avg-price`}>
    //                                                     ₹{Number(holding.averageprice).toFixed(2)}
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     LTP:
    //                                                 </span>
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} ltp`}>
    //                                                     ₹{Number(holding.ltp).toFixed(2)}
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Market Value:
    //                                                 </span>
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'} market-value`}>
    //                                                     ₹{holding.marketValue.toLocaleString()}
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Overall G/L:
    //                                                 </span>
    //                                                 <span className={`text-sm ${holding.profitandloss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} gain-loss`}>
    //                                                     {holding.profitandloss >= 0 ? '+' : '-'}₹{Math.abs(holding.profitandloss).toLocaleString()} ({Number(holding.pnlpercentage).toFixed(2)}%)
    //                                                 </span>
    //                                             </div>
    //                                             <div className="flex justify-between">
    //                                                 <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
    //                                                     Today’s P&L:
    //                                                 </span>
    //                                                 <span className={`text-sm ${holding.today_pnl >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')} today-pnl`}>
    //                                                     {holding.today_pnl >= 0 ? '+' : '-'}₹{Math.abs(holding.today_pnl).toLocaleString()}
    //                                                 </span>
    //                                             </div>
    //                                         </div>
    //                                     </div>
    //                                 ))}
    //                             </div>
    //                         )}
    //                     </>
    //                 )}
    //             </div>




    const renderDashboard = () => {
        return (
            <div className="space-y-6">
                <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Live P&L and Capital
                        </h3>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActivePLView('combined')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activePLView === 'combined'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                }`}
                            >
                                Combined
                            </button>
                            <button
                                onClick={() => setActivePLView('individual')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                                    activePLView === 'individual'
                                        ? 'bg-blue-600 text-white shadow-lg'
                                        : (theme === 'dark' ? 'bg-gray-700 text-gray-200 hover:bg-gray-600' : 'bg-gray-200 text-gray-700 hover:bg-gray-300')
                                }`}
                            >
                                Individual
                            </button>
                        </div>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : (
                        <>
                            {activePLView === 'combined' && (
                                <div className="portfolio-summary mb-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                                        <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Invested Amount
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {showInvestedAmount
                                                        ? `₹${Number(portfolioData.totalholding.totalinvvalue || 0).toLocaleString()}`
                                                        : '••••'}
                                                </p>
                                                <button
                                                    onClick={() => setShowInvestedAmount(!showInvestedAmount)}
                                                    className="ml-2 text-gray-500"
                                                >
                                                    {showInvestedAmount ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Current Value
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {showCurrentValue
                                                        ? `₹${Number(portfolioData.totalholding.totalholdingvalue || 0).toLocaleString()}`
                                                        : '••••'}
                                                </p>
                                                <button
                                                    onClick={() => setShowCurrentValue(!showCurrentValue)}
                                                    className="ml-2 text-gray-500"
                                                >
                                                    {showCurrentValue ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Overall G/L
                                            </p>
                                            <p className={`text-lg font-bold ${portfolioData.totalholding.totalprofitandloss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                                                {portfolioData.totalholding.totalprofitandloss >= 0 ? '+' : '-'}
                                                ₹{Math.abs(portfolioData.totalholding.totalprofitandloss || 0).toLocaleString()}
                                                ({Number(portfolioData.totalholding.totalpnlpercentage || 0).toFixed(2)}%)
                                            </p>
                                        </div>
                                        <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Today’s G/L
                                            </p>
                                            <p className={`text-lg font-bold ${portfolioData.totalholding.today_profit_and_loss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                                                {portfolioData.totalholding.today_profit_and_loss === 0
                                                    ? '₹0 (0%)'
                                                    : `${portfolioData.totalholding.today_profit_and_loss >= 0 ? '+' : '-'}₹${Math.abs(portfolioData.totalholding.today_profit_and_loss || 0).toLocaleString()} (${((Math.abs(portfolioData.totalholding.today_profit_and_loss || 0) / (portfolioData.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
                                            </p>
                                        </div>
                                        <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Available Cash
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {showAvailableCash
                                                        ? `₹${Number(rmsData.availablecash || 0).toLocaleString()}`
                                                        : '••••'}
                                                </p>
                                                <button
                                                    onClick={() => setShowAvailableCash(!showAvailableCash)}
                                                    className="ml-2 text-gray-500"
                                                >
                                                    {showAvailableCash ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
                                        <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Net Capital
                                            </p>
                                            <div className="flex items-center justify-between">
                                                <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {showNetCapital
                                                        ? `₹${Number(rmsData.net || 0).toLocaleString()}`
                                                        : '••••'}
                                                </p>
                                                <button
                                                    onClick={() => setShowNetCapital(!showNetCapital)}
                                                    className="ml-2 text-gray-500"
                                                >
                                                    {showNetCapital ? <EyeOff size={20} /> : <Eye size={20} />}
                                                </button>
                                            </div>
                                        </div>
                                        <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                Collateral
                                            </p>
                                            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                ₹{Number(rmsData.collateral || 0).toLocaleString()}
                                            </p>
                                        </div>
                                        <div className={`p-4 rounded-lg shadow-inner ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                M2M Total
                                            </p>
                                            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                ₹{(Number(rmsData.m2munrealized || 0) + Number(rmsData.m2mrealized || 0)).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                            {activePLView === 'individual' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {portfolioData.holdings.map((holding, index) => (
                                        <div
                                            key={index}
                                            data-symbol={holding.tradingsymbol}
                                            className={`p-6 rounded-lg shadow-md border ${theme === 'dark' ? 'bg-gray-900 border-gray-800 hover:shadow-xl' : 'bg-white border-gray-200 hover:shadow-lg'} transition-all duration-300`}
                                        >
                                            <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} mb-4`}>
                                                {holding.tradingsymbol}
                                            </h4>
                                            <div className="space-y-2">
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Quantity:
                                                    </span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                                        {holding.quantity}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Avg. Price:
                                                    </span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                                        ₹{Number(holding.averageprice).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        LTP:
                                                    </span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                                        ₹{Number(holding.ltp).toFixed(2)}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Market Value:
                                                    </span>
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                                        ₹{holding.marketValue.toLocaleString()}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Overall G/L:
                                                    </span>
                                                    <span className={`text-sm ${holding.profitandloss >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                                                        {holding.profitandloss >= 0 ? '+' : '-'}₹{Math.abs(holding.profitandloss).toLocaleString()} ({Number(holding.pnlpercentage).toFixed(2)}%)
                                                    </span>
                                                </div>
                                                <div className="flex justify-between">
                                                    <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                        Today’s P&L:
                                                    </span>
                                                    <span className={`text-sm ${holding.today_pnl >= 0 ? (theme === 'dark' ? 'text-green-400' : 'text-green-600') : (theme === 'dark' ? 'text-red-400' : 'text-red-600')}`}>
                                                        {holding.today_pnl >= 0 ? '+' : '-'}₹{Math.abs(holding.today_pnl).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className={`rounded-xl shadow-lg p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Symbol Settings (Strategy)
                        </h3>
                        <p className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
                            Connected Users: <span className="text-blue-600">{dashboardStats.total_connected_users}</span>
                        </p>
                    </div>
                    <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                        <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                            <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <tr>
                                {[
                                    'Sr No',
                                    'Symbol',
                                    'Phase',
                                    'Quantity',
                                    'Down %',
                                    'Strategy Status',
                                    'Toggle',
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
                            {dashboardStats.active_stock_data.length > 0 ? (
                                dashboardStats.active_stock_data.map((stock, index) => {
                                    const isLive = stock.activation_status; // Ensure this uses activation_status
                                    const downIncrement = stock.phase_drop || 0.25;
                                    return (
                                        <tr key={index} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition' : 'hover:bg-gray-50 transition'}`}>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {stock.current_sr_no}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {stock.stock_symbol}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {stock.phase}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {stock.total_open_quantity}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                -{downIncrement}%
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                                    <span
                                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                            isLive
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                        }`}
                                    >
                                        {isLive ? 'Live' : 'Not Live'}
                                    </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        type="checkbox"
                                                        checked={isLive}
                                                        onChange={() => toggleTradingStatus(stock.stock_symbol, !isLive)}
                                                        className="sr-only peer"
                                                    />
                                                    <div className={`w-11 h-6 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 ${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'}`}></div>
                                                </label>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={7} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        No active stocks found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {showConfigModal && (
                    <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50">
                        <div className={`rounded-2xl shadow-xl w-full max-w-md p-6 ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                            <div className="flex justify-between items-center mb-6">
                                <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                    Configure Trading for {selectedSymbol?.tradingsymbol}
                                </h3>
                                <button
                                    onClick={() => setShowConfigModal(false)}
                                    className={`transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12"
                                        />
                                    </svg>
                                </button>
                            </div>
                            <div className="space-y-4">
                                <div>
                                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                                        Select Capital
                                    </label>
                                    <select
                                        value={selectedCapital}
                                        onChange={(e) => setSelectedCapital(e.target.value)}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                                    >
                                        <option value="">Select Capital</option>
                                        {baseCapitalOptions.map((option) => (
                                            <option key={option} value={option}>
                                                ₹{option.toLocaleString()}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                                        Select Phase
                                    </label>
                                    <select
                                        value={selectedPhase}
                                        onChange={(e) => setSelectedPhase(parseInt(e.target.value))}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                                    >
                                        {[1, 2, 3, 4, 5].map((phase) => (
                                            <option key={phase} value={phase}>
                                                Phase {phase}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                                        Down Increment (%)
                                    </label>
                                    <select
                                        value={selectedDownIncrement}
                                        onChange={(e) => setSelectedDownIncrement(parseFloat(e.target.value))}
                                        className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                                    >
                                        <option value="">Select Down Increment</option>
                                        {[0.25, 0.50, 0.75, 1.00, 1.25].map((val) => (
                                            <option key={val} value={val}>
                                                {val}%
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <button
                                    onClick={startStrategy}
                                    className="w-full mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                                    disabled={!selectedCapital || !selectedPhase || selectedDownIncrement === null}
                                >
                                    Start Strategy
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <LivePricesComponent symbols={symbols} liveStockData={liveStockData} />
            </div>
        );
    };

    const renderUsers = () => {
        return (
            <div className={`rounded-2xl shadow-lg border overflow-hidden ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-50'}`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-50'}`}>
                    <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                        User Management
                    </h3>
                    <p className={`text-sm mt-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                        Manage your team: add, activate, or deactivate users
                    </p>
                </div>
                <div className="p-8">
                    <div className="flex justify-between items-center mb-8">
                        {/*<h2 className={`text-2xl font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>*/}
                        {/*    Dashboard Overview*/}
                        {/*</h2>*/}
                        <button
                            onClick={() => setShowAddMemberForm(true)}
                            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-5 py-2.5 rounded-xl transition-colors"
                        >
                            <UserPlus size={18} />
                            <span className="text-sm font-medium">Add New Member</span>
                        </button>
                    </div>
                    {showAddMemberForm && (
                        <div className="fixed inset-0 bg-gray-900/50 bg-opacity-40 flex items-center justify-center z-50">
                            <div className={`rounded-2xl shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto ${theme === 'dark' ? 'bg-gray-900' : 'bg-white'}`}>
                                <div className="p-8">
                                    <div className="flex justify-between items-center mb-6">
                                        <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                            Add New Member
                                        </h3>
                                        <button
                                            onClick={() => setShowAddMemberForm(false)}
                                            className={`transition-colors ${theme === 'dark' ? 'text-gray-400 hover:text-gray-200' : 'text-gray-400 hover:text-gray-600'}`}
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="h-6 w-6"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M6 18L18 6M6 6l12 12"
                                                />
                                            </svg>
                                        </button>
                                    </div>
                                    <AddMemberForm
                                        onClose={() => {
                                            setShowAddMemberForm(false);
                                            setRefreshTrigger((prev) => prev + 1);
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h4 className={`text-lg font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                Users List
                            </h4>
                            <div className="relative w-72">
                                <input
                                    type="text"
                                    placeholder="Search users..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-300 shadow-sm ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-100 text-gray-900'}`}
                                />
                                <Search
                                    size={16}
                                    className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}
                                />
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-100'}`}>
                                <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                                <tr>
                                    {['Name', 'Email', 'Mobile', 'Status', 'Actions'].map((header) => (
                                        <th
                                            key={header}
                                            scope="col"
                                            className={`px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                                </thead>
                                <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-50'}`}>
                                {filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <tr key={user.id} className={`${theme === 'dark' ? 'bg-gray-900 hover:bg-gray-800 transition-colors' : 'hover:bg-gray-25 transition-colors'}`}>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {user.name}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {user.email}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {user.phone}
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                                            user.is_active === 'True'
                                                                ? 'bg-green-50 text-green-700'
                                                                : 'bg-red-50 text-red-700'
                                                        }`}
                                                    >
                                                        {user.is_active === 'True' ? 'Active' : 'Inactive'}
                                                    </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-sm">
                                                <div className="flex space-x-4">
                                                    {user.is_active === 'True' ? (
                                                        <button
                                                            onClick={() => handleDeactivateUser(user.email)}
                                                            className={`flex items-center gap-1 transition-colors ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-500 hover:text-red-700'}`}
                                                        >
                                                            <EyeOff size={16} />
                                                            <span>Deactivate</span>
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={() => handleActivateUser(user.email)}
                                                            className={`flex items-center gap-1 transition-colors ${theme === 'dark' ? 'text-green-400 hover:text-green-300' : 'text-green-500 hover:text-green-700'}`}
                                                        >
                                                            <Eye size={16} />
                                                            <span>Activate</span>
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className={`px-6 py-5 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`}>
                                            No users found matching your search.
                                        </td>
                                    </tr>
                                )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderTradeBook = () => {
        // Assuming isLoading is a state variable that would be passed or managed in the componen
        return (
            <div className={`rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                    <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                        Trade Book
                    </h3>
                    <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        View all trading activity
                    </p>
                </div>
                <div className="p-6">
                    {error && (
                        <div className={`p-4 rounded mb-4 ${theme === 'dark' ? 'bg-red-900 text-red-400' : 'bg-red-100 text-red-700'}`}>
                            {error}
                        </div>
                    )}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div className="flex justify-center items-center py-8">
                                <div className={`animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 ${theme === 'dark' ? 'border-gray-200' : 'border-gray-600'}`}></div>
                            </div>
                        ) : (
                            <table className={`min-w-full divide-y trade-book-table ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                                <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-50'}`}>
                                <tr>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Trade Time
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Symbol
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Type
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Quantity
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Price
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Total
                                    </th>
                                    <th scope="col" className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        Order ID
                                    </th>
                                </tr>
                                </thead>
                                <tbody className={`${theme === 'dark' ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'}`}>
                                <tr>
                                    <td colSpan={7} className={`px-6 py-4 text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                        No trades available.
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    const renderStocks = () => {
        const handleSearchStock = async (query) => {
            if (!query || query.length < 1) {
                setStockSearchResults([]);
                return;
            }

            setIsSearchLoading(true);
            try {
                const token = getAuthToken();
                const response = await axios.get(
                    `${import.meta.env.VITE_API_URL}/user/angel/searchstock/${exchange}/${query}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const decryptedData = parseApiResponse(response.data.data);
                if (decryptedData?.status === '200') {
                    setStockSearchResults(decryptedData.search_result || []);
                } else {
                    throw new Error(decryptedData?.message || 'Search failed');
                }
            } catch (err) {
                // console.error('Error searching stock:', err);
                toast.error('Failed to search stock: ' + err.message);
                setStockSearchResults([]);
            } finally {
                setIsSearchLoading(false);
            }
        };

        const handleStockQueryChange = (e) => {
            const value = e.target.value;
            setStockSearchQuery(value);

            if (window.stockSearchTimeout) {
                clearTimeout(window.stockSearchTimeout);
            }

            if (value.trim() === '' || value.endsWith(' ')) {
                handleSearchStock(value.trim());
            } else {
                window.stockSearchTimeout = setTimeout(() => {
                    handleSearchStock(value.trim());
                }, 2000);
            }
        };

        const handleAddStock = async (e) => {
            e.preventDefault();
            if (!selectedStock) {
                toast.error('Please select a stock to add');
                return;
            }

            try {
                const token = getAuthToken();
                const stockData = {
                    exchange: selectedStock.exchange,
                    tradingsymbol: selectedStock.tradingsymbol,
                    symboltoken: selectedStock.symboltoken,
                };
                const encryptedData = encryptMessage(JSON.stringify(stockData));
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/user/stocks/add`,
                    { data: encryptedData },
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                const decryptedData = parseApiResponse(response.data.data);
                if (decryptedData?.status === '201') {
                    toast.success(decryptedData.message || 'Stock added successfully');
                    await fetchStocksData();
                    setSelectedStock(null);
                    setStockSearchQuery('');
                    setStockSearchResults([]);
                } else if (decryptedData?.status === '429') {
                    toast.error('Add stock limit exceeds');
                } else {
                    throw new Error(decryptedData?.message || 'Failed to add stock');
                }
            } catch (err) {
                // console.error('Error adding stock:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Failed to add stock';
                toast.error('Failed to add stock: ' + errorMessage);
            }
        };

        return (
            <div className="space-y-6">
                <div className={`rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            Add New Stock
                        </h3>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Search and add stocks to the system
                        </p>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center gap-4 mb-4">
                            <select
                                value={exchange}
                                onChange={(e) => setExchange(e.target.value)}
                                className={`w-32 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                            >
                                <option value="NSE">NSE</option>
                                <option value="BSE">BSE</option>
                            </select>
                            <div className="relative w-full max-w-md">
                                <input
                                    type="text"
                                    placeholder={`Search ${exchange} stocks (e.g., RPOWER)`}
                                    value={stockSearchQuery}
                                    onChange={handleStockQueryChange}
                                    className={`w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                                    disabled={isSearchLoading}
                                />
                                <Search size={16} className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-400'}`} />
                                {isSearchLoading && (
                                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                                    </div>
                                )}
                                {isSearchLoading && stockSearchQuery && (
                                    <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg p-2 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                        <p className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                            Searching...
                                        </p>
                                    </div>
                                )}
                                {!isSearchLoading && stockSearchResults.length > 0 && stockSearchQuery && (
                                    <div className={`absolute z-10 w-full mt-1 border rounded-md shadow-lg max-h-60 overflow-y-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
                                        {stockSearchResults.map((result) => (
                                            <div
                                                key={result.symboltoken}
                                                className={`p-2 cursor-pointer ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} ${
                                                    selectedStock?.symboltoken === result.symboltoken ? 'bg-blue-50' : ''
                                                }`}
                                                onClick={() => {
                                                    setSelectedStock(result);
                                                    setStockSearchQuery(result.tradingsymbol);
                                                    setStockSearchResults([]);
                                                }}
                                            >
                                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {result.tradingsymbol} (Token: {result.symboltoken})
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                        {selectedStock && (
                            <button
                                onClick={handleAddStock}
                                className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center"
                            >
                                <Plus size={16} className="mr-2" />
                                Add Selected Stock
                            </button>
                        )}
                    </div>
                </div>

                <div className={`rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className={`p-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            All Stocks
                        </h3>
                        <p className={`text-sm mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            View and manage stored stocks
                        </p>
                    </div>
                    <div className="p-6">
                        {stocks.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {stocks.map((stock) => (
                                    <div
                                        key={stock.symboltoken}
                                        className={`rounded-lg p-4 border transition-shadow ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:shadow-xl' : 'bg-gray-50 border-gray-100 hover:shadow-md'}`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                    {stock.tradingsymbol}
                                                </h4>
                                                <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                                    {stock.exchange}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => removeStock(stock.symboltoken)}
                                                className={`flex items-center gap-1 ${theme === 'dark' ? 'text-red-400 hover:text-red-300' : 'text-red-600 hover:text-red-800'}`}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                        <div className="mt-3 space-y-1">
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <span className="font-medium">Token:</span> {stock.symboltoken}
                                            </p>
                                            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <span className="font-medium">Added:</span>{' '}
                                                {new Date(stock.added_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                No stocks added yet.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <DashboardLayout>
            <div className={`mb-6 border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                <nav className="-mb-px flex space-x-8">
                    <button
                        onClick={() => setActiveTab('dashboard')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'dashboard'
                                ? 'border-blue-500 text-blue-600'
                                : (theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
                        }`}
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('users')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'users'
                                ? 'border-blue-500 text-blue-600'
                                : (theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
                        }`}
                    >
                        Users
                    </button>
                    <button
                        onClick={() => setActiveTab('tradeBook')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'tradeBook'
                                ? 'border-blue-500 text-blue-600'
                                : (theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
                        }`}
                    >
                        Trade Book
                    </button>
                    <button
                        onClick={() => setActiveTab('stocks')}
                        className={`py-4 px-1 border-b-2 font-medium text-sm ${
                            activeTab === 'stocks'
                                ? 'border-blue-500 text-blue-600'
                                : (theme === 'dark' ? 'border-transparent text-gray-400 hover:text-gray-200 hover:border-gray-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300')
                        }`}
                    >
                        Stocks
                    </button>
                </nav>
            </div>

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


            {activeTab === 'dashboard' && renderDashboard()}
            {activeTab === 'users' && renderUsers()}
            {activeTab === 'tradeBook' && renderTradeBook()}
            {activeTab === 'stocks' && renderStocks()}

        </DashboardLayout>
    );
};

export default ManagerDashboard;








