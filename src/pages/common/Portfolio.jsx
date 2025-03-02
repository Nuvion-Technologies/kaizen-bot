import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { PieChart, BarChart2, TrendingUp, TrendingDown } from 'lucide-react';

const Portfolio = () => {
    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
                <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-800">Portfolio Summary</h3>
                        <div className="flex space-x-2">
                            <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
                                <option>Last 7 days</option>
                                <option>Last 30 days</option>
                                <option>Last 90 days</option>
                                <option>Year to date</option>
                                <option>All time</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <p className="text-sm text-gray-500">Total Value</p>
                            <p className="text-2xl font-bold text-gray-900">$124,568.34</p>
                            <div className="flex items-center mt-1 text-green-600">
                                <TrendingUp size={16} className="mr-1" />
                                <span className="text-sm font-medium">+$6,245.23 (5.3%)</span>
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Today's Change</p>
                            <p className="text-2xl font-bold text-green-600">+$1,245.67</p>
                            <p className="text-sm text-green-600">+1.02%</p>
                        </div>
                    </div>

                    {/* Placeholder for chart */}
                    <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                        <BarChart2 size={48} className="text-gray-400" />
                        <span className="ml-2 text-gray-500">Portfolio Performance Chart</span>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Asset Allocation</h3>

                    {/* Placeholder for pie chart */}
                    <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                        <PieChart size={48} className="text-gray-400" />
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Stocks</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">65%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Bonds</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">20%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Cash</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">10%</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-purple-500 rounded-full mr-2"></div>
                                <span className="text-sm text-gray-700">Alternative</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900">5%</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-4">Holdings</h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shares</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Cost</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Market Value</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Gain/Loss</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AAPL</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Apple Inc.</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">25</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$145.32</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$182.34</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$4,558.50</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$925.50 (25.5%)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">MSFT</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Microsoft Corp.</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$290.45</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$378.92</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$5,683.80</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$1,327.05 (30.5%)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">GOOGL</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Alphabet Inc.</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$135.67</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$142.38</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,423.80</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$67.10 (4.9%)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">TSLA</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Tesla Inc.</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$265.34</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$249.13</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,993.04</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">-$129.68 (-6.1%)</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">AMZN</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Amazon.com Inc.</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$135.67</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$142.38</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,708.56</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">+$80.52 (4.9%)</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Portfolio;
