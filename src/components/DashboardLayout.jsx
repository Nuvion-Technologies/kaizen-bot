// import React, { useState } from 'react';
// import { Bell, LogOut, Menu, X } from 'lucide-react';
// import Sidebar from './Sidebar'; // Import the external Sidebar
//
// const DashboardLayout = ({ children }) => {
//     const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
//
//     const toggleMobileMenu = () => {
//         setMobileMenuOpen(!mobileMenuOpen);
//     };
//
//     return (
//         <div className="flex h-screen bg-gray-100">
//             {/* External Sidebar */}
//             {/*<Sidebar />*/}
//
//             {/* Main content area */}
//             <div className="flex flex-col flex-1 overflow-hidden md:ml-64"> {/* Offset for sidebar width */}
//                 {/* Top Navigation */}
//                 <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
//                     <button
//                         className="px-4 border-r border-gray-200 text-gray-500 md:hidden"
//                         onClick={toggleMobileMenu}
//                     >
//                         <span className="sr-only">Open sidebar</span>
//                         <Menu className="h-6 w-6" />
//                     </button>
//                     <div className="flex-1 px-4 flex justify-between">
//                         <div className="flex-1 flex items-center">
//                             <h1 className="text-2xl font-semibold text-gray-900">Super Admin Dashboard</h1>
//                         </div>
//                         <div className="ml-4 flex items-center md:ml-6">
//                             <button className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                                 <span className="sr-only">View notifications</span>
//                                 <Bell className="h-6 w-6" />
//                             </button>
//                             <div className="ml-3 relative">
//                                 <button className="max-w-xs bg-white flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                                     <span className="sr-only">Open user menu</span>
//                                     <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
//                                         A
//                                     </div>
//                                 </button>
//                             </div>
//                             <button className="ml-4 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
//                                 <span className="sr-only">Log out</span>
//                                 <LogOut className="h-6 w-6" />
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Mobile Sidebar Overlay */}
//                 {mobileMenuOpen && (
//                     <div className="fixed inset-0 z-40 md:hidden">
//                         <div
//                             className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300"
//                             onClick={toggleMobileMenu}
//                         ></div>
//                         <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white transform transition duration-300 ease-in-out translate-x-0">
//                             <div className="absolute top-0 right-0 -mr-12 pt-2">
//                                 <button
//                                     className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//                                     onClick={toggleMobileMenu}
//                                 >
//                                     <X className="h-6 w-6 text-white" />
//                                 </button>
//                             </div>
//                             <Sidebar /> {/* Embed Sidebar for mobile */}
//                         </div>
//                     </div>
//                 )}
//
//                 {/* Main Content */}
//                 <main className="flex-1 relative overflow-y-auto focus:outline-none p-6">
//                     {children}
//                 </main>
//             </div>
//         </div>
//     );
// };
//
// export default DashboardLayout;

















import React, { useState, useContext } from 'react';
import { Bell, LogOut, Menu, X } from 'lucide-react';
import Sidebar from './Sidebar'; // Import the external Sidebar
import { ThemeContext } from '../context/ThemeContext';

const DashboardLayout = ({ children }) => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme } = useContext(ThemeContext);

    const toggleMobileMenu = () => {
        setMobileMenuOpen(!mobileMenuOpen);
    };

    return (
        <div
            className={`flex h-screen ${
                theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            }`}
        >
            {/* External Sidebar (Desktop) */}
            <Sidebar />

            {/* Main content area */}
            <div className="flex flex-col flex-1 overflow-hidden md:ml-64">
                {/* Top Navigation */}
                <div
                    className={`relative z-10 flex-shrink-0 flex h-16 shadow ${
                        theme === 'dark'
                            ? 'bg-gray-900 border-b border-gray-700 text-gray-200'
                            : 'bg-white border-b border-gray-200 text-gray-700'
                    }`}
                >
                    <button
                        className={`px-4 border-r ${
                            theme === 'dark'
                                ? 'border-gray-700 text-gray-400 hover:bg-gray-700'
                                : 'border-gray-200 text-gray-500 hover:bg-gray-100'
                        } md:hidden`}
                        onClick={toggleMobileMenu}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                        <div className="flex-1 flex items-center">
                            <h1
                                className={`text-2xl font-semibold ${
                                    theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                }`}
                            >
                                Super Admin Dashboard
                            </h1>
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            <button
                                className={`p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    theme === 'dark'
                                        ? 'bg-gray-900 text-gray-400 hover:text-gray-300'
                                        : 'bg-white text-gray-400 hover:text-gray-500'
                                }`}
                            >
                                <span className="sr-only">View notifications</span>
                                <Bell className="h-6 w-6" />
                            </button>
                            <div className="ml-3 relative">
                                <button
                                    className={`max-w-xs flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                                    }`}
                                >
                                    <span className="sr-only">Open user menu</span>
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                                        A
                                    </div>
                                </button>
                            </div>
                            <button
                                className={`ml-4 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${
                                    theme === 'dark'
                                        ? 'bg-gray-900 text-gray-400 hover:text-gray-300'
                                        : 'bg-white text-gray-400 hover:text-gray-500'
                                }`}
                            >
                                <span className="sr-only">Log out</span>
                                <LogOut className="h-6 w-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Sidebar Overlay */}
                {mobileMenuOpen && (
                    <div className="fixed inset-0 z-40 md:hidden">
                        <div
                            className={`fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity duration-300`}
                            onClick={toggleMobileMenu}
                        ></div>
                        <div
                            className={`relative flex-1 flex flex-col max-w-xs w-full transform transition duration-300 ease-in-out translate-x-0 ${
                                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                            }`}
                        >
                            <div className="absolute top-0 right-0 -mr-12 pt-2">
                                <button
                                    className={`ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white ${
                                        theme === 'dark' ? 'text-gray-300' : 'text-white'
                                    }`}
                                    onClick={toggleMobileMenu}
                                >
                                    <X className="h-6 w-6" />
                                </button>
                            </div>
                            <Sidebar /> {/* Embed Sidebar for mobile */}
                        </div>
                    </div>
                )}

                {/* Main Content */}
                <main
                    className={`flex-1 relative overflow-y-auto focus:outline-none p-6 ${
                        theme === 'dark' ? 'bg-gray-800 text-gray-200' : 'bg-gray-100 text-gray-900'
                    }`}
                >
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;








