import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import { Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react';

const ManagerDashboard = () => {
    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Active Users"
                    value="246"
                    icon={<Users size={20} />}
                    color="bg-blue-100 text-blue-600"
                    change="+18 today"
                    changeType="positive"
                />
                <StatCard
                    title="Portfolio Performance"
                    value="+4.8%"
                    icon={<TrendingUp size={20} />}
                    color="bg-green-100 text-green-600"
                    change="Above market average"
                    changeType="positive"
                />
                <StatCard
                    title="Pending Orders"
                    value="12"
                    icon={<Clock size={20} />}
                    color="bg-amber-100 text-amber-600"
                    change="3 urgent"
                    changeType="neutral"
                />
                <StatCard
                    title="Risk Alerts"
                    value="5"
                    icon={<AlertTriangle size={20} />}
                    color="bg-red-100 text-red-600"
                    change="+2 from yesterday"
                    changeType="negative"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Team Performance</h3>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Sarah Johnson</span>
                                <span className="text-sm font-medium text-gray-700">92%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Michael Chen</span>
                                <span className="text-sm font-medium text-gray-700">88%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Jessica Williams</span>
                                <span className="text-sm font-medium text-gray-700">76%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '76%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">David Rodriguez</span>
                                <span className="text-sm font-medium text-gray-700">68%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '68%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium text-gray-700">Emily Thompson</span>
                                <span className="text-sm font-medium text-gray-700">54%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '54%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Upcoming Tasks</h3>
                    <div className="space-y-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-red-500 mt-1"></div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">Client portfolio review: Johnson Holdings</p>
                                <p className="text-xs text-gray-500">Today, 2:00 PM</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-amber-500 mt-1"></div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">Risk assessment for new investment strategy</p>
                                <p className="text-xs text-gray-500">Tomorrow, 10:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-amber-500 mt-1"></div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">Team performance review</p>
                                <p className="text-xs text-gray-500">Tomorrow, 3:30 PM</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">Market analysis report preparation</p>
                                <p className="text-xs text-gray-500">Wednesday, 11:00 AM</p>
                            </div>
                        </div>
                        <div className="flex items-start">
                            <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-800">Monthly client newsletter draft</p>
                                <p className="text-xs text-gray-500">Friday, 2:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default ManagerDashboard;
