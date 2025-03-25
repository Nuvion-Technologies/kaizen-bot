// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { logout, getAuthToken, getUserRole } from '../utils/auth';
// import { LogOut, Bell, Menu, X, ChevronDown } from 'lucide-react';
// import api from '.././utils/api.js';
//
// const Navbar = () => {
//     const [userData, setUserData] = useState({ role: '', name: '' });
//     const [notifications, setNotifications] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [showProfileMenu, setShowProfileMenu] = useState(false);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             if (getAuthToken()) {
//                 try {
//                     // Get user role from backend
//                     const role = await getUserRole();
//
//                     // Fetch user profile data
//                     // This would be a separate API call in a real app
//                     // For now, we'll use a placeholder name based on role
//                     let name = 'User';
//                     if (role === 'superuser') name = 'Super Admin';
//                     else if (role === 'manager') name = 'Manager';
//
//                     setUserData({
//                         role: role || '',
//                         name: name
//                     });
//
//                     // Mock notifications - in a real app, you'd fetch these from an API
//                     setNotifications([
//                         { id: 1, text: 'New market update available', time: '5m ago', read: false },
//                         { id: 2, text: 'Your order was executed successfully', time: '1h ago', read: false },
//                         { id: 3, text: 'Portfolio performance report ready', time: '3h ago', read: true }
//                     ]);
//                 } catch (error) {
//                     console.error('Error fetching user data:', error);
//                 }
//             }
//         };
//
//         fetchUserData();
//     }, []);
//
//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };
//
//     const toggleNotifications = () => {
//         setShowNotifications(!showNotifications);
//         if (showProfileMenu) setShowProfileMenu(false);
//     };
//
//     const toggleProfileMenu = () => {
//         setShowProfileMenu(!showProfileMenu);
//         if (showNotifications) setShowNotifications(false);
//     };
//
//     const toggleMobileMenu = () => {
//         setShowMobileMenu(!showMobileMenu);
//     };
//
//     const unreadCount = notifications.filter(n => !n.read).length;
//
//     return (
//         <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
//             <div className="flex justify-between items-center mx-auto">
//                 <div className="flex items-center">
//                     <Link to="/" className="flex items-center">
//                         <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600">
//                             StockBot
//                         </span>
//                     </Link>
//                 </div>
//
//                 {/* Mobile menu button */}
//                 <button
//                     className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
//                     onClick={toggleMobileMenu}
//                 >
//                     {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
//                 </button>
//
//                 {/* Desktop Navigation */}
//                 <div className={`items-center justify-between ${showMobileMenu ? 'flex flex-col absolute top-16 left-0 right-0 bg-white shadow-md p-4 z-50' : 'hidden md:flex'}`}>
//                     <div className="flex items-center space-x-4">
//                         {/* Notification bell */}
//                         <div className="relative">
//                             <button
//                                 className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 relative"
//                                 onClick={toggleNotifications}
//                             >
//                                 <Bell size={20} />
//                                 {unreadCount > 0 && (
//                                     <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
//                                         {unreadCount}
//                                     </span>
//                                 )}
//                             </button>
//
//                             {/* Notification dropdown */}
//                             {showNotifications && (
//                                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
//                                     <div className="px-4 py-2 border-b border-gray-200">
//                                         <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
//                                     </div>
//                                     <div className="max-h-60 overflow-y-auto">
//                                         {notifications.length > 0 ? (
//                                             notifications.map(notification => (
//                                                 <div
//                                                     key={notification.id}
//                                                     className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
//                                                 >
//                                                     <p className="text-sm text-gray-800">{notification.text}</p>
//                                                     <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <p className="px-4 py-3 text-sm text-gray-500">No notifications</p>
//                                         )}
//                                     </div>
//                                     {notifications.length > 0 && (
//                                         <div className="px-4 py-2 border-t border-gray-200">
//                                             <button className="text-xs text-blue-600 hover:text-blue-800">
//                                                 Mark all as read
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//
//                         {/* User profile */}
//                         <div className="relative">
//                             <button
//                                 className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
//                                 onClick={toggleProfileMenu}
//                             >
//                                 <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
//                                     {userData.name.charAt(0).toUpperCase()}
//                                 </div>
//                                 <span className="hidden md:block">{userData.name}</span>
//                                 <ChevronDown size={16} className="ml-1" />
//                             </button>
//
//                             {/* Profile dropdown */}
//                             {showProfileMenu && (
//                                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
//                                     <div className="px-4 py-2 border-b border-gray-200">
//                                         <p className="text-sm font-semibold text-gray-700">{userData.name}</p>
//                                         <p className="text-xs text-gray-500 capitalize">{userData.role}</p>
//                                     </div>
//                                     <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Your Profile
//                                     </Link>
//                                     <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Settings
//                                     </Link>
//                                     <button
//                                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                                         onClick={handleLogout}
//                                     >
//                                         Sign out
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };
//
// export default Navbar;





//
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { logout, getUserRole } from '../utils/auth';
// import { LogOut, Bell, Menu, X, ChevronDown } from 'lucide-react';
//
// const Navbar = () => {
//     const [userData, setUserData] = useState({ role: '', name: '' });
//     const [notifications, setNotifications] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [showProfileMenu, setShowProfileMenu] = useState(false);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const role = getUserRole();
//             if (role) {
//                 // For now, we'll use a placeholder name based on role
//                 let name = 'User';
//                 if (role === 'superuser') name = 'Super Admin';
//                 else if (role === 'manager') name = 'Manager';
//
//                 setUserData({
//                     role: role || '',
//                     name: name
//                 });
//
//                 // Mock notifications - in a real app, you'd fetch these from an API
//                 setNotifications([
//                     { id: 1, text: 'New market update available', time: '5m ago', read: false },
//                     { id: 2, text: 'Your order was executed successfully', time: '1h ago', read: false },
//                     { id: 3, text: 'Portfolio performance report ready', time: '3h ago', read: true }
//                 ]);
//             }
//         };
//
//         fetchUserData();
//     }, []);
//
//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };
//
//     const toggleNotifications = () => {
//         setShowNotifications(!showNotifications);
//         if (showProfileMenu) setShowProfileMenu(false);
//     };
//
//     const toggleProfileMenu = () => {
//         setShowProfileMenu(!showProfileMenu);
//         if (showNotifications) setShowNotifications(false);
//     };
//
//     const toggleMobileMenu = () => {
//         setShowMobileMenu(!showMobileMenu);
//     };
//
//     const unreadCount = notifications.filter(n => !n.read).length;
//
//     return (
//         <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
//             <div className="flex justify-between items-center mx-auto">
//                 <div className="flex items-center">
//                     <Link to="/" className="flex items-center">
//                         <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600">
//                             Kaizen Bot
//                         </span>
//                     </Link>
//                 </div>
//
//                 {/* Mobile menu button */}
//                 <button
//                     className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
//                     onClick={toggleMobileMenu}
//                 >
//                     {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
//                 </button>
//
//                 {/* Desktop Navigation */}
//                 <div className={`items-center justify-between ${showMobileMenu ? 'flex flex-col absolute top-16 left-0 right-0 bg-white shadow-md p-4 z-50' : 'hidden md:flex'}`}>
//                     <div className="flex items-center space-x-4">
//                         {/* Notification bell */}
//                         <div className="relative">
//                             <button
//                                 className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 relative"
//                                 onClick={toggleNotifications}
//                             >
//                                 <Bell size={20} />
//                                 {unreadCount > 0 && (
//                                     <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
//                                         {unreadCount}
//                                     </span>
//                                 )}
//                             </button>
//
//                             {/* Notification dropdown */}
//                             {showNotifications && (
//                                 <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
//                                     <div className="px-4 py-2 border-b border-gray-200">
//                                         <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
//                                     </div>
//                                     <div className="max-h-60 overflow-y-auto">
//                                         {notifications.length > 0 ? (
//                                             notifications.map(notification => (
//                                                 <div
//                                                     key={notification.id}
//                                                     className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
//                                                 >
//                                                     <p className="text-sm text-gray-800">{notification.text}</p>
//                                                     <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <p className="px-4 py-3 text-sm text-gray-500">No notifications</p>
//                                         )}
//                                     </div>
//                                     {notifications.length > 0 && (
//                                         <div className="px-4 py-2 border-t border-gray-200">
//                                             <button className="text-xs text-blue-600 hover:text-blue-800">
//                                                 Mark all as read
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//
//                         {/* User profile */}
//                         <div className="relative">
//                             <button
//                                 className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
//                                 onClick={toggleProfileMenu}
//                             >
//                                 <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
//                                     {userData.name.charAt(0).toUpperCase()}
//                                 </div>
//                                 <span className="hidden md:block">{userData.name}</span>
//                                 <ChevronDown size={16} className="ml-1" />
//                             </button>
//
//                             {/* Profile dropdown */}
//                             {showProfileMenu && (
//                                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
//                                     <div className="px-4 py-2 border-b border-gray-200">
//                                         <p className="text-sm font-semibold text-gray-700">{userData.name}</p>
//                                         <p className="text-xs text-gray-500 capitalize">{userData.role}</p>
//                                     </div>
//                                     <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Your Profile
//                                     </Link>
//                                     <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
//                                         Settings
//                                     </Link>
//                                     <button
//                                         className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
//                                         onClick={handleLogout}
//                                     >
//                                         Sign out
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };
//
// export default Navbar;

//
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { logout, getUserRole } from '../utils/auth';
// import { LogOut, Bell, Menu, X, ChevronDown } from 'lucide-react';
// import ThemeToggle from '../context/ThemeToggle';
//
// const Navbar = () => {
//     const [userData, setUserData] = useState({ role: '', name: '' });
//     const [notifications, setNotifications] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [showProfileMenu, setShowProfileMenu] = useState(false);
//     const navigate = useNavigate();
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const role = getUserRole();
//             if (role) {
//                 let name = 'User';
//                 if (role === 'superuser') name = 'Super Admin';
//                 else if (role === 'manager') name = 'Manager';
//
//                 setUserData({
//                     role: role || '',
//                     name: name
//                 });
//
//                 setNotifications([
//                     { id: 1, text: 'New market update available', time: '5m ago', read: false },
//                     { id: 2, text: 'Your order was executed successfully', time: '1h ago', read: false },
//                     { id: 3, text: 'Portfolio performance report ready', time: '3h ago', read: true }
//                 ]);
//             }
//         };
//
//         fetchUserData();
//     }, []);
//
//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };
//
//     const toggleNotifications = () => {
//         setShowNotifications(!showNotifications);
//         if (showProfileMenu) setShowProfileMenu(false);
//     };
//
//     const toggleProfileMenu = () => {
//         setShowProfileMenu(!showProfileMenu);
//         if (showNotifications) setShowNotifications(false);
//     };
//
//     const toggleMobileMenu = () => {
//         setShowMobileMenu(!showMobileMenu);
//     };
//
//     const unreadCount = notifications.filter(n => !n.read).length;
//
//     return (
//         <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
//             <div className="flex justify-between items-center mx-auto">
//                 <div className="flex items-center">
//                     <Link to="/" className="flex items-center">
//                         <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600">
//                             Kaizen Bot
//                         </span>
//                     </Link>
//                 </div>
//
//                 <button
//                     className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
//                     onClick={toggleMobileMenu}
//                 >
//                     {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
//                 </button>
//
//                 <div className={`items-center justify-between ${showMobileMenu ? 'flex flex-col absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-md p-4 z-50' : 'hidden md:flex'}`}>
//                     <div className="flex items-center space-x-4">
//                         <div className="relative">
//                             <button
//                                 className="p-2 text-gray-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200 relative"
//                                 onClick={toggleNotifications}
//                             >
//                                 <Bell size={20} />
//                                 {unreadCount > 0 && (
//                                     <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
//                                         {unreadCount}
//                                     </span>
//                                 )}
//                             </button>
//
//                             {showNotifications && (
//                                 <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700">
//                                     <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                                         <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-200">Notifications</h3>
//                                     </div>
//                                     <div className="max-h-60 overflow-y-auto">
//                                         {notifications.length > 0 ? (
//                                             notifications.map(notification => (
//                                                 <div
//                                                     key={notification.id}
//                                                     className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 ${!notification.read ? 'bg-blue-50 dark:bg-blue-900' : ''}`}
//                                                 >
//                                                     <p className="text-sm text-gray-800 dark:text-gray-200">{notification.text}</p>
//                                                     <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{notification.time}</p>
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <p className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">No notifications</p>
//                                         )}
//                                     </div>
//                                     {notifications.length > 0 && (
//                                         <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
//                                             <button className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300">
//                                                 Mark all as read
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//
//                         <ThemeToggle />
//
//                         <div className="relative">
//                             <button
//                                 className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
//                                 onClick={toggleProfileMenu}
//                             >
//                                 <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
//                                     {userData.name.charAt(0).toUpperCase()}
//                                 </div>
//                                 <span className="hidden md:block">{userData.name}</span>
//                                 <ChevronDown size={16} className="ml-1" />
//                             </button>
//
//                             {showProfileMenu && (
//                                 <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg py-2 z-10 border border-gray-200 dark:border-gray-700">
//                                     <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
//                                         <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">{userData.name}</p>
//                                         <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{userData.role}</p>
//                                     </div>
//                                     <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
//                                         Your Profile
//                                     </Link>
//                                     <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">
//                                         Settings
//                                     </Link>
//                                     <button
//                                         className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
//                                         onClick={handleLogout}
//                                     >
//                                         Sign out
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };
//
// export default Navbar;


// import React, { useState, useEffect, useContext } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { logout, getUserRole } from '../utils/auth';
// import { Bell, Menu, X, ChevronDown } from 'lucide-react';
// import ThemeToggle from '.././context/ThemeToggle'; // Adjusted path
// import { ThemeContext } from '../context/ThemeContext';
//
// const Navbar = () => {
//     const [userData, setUserData] = useState({ role: '', name: '' });
//     const [notifications, setNotifications] = useState([]);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [showProfileMenu, setShowProfileMenu] = useState(false);
//     const navigate = useNavigate();
//     const { theme } = useContext(ThemeContext);
//
//     useEffect(() => {
//         const fetchUserData = async () => {
//             const role = getUserRole();
//             if (role) {
//                 let name = 'User';
//                 if (role === 'superuser') name = 'Super Admin';
//                 else if (role === 'manager') name = 'Manager';
//
//                 setUserData({
//                     role: role || '',
//                     name: name,
//                 });
//
//                 setNotifications([
//                     { id: 1, text: 'New market update available', time: '5m ago', read: false },
//                     { id: 2, text: 'Your order was executed successfully', time: '1h ago', read: false },
//                     { id: 3, text: 'Portfolio performance report ready', time: '3h ago', read: true },
//                 ]);
//             }
//         };
//
//         fetchUserData();
//     }, []);
//
//     const handleLogout = () => {
//         logout();
//         navigate('/login');
//     };
//
//     const toggleNotifications = () => {
//         setShowNotifications(!showNotifications);
//         if (showProfileMenu) setShowProfileMenu(false);
//     };
//
//     const toggleProfileMenu = () => {
//         setShowProfileMenu(!showProfileMenu);
//         if (showNotifications) setShowNotifications(false);
//     };
//
//     const toggleMobileMenu = () => {
//         setShowMobileMenu(!showMobileMenu);
//     };
//
//     const unreadCount = notifications.filter((n) => !n.read).length;
//
//     return (
//         <nav
//             className={`${
//                 theme === 'dark'
//                     ? 'bg-gray-900 border-gray-700 text-gray-200'
//                     : 'bg-white border-gray-200 text-gray-700'
//             } border-b px-4 py-2.5 fixed left-0 right-0 top-0 z-50`}
//         >
//             <div className="flex justify-between items-center mx-auto">
//                 <div className="flex items-center">
//                     <Link to="/" className="flex items-center">
//                         <span className="self-center text-xl font-semibold whitespace-nowrap text-[#2b7efe]">
//                             Kaizen Bot
//                         </span>
//                     </Link>
//                 </div>
//
//                 <button
//                     className={`md:hidden p-2 rounded-lg ${
//                         theme === 'dark'
//                             ? 'text-gray-400 hover:bg-gray-700 focus:ring-gray-600'
//                             : 'text-gray-500 hover:bg-gray-100 focus:ring-gray-200'
//                     } focus:outline-none focus:ring-2`}
//                     onClick={toggleMobileMenu}
//                 >
//                     {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
//                 </button>
//
//                 <div
//                     className={`items-center justify-between ${
//                         showMobileMenu
//                             ? `flex flex-col absolute top-16 left-0 right-0 ${
//                                 theme === 'dark' ? 'bg-gray-900' : 'bg-white'
//                             } shadow-md p-4 z-50`
//                             : 'hidden md:flex'
//                     }`}
//                 >
//                     <div className="flex items-center space-x-4">
//                         <div className="relative">
//                             <button
//                                 className={`p-2 rounded-full ${
//                                     theme === 'dark'
//                                         ? 'text-gray-400 hover:bg-gray-700 focus:ring-gray-600'
//                                         : 'text-gray-500 hover:bg-gray-100 focus:ring-gray-200'
//                                 } focus:outline-none focus:ring-2 relative`}
//                                 onClick={toggleNotifications}
//                             >
//                                 <Bell size={20} />
//                                 {unreadCount > 0 && (
//                                     <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
//                                         {unreadCount}
//                                     </span>
//                                 )}
//                             </button>
//
//                             {showNotifications && (
//                                 <div
//                                     className={`absolute right-0 mt-2 w-80 rounded-lg shadow-lg py-2 z-10 border ${
//                                         theme === 'dark'
//                                             ? 'bg-gray-800 border-gray-700 text-gray-200'
//                                             : 'bg-white border-gray-200 text-gray-700'
//                                     }`}
//                                 >
//                                     <div
//                                         className={`px-4 py-2 border-b ${
//                                             theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//                                         }`}
//                                     >
//                                         <h3
//                                             className={`text-sm font-semibold ${
//                                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
//                                             }`}
//                                         >
//                                             Notifications
//                                         </h3>
//                                     </div>
//                                     <div className="max-h-60 overflow-y-auto">
//                                         {notifications.length > 0 ? (
//                                             notifications.map((notification) => (
//                                                 <div
//                                                     key={notification.id}
//                                                     className={`px-4 py-3 border-b ${
//                                                         theme === 'dark'
//                                                             ? 'hover:bg-gray-700 border-gray-600'
//                                                             : 'hover:bg-gray-50 border-gray-100'
//                                                     } ${
//                                                         !notification.read
//                                                             ? theme === 'dark'
//                                                                 ? 'bg-blue-900'
//                                                                 : 'bg-blue-50'
//                                                             : ''
//                                                     }`}
//                                                 >
//                                                     <p
//                                                         className={`text-sm ${
//                                                             theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                                         }`}
//                                                     >
//                                                         {notification.text}
//                                                     </p>
//                                                     <p
//                                                         className={`text-xs mt-1 ${
//                                                             theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                                         }`}
//                                                     >
//                                                         {notification.time}
//                                                     </p>
//                                                 </div>
//                                             ))
//                                         ) : (
//                                             <p
//                                                 className={`px-4 py-3 text-sm ${
//                                                     theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                                 }`}
//                                             >
//                                                 No notifications
//                                             </p>
//                                         )}
//                                     </div>
//                                     {notifications.length > 0 && (
//                                         <div
//                                             className={`px-4 py-2 border-t ${
//                                                 theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//                                             }`}
//                                         >
//                                             <button
//                                                 className={`text-xs ${
//                                                     theme === 'dark'
//                                                         ? 'text-blue-400 hover:text-blue-300'
//                                                         : 'text-blue-600 hover:text-blue-800'
//                                                 }`}
//                                             >
//                                                 Mark all as read
//                                             </button>
//                                         </div>
//                                     )}
//                                 </div>
//                             )}
//                         </div>
//
//                         <ThemeToggle />
//
//                         <div className="relative">
//                             <button
//                                 className={`flex items-center text-sm font-medium rounded-lg p-2 ${
//                                     theme === 'dark'
//                                         ? 'text-gray-200 hover:text-blue-400 hover:bg-gray-700'
//                                         : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
//                                 }`}
//                                 onClick={toggleProfileMenu}
//                             >
//                                 <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
//                                     {userData.name.charAt(0).toUpperCase()}
//                                 </div>
//                                 <span className="hidden md:block">{userData.name}</span>
//                                 <ChevronDown size={16} className="ml-1" />
//                             </button>
//
//                             {showProfileMenu && (
//                                 <div
//                                     className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-10 border ${
//                                         theme === 'dark'
//                                             ? 'bg-gray-800 border-gray-700 text-gray-200'
//                                             : 'bg-white border-gray-200 text-gray-700'
//                                     }`}
//                                 >
//                                     <div
//                                         className={`px-4 py-2 border-b ${
//                                             theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//                                         }`}
//                                     >
//                                         <p
//                                             className={`text-sm font-semibold ${
//                                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
//                                             }`}
//                                         >
//                                             {userData.name}
//                                         </p>
//                                         <p
//                                             className={`text-xs capitalize ${
//                                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                             }`}
//                                         >
//                                             {userData.role}
//                                         </p>
//                                     </div>
//                                     <Link
//                                         to="/profile"
//                                         className={`block px-4 py-2 text-sm ${
//                                             theme === 'dark'
//                                                 ? 'text-gray-200 hover:bg-gray-700'
//                                                 : 'text-gray-700 hover:bg-gray-100'
//                                         }`}
//                                     >
//                                         Your Profile
//                                     </Link>
//                                     {/*<Link*/}
//                                     {/*    to="/settings"*/}
//                                     {/*    className={`block px-4 py-2 text-sm ${*/}
//                                     {/*        theme === 'dark'*/}
//                                     {/*            ? 'text-gray-200 hover:bg-gray-700'*/}
//                                     {/*            : 'text-gray-700 hover:bg-gray-100'*/}
//                                     {/*    }`}*/}
//                                     {/*>*/}
//                                     {/*    Settings*/}
//                                     {/*</Link>*/}
//                                     <button
//                                         className={`block w-full text-left px-4 py-2 text-sm ${
//                                             theme === 'dark'
//                                                 ? 'text-red-400 hover:bg-gray-700'
//                                                 : 'text-red-600 hover:bg-gray-100'
//                                         }`}
//                                         onClick={handleLogout}
//                                     >
//                                         Sign out
//                                     </button>
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </nav>
//     );
// };
//
// export default Navbar;





import React, { useState, useEffect, useContext, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { logout, getUserRole } from '../utils/auth';
import { Bell, Menu, X, ChevronDown } from 'lucide-react';
import ThemeToggle from '../context/ThemeToggle';
import { ThemeContext } from '../context/ThemeContext';
import { encryptMessage, decryptMessage, parseApiResponse } from '../utils/crypto';

const Navbar = () => {
    const [userData, setUserData] = useState({ role: '', name: '' });
    const [notifications, setNotifications] = useState([]);
    const [latestNotification, setLatestNotification] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [hasData, setHasData] = useState(false);
    const intervalRef = useRef(null);
    const notificationRef = useRef(null);
    const latestNotifTimeoutRef = useRef(null);
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const getAuthToken = () => localStorage.getItem('token');

    const fetchOrderHistory = async () => {
        try {
            const token = getAuthToken();
            if (!token) {
                toast.error('No authentication token found. Please log in.');
                return;
            }

            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-order-history`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });

            const decryptedData = parseApiResponse(response.data.data);
            if (decryptedData.status === '200') {
                const orderHistory = decryptedData.order_history || [];
                const updatedNotifications = orderHistory.map((order, index) => {
                    // Preserve the read status of existing notifications
                    const existingNotification = notifications.find((n) => n.id === (order.order_id || index));
                    return {
                        id: order.order_id || index,
                        text: `${order.buy_sell === 'BUY' ? 'Bought' : 'Sold'} ${order.quantity} of ${order.symbol} at ₹${order.price} - ${order.status}`,
                        time: order.updated_at,
                        read: existingNotification ? existingNotification.read : false,
                    };
                });

                // Check for new notifications
                const existingIds = notifications.map((n) => n.id);
                const newNotifications = updatedNotifications.filter((n) => !existingIds.includes(n.id));

                // Update notifications state
                setNotifications(updatedNotifications);
                setHasData(updatedNotifications.length > 0);

                // If there are new notifications, display the latest unread one
                if (newNotifications.length > 0) {
                    const latestUnread = newNotifications.find((n) => !n.read) || newNotifications[0];
                    if (latestUnread && !latestUnread.read) {
                        setLatestNotification(latestUnread);

                        // Clear any existing timeout
                        if (latestNotifTimeoutRef.current) {
                            clearTimeout(latestNotifTimeoutRef.current);
                        }

                        // Set a timeout to hide the latest notification and mark it as read after 3 seconds
                        latestNotifTimeoutRef.current = setTimeout(() => {
                            setLatestNotification(null);
                            // Mark the notification as read when it disappears
                            setNotifications((prev) =>
                                prev.map((n) =>
                                    n.id === latestUnread.id ? { ...n, read: true } : n
                                )
                            );
                        }, 3000);
                    }
                }
            } else {
                throw new Error(decryptedData.message || 'Failed to fetch order history');
            }
        } catch (err) {
            // console.error('Error fetching order history:', err);
            toast.error('Failed to fetch order history: ' + err.message);
            setHasData(false);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const role = getUserRole();
            if (role) {
                let name = 'User';
                if (role === 'superuser') name = 'Super Admin';
                else if (role === 'manager') name = 'Manager';

                setUserData({
                    role: role || '',
                    name: name,
                });

                await fetchOrderHistory();
            }
        };

        fetchUserData();

        intervalRef.current = setInterval(() => {
            if (hasData) {
                fetchOrderHistory();
            }
        }, 5000);

        return () => {
            if (intervalRef.current) {
                // console.log('Cleaning up order history polling interval');
                clearInterval(intervalRef.current);
            }
            if (latestNotifTimeoutRef.current) {
                clearTimeout(latestNotifTimeoutRef.current);
            }
        };
    }, [hasData]);

    // Handle outside click to close notification dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const markAsRead = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) =>
                notification.id === id ? { ...notification, read: true } : notification
            )
        );
        // If the marked notification is the latest one, hide it
        if (latestNotification && latestNotification.id === id) {
            setLatestNotification(null);
            if (latestNotifTimeoutRef.current) {
                clearTimeout(latestNotifTimeoutRef.current);
            }
        }
    };

    const markAllAsRead = () => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notification) => ({ ...notification, read: true }))
        );
        // Hide the latest notification if it's being displayed
        if (latestNotification) {
            setLatestNotification(null);
            if (latestNotifTimeoutRef.current) {
                clearTimeout(latestNotifTimeoutRef.current);
            }
        }
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
        if (showProfileMenu) setShowProfileMenu(false);
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
        if (showNotifications) setShowNotifications(false);
    };

    const toggleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const unreadCount = notifications.filter((n) => !n.read).length;

    return (
        <nav
            className={`${
                theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-200'
                    : 'bg-white border-gray-200 text-gray-700'
            } border-b px-4 py-2.5 fixed left-0 right-0 top-0 z-50`}
        >
            <div className="flex justify-between items-center mx-auto">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-[#2b7efe]">
                            Kaizen Bot
                        </span>
                    </Link>
                </div>

                <button
                    className={`md:hidden p-2 rounded-lg ${
                        theme === 'dark'
                            ? 'text-gray-400 hover:bg-gray-700 focus:ring-gray-600'
                            : 'text-gray-500 hover:bg-gray-100 focus:ring-gray-200'
                    } focus:outline-none focus:ring-2`}
                    onClick={toggleMobileMenu}
                >
                    {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>

                <div
                    className={`items-center justify-between ${
                        showMobileMenu
                            ? `flex flex-col absolute top-16 left-0 right-0 ${
                                theme === 'dark' ? 'bg-gray-900' : 'bg-white'
                            } shadow-md p-4 z-50`
                            : 'hidden md:flex'
                    }`}
                >
                    <div className="flex items-center space-x-4">
                        <div className="relative">
                            <button
                                className={`p-2 rounded-full ${
                                    theme === 'dark'
                                        ? 'text-gray-400 hover:bg-gray-700 focus:ring-gray-600'
                                        : 'text-gray-500 hover:bg-gray-100 focus:ring-gray-200'
                                } focus:outline-none focus:ring-2 relative`}
                                onClick={toggleNotifications}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Latest Notification Display */}
                            {latestNotification && !showNotifications && (
                                <div
                                    className={`absolute right-0 top-10 w-80 rounded-lg shadow-lg py-2 z-10 border ${
                                        theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700 text-gray-200'
                                            : 'bg-white border-gray-200 text-gray-800'
                                    } animate-fade-in`}
                                >
                                    <div className="px-4 py-3">
                                        <p
                                            className={`text-sm ${
                                                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                            }`}
                                        >
                                            {latestNotification.text}
                                        </p>
                                        <p
                                            className={`text-xs mt-1 ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}
                                        >
                                            {latestNotification.time}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* All Notifications Dropdown */}
                            {showNotifications && (
                                <div
                                    ref={notificationRef}
                                    className={`absolute right-0 top-10 w-80 rounded-lg shadow-lg py-2 z-10 border ${
                                        theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700 text-gray-200'
                                            : 'bg-white border-gray-200 text-gray-700'
                                    }`}
                                >
                                    <div
                                        className={`px-4 py-2 border-b ${
                                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                        }`}
                                    >
                                        <h3
                                            className={`text-sm font-semibold ${
                                                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                            }`}
                                        >
                                            Notifications
                                        </h3>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map((notification) => (
                                                <div
                                                    key={notification.id}
                                                    className={`px-4 py-3 border-b flex justify-between items-center ${
                                                        theme === 'dark'
                                                            ? 'hover:bg-gray-700 border-gray-600'
                                                            : 'hover:bg-gray-50 border-gray-100'
                                                    } ${
                                                        !notification.read
                                                            ? theme === 'dark'
                                                                ? 'bg-blue-900'
                                                                : 'bg-blue-50'
                                                            : ''
                                                    }`}
                                                >
                                                    <div>
                                                        <p
                                                            className={`text-sm ${
                                                                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                                            }`}
                                                        >
                                                            {notification.text}
                                                        </p>
                                                        <p
                                                            className={`text-xs mt-1 ${
                                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                            }`}
                                                        >
                                                            {notification.time}
                                                        </p>
                                                    </div>
                                                    {!notification.read && (
                                                        <button
                                                            onClick={() => markAsRead(notification.id)}
                                                            className={`text-xs ${
                                                                theme === 'dark'
                                                                    ? 'text-blue-400 hover:text-blue-300'
                                                                    : 'text-blue-600 hover:text-blue-800'
                                                            }`}
                                                        >
                                                            Mark as read
                                                        </button>
                                                    )}
                                                </div>
                                            ))
                                        ) : (
                                            <p
                                                className={`px-4 py-3 text-sm ${
                                                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                                }`}
                                            >
                                                No notifications
                                            </p>
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div
                                            className={`px-4 py-2 border-t ${
                                                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                            }`}
                                        >
                                            <button
                                                onClick={markAllAsRead}
                                                className={`text-xs ${
                                                    theme === 'dark'
                                                        ? 'text-blue-400 hover:text-blue-300'
                                                        : 'text-blue-600 hover:text-blue-800'
                                                }`}
                                            >
                                                Mark all as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        <ThemeToggle />

                        <div className="relative">
                            <button
                                className={`flex items-center text-sm font-medium rounded-lg p-2 ${
                                    theme === 'dark'
                                        ? 'text-gray-200 hover:text-blue-400 hover:bg-gray-700'
                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                                }`}
                                onClick={toggleProfileMenu}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
                                    {userData.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden md:block">{userData.name}</span>
                                <ChevronDown size={16} className="ml-1" />
                            </button>

                            {showProfileMenu && (
                                <div
                                    className={`absolute right-0 mt-2 w-48 rounded-lg shadow-lg py-2 z-10 border ${
                                        theme === 'dark'
                                            ? 'bg-gray-800 border-gray-700 text-gray-200'
                                            : 'bg-white border-gray-200 text-gray-700'
                                    }`}
                                >
                                    <div
                                        className={`px-4 py-2 border-b ${
                                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                        }`}
                                    >
                                        <p
                                            className={`text-sm font-semibold ${
                                                theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
                                            }`}
                                        >
                                            {userData.name}
                                        </p>
                                        <p
                                            className={`text-xs capitalize ${
                                                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                            }`}
                                        >
                                            {userData.role}
                                        </p>
                                    </div>
                                    <Link
                                        to="/profile"
                                        className={`block px-4 py-2 text-sm ${
                                            theme === 'dark'
                                                ? 'text-gray-200 hover:bg-gray-700'
                                                : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                    >
                                        Your Profile
                                    </Link>
                                    <button
                                        className={`block w-full text-left px-4 py-2 text-sm ${
                                            theme === 'dark'
                                                ? 'text-red-400 hover:bg-gray-700'
                                                : 'text-red-600 hover:bg-gray-100'
                                        }`}
                                        onClick={handleLogout}
                                    >
                                        Sign out
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
