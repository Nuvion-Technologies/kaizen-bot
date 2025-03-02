import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Orders = () => {
    return (
        <DashboardLayout>
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                    <h3 className="text-lg font-medium text-gray-800">Recent Orders</h3>
                    <p className="text-sm text-gray-500">Track and manage your stock orders</p>
                </div>
                <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                        New Buy Order
                    </button>
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        New Sell Order
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gray-50">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex items-center gap-2">
                            <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
                                <option>All Orders</option>
                                <option>Buy Orders</option>
                                <option>Sell Orders</option>
                            </select>
                            <select className="text-sm border border-gray-300 rounded-md px-3 py-1.5">
                                <option>All Status</option>
                                <option>Pending</option>
                                <option>Completed</option>
                                <option>Cancelled</option>
                                <option>Failed</option>
                            </select>
                        </div>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search orders..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full md:w-64"
                            />
                            <svg
                                className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
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

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Symbol</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-2345</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Buy</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">AAPL</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">10</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$182.34</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,823.40</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 15, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <Clock size={16} className="text-amber-500 mr-1.5" />
                                    <span className="text-sm text-amber-500">Pending</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                                <button className="text-red-600 hover:text-red-800">Cancel</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-2344</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">Sell</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">TSLA</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$249.13</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,245.65</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 14, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <CheckCircle size={16} className="text-green-500 mr-1.5" />
                                    <span className="text-sm text-green-500">Completed</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-2343</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Buy</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MSFT</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$378.92</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$1,136.76</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 12, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <CheckCircle size={16} className="text-green-500 mr-1.5" />
                                    <span className="text-sm text-green-500">Completed</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                            </td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#ORD-2342</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">Buy</span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">NVDA</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">8</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$485.09</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$3,880.72</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Oct 10, 2023</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                    <XCircle size={16} className="text-red-500 mr-1.5" />
                                    <span className="text-sm text-red-500">Cancelled</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                <button className="text-blue-600 hover:text-blue-800 mr-3">View</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Orders;
