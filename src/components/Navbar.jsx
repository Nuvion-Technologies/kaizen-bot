
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

// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { logout, getUserRole } from '../utils/auth';
// import { Bell, Menu, X, ChevronDown } from 'lucide-react';
// import ThemeToggle from '../context/ThemeToggle';
// import { ThemeContext } from '../context/ThemeContext';
// import { encryptMessage, decryptMessage, parseApiResponse } from '../utils/crypto';
//
// const Navbar = () => {
//     const [userData, setUserData] = useState({ role: '', name: '' });
//     const [notifications, setNotifications] = useState([]);
//     const [latestNotification, setLatestNotification] = useState(null);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [showProfileMenu, setShowProfileMenu] = useState(false);
//     const [hasData, setHasData] = useState(false);
//     const intervalRef = useRef(null);
//     const notificationRef = useRef(null);
//     const latestNotifTimeoutRef = useRef(null);
//     const navigate = useNavigate();
//     const { theme } = useContext(ThemeContext);
//
//     const getAuthToken = () => localStorage.getItem('token');
//
//     const fetchOrderHistory = async () => {
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 toast.error('No authentication token found. Please log in.');
//                 return;
//             }
//
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-order-history`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData.status === '200') {
//                 const orderHistory = decryptedData.order_history || [];
//                 const updatedNotifications = orderHistory.map((order, index) => {
//                     // Preserve the read status of existing notifications
//                     const existingNotification = notifications.find((n) => n.id === (order.order_id || index));
//                     return {
//                         id: order.order_id || index,
//                         text: `${order.buy_sell === 'BUY' ? 'Bought' : 'Sold'} ${order.quantity} of ${order.symbol} at ₹${order.price} - ${order.status}`,
//                         time: order.updated_at,
//                         read: existingNotification ? existingNotification.read : false,
//                     };
//                 });
//
//                 // Check for new notifications
//                 const existingIds = notifications.map((n) => n.id);
//                 const newNotifications = updatedNotifications.filter((n) => !existingIds.includes(n.id));
//
//                 // Update notifications state
//                 setNotifications(updatedNotifications);
//                 setHasData(updatedNotifications.length > 0);
//
//                 // If there are new notifications, display the latest unread one
//                 if (newNotifications.length > 0) {
//                     const latestUnread = newNotifications.find((n) => !n.read) || newNotifications[0];
//                     if (latestUnread && !latestUnread.read) {
//                         setLatestNotification(latestUnread);
//
//                         // Clear any existing timeout
//                         if (latestNotifTimeoutRef.current) {
//                             clearTimeout(latestNotifTimeoutRef.current);
//                         }
//
//                         // Set a timeout to hide the latest notification and mark it as read after 3 seconds
//                         latestNotifTimeoutRef.current = setTimeout(() => {
//                             setLatestNotification(null);
//                             // Mark the notification as read when it disappears
//                             setNotifications((prev) =>
//                                 prev.map((n) =>
//                                     n.id === latestUnread.id ? { ...n, read: true } : n
//                                 )
//                             );
//                         }, 3000);
//                     }
//                 }
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to fetch order history');
//             }
//         } catch (err) {
//             // console.error('Error fetching order history:', err);
//             toast.error('Failed to fetch order history: ' + err.message);
//             setHasData(false);
//         }
//     };
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
//                 await fetchOrderHistory();
//             }
//         };
//
//         fetchUserData();
//
//         intervalRef.current = setInterval(() => {
//             if (hasData) {
//                 fetchOrderHistory();
//             }
//         }, 5000);
//
//         return () => {
//             if (intervalRef.current) {
//                 // console.log('Cleaning up order history polling interval');
//                 clearInterval(intervalRef.current);
//             }
//             if (latestNotifTimeoutRef.current) {
//                 clearTimeout(latestNotifTimeoutRef.current);
//             }
//         };
//     }, [hasData]);
//
//     // Handle outside click to close notification dropdown
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//                 setShowNotifications(false);
//             }
//         };
//
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//
//     const markAsRead = (id) => {
//         setNotifications((prevNotifications) =>
//             prevNotifications.map((notification) =>
//                 notification.id === id ? { ...notification, read: true } : notification
//             )
//         );
//         // If the marked notification is the latest one, hide it
//         if (latestNotification && latestNotification.id === id) {
//             setLatestNotification(null);
//             if (latestNotifTimeoutRef.current) {
//                 clearTimeout(latestNotifTimeoutRef.current);
//             }
//         }
//     };
//
//     const markAllAsRead = () => {
//         setNotifications((prevNotifications) =>
//             prevNotifications.map((notification) => ({ ...notification, read: true }))
//         );
//         // Hide the latest notification if it's being displayed
//         if (latestNotification) {
//             setLatestNotification(null);
//             if (latestNotifTimeoutRef.current) {
//                 clearTimeout(latestNotifTimeoutRef.current);
//             }
//         }
//     };
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
//                             {/* Latest Notification Display */}
//                             {latestNotification && !showNotifications && (
//                                 <div
//                                     className={`absolute right-0 top-10 w-80 rounded-lg shadow-lg py-2 z-10 border ${
//                                         theme === 'dark'
//                                             ? 'bg-gray-800 border-gray-700 text-gray-200'
//                                             : 'bg-white border-gray-200 text-gray-800'
//                                     } animate-fade-in`}
//                                 >
//                                     <div className="px-4 py-3">
//                                         <p
//                                             className={`text-sm ${
//                                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                             }`}
//                                         >
//                                             {latestNotification.text}
//                                         </p>
//                                         <p
//                                             className={`text-xs mt-1 ${
//                                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                             }`}
//                                         >
//                                             {latestNotification.time}
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}
//
//                             {/* All Notifications Dropdown */}
//                             {showNotifications && (
//                                 <div
//                                     ref={notificationRef}
//                                     className={`absolute right-0 top-10 w-80 rounded-lg shadow-lg py-2 z-10 border ${
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
//                                                     className={`px-4 py-3 border-b flex justify-between items-center ${
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
//                                                     <div>
//                                                         <p
//                                                             className={`text-sm ${
//                                                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                                             }`}
//                                                         >
//                                                             {notification.text}
//                                                         </p>
//                                                         <p
//                                                             className={`text-xs mt-1 ${
//                                                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                                             }`}
//                                                         >
//                                                             {notification.time}
//                                                         </p>
//                                                     </div>
//                                                     {!notification.read && (
//                                                         <button
//                                                             onClick={() => markAsRead(notification.id)}
//                                                             className={`text-xs ${
//                                                                 theme === 'dark'
//                                                                     ? 'text-blue-400 hover:text-blue-300'
//                                                                     : 'text-blue-600 hover:text-blue-800'
//                                                             }`}
//                                                         >
//                                                             Mark as read
//                                                         </button>
//                                                     )}
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
//                                                 onClick={markAllAsRead}
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

// import React, { useState, useEffect, useContext, useRef } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
// import axios from 'axios';
// import { logout, getUserRole } from '../utils/auth';
// import { Bell, Menu, X, ChevronDown } from 'lucide-react';
// import ThemeToggle from '../context/ThemeToggle';
// import { ThemeContext } from '../context/ThemeContext';
// import { encryptMessage, decryptMessage, parseApiResponse } from '../utils/crypto';
//
// // Import the logo
// import Logo from '/KB.png';
//
// const Navbar = () => {
//     const [userData, setUserData] = useState({ role: '', name: '' });
//     const [notifications, setNotifications] = useState([]);
//     const [latestNotification, setLatestNotification] = useState(null);
//     const [showNotifications, setShowNotifications] = useState(false);
//     const [showMobileMenu, setShowMobileMenu] = useState(false);
//     const [showProfileMenu, setShowProfileMenu] = useState(false);
//     const [hasData, setHasData] = useState(false);
//     const [currentDateTime, setCurrentDateTime] = useState(''); // State for IST date and time
//     const intervalRef = useRef(null);
//     const notificationRef = useRef(null);
//     const profileMenuRef = useRef(null); // Ref for profile dropdown
//     const latestNotifTimeoutRef = useRef(null);
//     const navigate = useNavigate();
//     const { theme } = useContext(ThemeContext);
//
//     const getAuthToken = () => localStorage.getItem('token');
//
//     // Function to get IST date and time
//     const updateDateTime = () => {
//         const now = new Date();
//         const istOptions = {
//             timeZone: 'Asia/Kolkata',
//             hour12: true,
//             year: 'numeric',
//             month: 'short',
//             day: '2-digit',
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit',
//         };
//         const istDateTime = now.toLocaleString('en-IN', istOptions);
//         setCurrentDateTime(istDateTime);
//     };
//
//     // Update date and time every second
//     useEffect(() => {
//         updateDateTime(); // Initial call
//         const intervalId = setInterval(updateDateTime, 1000);
//         return () => clearInterval(intervalId);
//     }, []);
//
//     const fetchOrderHistory = async () => {
//         try {
//             const token = getAuthToken();
//             if (!token) {
//                 toast.error('No authentication token found. Please log in.');
//                 return;
//             }
//
//             const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-order-history`, {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'application/json',
//                 },
//             });
//
//             const decryptedData = parseApiResponse(response.data.data);
//             if (decryptedData.status === '200') {
//                 const orderHistory = decryptedData.order_history || [];
//                 const updatedNotifications = orderHistory.map((order, index) => {
//                     const existingNotification = notifications.find((n) => n.id === (order.order_id || index));
//                     return {
//                         id: order.order_id || index,
//                         text: `${order.buy_sell === 'BUY' ? 'Bought' : 'Sold'} ${order.quantity} of ${order.symbol} at ₹${order.price} - ${order.status}`,
//                         time: order.updated_at,
//                         read: existingNotification ? existingNotification.read : false,
//                     };
//                 });
//
//                 const existingIds = notifications.map((n) => n.id);
//                 const newNotifications = updatedNotifications.filter((n) => !existingIds.includes(n.id));
//
//                 setNotifications(updatedNotifications);
//                 setHasData(updatedNotifications.length > 0);
//
//                 if (newNotifications.length > 0) {
//                     const latestUnread = newNotifications.find((n) => !n.read) || newNotifications[0];
//                     if (latestUnread && !latestUnread.read) {
//                         setLatestNotification(latestUnread);
//
//                         if (latestNotifTimeoutRef.current) {
//                             clearTimeout(latestNotifTimeoutRef.current);
//                         }
//
//                         latestNotifTimeoutRef.current = setTimeout(() => {
//                             setLatestNotification(null);
//                             setNotifications((prev) =>
//                                 prev.map((n) =>
//                                     n.id === latestUnread.id ? { ...n, read: true } : n
//                                 )
//                             );
//                         }, 3000);
//                     }
//                 }
//             } else {
//                 throw new Error(decryptedData.message || 'Failed to fetch order history');
//             }
//         } catch (err) {
//             toast.error('Failed to fetch order history: ' + err.message);
//             setHasData(false);
//         }
//     };
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
//                 await fetchOrderHistory();
//             }
//         };
//
//         fetchUserData();
//
//         intervalRef.current = setInterval(() => {
//             if (hasData) {
//                 fetchOrderHistory();
//             }
//         }, 5000);
//
//         return () => {
//             if (intervalRef.current) {
//                 clearInterval(intervalRef.current);
//             }
//             if (latestNotifTimeoutRef.current) {
//                 clearTimeout(latestNotifTimeoutRef.current);
//             }
//         };
//     }, [hasData]);
//
//     // Handle outside click to close notification dropdown
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (notificationRef.current && !notificationRef.current.contains(event.target)) {
//                 setShowNotifications(false);
//             }
//         };
//
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//
//     // Handle outside click to close profile dropdown
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
//                 setShowProfileMenu(false);
//             }
//         };
//
//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);
//
//     const markAsRead = (id) => {
//         setNotifications((prevNotifications) =>
//             prevNotifications.map((notification) =>
//                 notification.id === id ? { ...notification, read: true } : notification
//             )
//         );
//         if (latestNotification && latestNotification.id === id) {
//             setLatestNotification(null);
//             if (latestNotifTimeoutRef.current) {
//                 clearTimeout(latestNotifTimeoutRef.current);
//             }
//         }
//     };
//
//     const markAllAsRead = () => {
//         setNotifications((prevNotifications) =>
//             prevNotifications.map((notification) => ({ ...notification, read: true }))
//         );
//         if (latestNotification) {
//             setLatestNotification(null);
//             if (latestNotifTimeoutRef.current) {
//                 clearTimeout(latestNotifTimeoutRef.current);
//             }
//         }
//     };
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
//                 <div className="flex items-center space-x-3">
//                     {/* Logo */}
//                     <Link to="/" className="flex items-center">
//                         <img src={Logo} alt="KaizenBot Logo" className="h-10 w-10 mr-2" />
//                         <span className="self-center text-3xl font-bold whitespace-nowrap text-[#2b7efe]">
//                             KaizenBot
//                         </span>
//                     </Link>
//                 </div>
//
//                 {/* IST Date and Time */}
//                 <div className="hidden md:block text-xl font-medium">
//                     <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
//                         {currentDateTime}
//                     </span>
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
//                             {latestNotification && !showNotifications && (
//                                 <div
//                                     className={`absolute right-0 top-10 w-80 rounded-lg shadow-lg py-2 z-10 border ${
//                                         theme === 'dark'
//                                             ? 'bg-gray-800 border-gray-700 text-gray-200'
//                                             : 'bg-white border-gray-200 text-gray-800'
//                                     } animate-fade-in`}
//                                 >
//                                     <div className="px-4 py-3">
//                                         <p
//                                             className={`text-sm ${
//                                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                             }`}
//                                         >
//                                             {latestNotification.text}
//                                         </p>
//                                         <p
//                                             className={`text-xs mt-1 ${
//                                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                             }`}
//                                         >
//                                             {latestNotification.time}
//                                         </p>
//                                     </div>
//                                 </div>
//                             )}
//
//                             {showNotifications && (
//                                 <div
//                                     ref={notificationRef}
//                                     className={`absolute right-0 top-10 w-80 rounded-lg shadow-lg py-2 z-10 border ${
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
//                                                     className={`px-4 py-3 border-b flex justify-between items-center ${
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
//                                                     <div>
//                                                         <p
//                                                             className={`text-sm ${
//                                                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                                             }`}
//                                                         >
//                                                             {notification.text}
//                                                         </p>
//                                                         <p
//                                                             className={`text-xs mt-1 ${
//                                                                 theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                                             }`}
//                                                         >
//                                                             {notification.time}
//                                                         </p>
//                                                     </div>
//                                                     {!notification.read && (
//                                                         <button
//                                                             onClick={() => markAsRead(notification.id)}
//                                                             className={`text-xs ${
//                                                                 theme === 'dark'
//                                                                     ? 'text-blue-400 hover:text-blue-300'
//                                                                     : 'text-blue-600 hover:text-blue-800'
//                                                             }`}
//                                                         >
//                                                             Mark as read
//                                                         </button>
//                                                     )}
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
//                                                 onClick={markAllAsRead}
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
//                         <div className="relative" ref={profileMenuRef}>
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

// Import the logo
import Logo from '/KBT.png';

const Navbar = () => {
    const [userData, setUserData] = useState({ role: '', name: '' });
    const [notifications, setNotifications] = useState([]);
    const [latestNotification, setLatestNotification] = useState(null);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [hasData, setHasData] = useState(false);
    const [currentDateTime, setCurrentDateTime] = useState(''); // State for IST date and time
    const intervalRef = useRef(null);
    const notificationRef = useRef(null);
    const profileMenuRef = useRef(null); // Ref for profile dropdown
    const latestNotifTimeoutRef = useRef(null);
    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const getAuthToken = () => localStorage.getItem('token');

    // Function to get IST date and time
    const updateDateTime = () => {
        const now = new Date();
        const istOptions = {
            timeZone: 'Asia/Kolkata',
            hour12: true,
            year: 'numeric',
            month: 'short',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
        };
        const istDateTime = now.toLocaleString('en-IN', istOptions);
        setCurrentDateTime(istDateTime);
    };


    // Load read notification IDs from localStorage
    const getReadNotificationIds = () => {
        const encryptedStored = localStorage.getItem('susb_snnsc_scmisn');
        if (!encryptedStored) return [];
        try {
            const decrypted = decryptMessage(encryptedStored);
            return JSON.parse(decrypted); // Parse the decrypted string back to an array
        } catch (error) {
            console.error('Failed to decrypt read notification IDs:', error);
            return []; // Return empty array if decryption fails
        }
    };

    // Encrypt and save read notification IDs to localStorage
    const saveReadNotificationIds = (ids) => {
        try {
            const idsString = JSON.stringify(ids); // Convert array to string
            const encrypted = encryptMessage(idsString); // Encrypt the string
            localStorage.setItem('susb_snnsc_scmisn', encrypted);
        } catch (error) {
            console.error('Failed to encrypt and save read notification IDs:', error);
        }
    };

    // Update date and time every second
    useEffect(() => {
        updateDateTime(); // Initial call
        const intervalId = setInterval(updateDateTime, 1000);
        return () => clearInterval(intervalId);
    }, []);

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
                const readIds = getReadNotificationIds(); // Get decrypted read IDs

                const updatedNotifications = orderHistory.map((order, index) => {
                    const id = order.order_id || index;
                    return {
                        id,
                        text: `${order.buy_sell === 'BUY' ? 'Bought' : 'Sold'} ${order.quantity} of ${order.symbol} at ₹${order.price} - ${order.status}`,
                        time: order.updated_at,
                        read: readIds.includes(id), // Set read status based on decrypted IDs
                    };
                });

                const existingIds = notifications.map((n) => n.id);
                const newNotifications = updatedNotifications.filter((n) => !existingIds.includes(n.id));

                setNotifications(updatedNotifications);
                setHasData(updatedNotifications.length > 0);

                if (newNotifications.length > 0) {
                    const latestUnread = newNotifications.find((n) => !n.read) || newNotifications[0];
                    if (latestUnread && !latestUnread.read) {
                        setLatestNotification(latestUnread);

                        if (latestNotifTimeoutRef.current) {
                            clearTimeout(latestNotifTimeoutRef.current);
                        }

                        latestNotifTimeoutRef.current = setTimeout(() => {
                            setLatestNotification(null);
                            setNotifications((prev) =>
                                prev.map((n) =>
                                    n.id === latestUnread.id ? { ...n, read: true } : n
                                )
                            );
                            const updatedReadIds = [...readIds, latestUnread.id];
                            saveReadNotificationIds(updatedReadIds); // Encrypt and save
                        }, 3000);
                    }
                }
            } else {
                throw new Error(decryptedData.message || 'Failed to fetch order history');
            }
        } catch (err) {
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

    // Handle outside click to close profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
                setShowProfileMenu(false);
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
        const readIds = getReadNotificationIds();
        if (!readIds.includes(id)) {
            const updatedReadIds = [...readIds, id];
            saveReadNotificationIds(updatedReadIds); // Encrypt and save
        }
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
        const allIds = notifications.map((n) => n.id);
        saveReadNotificationIds(allIds); // Encrypt and save all IDs
        if (latestNotification) {
            setLatestNotification(null);
            if (latestNotifTimeoutRef.current) {
                clearTimeout(latestNotifTimeoutRef.current);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('susb_snnsc_scmisn'); // Clear encrypted read IDs
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
                <div className="flex items-center space-x-3">
                    {/* Logo */}
                    <Link to="/" className="flex items-center">
                        <img src={Logo} alt="KaizenBot Logo" className="h-10 w-10 mr-2" />
                        <span className="self-center text-3xl font-bold whitespace-nowrap text-[#2b7efe]">
                            KaizenBot
                        </span>
                    </Link>
                </div>

                {/* IST Date and Time */}
                <div className="hidden md:block text-xl font-medium">
                    <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                        {currentDateTime}
                    </span>
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

                        <div className="relative" ref={profileMenuRef}>
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
