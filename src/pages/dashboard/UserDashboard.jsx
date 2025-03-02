import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import { DollarSign, TrendingUp, BarChart2, PieChart } from 'lucide-react';

const UserDashboard = () => {
    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Portfolio Value"
                    value="$24,568"
                    icon={<DollarSign size={20} />}
                    color="bg-blue-100 text-blue-600"
                    change="+$1,234 (5.3%)"
                    changeType="positive"
                />
                <StatCard
                    title="Today's Change"
                    value="+1.2%"
                    icon={<TrendingUp size={20} />}
                    color="bg-green-100 text-green-600"
                    change="+$293.45"
                    changeType="positive"
                />
                <StatCard
                    title="Open Positions"
                    value="8"
                    icon={<BarChart2 size={20} />}
                    color="bg-purple-100 text-purple-600"
                    change="2 in profit"
                    changeType="neutral"
                />
                <StatCard
                    title="Asset Allocation"
                    value="Balanced"
                    icon={<PieChart size={20} />}
                    color="bg-amber-100 text-amber-600"
                    change="Well diversified"
                    changeType="neutral"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Top Performing Assets</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">A</div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-800">AAPL</p>
                                    <p className="text-xs text-gray-500">Apple Inc.</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-green-600">+8.4%</p>
                                <p className="text-xs text-gray-500">$182.34</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold">M</div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-800">MSFT</p>
                                    <p className="text-xs text-gray-500">Microsoft Corp.</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-green-600">+6.2%</p>
                                <p className="text-xs text-gray-500">$378.92</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 font-bold">N</div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-800">NVDA</p>
                                    <p className="text-xs text-gray-500">NVIDIA Corp.</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-green-600">+5.8%</p>
                                <p className="text-xs text-gray-500">$124.76</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div className="flex items-center">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">G</div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-800">GOOGL</p>
                                    <p className="text-xs text-gray-500">Alphabet Inc.</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-green-600">+4.3%</p>
                                <p className="text-xs text-gray-500">$142.38</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Transactions</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Buy AAPL</p>
                                <p className="text-xs text-gray-500">Today, 10:24 AM</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">10 shares</p>
                                <p className="text-xs text-green-600">$1,823.40</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Sell TSLA</p>
                                <p className="text-xs text-gray-500">Yesterday, 3:45 PM</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">5 shares</p>
                                <p className="text-xs text-red-600">$1,245.65</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Buy MSFT</p>
                                <p className="text-xs text-gray-500">Oct 12, 11:32 AM</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">3 shares</p>
                                <p className="text-xs text-green-600">$1,136.76</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center pb-2 border-b border-gray-100">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Deposit</p>
                                <p className="text-xs text-gray-500">Oct 10, 9:15 AM</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">Bank Transfer</p>
                                <p className="text-xs text-green-600">$5,000.00</p>
                            </div>
                        </div>
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-sm font-medium text-gray-800">Dividend AAPL</p>
                                <p className="text-xs text-gray-500">Oct 5, 8:00 AM</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-800">Quarterly</p>
                                <p className="text-xs text-green-600">$23.45</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default UserDashboard;
