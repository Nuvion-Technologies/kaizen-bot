// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import DashboardLayout from '../../components/DashboardLayout';
// import api from '../../utils/api'; // Adjust path
// import { getAuthToken } from '../../utils/auth'; // Adjust path
//
// const Portfolio = () => {
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
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const holdingsRef = useRef(new Map()); // Store holdings for direct DOM updates
//     const updateCounter = useRef(0); // Counter for polling updates
//
//     // Fetch portfolio data (GET request)
//     const fetchPortfolioData = async () => {
//         try {
//             setLoading(true);
//             const token = getAuthToken();
//             console.log('Fetching Portfolio Data - Token:', token);
//
//             const response = await api.get('/user/angel/all-holding', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             console.log('API Response:', response);
//             console.log('Decrypted Data:', response.decryptedData);
//
//             if (response.status === 200 && response.decryptedData?.status === "200") {
//                 const allHoldingData = response.decryptedData.all_holding.data;
//                 const holdings = allHoldingData.holdings || [];
//                 const totalholding = allHoldingData.totalholding || {
//                     totalholdingvalue: 0,
//                     totalinvvalue: 0,
//                     totalprofitandloss: 0,
//                     totalpnlpercentage: 0,
//                     today_profit_and_loss: allHoldingData.today_profit_and_loss || 0,
//                 };
//
//                 console.log('All Holding Data:', allHoldingData);
//                 console.log('Holdings:', holdings);
//                 console.log('Total Holding:', totalholding);
//
//                 updateCounter.current += 1;
//                 console.log(`Portfolio Update #${updateCounter.current}`);
//
//                 // Update state and holdings ref
//                 setPortfolioData({ holdings, totalholding });
//                 holdingsRef.current = new Map(holdings.map(holding => [holding.tradingsymbol, { ...holding }]));
//
//                 // Direct DOM updates for existing rows
//                 holdings.forEach(holding => {
//                     const symbol = holding.tradingsymbol;
//                     const newLTP = holding.ltp;
//                     const currentHolding = holdingsRef.current.get(symbol);
//
//                     if (currentHolding) {
//                         const updatedHolding = updateHoldingWithLTP(currentHolding, newLTP);
//                         holdingsRef.current.set(symbol, updatedHolding);
//
//                         const row = document.querySelector(`tr[data-symbol="${symbol}"]`);
//                         if (row) {
//                             row.querySelector('.ltp').textContent = `₹${newLTP.toFixed(2)}`;
//                             row.querySelector('.market-value').textContent = `₹${updatedHolding.marketValue.toLocaleString()}`;
//                             row.querySelector('.gain-loss').textContent = `${updatedHolding.profitandloss >= 0 ? '+' : '-'}₹${Math.abs(updatedHolding.profitandloss).toLocaleString()} (${updatedHolding.pnlpercentage.toFixed(2)}%)`;
//                             row.querySelector('.today-pnl').textContent = `${updatedHolding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(updatedHolding.today_pnl).toLocaleString()}`;
//                             row.querySelector('.gain-loss').className = `px-4 py-3 whitespace-nowrap text-sm ${updatedHolding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'} gain-loss`;
//                             row.querySelector('.today-pnl').className = `px-4 py-3 whitespace-nowrap text-sm ${updatedHolding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600'} today-pnl`;
//                             console.log(`DOM Updated for ${symbol}:`, updatedHolding);
//                         }
//                     }
//                 });
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to fetch portfolio data');
//             }
//         } catch (err) {
//             setError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
//             console.error('Fetch Error:', err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Update holding with new LTP and recalculate derived fields
//     const updateHoldingWithLTP = (holding, newLTP) => {
//         const updatedHolding = {
//             ...holding,
//             ltp: newLTP,
//             marketValue: newLTP * holding.quantity,
//             profitandloss: (newLTP - holding.averageprice) * holding.quantity,
//             pnlpercentage: holding.averageprice !== 0 ? ((newLTP - holding.averageprice) / holding.averageprice) * 100 : 0,
//             today_pnl: calculateTodaysPNL(newLTP, holding.close, holding.quantity),
//         };
//         console.log('Updated Holding with LTP:', updatedHolding);
//         return updatedHolding;
//     };
//
//     // Calculate today's P&L based on LTP and previous close
//     const calculateTodaysPNL = (ltp, close, quantity) => {
//         const todayPNL = (ltp - close) * quantity;
//         console.log(`Today’s P&L Calculation - LTP: ${ltp}, Close: ${close}, Quantity: ${quantity}, Result: ${todayPNL}`);
//         return todayPNL;
//     };
//
//     // Update total holdings based on updated individual holdings
//     const updateTotalHoldings = (holdings) => {
//         const totalholding = {
//             totalholdingvalue: 0,
//             totalinvvalue: portfolioData.totalholding.totalinvvalue || 0,
//             totalprofitandloss: 0,
//             totalpnlpercentage: 0,
//             today_profit_and_loss: 0,
//         };
//
//         holdings.forEach(holding => {
//             totalholding.totalholdingvalue += holding.marketValue || (holding.ltp * holding.quantity);
//             totalholding.totalprofitandloss += holding.profitandloss || 0;
//             totalholding.today_profit_and_loss += holding.today_pnl || 0;
//         });
//
//         totalholding.totalpnlpercentage = totalholding.totalinvvalue !== 0
//             ? (totalholding.totalprofitandloss / totalholding.totalinvvalue) * 100
//             : 0;
//
//         console.log('Updated Total Holdings:', totalholding);
//         return totalholding;
//     };
//
//     // Memoized holdings for rendering stability
//     const memoizedHoldings = useMemo(() => portfolioData.holdings, [portfolioData.holdings]);
//
//     // Set up polling with setInterval
//     useEffect(() => {
//         fetchPortfolioData(); // Initial fetch
//
//         const intervalId = setInterval(() => {
//             fetchPortfolioData();
//         }, 1000); // Fetch every 10 seconds
//
//         return () => {
//             clearInterval(intervalId);
//             console.log('Polling interval cleared');
//         };
//     }, []);
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-full">
//                     <p>Loading portfolio...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 {error && (
//                     <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//
//                 {/* Portfolio Summary */}
//                 <div className="mb-6">
//                     <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-medium text-gray-800">Portfolio Summary</h3>
//                         <div className="flex space-x-2">
//                             <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
//                                 <option>Last 7 days</option>
//                                 <option>Last 30 days</option>
//                                 <option>Last 90 days</option>
//                                 <option>Year to date</option>
//                                 <option>All time</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                             <p className="text-gray-500">Invested Amount</p>
//                             <p className="text-lg font-bold text-gray-900">₹{portfolioData.totalholding.totalinvvalue.toLocaleString()}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Current Value</p>
//                             <p className="text-lg font-bold text-gray-900">₹{portfolioData.totalholding.totalholdingvalue.toLocaleString()}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Overall {portfolioData.totalholding.totalprofitandloss < 0 ? 'Loss' : 'Gain'}</p>
//                             <p className={`text-lg font-bold ${portfolioData.totalholding.totalprofitandloss < 0 ? 'text-red-600' : 'text-green-600'}`}>
//                                 {portfolioData.totalholding.totalprofitandloss < 0 ? '-' : '+'}₹
//                                 {Math.abs(portfolioData.totalholding.totalprofitandloss).toLocaleString()}
//                                 ({portfolioData.totalholding.totalpnlpercentage.toFixed(2)}%)
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Today’s {portfolioData.totalholding.today_profit_and_loss < 0 ? 'Loss' : 'Gain'}</p>
//                             <p className={`text-lg font-bold ${portfolioData.totalholding.today_profit_and_loss < 0 ? 'text-red-600' : 'text-green-600'}`}>
//                                 {portfolioData.totalholding.today_profit_and_loss === 0
//                                     ? '₹0 (0%)'
//                                     : `${portfolioData.totalholding.today_profit_and_loss < 0 ? '-' : '+'}₹${Math.abs(portfolioData.totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(portfolioData.totalholding.today_profit_and_loss) / (portfolioData.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Holdings Table */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="p-4 flex justify-between items-center border-b border-gray-300">
//                         <h3 className="text-lg font-medium text-gray-800">Holdings <span className="text-gray-500">({portfolioData.holdings.length})</span></h3>
//                         <div className="flex space-x-2">
//                             <input
//                                 type="text"
//                                 placeholder="Search for stock or company"
//                                 className="bg-gray-100 text-gray-800 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                             />
//                             <button className="bg-gray-100 p-2 rounded-md border border-gray-300 hover:bg-gray-200 text-gray-600">
//                                 <span className="text-gray-600">↓</span>
//                             </button>
//                             <button className="bg-gray-100 p-2 rounded-md border border-gray-300 hover:bg-gray-200 text-gray-600">
//                                 <span className="text-gray-600">🔒</span>
//                             </button>
//                             <button className="bg-gray-100 p-2 rounded-md border border-gray-300 hover:bg-gray-200 text-gray-600">
//                                 <span className="text-gray-600">🏠</span>
//                             </button>
//                             <button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">SELECT & EXIT</button>
//                         </div>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-100">
//                             <tr>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Stock Name ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Quantity ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Avg. Price ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">LTP ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Inv Amt ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Mkt Val ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Overall G/L ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Day’s G/L ▼</th>
//                             </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                             {memoizedHoldings.map((holding, index) => (
//                                 <tr key={index} data-symbol={holding.tradingsymbol}>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{holding.tradingsymbol}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{holding.quantity}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">₹{holding.averageprice.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 ltp">₹{holding.ltp.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">₹{(holding.averageprice * holding.quantity).toLocaleString()}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 market-value">₹{(holding.ltp * holding.quantity).toLocaleString()}</td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${holding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'} gain-loss`}>
//                                         {holding.profitandloss >= 0 ? '+' : '-'}₹
//                                         {Math.abs(holding.profitandloss).toLocaleString()}
//                                         ({holding.pnlpercentage.toFixed(2)}%)
//                                     </td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${holding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600'} today-pnl`}>
//                                         {holding.today_pnl >= 0 ? '+' : '-'}₹
//                                         {Math.abs(holding.today_pnl).toLocaleString()}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Portfolio;





// SECOND WORKING CODE # BHIMANI CODE
// import DashboardLayout from '../../components/DashboardLayout';
// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import api from '../../utils/api'; // Adjust path
// import { getAuthToken } from '../../utils/auth'; // Adjust path
//
// const Portfolio = () => {
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
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const holdingsRef = useRef(new Map()); // Store holdings for direct DOM updates
//     const totalHoldingRef = useRef({}); // Store total holdings for direct updates
//     const updateCounter = useRef(0); // Counter for polling updates
//
//     // Fetch portfolio data (GET request)
//     const fetchPortfolioData = async (isInitialFetch = false) => {
//         try {
//             if (isInitialFetch) setLoading(true);
//             const token = getAuthToken();
//             console.log('Fetching Portfolio Data - Token:', token);
//
//             const response = await api.get('/user/angel/all-holding', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             console.log('API Response:', response);
//             console.log('Decrypted Data:', response.data);
//
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
//                 console.log('All Holding Data:', allHoldingData);
//                 console.log('Holdings:', holdings);
//                 console.log('Total Holding:', totalholding);
//
//                 updateCounter.current += 1;
//                 console.log(`Portfolio Update #${updateCounter.current}`);
//
//                 // Initial fetch: Set state and populate refs
//                 if (isInitialFetch) {
//                     setPortfolioData({ holdings, totalholding });
//                     holdingsRef.current = new Map(holdings.map(holding => [holding.tradingsymbol, { ...holding }]));
//                     totalHoldingRef.current = { ...totalholding };
//                 }
//
//                 // Update holdings and DOM directly
//                 holdings.forEach(holding => {
//                     const symbol = holding.tradingsymbol;
//                     const newLTP = holding.ltp;
//                     const currentHolding = holdingsRef.current.get(symbol);
//
//                     if (currentHolding) {
//                         const updatedHolding = updateHoldingWithLTP(currentHolding, newLTP);
//                         holdingsRef.current.set(symbol, updatedHolding);
//
//                         const row = document.querySelector(`tr[data-symbol="${symbol}"]`);
//                         if (row) {
//                             row.querySelector('.ltp').textContent = `₹${newLTP.toFixed(2)}`;
//                             row.querySelector('.market-value').textContent = `₹${updatedHolding.marketValue.toLocaleString()}`;
//                             row.querySelector('.gain-loss').textContent = `${updatedHolding.profitandloss >= 0 ? '+' : '-'}₹${Math.abs(updatedHolding.profitandloss).toLocaleString()} (${updatedHolding.pnlpercentage.toFixed(2)}%)`;
//                             row.querySelector('.today-pnl').textContent = `${updatedHolding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(updatedHolding.today_pnl).toLocaleString()}`;
//                             row.querySelector('.gain-loss').className = `px-4 py-3 whitespace-nowrap text-sm ${updatedHolding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'} gain-loss`;
//                             row.querySelector('.today-pnl').className = `px-4 py-3 whitespace-nowrap text-sm ${updatedHolding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600'} today-pnl`;
//                             console.log(`DOM Updated for ${symbol}:`, updatedHolding);
//                         }
//                     }
//                 });
//
//                 // Update total holdings and DOM directly
//                 const updatedTotalHolding = updateTotalHoldings(Array.from(holdingsRef.current.values()));
//                 totalHoldingRef.current = updatedTotalHolding;
//
//                 // Update summary section DOM
//                 const summary = document.querySelector('.portfolio-summary');
//                 if (summary) {
//                     summary.querySelector('.current-value').textContent = `₹${updatedTotalHolding.totalholdingvalue.toLocaleString()}`;
//                     summary.querySelector('.overall-gain-loss').textContent = `${updatedTotalHolding.totalprofitandloss >= 0 ? '+' : '-'}₹${Math.abs(updatedTotalHolding.totalprofitandloss).toLocaleString()} (${updatedTotalHolding.totalpnlpercentage.toFixed(2)}%)`;
//                     summary.querySelector('.overall-gain-loss').className = `text-lg font-bold ${updatedTotalHolding.totalprofitandloss >= 0 ? 'text-green-600' : 'text-red-600'} overall-gain-loss`;
//                     summary.querySelector('.today-gain-loss').textContent = updatedTotalHolding.today_profit_and_loss === 0
//                         ? '₹0 (0%)'
//                         : `${updatedTotalHolding.today_profit_and_loss >= 0 ? '+' : '-'}₹${Math.abs(updatedTotalHolding.today_profit_and_loss).toLocaleString()} (${((Math.abs(updatedTotalHolding.today_profit_and_loss) / (updatedTotalHolding.totalinvvalue || 1)) * 100).toFixed(2)}%)`;
//                     summary.querySelector('.today-gain-loss').className = `text-lg font-bold ${updatedTotalHolding.today_profit_and_loss >= 0 ? 'text-green-600' : 'text-red-600'} today-gain-loss`;
//                     console.log('DOM Updated for Summary:', updatedTotalHolding);
//                 }
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to fetch portfolio data');
//             }
//         } catch (err) {
//             setError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
//             console.error('Fetch Error:', err);
//         } finally {
//             if (isInitialFetch) setLoading(false);
//         }
//     };
//
//     // Update holding with new LTP and recalculate derived fields
//     const updateHoldingWithLTP = (holding, newLTP) => {
//         const updatedHolding = {
//             ...holding,
//             ltp: newLTP,
//             marketValue: newLTP * holding.quantity,
//             profitandloss: (newLTP - holding.averageprice) * holding.quantity,
//             pnlpercentage: holding.averageprice !== 0 ? ((newLTP - holding.averageprice) / holding.averageprice) * 100 : 0,
//             today_pnl: calculateTodaysPNL(newLTP, holding.close || holding.ltp, holding.quantity), // Fallback to ltp if close is missing
//         };
//         console.log('Updated Holding with LTP:', updatedHolding);
//         return updatedHolding;
//     };
//
//     // Calculate today's P&L based on LTP and previous close
//     const calculateTodaysPNL = (ltp, close, quantity) => {
//         const todayPNL = (ltp - close) * quantity;
//         console.log(`Today’s P&L Calculation - LTP: ${ltp}, Close: ${close}, Quantity: ${quantity}, Result: ${todayPNL}`);
//         return todayPNL;
//     };
//
//     // Update total holdings based on updated individual holdings
//     const updateTotalHoldings = (holdings) => {
//         const totalholding = {
//             totalholdingvalue: 0,
//             totalinvvalue: totalHoldingRef.current.totalinvvalue || 0,
//             totalprofitandloss: 0,
//             totalpnlpercentage: 0,
//             today_profit_and_loss: 0,
//         };
//
//         holdings.forEach(holding => {
//             totalholding.totalholdingvalue += holding.marketValue || (holding.ltp * holding.quantity);
//             totalholding.totalprofitandloss += holding.profitandloss || 0;
//             totalholding.today_profit_and_loss += holding.today_pnl || 0;
//         });
//
//         totalholding.totalpnlpercentage = totalholding.totalinvvalue !== 0
//             ? (totalholding.totalprofitandloss / totalholding.totalinvvalue) * 100
//             : 0;
//
//         console.log('Updated Total Holdings:', totalholding);
//         return totalholding;
//     };
//
//     // Memoized holdings for rendering stability
//     const memoizedHoldings = useMemo(() => portfolioData.holdings, [portfolioData.holdings]);
//
//     // Set up polling with setInterval
//     useEffect(() => {
//         fetchPortfolioData(true); // Initial fetch with loading state
//
//         const intervalId = setInterval(() => {
//             fetchPortfolioData(false); // Subsequent fetches without loading state
//         }, 500); // Fetch every 10 seconds
//
//         return () => {
//             clearInterval(intervalId);
//             console.log('Polling interval cleared');
//         };
//     }, []);
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-full">
//                     <p>Loading portfolio...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 {error && (
//                     <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//
//                 {/* Portfolio Summary */}
//                 <div className="mb-6 portfolio-summary">
//                     <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-medium text-gray-800">Portfolio Summary</h3>
//                         <div className="flex space-x-2">
//                             <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
//                                 <option>Last 7 days</option>
//                                 <option>Last 30 days</option>
//                                 <option>Last 90 days</option>
//                                 <option>Year to date</option>
//                                 <option>All time</option>
//                             </select>
//                         </div>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                             <p className="text-gray-500">Invested Amount</p>
//                             <p className="text-lg font-bold text-gray-900">₹{portfolioData.totalholding.totalinvvalue.toLocaleString()}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Current Value</p>
//                             <p className="text-lg font-bold text-gray-900 current-value">₹{portfolioData.totalholding.totalholdingvalue.toLocaleString()}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Overall G/L</p>
//                             <p className={`text-lg font-bold ${portfolioData.totalholding.totalprofitandloss < 0 ? 'text-red-600' : 'text-green-600'} overall-gain-loss`}>
//                                 {portfolioData.totalholding.totalprofitandloss < 0 ? '-' : '+'}₹
//                                 {Math.abs(portfolioData.totalholding.totalprofitandloss).toLocaleString()}
//                                 ({portfolioData.totalholding.totalpnlpercentage.toFixed(2)}%)
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">
//                                 Today’s G/L
//                             </p>
//                             <p className={`text-lg font-bold ${isNaN(portfolioData.totalholding.today_profit_and_loss) ? 'text-black-600' : (portfolioData.totalholding.today_profit_and_loss < 0 ? 'text-red-600' : 'text-green-600')} today-gain-loss`}>
//                                 {isNaN(portfolioData.totalholding.today_profit_and_loss)
//                                     ? 'Calculating...'
//                                     : portfolioData.totalholding.today_profit_and_loss === 0
//                                         ? '₹0 (0%)'
//                                         : `${portfolioData.totalholding.today_profit_and_loss < 0 ? '-' : '+'}₹${Math.abs(portfolioData.totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(portfolioData.totalholding.today_profit_and_loss) / (portfolioData.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
//                             </p>
//
//                         </div>
//
//                     </div>
//                 </div>
//
//                 {/* Holdings Table */}
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="p-4 flex justify-between items-center border-b border-gray-300">
//                         <h3 className="text-lg font-medium text-gray-800">Holdings <span className="text-gray-500">({portfolioData.holdings.length})</span></h3>
//                         <div className="flex space-x-2">
//                             <input
//                                 type="text"
//                                 placeholder="Search for stock or company"
//                                 className="bg-gray-100 text-gray-800 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                             />
//                             {/*<button className="bg-gray-100 p-2 rounded-md border border-gray-300 hover:bg-gray-200 text-gray-600">*/}
//                             {/*    <span className="text-gray-600">↓</span>*/}
//                             {/*</button>*/}
//                             {/*<button className="bg-gray-100 p-2 rounded-md border border-gray-300 hover:bg-gray-200 text-gray-600">*/}
//                             {/*    <span className="text-gray-600">🔒</span>*/}
//                             {/*</button>*/}
//                             {/*<button className="bg-gray-100 p-2 rounded-md border border-gray-300 hover:bg-gray-200 text-gray-600">*/}
//                             {/*    <span className="text-gray-600">🏠</span>*/}
//                             {/*</button>*/}
//                             {/*<button className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700">SELECT & EXIT</button>*/}
//                         </div>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-100">
//                             <tr>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Stock Name ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Quantity ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Avg. Price ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">LTP ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Inv Amt ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Mkt Val ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Overall G/L ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Day’s G/L ▼</th>
//                             </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                             {memoizedHoldings.map((holding, index) => (
//                                 <tr key={index} data-symbol={holding.tradingsymbol}>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{holding.tradingsymbol}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{holding.quantity}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">₹{holding.averageprice.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 ltp">₹{holding.ltp.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">₹{(holding.averageprice * holding.quantity).toLocaleString()}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 market-value">₹{(holding.ltp * holding.quantity).toLocaleString()}</td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${holding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'} gain-loss`}>
//                                         {holding.profitandloss >= 0 ? '+' : '-'}₹
//                                         {Math.abs(holding.profitandloss).toLocaleString()}
//                                         ({holding.pnlpercentage.toFixed(2)}%)
//                                     </td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${isNaN(holding.today_pnl) ? 'text-gray-600' : (holding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600')} today-pnl`}>
//                                         {isNaN(holding.today_pnl)
//                                             ? 'Calculating...'
//                                             : `${holding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(holding.today_pnl).toLocaleString()}`}
//                                     </td>
//
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Portfolio;







// import DashboardLayout from '../../components/DashboardLayout';
// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { useLocation } from 'react-router-dom';
// import api from '../../utils/api';
// import { getAuthToken } from '../../utils/auth';
//
// const Portfolio = () => {
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
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const holdingsRef = useRef(new Map());
//     const totalHoldingRef = useRef({});
//     const updateCounter = useRef(0);
//     const location = useLocation();
//
//     const fetchPortfolioData = async (isInitialFetch = false) => {
//         try {
//             if (isInitialFetch) setLoading(true);
//             const token = getAuthToken();
//             console.log('Fetching Portfolio Data - Token:', token);
//
//             const response = await api.get('/user/angel/all-holding', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             console.log('API Response:', response);
//             console.log('Decrypted Data:', response.data);
//
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
//                 console.log('All Holding Data:', allHoldingData);
//                 console.log('Holdings:', holdings);
//                 console.log('Total Holding:', totalholding);
//
//                 updateCounter.current += 1;
//                 console.log(`Portfolio Update #${updateCounter.current}`);
//
//                 if (isInitialFetch) {
//                     setPortfolioData({ holdings, totalholding }); // Fixed typo: Holdings -> holdings
//                     holdingsRef.current = new Map(holdings.map(holding => [holding.tradingsymbol, { ...holding }]));
//                     totalHoldingRef.current = { ...totalholding };
//                 }
//
//                 holdings.forEach(holding => {
//                     const symbol = holding.tradingsymbol;
//                     const newLTP = holding.ltp;
//                     const currentHolding = holdingsRef.current.get(symbol);
//
//                     if (currentHolding) {
//                         const updatedHolding = updateHoldingWithLTP(currentHolding, newLTP);
//                         holdingsRef.current.set(symbol, updatedHolding);
//
//                         const row = document.querySelector(`tr[data-symbol="${symbol}"]`);
//                         if (row) {
//                             row.querySelector('.ltp').textContent = `₹${newLTP.toFixed(2)}`;
//                             row.querySelector('.market-value').textContent = `₹${updatedHolding.marketValue.toLocaleString()}`;
//                             row.querySelector('.gain-loss').textContent = `${updatedHolding.profitandloss >= 0 ? '+' : '-'}₹${Math.abs(updatedHolding.profitandloss).toLocaleString()} (${updatedHolding.pnlpercentage.toFixed(2)}%)`;
//                             row.querySelector('.today-pnl').textContent = `${updatedHolding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(updatedHolding.today_pnl).toLocaleString()}`;
//                             row.querySelector('.gain-loss').className = `px-4 py-3 whitespace-nowrap text-sm ${updatedHolding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'} gain-loss`;
//                             row.querySelector('.today-pnl').className = `px-4 py-3 whitespace-nowrap text-sm ${updatedHolding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600'} today-pnl`;
//                             console.log(`DOM Updated for ${symbol}:`, updatedHolding);
//                         }
//                     }
//                 });
//
//                 const updatedTotalHolding = updateTotalHoldings(Array.from(holdingsRef.current.values()));
//                 totalHoldingRef.current = updatedTotalHolding;
//
//                 const summary = document.querySelector('.portfolio-summary');
//                 if (summary) {
//                     summary.querySelector('.current-value').textContent = `₹${updatedTotalHolding.totalholdingvalue.toLocaleString()}`;
//                     summary.querySelector('.overall-gain-loss').textContent = `${updatedTotalHolding.totalprofitandloss >= 0 ? '+' : '-'}₹${Math.abs(updatedTotalHolding.totalprofitandloss).toLocaleString()} (${updatedTotalHolding.totalpnlpercentage.toFixed(2)}%)`;
//                     summary.querySelector('.overall-gain-loss').className = `text-lg font-bold ${updatedTotalHolding.totalprofitandloss >= 0 ? 'text-green-600' : 'text-red-600'} overall-gain-loss`;
//                     summary.querySelector('.today-gain-loss').textContent = updatedTotalHolding.today_profit_and_loss === 0
//                         ? '₹0 (0%)'
//                         : `${updatedTotalHolding.today_profit_and_loss >= 0 ? '+' : '-'}₹${Math.abs(updatedTotalHolding.today_profit_and_loss).toLocaleString()} (${((Math.abs(updatedTotalHolding.today_profit_and_loss) / (updatedTotalHolding.totalinvvalue || 1)) * 100).toFixed(2)}%)`;
//                     summary.querySelector('.today-gain-loss').className = `text-lg font-bold ${updatedTotalHolding.today_profit_and_loss >= 0 ? 'text-green-600' : 'text-red-600'} today-gain-loss`;
//                     console.log('DOM Updated for Summary:', updatedTotalHolding);
//                 }
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to fetch portfolio data');
//             }
//         } catch (err) {
//             setError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
//             console.error('Fetch Error:', err);
//         } finally {
//             if (isInitialFetch) setLoading(false);
//         }
//     };
//
//     const updateHoldingWithLTP = (holding, newLTP) => {
//         const updatedHolding = {
//             ...holding,
//             ltp: newLTP,
//             marketValue: newLTP * holding.quantity,
//             profitandloss: (newLTP - holding.averageprice) * holding.quantity,
//             pnlpercentage: holding.averageprice !== 0 ? ((newLTP - holding.averageprice) / holding.averageprice) * 100 : 0,
//             today_pnl: calculateTodaysPNL(newLTP, holding.close || holding.ltp, holding.quantity),
//         };
//         console.log('Updated Holding with LTP:', updatedHolding);
//         return updatedHolding;
//     };
//
//     const calculateTodaysPNL = (ltp, close, quantity) => {
//         const todayPNL = (ltp - close) * quantity;
//         console.log(`Today’s P&L Calculation - LTP: ${ltp}, Close: ${close}, Quantity: ${quantity}, Result: ${todayPNL}`);
//         return todayPNL;
//     };
//
//     const updateTotalHoldings = (holdings) => {
//         const totalholding = {
//             totalholdingvalue: 0,
//             totalinvvalue: totalHoldingRef.current.totalinvvalue || 0,
//             totalprofitandloss: 0,
//             totalpnlpercentage: 0,
//             today_profit_and_loss: 0,
//         };
//
//         holdings.forEach(holding => {
//             totalholding.totalholdingvalue += holding.marketValue || (holding.ltp * holding.quantity);
//             totalholding.totalprofitandloss += holding.profitandloss || 0;
//             totalholding.today_profit_and_loss += holding.today_pnl || 0;
//         });
//
//         totalholding.totalpnlpercentage = totalholding.totalinvvalue !== 0
//             ? (totalholding.totalprofitandloss / totalholding.totalinvvalue) * 100
//             : 0;
//
//         console.log('Updated Total Holdings:', totalholding);
//         return totalholding;
//     };
//
//     const memoizedHoldings = useMemo(() => portfolioData.holdings, [portfolioData.holdings]);
//
//     useEffect(() => {
//         if (location.pathname === '/portfolio') {
//             fetchPortfolioData(true);
//             const intervalId = setInterval(() => {
//                 fetchPortfolioData(false);
//             }, 2500);
//             return () => {
//                 clearInterval(intervalId);
//                 console.log('Polling interval cleared for Portfolio page');
//             };
//         }
//     }, [location.pathname]);
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-full">
//                     <p>Loading portfolio...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 {error && (
//                     <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//
//                 <div className="mb-6 portfolio-summary">
//                     <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-medium text-gray-800">Portfolio Summary</h3>
//                         {/*<div className="flex space-x-2">*/}
//                         {/*    <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">*/}
//                         {/*        <option>Last 7 days</option>*/}
//                         {/*        <option>Last 30 days</option>*/}
//                         {/*        <option>Last 90 days</option>*/}
//                         {/*        <option>Year to date</option>*/}
//                         {/*        <option>All time</option>*/}
//                         {/*    </select>*/}
//                         {/*</div>*/}
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                             <p className="text-gray-500">Invested Amount</p>
//                             <p className="text-lg font-bold text-gray-900">₹{portfolioData.totalholding.totalinvvalue.toLocaleString()}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Current Value</p>
//                             <p className="text-lg font-bold text-gray-900 current-value">₹{portfolioData.totalholding.totalholdingvalue.toLocaleString()}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Overall G/L</p>
//                             <p className={`text-lg font-bold ${portfolioData.totalholding.totalprofitandloss < 0 ? 'text-red-600' : 'text-green-600'} overall-gain-loss`}>
//                                 {portfolioData.totalholding.totalprofitandloss < 0 ? '-' : '+'}₹
//                                 {Math.abs(portfolioData.totalholding.totalprofitandloss).toLocaleString()}
//                                 ({portfolioData.totalholding.totalpnlpercentage.toFixed(2)}%)
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Today’s G/L</p>
//                             <p className={`text-lg font-bold ${isNaN(portfolioData.totalholding.today_profit_and_loss) ? 'text-black-600' : (portfolioData.totalholding.today_profit_and_loss < 0 ? 'text-red-600' : 'text-green-600')} today-gain-loss`}>
//                                 {isNaN(portfolioData.totalholding.today_profit_and_loss)
//                                     ? 'Calculating...'
//                                     : portfolioData.totalholding.today_profit_and_loss === 0
//                                         ? '₹0 (0%)'
//                                         : `${portfolioData.totalholding.today_profit_and_loss < 0 ? '-' : '+'}₹${Math.abs(portfolioData.totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(portfolioData.totalholding.today_profit_and_loss) / (portfolioData.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="p-4 flex justify-between items-center border-b border-gray-300">
//                         <h3 className="text-lg font-medium text-gray-800">Holdings <span className="text-gray-500">({portfolioData.holdings.length})</span></h3>
//                         <div className="flex space-x-2">
//                             <input
//                                 type="text"
//                                 placeholder="Search for stock or company"
//                                 className="bg-gray-100 text-gray-800 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                             />
//                         </div>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-100">
//                             <tr>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Stock Name ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Quantity ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Avg. Price ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">LTP ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Inv Amt ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Mkt Val ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Overall G/L ▼</th>
//                                 <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">Day’s G/L ▼</th>
//                             </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                             {memoizedHoldings.map((holding, index) => (
//                                 <tr key={index} data-symbol={holding.tradingsymbol}>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{holding.tradingsymbol}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{holding.quantity}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">₹{holding.averageprice.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 ltp">₹{holding.ltp.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">₹{(holding.averageprice * holding.quantity).toLocaleString()}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 market-value">₹{(holding.ltp * holding.quantity).toLocaleString()}</td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${holding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'} gain-loss`}>
//                                         {holding.profitandloss >= 0 ? '+' : '-'}₹
//                                         {Math.abs(holding.profitandloss).toLocaleString()}
//                                         ({holding.pnlpercentage.toFixed(2)}%)
//                                     </td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${isNaN(holding.today_pnl) ? 'text-gray-600' : (holding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600')} today-pnl`}>
//                                         {isNaN(holding.today_pnl)
//                                             ? 'Calculating...'
//                                             : `${holding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(holding.today_pnl).toLocaleString()}`}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Portfolio;






// import DashboardLayout from '../../components/DashboardLayout';
// import React, { useState, useEffect, useRef, useMemo } from 'react';
// import { useLocation } from 'react-router-dom';
// import api from '../../utils/api';
// import { getAuthToken } from '../../utils/auth';
// import {parseApiResponse} from "../../utils/crypto.js";
//
// const Portfolio = () => {
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
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortConfig, setSortConfig] = useState({ key: null, direction: 'desc' });
//     const holdingsRef = useRef(new Map());
//     const totalHoldingRef = useRef({});
//     const updateCounter = useRef(0);
//     const location = useLocation();
//
//     // const fetchPortfolioData = async (isInitialFetch = false) => {
//     //     try {
//     //         if (isInitialFetch) setLoading(true);
//     //         const token = getAuthToken();
//     //         const response = await api.get('/user/angel/all-holding', {
//     //             headers: { Authorization: `Bearer ${token}` },
//     //         });
//     //
//     //         console.log("Response",response);
//     //         if (response.status === 200 && response.data.data?.status === "200") {
//     //             const allHoldingData = response.data.data.all_holding.data;
//     //             const holdings = allHoldingData.holdings || [];
//     //             const totalholding = allHoldingData.totalholding || {
//     //                 totalholdingvalue: 0,
//     //                 totalinvvalue: 0,
//     //                 totalprofitandloss: 0,
//     //                 totalpnlpercentage: 0,
//     //                 today_profit_and_loss: allHoldingData.today_profit_and_loss || 0,
//     //             };
//     //
//     //             updateCounter.current += 1;
//     //
//     //             if (isInitialFetch) {
//     //                 setPortfolioData({ holdings, totalholding });
//     //                 holdingsRef.current = new Map(holdings.map(holding => [holding.tradingsymbol, { ...holding }]));
//     //                 totalHoldingRef.current = { ...totalholding };
//     //             }
//     //
//     //             holdings.forEach(holding => {
//     //                 const symbol = holding.tradingsymbol;
//     //                 const newLTP = holding.ltp;
//     //                 const currentHolding = holdingsRef.current.get(symbol);
//     //
//     //                 if (currentHolding) {
//     //                     const updatedHolding = updateHoldingWithLTP(currentHolding, newLTP);
//     //                     holdingsRef.current.set(symbol, updatedHolding);
//     //
//     //                     const row = document.querySelector(`tr[data-symbol="${symbol}"]`);
//     //                     if (row) {
//     //                         row.querySelector('.ltp').textContent = `₹${newLTP.toFixed(2)}`;
//     //                         row.querySelector('.market-value').textContent = `₹${updatedHolding.marketValue.toLocaleString()}`;
//     //                         row.querySelector('.gain-loss').textContent = `${updatedHolding.profitandloss >= 0 ? '+' : '-'}₹${Math.abs(updatedHolding.profitandloss).toLocaleString()} (${updatedHolding.pnlpercentage.toFixed(2)}%)`;
//     //                         row.querySelector('.today-pnl').textContent = `${updatedHolding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(updatedHolding.today_pnl).toLocaleString()}`;
//     //                         row.querySelector('.gain-loss').className = `px-4 py-3 whitespace-nowrap text-sm ${updatedHolding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'} gain-loss`;
//     //                         row.querySelector('.today-pnl').className = `px-4 py-3 whitespace-nowrap text-sm ${updatedHolding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600'} today-pnl`;
//     //                     }
//     //                 }
//     //             });
//     //
//     //             const updatedTotalHolding = updateTotalHoldings(Array.from(holdingsRef.current.values()));
//     //             totalHoldingRef.current = updatedTotalHolding;
//     //
//     //             const summary = document.querySelector('.portfolio-summary');
//     //             if (summary) {
//     //                 summary.querySelector('.current-value').textContent = `₹${updatedTotalHolding.totalholdingvalue.toLocaleString()}`;
//     //                 summary.querySelector('.overall-gain-loss').textContent = `${updatedTotalHolding.totalprofitandloss >= 0 ? '+' : '-'}₹${Math.abs(updatedTotalHolding.totalprofitandloss).toLocaleString()} (${updatedTotalHolding.totalpnlpercentage.toFixed(2)}%)`;
//     //                 summary.querySelector('.overall-gain-loss').className = `text-lg font-bold ${updatedTotalHolding.totalprofitandloss >= 0 ? 'text-green-600' : 'text-red-600'} overall-gain-loss`;
//     //                 summary.querySelector('.today-gain-loss').textContent = updatedTotalHolding.today_profit_and_loss === 0
//     //                     ? '₹0 (0%)'
//     //                     : `${updatedTotalHolding.today_profit_and_loss >= 0 ? '+' : '-'}₹${Math.abs(updatedTotalHolding.today_profit_and_loss).toLocaleString()} (${((Math.abs(updatedTotalHolding.today_profit_and_loss) / (updatedTotalHolding.totalinvvalue || 1)) * 100).toFixed(2)}%)`;
//     //                 summary.querySelector('.today-gain-loss').className = `text-lg font-bold ${updatedTotalHolding.today_profit_and_loss >= 0 ? 'text-green-600' : 'text-red-600'} today-gain-loss`;
//     //             }
//     //         }
//     //     } catch (err) {
//     //         setError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
//     //         console.error('Fetch Error:', err);
//     //     } finally {
//     //         if (isInitialFetch) setLoading(false);
//     //     }
//     // };
//
//
//     const fetchPortfolioData = async (isInitialFetch = false) => {
//         try {
//             if (isInitialFetch) setLoading(true);
//             const token = getAuthToken();
//             const response = await api.get('/user/angel/all-holding', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             console.log("API Response:", response);
//
//             let data = response.data;
//             if (typeof data === 'string') {
//                 data = parseApiResponse(data);
//             }
//
//             if (response.status === 200 && data.data?.status === "200") {
//                 const allHoldingData = data.data.all_holding.data || {};
//                 const holdings = allHoldingData.holdings || [];
//                 const totalholding = allHoldingData.totalholding || {
//                     totalholdingvalue: 0,
//                     totalinvvalue: 0,
//                     totalprofitandloss: 0,
//                     totalpnlpercentage: 0,
//                     today_profit_and_loss: allHoldingData.today_profit_and_loss || 0,
//                 };
//
//                 // Check for rate limit message
//                 if (data.data.message.includes("Rate limit exceeded")) {
//                     setError("Rate limit exceeded. Showing last known data.");
//                     return; // Keep existing portfolioData
//                 }
//
//                 updateCounter.current += 1;
//
//                 setPortfolioData({ holdings, totalholding });
//                 if (isInitialFetch) {
//                     holdingsRef.current = new Map(holdings.map(holding => [holding.tradingsymbol, { ...holding }]));
//                     totalHoldingRef.current = { ...totalholding };
//                 }
//             } else {
//                 throw new Error(data.data?.message || 'Failed to fetch portfolio data');
//             }
//         } catch (err) {
//             setError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
//             console.error('Fetch Error:', err);
//         } finally {
//             if (isInitialFetch) setLoading(false);
//         }
//     };
//
//
//
//
//     const updateHoldingWithLTP = (holding, newLTP) => {
//         const updatedHolding = {
//             ...holding,
//             ltp: newLTP,
//             marketValue: newLTP * holding.quantity,
//             profitandloss: (newLTP - holding.averageprice) * holding.quantity,
//             pnlpercentage: holding.averageprice !== 0 ? ((newLTP - holding.averageprice) / holding.averageprice) * 100 : 0,
//             today_pnl: calculateTodaysPNL(newLTP, holding.close || holding.ltp, holding.quantity),
//         };
//         return updatedHolding;
//     };
//
//     const calculateTodaysPNL = (ltp, close, quantity) => {
//         return (ltp - close) * quantity;
//     };
//
//     const updateTotalHoldings = (holdings) => {
//         const totalholding = {
//             totalholdingvalue: 0,
//             totalinvvalue: totalHoldingRef.current.totalinvvalue || 0,
//             totalprofitandloss: 0,
//             totalpnlpercentage: 0,
//             today_profit_and_loss: 0,
//         };
//
//         holdings.forEach(holding => {
//             totalholding.totalholdingvalue += holding.marketValue || (holding.ltp * holding.quantity);
//             totalholding.totalprofitandloss += holding.profitandloss || 0;
//             totalholding.today_profit_and_loss += holding.today_pnl || 0;
//         });
//
//         totalholding.totalpnlpercentage = totalholding.totalinvvalue !== 0
//             ? (totalholding.totalprofitandloss / totalholding.totalinvvalue) * 100
//             : 0;
//
//         return totalholding;
//     };
//
//     // Filter and sort holdings
//     const filteredAndSortedHoldings = useMemo(() => {
//         let result = [...portfolioData.holdings];
//
//         // Search filter
//         if (searchTerm) {
//             result = result.filter(holding =>
//                 holding.tradingsymbol.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//
//         // Sorting
//         if (sortConfig.key) {
//             result.sort((a, b) => {
//                 let aValue, bValue;
//
//                 switch(sortConfig.key) {
//                     case 'tradingsymbol':
//                         aValue = a.tradingsymbol;
//                         bValue = b.tradingsymbol;
//                         break;
//                     case 'quantity':
//                         aValue = a.quantity;
//                         bValue = b.quantity;
//                         break;
//                     case 'averageprice':
//                         aValue = a.averageprice;
//                         bValue = b.averageprice;
//                         break;
//                     case 'ltp':
//                         aValue = a.ltp;
//                         bValue = b.ltp;
//                         break;
//                     case 'invAmt':
//                         aValue = a.averageprice * a.quantity;
//                         bValue = b.averageprice * b.quantity;
//                         break;
//                     case 'marketValue':
//                         aValue = a.ltp * a.quantity;
//                         bValue = b.ltp * b.quantity;
//                         break;
//                     case 'profitandloss':
//                         aValue = a.profitandloss;
//                         bValue = b.profitandloss;
//                         break;
//                     case 'today_pnl':
//                         aValue = a.today_pnl || 0;
//                         bValue = b.today_pnl || 0;
//                         break;
//                     default:
//                         return 0;
//                 }
//
//                 if (typeof aValue === 'string') {
//                     return sortConfig.direction === 'asc'
//                         ? aValue.localeCompare(bValue)
//                         : bValue.localeCompare(aValue);
//                 }
//                 return sortConfig.direction === 'asc'
//                     ? aValue - bValue
//                     : bValue - aValue;
//             });
//         }
//
//         return result;
//     }, [portfolioData.holdings, searchTerm, sortConfig]);
//
//     const handleSort = (key) => {
//         setSortConfig(prev => ({
//             key,
//             direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
//         }));
//     };
//
//     useEffect(() => {
//         if (location.pathname === '/portfolio') {
//             fetchPortfolioData(true);
//             const intervalId = setInterval(() => {
//                 fetchPortfolioData(false);
//             }, 2500);
//             return () => clearInterval(intervalId);
//         }
//     }, [location.pathname]);
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-full">
//                     <p>Loading portfolio...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 {error && (
//                     <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//
//                 <div className="mb-6 portfolio-summary">
//                     <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-medium text-gray-800">Portfolio Summary</h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                             <p className="text-gray-500">Invested Amount</p>
//                             <p className="text-lg font-bold text-gray-900">
//                                 ₹{Number(portfolioData.totalholding.totalinvvalue).toLocaleString()}
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Current Value</p>
//                             <p className="text-lg font-bold text-gray-900">
//                                 ₹{Number(portfolioData.totalholding.totalholdingvalue).toLocaleString()}
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Overall G/L</p>
//                             <p className={`text-lg font-bold ${portfolioData.totalholding.totalprofitandloss < 0 ? 'text-red-600' : 'text-green-600'}`}>
//                                 {portfolioData.totalholding.totalprofitandloss < 0 ? '-' : '+'}₹
//                                 {Math.abs(portfolioData.totalholding.totalprofitandloss).toLocaleString()}
//                                 ({portfolioData.totalholding.totalpnlpercentage.toFixed(2)}%)
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Today’s G/L</p>
//                             <p className={`text-lg font-bold ${isNaN(portfolioData.totalholding.today_profit_and_loss) ? 'text-gray-600' : (portfolioData.totalholding.today_profit_and_loss < 0 ? 'text-red-600' : 'text-green-600')}`}>
//                                 {isNaN(portfolioData.totalholding.today_profit_and_loss)
//                                     ? 'Calculating...'
//                                     : portfolioData.totalholding.today_profit_and_loss === 0
//                                         ? '₹0 (0%)'
//                                         : `${portfolioData.totalholding.today_profit_and_loss < 0 ? '-' : '+'}₹${Math.abs(portfolioData.totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(portfolioData.totalholding.today_profit_and_loss) / (portfolioData.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="p-4 flex justify-between items-center border-b border-gray-300">
//                         <h3 className="text-lg font-medium text-gray-800">
//                             Holdings <span className="text-gray-500">({filteredAndSortedHoldings.length})</span>
//                         </h3>
//                         <div className="flex space-x-2">
//                             <input
//                                 type="text"
//                                 placeholder="Search for stock or company"
//                                 className="bg-gray-100 text-gray-800 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-100">
//                             <tr>
//                                 <th
//                                     onClick={() => handleSort('tradingsymbol')}
//                                     className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
//                                 >
//                                     Stock Name {sortConfig.key === 'tradingsymbol' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('quantity')}
//                                     className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
//                                 >
//                                     Quantity {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('averageprice')}
//                                     className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
//                                 >
//                                     Avg. Price {sortConfig.key === 'averageprice' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('ltp')}
//                                     className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
//                                 >
//                                     LTP {sortConfig.key === 'ltp' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('invAmt')}
//                                     className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
//                                 >
//                                     Inv Amt {sortConfig.key === 'invAmt' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('marketValue')}
//                                     className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
//                                 >
//                                     Mkt Val {sortConfig.key === 'marketValue' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('profitandloss')}
//                                     className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
//                                 >
//                                     Overall G/L {sortConfig.key === 'profitandloss' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('today_pnl')}
//                                     className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer"
//                                 >
//                                     Day’s G/L {sortConfig.key === 'today_pnl' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                             </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                             {filteredAndSortedHoldings.map((holding, index) => (
//                                 <tr key={index} data-symbol={holding.tradingsymbol}>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
//                                         {holding.tradingsymbol}
//                                     </td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
//                                         {holding.quantity}
//                                     </td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
//                                         ₹{Number(holding.averageprice).toFixed(2)}
//                                     </td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
//                                         ₹{Number(holding.ltp).toFixed(2)}
//                                     </td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
//                                         ₹{(holding.averageprice * holding.quantity).toLocaleString()}
//                                     </td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">
//                                         ₹{(holding.ltp * holding.quantity).toLocaleString()}
//                                     </td>
//                                     <td className={`px 솝 py-3 whitespace-nowrap text-sm ${holding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                                         {holding.profitandloss >= 0 ? '+' : '-'}₹
//                                         {Math.abs(holding.profitandloss).toLocaleString()}
//                                         ({holding.pnlpercentage.toFixed(2)}%)
//                                     </td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${isNaN(holding.today_pnl) ? 'text-gray-600' : (holding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600')}`}>
//                                         {isNaN(holding.today_pnl)
//                                             ? 'Calculating...'
//                                             : `${holding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(holding.today_pnl).toLocaleString()}`}
//                                     </td>
//                                 </tr>
//                             ))}
//                             {filteredAndSortedHoldings.length === 0 && (
//                                 <tr>
//                                     <td colSpan="8" className="px-4 py-3 text-center text-gray-500">
//                                         No holdings found.
//                                     </td>
//                                 </tr>
//                             )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
//
// export default Portfolio;


//
//
// import DashboardLayout from '../../components/DashboardLayout';
// import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
// import { useLocation } from 'react-router-dom';
// import api from '../../utils/api';
// import { getAuthToken } from '../../utils/auth';
// import { parseApiResponse } from '../../utils/crypto.js';
// import { ThemeContext } from '../../context/ThemeContext';
//
// const Portfolio = () => {
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
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [searchTerm, setSearchTerm] = useState('');
//     const [sortConfig, setSortConfig] = useState({ key: 'tradingsymbol', direction: 'asc' }); // Default sort by tradingsymbol ascending
//     const holdingsRef = useRef(new Map());
//     const totalHoldingRef = useRef({});
//     const updateCounter = useRef(0);
//     const location = useLocation();
//     const { theme } = useContext(ThemeContext);
//
//     const fetchPortfolioData = async (isInitialFetch = false) => {
//         try {
//             if (isInitialFetch) setLoading(true);
//             const token = getAuthToken();
//             const response = await api.get('/user/angel/all-holding', {
//                 headers: { Authorization: `Bearer ${token}` },
//             });
//
//             console.log("API Response:", response);
//
//             let data = response.data;
//             if (typeof data === 'string') {
//                 data = parseApiResponse(data);
//             }
//
//             if (response.status === 200 && data.data?.status === "200") {
//                 const allHoldingData = data.data.all_holding.data || {};
//                 let holdings = allHoldingData.holdings || [];
//                 const totalholding = allHoldingData.totalholding || {
//                     totalholdingvalue: 0,
//                     totalinvvalue: 0,
//                     totalprofitandloss: 0,
//                     totalpnlpercentage: 0,
//                     today_profit_and_loss: allHoldingData.today_profit_and_loss || 0,
//                 };
//
//                 // Check for rate limit message
//                 if (data.data.message.includes("Rate limit exceeded")) {
//                     setError("Rate limit exceeded. Showing last known data.");
//                     return; // Keep existing portfolioData
//                 }
//
//                 // Sort holdings alphabetically by tradingsymbol (A-Z)
//                 holdings = holdings.sort((a, b) => a.tradingsymbol.localeCompare(b.tradingsymbol));
//
//                 updateCounter.current += 1;
//
//                 setPortfolioData({ holdings, totalholding });
//                 if (isInitialFetch) {
//                     holdingsRef.current = new Map(holdings.map(holding => [holding.tradingsymbol, { ...holding }]));
//                     totalHoldingRef.current = { ...totalholding };
//                 }
//             } else {
//                 throw new Error(data.data?.message || 'Failed to fetch portfolio data');
//             }
//         } catch (err) {
//             setError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
//             console.error('Fetch Error:', err);
//         } finally {
//             if (isInitialFetch) setLoading(false);
//         }
//     };
//
//     const updateHoldingWithLTP = (holding, newLTP) => {
//         const updatedHolding = {
//             ...holding,
//             ltp: newLTP,
//             marketValue: newLTP * holding.quantity,
//             profitandloss: (newLTP - holding.averageprice) * holding.quantity,
//             pnlpercentage: holding.averageprice !== 0 ? ((newLTP - holding.averageprice) / holding.averageprice) * 100 : 0,
//             today_pnl: calculateTodaysPNL(newLTP, holding.close || holding.ltp, holding.quantity),
//         };
//         return updatedHolding;
//     };
//
//     const calculateTodaysPNL = (ltp, close, quantity) => {
//         return (ltp - close) * quantity;
//     };
//
//     const updateTotalHoldings = (holdings) => {
//         const totalholding = {
//             totalholdingvalue: 0,
//             totalinvvalue: totalHoldingRef.current.totalinvvalue || 0,
//             totalprofitandloss: 0,
//             totalpnlpercentage: 0,
//             today_profit_and_loss: 0,
//         };
//
//         holdings.forEach(holding => {
//             totalholding.totalholdingvalue += holding.marketValue || (holding.ltp * holding.quantity);
//             totalholding.totalprofitandloss += holding.profitandloss || 0;
//             totalholding.today_profit_and_loss += holding.today_pnl || 0;
//         });
//
//         totalholding.totalpnlpercentage = totalholding.totalinvvalue !== 0
//             ? (totalholding.totalprofitandloss / totalholding.totalinvvalue) * 100
//             : 0;
//
//         return totalholding;
//     };
//
//     // Filter and sort holdings
//     const filteredAndSortedHoldings = useMemo(() => {
//         let result = [...portfolioData.holdings];
//
//         // Search filter
//         if (searchTerm) {
//             result = result.filter(holding =>
//                 holding.tradingsymbol.toLowerCase().includes(searchTerm.toLowerCase())
//             );
//         }
//
//         // Sorting
//         if (sortConfig.key) {
//             result.sort((a, b) => {
//                 let aValue, bValue;
//
//                 switch (sortConfig.key) {
//                     case 'tradingsymbol':
//                         aValue = a.tradingsymbol;
//                         bValue = b.tradingsymbol;
//                         break;
//                     case 'quantity':
//                         aValue = a.quantity;
//                         bValue = b.quantity;
//                         break;
//                     case 'averageprice':
//                         aValue = a.averageprice;
//                         bValue = b.averageprice;
//                         break;
//                     case 'ltp':
//                         aValue = a.ltp;
//                         bValue = b.ltp;
//                         break;
//                     case 'invAmt':
//                         aValue = a.averageprice * a.quantity;
//                         bValue = b.averageprice * b.quantity;
//                         break;
//                     case 'marketValue':
//                         aValue = a.ltp * a.quantity;
//                         bValue = b.ltp * b.quantity;
//                         break;
//                     case 'profitandloss':
//                         aValue = a.profitandloss;
//                         bValue = b.profitandloss;
//                         break;
//                     case 'today_pnl':
//                         aValue = a.today_pnl || 0;
//                         bValue = b.today_pnl || 0;
//                         break;
//                     default:
//                         return 0;
//                 }
//
//                 if (typeof aValue === 'string') {
//                     return sortConfig.direction === 'asc'
//                         ? aValue.localeCompare(bValue)
//                         : bValue.localeCompare(aValue);
//                 }
//                 return sortConfig.direction === 'asc'
//                     ? aValue - bValue
//                     : bValue - aValue;
//             });
//         }
//
//         return result;
//     }, [portfolioData.holdings, searchTerm, sortConfig]);
//
//     const handleSort = (key) => {
//         setSortConfig(prev => ({
//             key,
//             direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
//         }));
//     };
//
//     useEffect(() => {
//         if (location.pathname === '/portfolio') {
//             fetchPortfolioData(true);
//             const intervalId = setInterval(() => {
//                 fetchPortfolioData(false);
//             }, 2500);
//             return () => clearInterval(intervalId);
//         }
//     }, [location.pathname]);
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div
//                     className={`flex justify-center items-center h-full ${
//                         theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
//                     }`}
//                 >
//                     <p>Loading portfolio...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div
//                 className={`p-6 rounded-lg shadow-sm border ${
//                     theme === 'dark'
//                         ? 'bg-gray-900 border-gray-800'
//                         : 'bg-white border-gray-200'
//                 }`}
//             >
//                 {error && (
//                     <div
//                         className={`p-4 rounded mb-4 ${
//                             theme === 'dark'
//                                 ? 'bg-red-900 text-red-300'
//                                 : 'bg-red-100 text-red-700'
//                         }`}
//                     >
//                         {error}
//                     </div>
//                 )}
//
//                 <div className="mb-6 portfolio-summary">
//                     <div className="flex justify-between items-center mb-4">
//                         <h3
//                             className={`text-lg font-medium ${
//                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                             }`}
//                         >
//                             Portfolio Summary
//                         </h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                             <p
//                                 className={`${
//                                     theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                 }`}
//                             >
//                                 Invested Amount
//                             </p>
//                             <p
//                                 className={`text-lg font-bold ${
//                                     theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
//                                 }`}
//                             >
//                                 ₹{Number(portfolioData.totalholding.totalinvvalue).toLocaleString()}
//                             </p>
//                         </div>
//                         <div>
//                             <p
//                                 className={`${
//                                     theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                 }`}
//                             >
//                                 Current Value
//                             </p>
//                             <p
//                                 className={`text-lg font-bold current-value ${
//                                     theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
//                                 }`}
//                             >
//                                 ₹{Number(portfolioData.totalholding.totalholdingvalue).toLocaleString()}
//                             </p>
//                         </div>
//                         <div>
//                             <p
//                                 className={`${
//                                     theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                 }`}
//                             >
//                                 Overall G/L
//                             </p>
//                             <p
//                                 className={`text-lg font-bold overall-gain-loss ${
//                                     portfolioData.totalholding.totalprofitandloss < 0
//                                         ? 'text-red-600'
//                                         : 'text-green-600'
//                                 }`}
//                             >
//                                 {portfolioData.totalholding.totalprofitandloss < 0 ? '-' : '+'}₹
//                                 {Math.abs(portfolioData.totalholding.totalprofitandloss).toLocaleString()}
//                                 ({portfolioData.totalholding.totalpnlpercentage.toFixed(2)}%)
//                             </p>
//                         </div>
//                         <div>
//                             <p
//                                 className={`${
//                                     theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                 }`}
//                             >
//                                 Today’s G/L
//                             </p>
//                             <p
//                                 className={`text-lg font-bold today-gain-loss ${
//                                     isNaN(portfolioData.totalholding.today_profit_and_loss)
//                                         ? theme === 'dark'
//                                             ? 'text-gray-400'
//                                             : 'text-gray-600'
//                                         : portfolioData.totalholding.today_profit_and_loss < 0
//                                             ? 'text-red-600'
//                                             : 'text-green-600'
//                                 }`}
//                             >
//                                 {isNaN(portfolioData.totalholding.today_profit_and_loss)
//                                     ? 'Calculating...'
//                                     : portfolioData.totalholding.today_profit_and_loss === 0
//                                         ? '₹0 (0%)'
//                                         : `${portfolioData.totalholding.today_profit_and_loss < 0 ? '-' : '+'}₹${Math.abs(portfolioData.totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(portfolioData.totalholding.today_profit_and_loss) / (portfolioData.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div
//                     className={`rounded-lg shadow-sm border ${
//                         theme === 'dark'
//                             ? 'bg-gray-900 border-gray-800'
//                             : 'bg-white border-gray-200'
//                     }`}
//                 >
//                     <div
//                         className={`p-4 flex justify-between items-center border-b ${
//                             theme === 'dark'
//                                 ? 'border-gray-800'
//                                 : 'border-gray-300'
//                         }`}
//                     >
//                         <h3
//                             className={`text-lg font-medium ${
//                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                             }`}
//                         >
//                             Holdings{' '}
//                             <span
//                                 className={`${
//                                     theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                 }`}
//                             >
//                                 ({filteredAndSortedHoldings.length})
//                             </span>
//                         </h3>
//                         <div className="flex space-x-2">
//                             <input
//                                 type="text"
//                                 placeholder="Search for stock or company"
//                                 className={`p-2 rounded-md border focus:outline-none focus:border-blue-500 ${
//                                     theme === 'dark'
//                                         ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400'
//                                         : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500'
//                                 }`}
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table
//                             className={`min-w-full divide-y ${
//                                 theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'
//                             }`}
//                         >
//                             <thead
//                                 className={`${
//                                     theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
//                                 }`}
//                             >
//                             <tr>
//                                 <th
//                                     onClick={() => handleSort('tradingsymbol')}
//                                     className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                     }`}
//                                 >
//                                     Stock Name{' '}
//                                     {sortConfig.key === 'tradingsymbol' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('quantity')}
//                                     className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                     }`}
//                                 >
//                                     Quantity{' '}
//                                     {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('averageprice')}
//                                     className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                     }`}
//                                 >
//                                     Avg. Price{' '}
//                                     {sortConfig.key === 'averageprice' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('ltp')}
//                                     className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                     }`}
//                                 >
//                                     LTP{' '}
//                                     {sortConfig.key === 'ltp' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('invAmt')}
//                                     className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                     }`}
//                                 >
//                                     Inv Amt{' '}
//                                     {sortConfig.key === 'invAmt' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('marketValue')}
//                                     className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                     }`}
//                                 >
//                                     Mkt Val{' '}
//                                     {sortConfig.key === 'marketValue' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('profitandloss')}
//                                     className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                     }`}
//                                 >
//                                     Overall G/L{' '}
//                                     {sortConfig.key === 'profitandloss' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th
//                                     onClick={() => handleSort('today_pnl')}
//                                     className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${
//                                         theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
//                                     }`}
//                                 >
//                                     Day’s G/L{' '}
//                                     {sortConfig.key === 'today_pnl' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                             </tr>
//                             </thead>
//                             <tbody
//                                 className={`divide-y ${
//                                     theme === 'dark'
//                                         ? 'bg-gray-900 divide-gray-800'
//                                         : 'bg-white divide-gray-200'
//                                 }`}
//                             >
//                             {filteredAndSortedHoldings.map((holding, index) => (
//                                 <tr key={index} data-symbol={holding.tradingsymbol}>
//                                     <td
//                                         className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
//                                         }`}
//                                     >
//                                         {holding.tradingsymbol}
//                                     </td>
//                                     <td
//                                         className={`px-4 py-3 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         {holding.quantity}
//                                     </td>
//                                     <td
//                                         className={`px-4 py-3 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         ₹{Number(holding.averageprice).toFixed(2)}
//                                     </td>
//                                     <td
//                                         className={`px-4 py-3 whitespace-nowrap text-sm ltp ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         ₹{Number(holding.ltp).toFixed(2)}
//                                     </td>
//                                     <td
//                                         className={`px-4 py-3 whitespace-nowrap text-sm ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         ₹{(holding.averageprice * holding.quantity).toLocaleString()}
//                                     </td>
//                                     <td
//                                         className={`px-4 py-3 whitespace-nowrap text-sm market-value ${
//                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-600'
//                                         }`}
//                                     >
//                                         ₹{(holding.ltp * holding.quantity).toLocaleString()}
//                                     </td>
//                                     <td
//                                         className={`px-4 py-3 whitespace-nowrap text-sm gain-loss ${
//                                             holding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'
//                                         }`}
//                                     >
//                                         {holding.profitandloss >= 0 ? '+' : '-'}₹
//                                         {Math.abs(holding.profitandloss).toLocaleString()}
//                                         ({holding.pnlpercentage.toFixed(2)}%)
//                                     </td>
//                                     <td
//                                         className={`px-4 py-3 whitespace-nowrap text-sm today-pnl ${
//                                             isNaN(holding.today_pnl)
//                                                 ? theme === 'dark'
//                                                     ? 'text-gray-400'
//                                                     : 'text-gray-600'
//                                                 : holding.today_pnl >= 0
//                                                     ? 'text-green-600'
//                                                     : 'text-red-600'
//                                         }`}
//                                     >
//                                         {isNaN(holding.today_pnl)
//                                             ? 'Calculating...'
//                                             : `${holding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(holding.today_pnl).toLocaleString()}`}
//                                     </td>
//                                 </tr>
//                             ))}
//                             {filteredAndSortedHoldings.length === 0 && (
//                                 <tr>
//                                     <td
//                                         colSpan="8"
//                                         className={`px-4 py-3 text-center ${
//                                             theme === 'dark' ? 'text-gray-300' : 'text-gray-500'
//                                         }`}
//                                     >
//                                         No holdings found.
//                                     </td>
//                                 </tr>
//                             )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Portfolio;







import DashboardLayout from '../../components/DashboardLayout';
import React, { useState, useEffect, useRef, useMemo, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../utils/api';
import { getAuthToken } from '../../utils/auth';
import { parseApiResponse } from '../../utils/crypto.js';
import { ThemeContext } from '../../context/ThemeContext';

const Portfolio = () => {
    // State for portfolio data including holdings and totals
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
    const [loading, setLoading] = useState(true); // Loading state for initial fetch
    const [error, setError] = useState(null); // Error state for fetch failures
    const [searchTerm, setSearchTerm] = useState(''); // Search filter state
    const [sortConfig, setSortConfig] = useState({ key: 'tradingsymbol', direction: 'asc' }); // Sorting configuration
    const holdingsRef = useRef(new Map()); // Reference for holding data
    const totalHoldingRef = useRef({}); // Reference for total holding data
    const updateCounter = useRef(0); // Counter for tracking updates
    const location = useLocation(); // Current route location
    const { theme } = useContext(ThemeContext); // Theme context for dark/light mode

    // Fetch portfolio data from API
    const fetchPortfolioData = async (isInitialFetch = false) => {
        try {
            if (isInitialFetch) setLoading(true);
            const token = getAuthToken();
            const response = await api.get('/user/angel/all-holding', {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response:", response);

            let data = response.data;
            if (typeof data === 'string') {
                data = parseApiResponse(data); // Parse encrypted response if needed
            }

            if (response.status === 200 && data.data?.status === "200") {
                const allHoldingData = data.data.all_holding.data || {};
                let holdings = allHoldingData.holdings || [];
                const totalholding = allHoldingData.totalholding || {
                    totalholdingvalue: 0,
                    totalinvvalue: 0,
                    totalprofitandloss: 0,
                    totalpnlpercentage: 0,
                    today_profit_and_loss: allHoldingData.today_profit_and_loss || 0,
                };

                // Map holdings with calculated values
                holdings = holdings.map(holding => ({
                    ...holding,
                    marketValue: holding.ltp * holding.quantity,
                    profitandloss: (holding.ltp - holding.averageprice) * holding.quantity,
                    pnlpercentage: holding.averageprice !== 0
                        ? ((holding.ltp - holding.averageprice) / holding.averageprice) * 100
                        : 0,
                    today_pnl: (holding.ltp - (holding.close || holding.ltp)) * holding.quantity, // Today's P&L logic from Manager Dashboard
                }));

                // Calculate aggregated totals
                const updatedTotalHolding = {
                    totalholdingvalue: holdings.reduce((sum, h) => sum + h.marketValue, 0),
                    totalinvvalue: totalholding.totalinvvalue || 0,
                    totalprofitandloss: holdings.reduce((sum, h) => sum + h.profitandloss, 0),
                    totalpnlpercentage: totalholding.totalinvvalue !== 0
                        ? (holdings.reduce((sum, h) => sum + h.profitandloss, 0) / totalholding.totalinvvalue) * 100
                        : 0,
                    today_profit_and_loss: holdings.reduce((sum, h) => sum + h.today_pnl, 0),
                };

                // Handle rate limit scenario
                if (data.data.message?.includes("Rate limit exceeded")) {
                    setError("Rate limit exceeded. Showing last known data.");
                    return;
                }

                // Sort holdings alphabetically by default
                holdings = holdings.sort((a, b) => a.tradingsymbol.localeCompare(b.tradingsymbol));

                updateCounter.current += 1;
                setPortfolioData({ holdings, totalholding: updatedTotalHolding });

                // Store initial data in refs
                if (isInitialFetch) {
                    holdingsRef.current = new Map(holdings.map(holding => [holding.tradingsymbol, { ...holding }]));
                    totalHoldingRef.current = { ...updatedTotalHolding };
                }
            } else {
                throw new Error(data.data?.message || 'Failed to fetch portfolio data');
            }
        } catch (err) {
            setError('Failed to fetch portfolio data: ' + (err.message || 'Unknown error'));
            console.error('Fetch Error:', err);
        } finally {
            if (isInitialFetch) setLoading(false);
        }
    };

    // Update individual holding with new LTP
    const updateHoldingWithLTP = (holding, newLTP) => {
        return {
            ...holding,
            ltp: newLTP,
            marketValue: newLTP * holding.quantity,
            profitandloss: (newLTP - holding.averageprice) * holding.quantity,
            pnlpercentage: holding.averageprice !== 0 ? ((newLTP - holding.averageprice) / holding.averageprice) * 100 : 0,
            today_pnl: (newLTP - (holding.close || newLTP)) * holding.quantity,
        };
    };

    // Recalculate total holdings based on updated holdings
    const updateTotalHoldings = (holdings) => {
        const totalholding = {
            totalholdingvalue: holdings.reduce((sum, h) => sum + (h.marketValue || (h.ltp * h.quantity)), 0),
            totalinvvalue: totalHoldingRef.current.totalinvvalue || 0,
            totalprofitandloss: holdings.reduce((sum, h) => sum + (h.profitandloss || 0), 0),
            totalpnlpercentage: 0,
            today_profit_and_loss: holdings.reduce((sum, h) => sum + (h.today_pnl || 0), 0),
        };

        totalholding.totalpnlpercentage = totalholding.totalinvvalue !== 0
            ? (totalholding.totalprofitandloss / totalholding.totalinvvalue) * 100
            : 0;

        return totalholding;
    };

    // Memoized filtered and sorted holdings
    const filteredAndSortedHoldings = useMemo(() => {
        let result = [...portfolioData.holdings];

        // Apply search filter
        if (searchTerm) {
            result = result.filter(holding =>
                holding.tradingsymbol.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Apply sorting
        if (sortConfig.key) {
            result.sort((a, b) => {
                let aValue, bValue;

                switch (sortConfig.key) {
                    case 'tradingsymbol':
                        aValue = a.tradingsymbol;
                        bValue = b.tradingsymbol;
                        break;
                    case 'quantity':
                        aValue = a.quantity;
                        bValue = b.quantity;
                        break;
                    case 'averageprice':
                        aValue = a.averageprice;
                        bValue = b.averageprice;
                        break;
                    case 'ltp':
                        aValue = a.ltp;
                        bValue = b.ltp;
                        break;
                    case 'invAmt':
                        aValue = a.averageprice * a.quantity;
                        bValue = b.averageprice * b.quantity;
                        break;
                    case 'marketValue':
                        aValue = a.ltp * a.quantity;
                        bValue = b.ltp * b.quantity;
                        break;
                    case 'profitandloss':
                        aValue = a.profitandloss;
                        bValue = b.profitandloss;
                        break;
                    case 'today_pnl':
                        aValue = a.today_pnl || 0;
                        bValue = b.today_pnl || 0;
                        break;
                    default:
                        return 0;
                }

                if (typeof aValue === 'string') {
                    return sortConfig.direction === 'asc'
                        ? aValue.localeCompare(bValue)
                        : bValue.localeCompare(aValue);
                }
                return sortConfig.direction === 'asc'
                    ? aValue - bValue
                    : bValue - aValue;
            });
        }

        return result;
    }, [portfolioData.holdings, searchTerm, sortConfig]);

    // Handle column sorting
    const handleSort = (key) => {
        setSortConfig(prev => ({
            key,
            direction: prev.key === key && prev.direction === 'desc' ? 'asc' : 'desc'
        }));
    };

    // Effect to fetch data and set up polling
    useEffect(() => {
        if (location.pathname === '/portfolio') {
            fetchPortfolioData(true);
            const intervalId = setInterval(() => fetchPortfolioData(false), 2500);
            return () => clearInterval(intervalId); // Cleanup interval on unmount
        }
    }, [location.pathname]);

    // Loading state UI
    if (loading) {
        return (
            <DashboardLayout>
                <div className={`flex justify-center items-center h-full ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                    <p>Loading portfolio...</p>
                </div>
            </DashboardLayout>
        );
    }

    // Main portfolio UI
    return (
        <DashboardLayout>
            <div className={`p-6 rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                {error && (
                    <div className={`p-4 rounded mb-4 ${theme === 'dark' ? 'bg-red-900 text-red-300' : 'bg-red-100 text-red-700'}`}>
                        {error}
                    </div>
                )}

                {/* Portfolio Summary */}
                <div className="mb-6 portfolio-summary">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            Portfolio Summary
                        </h3>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Invested Amount</p>
                            <p className={`text-lg font-bold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                ₹{Number(portfolioData.totalholding.totalinvvalue).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Current Value</p>
                            <p className={`text-lg font-bold current-value ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                ₹{Number(portfolioData.totalholding.totalholdingvalue).toLocaleString()}
                            </p>
                        </div>
                        <div>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Overall G/L</p>
                            <p className={`text-lg font-bold overall-gain-loss ${portfolioData.totalholding.totalprofitandloss < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {portfolioData.totalholding.totalprofitandloss < 0 ? '-' : '+'}₹
                                {Math.abs(portfolioData.totalholding.totalprofitandloss).toLocaleString()}
                                ({portfolioData.totalholding.totalpnlpercentage.toFixed(2)}%)
                            </p>
                        </div>
                        <div>
                            <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Today’s G/L</p>
                            <p className={`text-lg font-bold today-gain-loss ${portfolioData.totalholding.today_profit_and_loss < 0 ? 'text-red-600' : 'text-green-600'}`}>
                                {portfolioData.totalholding.today_profit_and_loss === 0
                                    ? '₹0 (0%)'
                                    : `${portfolioData.totalholding.today_profit_and_loss < 0 ? '-' : '+'}₹${Math.abs(portfolioData.totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(portfolioData.totalholding.today_profit_and_loss) / (portfolioData.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Holdings Table */}
                <div className={`rounded-lg shadow-sm border ${theme === 'dark' ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200'}`}>
                    <div className={`p-4 flex justify-between items-center border-b ${theme === 'dark' ? 'border-gray-800' : 'border-gray-300'}`}>
                        <h3 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                            Holdings <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>({filteredAndSortedHoldings.length})</span>
                        </h3>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                placeholder="Search for stock or company"
                                className={`p-2 rounded-md border focus:outline-none focus:border-blue-500 ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-gray-200 placeholder-gray-400' : 'bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500'}`}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-800' : 'divide-gray-200'}`}>
                            <thead className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'}`}>
                            <tr>
                                <th onClick={() => handleSort('tradingsymbol')} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Stock Name {sortConfig.key === 'tradingsymbol' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                                </th>
                                <th onClick={() => handleSort('quantity')} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Quantity {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                                </th>
                                <th onClick={() => handleSort('averageprice')} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Avg. Price {sortConfig.key === 'averageprice' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                                </th>
                                <th onClick={() => handleSort('ltp')} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    LTP {sortConfig.key === 'ltp' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                                </th>
                                <th onClick={() => handleSort('invAmt')} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Inv Amt {sortConfig.key === 'invAmt' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                                </th>
                                <th onClick={() => handleSort('marketValue')} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Mkt Val {sortConfig.key === 'marketValue' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                                </th>
                                <th onClick={() => handleSort('profitandloss')} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Overall G/L {sortConfig.key === 'profitandloss' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                                </th>
                                <th onClick={() => handleSort('today_pnl')} className={`px-4 py-3 text-left text-xs font-medium uppercase tracking-wider cursor-pointer ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                    Day’s G/L {sortConfig.key === 'today_pnl' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
                                </th>
                            </tr>
                            </thead>
                            <tbody className={`divide-y ${theme === 'dark' ? 'bg-gray-900 divide-gray-800' : 'bg-white divide-gray-200'}`}>
                            {filteredAndSortedHoldings.map((holding, index) => (
                                <tr key={index} data-symbol={holding.tradingsymbol}>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'}`}>
                                        {holding.tradingsymbol}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                        {holding.quantity}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                        ₹{Number(holding.averageprice).toFixed(2)}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm ltp ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                        ₹{Number(holding.ltp).toFixed(2)}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                        ₹{(holding.averageprice * holding.quantity).toLocaleString()}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm market-value ${theme === 'dark' ? 'text-gray-200' : 'text-gray-600'}`}>
                                        ₹{(holding.ltp * holding.quantity).toLocaleString()}
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm gain-loss ${holding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {holding.profitandloss >= 0 ? '+' : '-'}₹
                                        {Math.abs(holding.profitandloss).toLocaleString()}
                                        ({holding.pnlpercentage.toFixed(2)}%)
                                    </td>
                                    <td className={`px-4 py-3 whitespace-nowrap text-sm today-pnl ${holding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                        {holding.today_pnl >= 0 ? '+' : '-'}₹
                                        {Math.abs(holding.today_pnl).toLocaleString()}
                                    </td>
                                </tr>
                            ))}
                            {filteredAndSortedHoldings.length === 0 && (
                                <tr>
                                    <td colSpan="8" className={`px-4 py-3 text-center ${theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}>
                                        No holdings found.
                                    </td>
                                </tr>
                            )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Portfolio;



//     return (
//         <DashboardLayout>
//             <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
//                 {error && (
//                     <div className="p-4 bg-red-100 text-red-700 rounded mb-4">
//                         {error}
//                     </div>
//                 )}
//
//                 <div className="mb-6 portfolio-summary">
//                     <div className="flex justify-between items-center mb-4">
//                         <h3 className="text-lg font-medium text-gray-800">Portfolio Summary</h3>
//                     </div>
//                     <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
//                         <div>
//                             <p className="text-gray-500">Invested Amount</p>
//                             <p className="text-lg font-bold text-gray-900">₹{portfolioData.totalholding.totalinvvalue.toLocaleString()}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Current Value</p>
//                             <p className="text-lg font-bold text-gray-900 current-value">₹{portfolioData.totalholding.totalholdingvalue.toLocaleString()}</p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Overall G/L</p>
//                             <p className={`text-lg font-bold ${portfolioData.totalholding.totalprofitandloss < 0 ? 'text-red-600' : 'text-green-600'} overall-gain-loss`}>
//                                 {portfolioData.totalholding.totalprofitandloss < 0 ? '-' : '+'}₹
//                                 {Math.abs(portfolioData.totalholding.totalprofitandloss).toLocaleString()}
//                                 ({portfolioData.totalholding.totalpnlpercentage.toFixed(2)}%)
//                             </p>
//                         </div>
//                         <div>
//                             <p className="text-gray-500">Today’s G/L</p>
//                             <p className={`text-lg font-bold ${isNaN(portfolioData.totalholding.today_profit_and_loss) ? 'text-black-600' : (portfolioData.totalholding.today_profit_and_loss < 0 ? 'text-red-600' : 'text-green-600')} today-gain-loss`}>
//                                 {isNaN(portfolioData.totalholding.today_profit_and_loss)
//                                     ? 'Calculating...'
//                                     : portfolioData.totalholding.today_profit_and_loss === 0
//                                         ? '₹0 (0%)'
//                                         : `${portfolioData.totalholding.today_profit_and_loss < 0 ? '-' : '+'}₹${Math.abs(portfolioData.totalholding.today_profit_and_loss).toLocaleString()} (${((Math.abs(portfolioData.totalholding.today_profit_and_loss) / (portfolioData.totalholding.totalinvvalue || 1)) * 100).toFixed(2)}%)`}
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//
//                 <div className="bg-white rounded-lg shadow-sm border border-gray-200">
//                     <div className="p-4 flex justify-between items-center border-b border-gray-300">
//                         <h3 className="text-lg font-medium text-gray-800">Holdings <span className="text-gray-500">({filteredAndSortedHoldings.length})</span></h3>
//                         <div className="flex space-x-2">
//                             <input
//                                 type="text"
//                                 placeholder="Search for stock or company"
//                                 className="bg-gray-100 text-gray-800 p-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-gray-100">
//                             <tr>
//                                 <th onClick={() => handleSort('tradingsymbol')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">
//                                     Stock Name {sortConfig.key === 'tradingsymbol' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th onClick={() => handleSort('quantity')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">
//                                     Quantity {sortConfig.key === 'quantity' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th onClick={() => handleSort('averageprice')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">
//                                     Avg. Price {sortConfig.key === 'averageprice' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th onClick={() => handleSort('ltp')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">
//                                     LTP {sortConfig.key === 'ltp' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th onClick={() => handleSort('invAmt')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">
//                                     Inv Amt {sortConfig.key === 'invAmt' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th onClick={() => handleSort('marketValue')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">
//                                     Mkt Val {sortConfig.key === 'marketValue' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th onClick={() => handleSort('profitandloss')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">
//                                     Overall G/L {sortConfig.key === 'profitandloss' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                                 <th onClick={() => handleSort('today_pnl')} className="px-4 py-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider cursor-pointer">
//                                     Day’s G/L {sortConfig.key === 'today_pnl' ? (sortConfig.direction === 'asc' ? '▲' : '▼') : '▼'}
//                                 </th>
//                             </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                             {filteredAndSortedHoldings.map((holding, index) => (
//                                 <tr key={index} data-symbol={holding.tradingsymbol}>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">{holding.tradingsymbol}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">{holding.quantity}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">₹{holding.averageprice.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 ltp">₹{holding.ltp.toFixed(2)}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600">₹{(holding.averageprice * holding.quantity).toLocaleString()}</td>
//                                     <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 market-value">₹{(holding.ltp * holding.quantity).toLocaleString()}</td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${holding.profitandloss >= 0 ? 'text-green-600' : 'text-red-600'} gain-loss`}>
//                                         {holding.profitandloss >= 0 ? '+' : '-'}₹
//                                         {Math.abs(holding.profitandloss).toLocaleString()}
//                                         ({holding.pnlpercentage.toFixed(2)}%)
//                                     </td>
//                                     <td className={`px-4 py-3 whitespace-nowrap text-sm ${isNaN(holding.today_pnl) ? 'text-gray-600' : (holding.today_pnl >= 0 ? 'text-green-600' : 'text-red-600')} today-pnl`}>
//                                         {isNaN(holding.today_pnl)
//                                             ? 'Calculating...'
//                                             : `${holding.today_pnl >= 0 ? '+' : '-'}₹${Math.abs(holding.today_pnl).toLocaleString()}`}
//                                     </td>
//                                 </tr>
//                             ))}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };



// OM CODE
// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
//
// export default function Portfolio() {
//     const [portfolio, setPortfolio] = useState([]);
//     const [investedAmount, setInvestedAmount] = useState(0);
//     const [currentValue, setCurrentValue] = useState(0);
//     const [overallGain, setOverallGain] = useState(0);
//     const [overallLoss, setOverallLoss] = useState(0);
//     const [todaysGain, setTodaysGain] = useState(0);
//
//     const [prevLtp, setPrevLtp] = useState({});
//
//     const fetchPortfolio = async () => {
//         try {
//             const response = await axios.get('http://192.168.1.110:5000/api/stock_market/portfolio');
//
//             const data = response.data?.holdings || [];
//             const updatedPrevLtp = { ...prevLtp };
//
//             let investedTotal = 0;
//             let currentTotal = 0;
//             let gainTotal = 0;
//             let lossTotal = 0;
//             let todaysTotalGain = 0;
//
//             const updatedPortfolio = data.map(stock => {
//                 const invested = (stock.averageprice || 0) * (stock.quantity || 0);
//                 const current = (stock.ltp || 0) * (stock.quantity || 0);
//
//                 investedTotal += invested;
//                 currentTotal += current;
//
//                 const pnl = current - invested;
//
//                 // Separate Gain & Loss Calculation
//                 if (pnl > 0) {
//                     gainTotal += pnl;
//                 } else {
//                     lossTotal += Math.abs(pnl);
//                 }
//
//                 // Calculate today's gain using previous LTP
//                 if (prevLtp[stock.tradingsymbol]) {
//                     const prevPrice = prevLtp[stock.tradingsymbol];
//                     todaysTotalGain += (stock.ltp - prevPrice) * (stock.quantity || 0);
//                 }
//
//                 updatedPrevLtp[stock.tradingsymbol] = stock.ltp;
//
//                 return stock;
//             });
//
//             setPortfolio(updatedPortfolio);
//             setInvestedAmount(investedTotal);
//             setCurrentValue(currentTotal);
//             setOverallGain(gainTotal);
//             setOverallLoss(lossTotal);
//             setTodaysGain(todaysTotalGain);
//
//             setPrevLtp(updatedPrevLtp); // Update LTP for next comparison
//         } catch (error) {
//             console.error('Error fetching portfolio data:', error.message);
//         }
//     };
//
//     useEffect(() => {
//         fetchPortfolio();
//         const interval = setInterval(fetchPortfolio, 3000); // Refresh every 3 seconds
//         return () => clearInterval(interval);
//     }, []);
//
//     return (
//         <div className="p-6 bg-gray-100 min-h-screen">
//             <h1 className="text-2xl font-bold mb-4 text-center">Stock Market Portfolio</h1>
//
//             {portfolio.length === 0 ? (
//                 <p className="text-center text-red-500">No data available.</p>
//             ) : (
//                 <div className="overflow-x-auto">
//                     <table className="w-full bg-white shadow-md rounded-lg">
//                         <thead className="bg-blue-500 text-white">
//                         <tr>
//                             <th className="p-3 text-left">Symbol</th>
//                             <th className="p-3 text-left">Exchange</th>
//                             <th className="p-3 text-left">Quantity</th>
//                             <th className="p-3 text-left">Average Price</th>
//                             <th className="p-3 text-left">LTP</th>
//                             <th className="p-3 text-left">Profit/Loss</th>
//                         </tr>
//                         </thead>
//                         <tbody>
//                         {portfolio.map((stock, index) => (
//                             <tr key={index} className="border-t">
//                                 <td className="p-3">{stock.tradingsymbol || 'N/A'}</td>
//                                 <td className="p-3">{stock.exchange || 'N/A'}</td>
//                                 <td className="p-3">{stock.quantity || 0}</td>
//                                 <td className="p-3">₹{(stock.averageprice || 0).toFixed(2)}</td>
//                                 <td className="p-3">₹{(stock.ltp || 0).toFixed(2)}</td>
//                                 <td className={`p-3 ${stock.profitandloss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                                     ₹{(stock.profitandloss || 0).toFixed(2)}
//                                 </td>
//                             </tr>
//                         ))}
//                         </tbody>
//                     </table>
//                 </div>
//             )}
//
//             {/* Summary Section */}
//             <div className="mt-6 p-4 bg-white rounded-lg shadow-md">
//                 <p className="text-lg font-semibold">Total Amount Invested: <span className="font-bold">₹{investedAmount.toFixed(2)}</span></p>
//                 <p className="text-lg font-semibold">Current Value: <span className="font-bold">₹{currentValue.toFixed(2)}</span></p>
//                 <p className="text-lg font-semibold text-green-500">
//                     Overall Gain: <span className="font-bold">₹{overallGain.toFixed(2)}</span>
//                 </p>
//                 <p className="text-lg font-semibold text-red-500">
//                     Overall Loss: <span className="font-bold">₹{overallLoss.toFixed(2)}</span>
//                 </p>
//                 <p className={`text-lg font-semibold ${todaysGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
//                     Today's Gain: <span className="font-bold">₹{todaysGain.toFixed(2)}</span>
//                 </p>
//             </div>
//         </div>
//     );
// }
//
