import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import StatCard from '../../components/StatCard';
import AddMemberForm from '../../components/AddMemberForm';
import { Users, DollarSign, TrendingUp, Activity, UserPlus } from 'lucide-react';

const SuperAdminDashboard = () => {
    const [showAddMemberForm, setShowAddMemberForm] = useState(false);

    return (
        <DashboardLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title="Total Users"
                    value="1,284"
                    icon={<Users size={20} />}
                    color="bg-blue-100 text-blue-600"
                    change="+12% from last month"
                    changeType="positive"
                />
                <StatCard
                    title="Revenue"
                    value="$34,742"
                    icon={<DollarSign size={20} />}
                    color="bg-green-100 text-green-600"
                    change="+8.3% from last month"
                    changeType="positive"
                />
                <StatCard
                    title="Active Trades"
                    value="342"
                    icon={<Activity size={20} />}
                    color="bg-purple-100 text-purple-600"
                    change="+24 since yesterday"
                    changeType="positive"
                />
                <StatCard
                    title="Market Performance"
                    value="+6.2%"
                    icon={<TrendingUp size={20} />}
                    color="bg-amber-100 text-amber-600"
                    change="Outperforming by 2.4%"
                    changeType="positive"
                />
            </div>

            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
                <button
                    onClick={() => setShowAddMemberForm(true)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                    <UserPlus size={18} />
                    <span>Add New Member</span>
                </button>
            </div>

            {showAddMemberForm && (
                <div className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Add New Member</h3>
                                <button
                                    onClick={() => setShowAddMemberForm(false)}
                                    className="text-gray-500 hover:text-gray-700"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <AddMemberForm onClose={() => setShowAddMemberForm(false)} />
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">System Overview</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">System Status</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">API Status</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Database Status</span>
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Operational</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Last Backup</span>
                            <span className="text-gray-800">Today, 04:30 AM</span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-gray-600">Server Load</span>
                            <span className="text-gray-800">24%</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Activities</h3>
                    <div className="space-y-4">
                        <div className="border-l-4 border-blue-500 pl-4 py-1">
                            <p className="text-sm text-gray-800">New user registration: John Smith</p>
                            <p className="text-xs text-gray-500">10 minutes ago</p>
                        </div>
                        <div className="border-l-4 border-green-500 pl-4 py-1">
                            <p className="text-sm text-gray-800">System update completed successfully</p>
                            <p className="text-xs text-gray-500">1 hour ago</p>
                        </div>
                        <div className="border-l-4 border-amber-500 pl-4 py-1">
                            <p className="text-sm text-gray-800">API rate limit warning for client #2458</p>
                            <p className="text-xs text-gray-500">2 hours ago</p>
                        </div>
                        <div className="border-l-4 border-purple-500 pl-4 py-1">
                            <p className="text-sm text-gray-800">Database optimization completed</p>
                            <p className="text-xs text-gray-500">3 hours ago</p>
                        </div>
                        <div className="border-l-4 border-red-500 pl-4 py-1">
                            <p className="text-sm text-gray-800">Failed login attempt from IP 192.168.1.45</p>
                            <p className="text-xs text-gray-500">4 hours ago</p>
                        </div>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default SuperAdminDashboard;
