import React, {useState, useEffect, useContext} from 'react';
import { Loader2,ChevronDown  } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import api from '../../utils/api';
import { getAuthToken } from '../../utils/auth';
import { parseApiResponse } from '../../utils/crypto';
import DashboardLayout from '../../components/DashboardLayout';
import {ThemeContext} from "../../context/ThemeContext.jsx";
import axios from 'axios';
const ip = import.meta.env.VITE_API_URL;

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement);

const Analytics = () => {
    const { theme } = useContext(ThemeContext);
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedStock, setSelectedStock] = useState(null)


    // Fetch profit analysis data
    const fetchProfitAnalysis = async () => {
        setLoading(true);
        try {
            const token = getAuthToken();
            const response = await axios.get(`${ip}/profit-analysis`, {
                headers: { Authorization: `Bearer ${token}` },
                'Content-Type': 'application/json',
            });
            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData && decryptedData.status === "200") {
                setAnalysisData(decryptedData.data);
                // Set default selected stock to the first one, if available
                const stocks = Object.keys(decryptedData.data.profit_by_target_by_stock);
                setSelectedStock(stocks.length > 0 ? stocks[0] : null);
            } else {
                throw new Error(decryptedData?.message || 'Failed to fetch profit analysis');
            }
            console.log(decryptedData);
        } catch (error) {
            console.error('Error fetching profit analysis:', error);
            toast.error('Failed to fetch profit analysis: ' + error.message);
            setAnalysisData(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfitAnalysis();
    }, []);

    // Chart Data Preparation
    const prepareChartData = () => {
        if (!analysisData) return {};

        // Profit by Stock (Bar Chart)
        const stockProfitData = {
            labels: Object.keys(analysisData.profit_by_stock),
            datasets: [{
                label: 'Profit by Stock (₹)',
                data: Object.values(analysisData.profit_by_stock),
                backgroundColor: Object.values(analysisData.profit_by_stock).map(value =>
                    value >= 0 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(248, 113, 113, 0.6)' // Green/Red
                ),
                borderColor: Object.values(analysisData.profit_by_stock).map(value =>
                    value >= 0 ? 'rgba(74, 222, 128, 1)' : 'rgba(248, 113, 113, 1)'
                ),
                borderWidth: 1,
            }],
        };

        // Profit by Target for Selected Stock (Bar Chart)
        const targetProfitData = selectedStock && analysisData.profit_by_target_by_stock[selectedStock] ? {
            labels: ['First Profit', 'Second Profit', 'Final Profit'],
            datasets: [{
                label: `Profit by Target for ${selectedStock} (₹)`,
                data: [
                    analysisData.profit_by_target_by_stock[selectedStock].first_profit,
                    analysisData.profit_by_target_by_stock[selectedStock].second_profit,
                    analysisData.profit_by_target_by_stock[selectedStock].final_profit,
                ],
                backgroundColor: [
                    analysisData.profit_by_target_by_stock[selectedStock].first_profit >= 0 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(248, 113, 113, 0.6)',
                    analysisData.profit_by_target_by_stock[selectedStock].second_profit >= 0 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(248, 113, 113, 0.6)',
                    analysisData.profit_by_target_by_stock[selectedStock].final_profit >= 0 ? 'rgba(74, 222, 128, 0.6)' : 'rgba(248, 113, 113, 0.6)',
                ],
                borderColor: [
                    analysisData.profit_by_target_by_stock[selectedStock].first_profit >= 0 ? 'rgba(74, 222, 128, 1)' : 'rgba(248, 113, 113, 1)',
                    analysisData.profit_by_target_by_stock[selectedStock].second_profit >= 0 ? 'rgba(74, 222, 128, 1)' : 'rgba(248, 113, 113, 1)',
                    analysisData.profit_by_target_by_stock[selectedStock].final_profit >= 0 ? 'rgba(74, 222, 128, 1)' : 'rgba(248, 113, 113, 1)',
                ],
                borderWidth: 1,
            }],
        } : { labels: [], datasets: [] };

        // Time-Based Profit (Line Chart)
        const timeProfitData = {
            labels: Object.keys(analysisData.time_based_profit),
            datasets: [{
                label: 'Profit Over Time (₹)',
                data: Object.values(analysisData.time_based_profit),
                fill: false,
                borderColor: '#4BC0C0',
                backgroundColor: Object.values(analysisData.time_based_profit).map(value =>
                    value >= 0 ? '#4BC0C0' : '#F87171'
                ),
                pointBackgroundColor: Object.values(analysisData.time_based_profit).map(value =>
                    value >= 0 ? '#4BC0C0' : '#F87171'
                ),
                tension: 0.1,
            }],
        };

        return { stockProfitData, targetProfitData, timeProfitData };
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            legend: { position: 'top', labels: { color: theme === 'dark' ? '#E5E7EB' : '#374151' } },
            title: { display: true, color: theme === 'dark' ? '#E5E7EB' : '#374151', font: { size: 16 } },
        },
        scales: {
            x: { ticks: { color: theme === 'dark' ? '#E5E7EB' : '#374151' } },
            y: { ticks: { color: theme === 'dark' ? '#E5E7EB' : '#374151' } },
        },
    };

    const { stockProfitData, targetProfitData, timeProfitData } = prepareChartData();

    return (
        <DashboardLayout>
            <div className="space-y-8 p-6">

                {/* Loading State */}
                {loading ? (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                    </div>
                ) : !analysisData ? (
                    <p className={`text-center ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                        No analysis data available.
                    </p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {/* Total Profit Card */}
                        <div className={`rounded-xl shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border`}>
                            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Total Profit
                            </h4>
                            <p className={`text-3xl font-bold mt-2 ${analysisData.total_profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ₹{Number(analysisData.total_profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Top Performing Stock */}
                        <div className={`rounded-xl shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border`}>
                            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Top Performing Stock
                            </h4>
                            <p className="text-xl font-semibold mt-2 text-blue-500">
                                {analysisData.top_performing_stock.stock_symbol || 'N/A'}
                            </p>
                            <p className={`text-lg ${analysisData.top_performing_stock.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ₹{Number(analysisData.top_performing_stock.profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Least Performing Stock */}
                        <div className={`rounded-xl shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border`}>
                            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'}`}>
                                Least Performing Stock
                            </h4>
                            <p className="text-xl font-semibold mt-2 text-blue-500">
                                {analysisData.least_performing_stock.stock_symbol || 'N/A'}
                            </p>
                            <p className={`text-lg ${analysisData.least_performing_stock.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                                ₹{Number(analysisData.least_performing_stock.profit).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        {/* Cycle Performance */}
                        <div className={`rounded-xl shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border col-span-full`}>
                            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                                Cycle Performance
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Total Cycles</p>
                                    <p className="text-xl font-semibold text-blue-500">{analysisData.cycle_performance.total_cycles}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Completed Cycles</p>
                                    <p className="text-xl font-semibold text-blue-500">{analysisData.cycle_performance.completed_cycles}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Positive Profit Cycles</p>
                                    <p className="text-xl font-semibold text-blue-500">{analysisData.cycle_performance.positive_profit_cycles}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>Success Rate</p>
                                    <p className="text-xl font-semibold text-blue-500">{analysisData.cycle_performance.success_rate.toFixed(2)}%</p>
                                </div>
                            </div>
                        </div>

                        {/* Profit by Stock Chart */}
                        <div className={`rounded-xl shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border col-span-full md:col-span-2`}>
                            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                                Profit by Stock
                            </h4>
                            <Bar data={stockProfitData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Profit by Stock' } } }} />
                        </div>

                        {/* Profit by Target by Stock Chart */}
                        <div className={`rounded-xl shadow-lg p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border transition-transform hover:scale-[1.02]`}>
                            <h4 className={`text-xl font-semibold ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                                Profit by Target
                            </h4>
                            <div className="relative mb-6">
                                <select
                                    value={selectedStock || ''}
                                    onChange={(e) => setSelectedStock(e.target.value)}
                                    className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none shadow-sm ${theme === 'dark' ? 'bg-gray-900 border-gray-700 text-gray-200' : 'bg-white border-gray-200 text-gray-900'}`}
                                >
                                    {Object.keys(analysisData.profit_by_target_by_stock).map((stock) => (
                                        <option key={stock} value={stock}>
                                            {stock}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                            </div>
                            <Bar data={targetProfitData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: `Profit by Target for ${selectedStock || 'Select a Stock'}` } }} } />
                        </div>

                        {/* Time-Based Profit Chart */}
                        <div className={`rounded-xl shadow-md p-6 ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'} border col-span-full`}>
                            <h4 className={`text-lg font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-800'} mb-4`}>
                                Profit Over Time
                            </h4>
                            <Line data={timeProfitData} options={{ ...chartOptions, plugins: { ...chartOptions.plugins, title: { text: 'Profit Over Time' } } }} />
                        </div>
                    </div>
                )}
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

export default Analytics;
