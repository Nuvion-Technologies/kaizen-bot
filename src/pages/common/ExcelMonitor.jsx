// import React, {useState, useEffect, useContext} from 'react';
// import { ChevronDown, Loader2 } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from '../../utils/api'; // Your axios instance
// import { getAuthToken } from '../../utils/auth';
// import { encryptMessage, decryptMessage, parseApiResponse } from '../../utils/crypto';
// import DashboardLayout from '../../components/DashboardLayout';
// import { ThemeContext } from '../../context/ThemeContext';
//
// const ExcelMonitor = () => {
//     const [tradeCycles, setTradeCycles] = useState([]);
//     const [selectedCycleId, setSelectedCycleId] = useState(null);
//     const [excelData, setExcelData] = useState(null);
//     const [loadingCycles, setLoadingCycles] = useState(true);
//     const [loadingExcel, setLoadingExcel] = useState(false);
//     const { theme } = useContext(ThemeContext);
//
//
//     // Fetch trade cycle history
//     const fetchTradeCycleHistory = async () => {
//         setLoadingCycles(true);
//         try {
//             const token = getAuthToken();
//             const response = await api.get('/api/trade-cycle-history', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData.status === "200") {
//                 setTradeCycles(decryptedData.trade_cycle_history || []);
//             } else if (decryptedData.status === "404") {
//                 setTradeCycles([]);
//                 toast.info('No trade cycle history found');
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to fetch trade cycle history');
//             }
//         } catch (error) {
//             console.error('Error fetching trade cycle history:', error);
//             toast.error('Failed to fetch trade cycle history: ' + error.message);
//         } finally {
//             setLoadingCycles(false);
//         }
//     };
//
//     // Fetch Excel analysis data
//     const fetchExcelAnalysis = async (cycleId) => {
//         setLoadingExcel(true);
//         try {
//             const token = getAuthToken();
//             const response = await api.get(`/excel-analysis?cycle_id=${cycleId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             // Assuming the response is HTML table string from backend
//             setExcelData(response.data);
//             console.log(response);
//         } catch (error) {
//             console.error('Error fetching Excel analysis:', error);
//             toast.error('Failed to fetch Excel analysis: ' + error.message);
//             setExcelData(null);
//         } finally {
//             setLoadingExcel(false);
//         }
//     };
//
//     // Initial fetch for trade cycles
//     useEffect(() => {
//         fetchTradeCycleHistory();
//     }, []);
//
//     // Fetch Excel data when cycle ID changes
//     useEffect(() => {
//         if (selectedCycleId) {
//             fetchExcelAnalysis(selectedCycleId);
//         }
//     }, [selectedCycleId]);
//
//     // Handle cycle selection
//     const handleCycleChange = (e) => {
//         setSelectedCycleId(e.target.value);
//     };
//
//     return (
//         <DashboardLayout>
//             <div className="space-y-6">
//                 <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                             Excel Monitor
//                         </h3>
//                     </div>
//
//                     {/* Trade Cycle Selector */}
//                     <div className="mb-6">
//                         <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
//                             Select Trade Cycle
//                         </label>
//                         {loadingCycles ? (
//                             <div className="flex justify-center items-center py-4">
//                                 <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
//                             </div>
//                         ) : (
//                             <div className="relative">
//                                 <select
//                                     value={selectedCycleId || ''}
//                                     onChange={handleCycleChange}
//                                     className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
//                                 >
//                                     <option value="" disabled>Select a cycle</option>
//                                     {tradeCycles.map((cycle) => (
//                                         <option key={cycle.id} value={cycle.id}>
//                                             {cycle.stock_symbol} - {cycle.cycle_start || 'N/A'}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Excel Analysis Display */}
//                     <div>
//                         <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
//                             Excel Analysis
//                         </h4>
//                         {loadingExcel ? (
//                             <div className="flex justify-center items-center py-8">
//                                 <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
//                             </div>
//                         ) : excelData ? (
//                             <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
//                                 <div
//                                     className={`${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} [&_td]:p-2 [&_th]:p-2`}
//                                     dangerouslySetInnerHTML={{ __html: excelData }}
//                                 />
//                             </div>
//                         ) : selectedCycleId ? (
//                             <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                 No data available for this cycle.
//                             </p>
//                         ) : (
//                             <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                 Please select a trade cycle to view analysis.
//                             </p>
//                         )}
//                     </div>
//                 </div>
//
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
// export default ExcelMonitor;




//WORKING WITHOUT AUTOSCROLL
// import React, {useState, useEffect, useContext} from 'react';
// import { ChevronDown, Loader2 } from 'lucide-react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import api from '../../utils/api';
// import { getAuthToken } from '../../utils/auth';
// import { parseApiResponse } from '../../utils/crypto';
// import DashboardLayout from '../../components/DashboardLayout';
// import {ThemeContext} from "../../context/ThemeContext.jsx";
//
// const ExcelMonitor = () => {
//     const { theme } = useContext(ThemeContext);
//     const [tradeCycles, setTradeCycles] = useState([]);
//     const [selectedCycleId, setSelectedCycleId] = useState(null);
//     const [excelData, setExcelData] = useState(null);
//     const [loadingCycles, setLoadingCycles] = useState(true);
//     const [loadingExcel, setLoadingExcel] = useState(false);
//     const [basePrice, setBasePrice] = useState(null); // New state for base_price
//     const [currentSrNo, setCurrentSrNo] = useState(null);
//     const [walletvalue, setWalletvalue] = useState(null);
//
//
//     // Fetch trade cycle history
//     const fetchTradeCycleHistory = async () => {
//         setLoadingCycles(true);
//         try {
//             const token = getAuthToken();
//             const response = await api.get('/api/trade-cycle-history', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData.status === "200") {
//                 setTradeCycles(decryptedData.trade_cycle_history || []);
//             } else if (decryptedData.status === "404") {
//                 setTradeCycles([]);
//                 toast.info('No trade cycle history found');
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to fetch trade cycle history');
//             }
//         } catch (error) {
//             console.error('Error fetching trade cycle history:', error);
//             toast.error('Failed to fetch trade cycle history: ' + error.message);
//         } finally {
//             setLoadingCycles(false);
//         }
//     };
//
//     // Fetch Excel analysis data
//     const fetchExcelAnalysis = async (cycleId) => {
//         setLoadingExcel(true);
//         try {
//             const token = getAuthToken();
//             const response = await api.get(`/excel-analysis?cycle_id=${cycleId}`, {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData && decryptedData.status === "200") {
//                 setExcelData(decryptedData.strategy || []);
//                 setBasePrice(decryptedData.base_price);
//                 setCurrentSrNo(decryptedData.currunt_sr_no);
//                 setWalletvalue(decryptedData.wallet_value);
//             } else {
//                 throw new Error(decryptedData?.message || 'Failed to fetch Excel analysis');
//             }
//             console.log(decryptedData);
//         } catch (error) {
//             console.error('Error fetching Excel analysis:', error);
//             toast.error('Failed to fetch Excel analysis: ' + error.message);
//             setExcelData(null);
//             setBasePrice(null);
//             setCurrentSrNo(null);
//         } finally {
//             setLoadingExcel(false);
//         }
//     };
//
//     // Initial fetch for trade cycles
//     useEffect(() => {
//         fetchTradeCycleHistory();
//     }, []);
//
//     // Fetch Excel data when cycle ID changes
//     useEffect(() => {
//         if (selectedCycleId) {
//             fetchExcelAnalysis(selectedCycleId);
//         }
//     }, [selectedCycleId]);
//
//     // Handle cycle selection
//     const handleCycleChange = (e) => {
//         setSelectedCycleId(e.target.value);
//     };
//
//     return (
//         <DashboardLayout>
//             <div className="space-y-6">
//                 <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
//                     <div className="flex items-center justify-between mb-6">
//                         <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                             Excel Monitor
//                         </h3>
//                     </div>
//
//                     {/* Trade Cycle Selector */}
//                     <div className="mb-6">
//                         <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
//                             Select Trade Cycle
//                         </label>
//                         {loadingCycles ? (
//                             <div className="flex justify-center items-center py-4">
//                                 <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
//                             </div>
//                         ) : (
//                             <div className="relative">
//                                 <select
//                                     value={selectedCycleId || ''}
//                                     onChange={handleCycleChange}
//                                     className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
//                                 >
//                                     <option value="" disabled>Select a cycle</option>
//                                     {tradeCycles.map((cycle) => (
//                                         <option key={cycle.id} value={cycle.id}>
//                                             {cycle.stock_symbol} - {cycle.cycle_start || 'N/A'}
//                                         </option>
//                                     ))}
//                                 </select>
//                                 <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
//                             </div>
//                         )}
//                     </div>
//
//                     {/* Excel Analysis Display */}
//                     <div>
//                         <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
//                             Excel Analysis
//                         </h4>
//                         {basePrice !== null && (
//                             <p className={`text-xl mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
//                                 Base Price: ₹{Number(basePrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} &nbsp;&nbsp;
//                                 Wallet Value: ₹{Number(walletvalue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                             </p>
//                         )}
//
//                         {loadingExcel ? (
//                             <div className="flex justify-center items-center py-8">
//                                 <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
//                             </div>
//                         ) : excelData ? (
//                             <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
//                                 <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
//                                     <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
//                                     <tr>
//                                         {[
//                                             'Sr.No', 'DOWN', 'Entry', 'Qnty', 'Capital', 'Total Qty', 'Total Invested',
//                                             'First TGT', 'Exit 1st Half', 'Second TGT', 'Exit 2nd Half', 'Final TGT', 'AVG on Capital'
//                                         ].map((header) => (
//                                             <th
//                                                 key={header}
//                                                 className={`px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}
//                                             >
//                                                 {header}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                     </thead>
//                                     <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
//                                     {excelData.map((row, index) => (
//                                         <tr
//                                             key={index}
//                                             className={`${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition ${row['Sr.No'] === currentSrNo ? (theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100') : ''}`}
//                                         >
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {row['Sr.No']}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {row['DOWN']}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 ₹{Number(row['Entry']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {row['Qnty']}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 ₹{Number(row['Capital']).toLocaleString('en-IN')}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {row['Total_Qty']}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 ₹{Number(row['Total_Invested']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {row['First_TGT'] ? `₹${Number(row['First_TGT']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {row['EXIT_1st_HALF'] || 'N/A'}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {row['Second_TGT'] ? `₹${Number(row['Second_TGT']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 {row['EXIT_2nd_HALF'] || 'N/A'}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 ₹{Number(row['FINAL_TGT']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                             </td>
//                                             <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
//                                                 ₹{Number(row['AVG_on_Capital']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
//                                             </td>
//                                         </tr>
//                                     ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         ) : selectedCycleId ? (
//                             <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                 No data available for this cycle.
//                             </p>
//                         ) : (
//                             <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
//                                 Please select a trade cycle to view analysis.
//                             </p>
//                         )}
//                     </div>
//                 </div>
//
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
// export default ExcelMonitor;





import React, {useState, useEffect, useRef, useContext} from 'react';
import { ChevronDown, Loader2 } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../../utils/api';
import { getAuthToken } from '../../utils/auth';
import { parseApiResponse } from '../../utils/crypto';
import DashboardLayout from '../../components/DashboardLayout';
import {ThemeContext} from "../../context/ThemeContext.jsx";

const ExcelMonitor = () => {
    const { theme } = useContext(ThemeContext);
    const [tradeCycles, setTradeCycles] = useState([]);
    const [selectedCycleId, setSelectedCycleId] = useState(null);
    const [excelData, setExcelData] = useState(null);
    const [basePrice, setBasePrice] = useState(null);
    const [currentSrNo, setCurrentSrNo] = useState(null);
    const [loadingCycles, setLoadingCycles] = useState(true);
    const [loadingExcel, setLoadingExcel] = useState(false);
    const rowRef = useRef(null); // Ref to track the row to scroll to
    const [Walletvalue,setWalletValue] = useState(null);

    // Sync theme to localStorage
    useEffect(() => {
        localStorage.setItem('theme', theme);
    }, [theme]);

    // Fetch trade cycle history
    const fetchTradeCycleHistory = async () => {
        setLoadingCycles(true);
        try {
            const token = getAuthToken();
            const response = await api.get('/api/trade-cycle-history', {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData.status === "200") {
                setTradeCycles(decryptedData.trade_cycle_history || []);
            } else if (decryptedData.status === "404") {
                setTradeCycles([]);
                toast.info('No trade cycle history found');
            } else {
                throw new Error(decryptedData.message || 'Failed to fetch trade cycle history');
            }
        } catch (error) {
            console.error('Error fetching trade cycle history:', error);
            toast.error('Failed to fetch trade cycle history: ' + error.message);
        } finally {
            setLoadingCycles(false);
        }
    };

    // Fetch Excel analysis data
    const fetchExcelAnalysis = async (cycleId) => {
        setLoadingExcel(true);
        try {
            const token = getAuthToken();
            const response = await api.get(`/excel-analysis?cycle_id=${cycleId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData && decryptedData.status === "200") {
                setExcelData(decryptedData.strategy || []);
                setBasePrice(decryptedData.base_price);
                setCurrentSrNo(decryptedData.currunt_sr_no); // Typo in backend key
                setWalletValue(decryptedData.wallet_value);
            } else {
                throw new Error(decryptedData?.message || 'Failed to fetch Excel analysis');
            }
        } catch (error) {
            console.error('Error fetching Excel analysis:', error);
            toast.error('Failed to fetch Excel analysis: ' + error.message);
            setExcelData(null);
            setBasePrice(null);
            setCurrentSrNo(null);
        } finally {
            setLoadingExcel(false);
        }
    };

    // Initial fetch for trade cycles
    useEffect(() => {
        fetchTradeCycleHistory();
    }, []);

    // Fetch Excel data when cycle ID changes
    useEffect(() => {
        if (selectedCycleId) {
            fetchExcelAnalysis(selectedCycleId);
        }
    }, [selectedCycleId]);

    // Auto-scroll to the current Sr.No row when data loads
    useEffect(() => {
        if (excelData && currentSrNo && rowRef.current) {
            rowRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
    }, [excelData, currentSrNo]);

    // Handle cycle selection
    const handleCycleChange = (e) => {
        setSelectedCycleId(e.target.value);
    };

    return (
        <DashboardLayout>
            <div className="space-y-6">
                <div className={`rounded-xl shadow-md p-6 border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-gradient-to-r from-gray-50 to-white border-gray-100'}`}>
                    <div className="flex items-center justify-between mb-6">
                        <h3 className={`text-2xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                            Excel Monitor
                        </h3>
                    </div>

                    {/* Trade Cycle Selector */}
                    <div className="mb-6">
                        <label className={`block text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'} mb-2`}>
                            Select Trade Cycle
                        </label>
                        {loadingCycles ? (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="animate-spin h-8 w-8 text-blue-500" />
                            </div>
                        ) : (
                            <div className="relative">
                                <select
                                    value={selectedCycleId || ''}
                                    onChange={handleCycleChange}
                                    className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200' : 'bg-white border-gray-300 text-gray-900'}`}
                                >
                                    <option value="" disabled>Select a cycle</option>
                                    {tradeCycles.map((cycle) => (
                                        <option key={cycle.id} value={cycle.id}>
                                            {cycle.stock_symbol} - {cycle.cycle_start || 'N/A'}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                        )}
                    </div>

                    {/* Excel Analysis Display */}
                    <div>
                        <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                            Excel Analysis
                        </h4>
                        <p className={`text-xl mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            Base Price: ₹{Number(basePrice).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} &nbsp;&nbsp;
                            Wallet Value: ₹{Number(Walletvalue).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                        {loadingExcel ? (
                            <div className="flex justify-center items-center py-8">
                                <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                            </div>
                        ) : excelData ? (
                            <div className={`overflow-x-auto rounded-lg border ${theme === 'dark' ? 'border-gray-800 bg-gray-900' : 'border-gray-200 bg-white'}`}>
                                <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                                    <tr>
                                        {[
                                            'Sr.No', 'DOWN', 'Entry', 'Qnty', 'Capital', 'Total Qty', 'Total Invested',
                                            'First TGT', 'Exit 1st Half', 'Second TGT', 'Exit 2nd Half', 'Final TGT', 'AVG on Capital'
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
                                    <tbody className={`divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
                                    {excelData.map((row, index) => (
                                        <tr
                                            key={index}
                                            ref={row['Sr.No'] === currentSrNo ? rowRef : null} // Attach ref to the current Sr.No row
                                            className={`${theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-50'} transition ${row['Sr.No'] === currentSrNo ? (theme === 'dark' ? 'bg-blue-900' : 'bg-blue-100') : ''}`}
                                        >
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {row['Sr.No']}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {row['DOWN']}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                ₹{Number(row['Entry']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {row['Qnty']}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                ₹{Number(row['Capital']).toLocaleString('en-IN')}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {row['Total_Qty']}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                ₹{Number(row['Total_Invested']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {row['First_TGT'] ? `₹${Number(row['First_TGT']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {row['EXIT_1st_HALF'] || 'N/A'}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {row['Second_TGT'] ? `₹${Number(row['Second_TGT']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'N/A'}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                {row['EXIT_2nd_HALF'] || 'N/A'}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                ₹{Number(row['FINAL_TGT']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                            <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                                ₹{Number(row['AVG_on_Capital']).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : selectedCycleId ? (
                            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                No data available for this cycle.
                            </p>
                        ) : (
                            <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                Please select a trade cycle to view analysis.
                            </p>
                        )}
                    </div>
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
            </div>
        </DashboardLayout>
    );
};

export default ExcelMonitor;
