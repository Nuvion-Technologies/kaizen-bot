import React from 'react';
import {
    LayoutDashboard,
    Users,
    Settings,
    LogOut,
    Bell,
    Search,
    Menu,
    X
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = React.useState(false);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Mobile sidebar backdrop */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                ></div>
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
                <div className="flex items-center justify-between h-16 px-6 border-b">
                    <h1 className="text-xl font-semibold text-gray-800">Admin Portal</h1>
                    <button
                        className="lg:hidden text-gray-500 hover:text-gray-700"
                        onClick={() => setSidebarOpen(false)}
                    >
                        <X size={20} />
                    </button>
                </div>
                <nav className="px-4 py-6">
                    <ul className="space-y-1">
                        <li>
                            <a href="#" className="flex items-center px-4 py-3 text-gray-800 bg-gray-100 rounded-md">
                                <LayoutDashboard className="w-5 h-5 mr-3" />
                                <span>Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md">
                                <Users className="w-5 h-5 mr-3" />
                                <span>Members</span>
                            </a>
                        </li>
                        <li>
                            <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md">
                                <Settings className="w-5 h-5 mr-3" />
                                <span>Settings</span>
                            </a>
                        </li>
                    </ul>
                    <div className="pt-8 mt-8 border-t">
                        <a href="#" className="flex items-center px-4 py-3 text-gray-600 hover:bg-gray-100 rounded-md">
                            <LogOut className="w-5 h-5 mr-3" />
                            <span>Logout</span>
                        </a>
                    </div>
                </nav>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col lg:ml-64">
                {/* Header */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b">
                    <button
                        className="text-gray-500 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu size={24} />
                    </button>
                    <div className="flex-1 flex justify-center lg:justify-end">
                        <div className="relative w-full max-w-md lg:max-w-xs">
                            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                <Search className="w-5 h-5 text-gray-400" />
                            </span>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                            />
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button className="p-1 text-gray-400 rounded-full hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                            <Bell className="w-6 h-6" />
                        </button>
                        <div className="ml-4 relative flex-shrink-0">
                            <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-medium">
                                SA
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;
