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






import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { logout, getUserRole } from '../utils/auth';
import { LogOut, Bell, Menu, X, ChevronDown } from 'lucide-react';

const Navbar = () => {
    const [userData, setUserData] = useState({ role: '', name: '' });
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            const role = getUserRole();
            if (role) {
                // For now, we'll use a placeholder name based on role
                let name = 'User';
                if (role === 'superuser') name = 'Super Admin';
                else if (role === 'manager') name = 'Manager';

                setUserData({
                    role: role || '',
                    name: name
                });

                // Mock notifications - in a real app, you'd fetch these from an API
                setNotifications([
                    { id: 1, text: 'New market update available', time: '5m ago', read: false },
                    { id: 2, text: 'Your order was executed successfully', time: '1h ago', read: false },
                    { id: 3, text: 'Portfolio performance report ready', time: '3h ago', read: true }
                ]);
            }
        };

        fetchUserData();
    }, []);

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

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
            <div className="flex justify-between items-center mx-auto">
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <span className="self-center text-xl font-semibold whitespace-nowrap text-blue-600">
                            StockBot
                        </span>
                    </Link>
                </div>

                {/* Mobile menu button */}
                <button
                    className="md:hidden p-2 text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
                    onClick={toggleMobileMenu}
                >
                    {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
                </button>

                {/* Desktop Navigation */}
                <div className={`items-center justify-between ${showMobileMenu ? 'flex flex-col absolute top-16 left-0 right-0 bg-white shadow-md p-4 z-50' : 'hidden md:flex'}`}>
                    <div className="flex items-center space-x-4">
                        {/* Notification bell */}
                        <div className="relative">
                            <button
                                className="p-2 text-gray-500 rounded-full hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 relative"
                                onClick={toggleNotifications}
                            >
                                <Bell size={20} />
                                {unreadCount > 0 && (
                                    <span className="absolute top-0 right-0 inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 rounded-full">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                                    </div>
                                    <div className="max-h-60 overflow-y-auto">
                                        {notifications.length > 0 ? (
                                            notifications.map(notification => (
                                                <div
                                                    key={notification.id}
                                                    className={`px-4 py-3 hover:bg-gray-50 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                                                >
                                                    <p className="text-sm text-gray-800">{notification.text}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="px-4 py-3 text-sm text-gray-500">No notifications</p>
                                        )}
                                    </div>
                                    {notifications.length > 0 && (
                                        <div className="px-4 py-2 border-t border-gray-200">
                                            <button className="text-xs text-blue-600 hover:text-blue-800">
                                                Mark all as read
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* User profile */}
                        <div className="relative">
                            <button
                                className="flex items-center text-sm font-medium text-gray-700 hover:text-blue-600 p-2 rounded-lg hover:bg-gray-100"
                                onClick={toggleProfileMenu}
                            >
                                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center mr-2">
                                    {userData.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="hidden md:block">{userData.name}</span>
                                <ChevronDown size={16} className="ml-1" />
                            </button>

                            {/* Profile dropdown */}
                            {showProfileMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border border-gray-200">
                                    <div className="px-4 py-2 border-b border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700">{userData.name}</p>
                                        <p className="text-xs text-gray-500 capitalize">{userData.role}</p>
                                    </div>
                                    <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Your Profile
                                    </Link>
                                    <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                                        Settings
                                    </Link>
                                    <button
                                        className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
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
