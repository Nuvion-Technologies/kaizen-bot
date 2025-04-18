// import React, { useState, useEffect } from 'react';
// import { Link, useLocation } from 'react-router-dom';
// import { getUserRole } from '../utils/auth';
// import { LayoutDashboard, Briefcase, ShoppingCart, User, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
//
// const Sidebar = () => {
//     const [isOpen, setIsOpen] = useState(true);
//     const [userRole, setUserRole] = useState('');
//     const location = useLocation();
//
//     useEffect(() => {
//         const fetchUserRole = async () => {
//             try {
//                 const role = await getUserRole();
//                 setUserRole(role || '');
//             } catch (error) {
//                 console.error('Error fetching user role:', error);
//             }
//         };
//         fetchUserRole();
//     }, []);
//
//     const toggleSidebar = () => {
//         setIsOpen(!isOpen);
//     };
//
//     const menuItems = [
//         {
//             title: 'Dashboard',
//             path: userRole === 'superuser' ? '/dashboard/super-admin' :
//                 userRole === 'manager' ? '/dashboard/manager' : '/dashboard/user',
//             icon: <LayoutDashboard size={20} />,
//             roles: ['superuser', 'manager', 'user']
//         },
//         {
//             title: 'Portfolio',
//             path: '/portfolio',
//             icon: <Briefcase size={20} />,
//             roles: ['superuser', 'manager', 'user']
//         },
//         {
//             title: 'Orders',
//             path: '/orders',
//             icon: <ShoppingCart size={20} />,
//             roles: ['superuser', 'manager', 'user']
//         },
//         {
//             title: 'Analytics',
//             path: '/analytics',
//             icon: <BarChart3 size={20} />,
//             roles: ['superuser', 'manager']
//         },
//         {
//             title: 'Profile',
//             path: '/profile',
//             icon: <User size={20} />,
//             roles: ['superuser', 'manager', 'user']
//         }
//     ];
//
//     const filteredMenuItems = menuItems.filter(item => item.roles.includes(userRole));
//
//     return (
//         <aside className={`bg-white border-r border-gray-200 fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${isOpen ? 'w-64' : 'w-20'} shadow-md`}>
//             <div className="h-full px-3 py-4 overflow-y-auto">
//                 <div className="flex items-center justify-end mb-6">
//                     <button onClick={toggleSidebar} className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition duration-200" aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}>
//                         {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//                     </button>
//                 </div>
//
//                 <ul className="space-y-2">
//                     {filteredMenuItems.map((item, index) => (
//                         <li key={index}>
//                             <Link to={item.path} className={`flex items-center p-3 text-base font-medium rounded-lg transition duration-200 ${location.pathname === item.path ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'} ${!isOpen ? 'justify-center' : ''}`}>
//                                 <div className={location.pathname === item.path ? 'text-white' : 'text-gray-500'}>
//                                     {item.icon}
//                                 </div>
//                                 {isOpen && <span className="ml-3 whitespace-nowrap">{item.title}</span>}
//                                 {!isOpen && <span className="sr-only">{item.title}</span>}
//                             </Link>
//                         </li>
//                     ))}
//                 </ul>
//             </div>
//         </aside>
//     );
// };
//
// export default Sidebar;










import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getUserRole } from '../utils/auth';
import { LayoutDashboard, Briefcase, ShoppingCart, User, ChevronLeft, ChevronRight, BarChart3,Bot,Binoculars } from 'lucide-react';
import { ThemeContext } from '../context/ThemeContext';

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [userRole, setUserRole] = useState('');
    const location = useLocation();
    const { theme } = useContext(ThemeContext);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const role = await getUserRole();
                setUserRole(role || '');
            } catch (error) {
                console.error('Error fetching user role:', error);
            }
        };
        fetchUserRole();
    }, []);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    const menuItems = [
        {
            title: 'Dashboard',
            path:
                userRole === 'superuser'
                    ? '/dashboard/super-admin'
                    : userRole === 'manager'
                        ? '/dashboard/manager'
                        : '/dashboard/user',
            icon: <LayoutDashboard size={20} />,
            roles: ['superuser', 'manager', 'user'],
        },
        {
            title: 'Portfolio',
            path: '/portfolio',
            icon: <Briefcase size={20} />,
            roles: ['superuser', 'manager', 'user'],
        },
        {
            title: 'Orders',
            path: '/orders',
            icon: <ShoppingCart size={20} />,
            roles: ['superuser', 'manager', 'user'],
        },
        {
            title: 'BotOrder',
            path: '/botorder',
            icon: <Bot size={20} />,
            roles: ['superuser', 'manager', 'user'],
        },
        {
            title: 'Analytics',
            path: '/analytics',
            icon: <BarChart3 size={20} />,
            roles: ['superuser', 'manager'],
        },
        {
            title: 'Excel Monitor',
            path: '/excelmonitor',
            icon: <Binoculars size={20} />,
            roles: ['superuser', 'manager', 'user'],
        },
        {
            title: 'Profile',
            path: '/profile',
            icon: <User size={20} />,
            roles: ['superuser', 'manager', 'user'],
        },

    ];

    const filteredMenuItems = menuItems.filter((item) => item.roles.includes(userRole));

    return (
        <aside
            className={`${
                theme === 'dark'
                    ? 'bg-gray-900 border-gray-700 text-gray-200'
                    : 'bg-white border-gray-200 text-gray-700'
            } border-r fixed top-16 left-0 z-40 h-[calc(100vh-4rem)] transition-all duration-300 ease-in-out ${
                isOpen ? 'w-64' : 'w-20'
            } shadow-md`}
        >
            <div className="h-full px-3 py-4 overflow-y-auto">
                <div className="flex items-center justify-end mb-6">
                    {/*<button*/}
                    {/*    onClick={toggleSidebar}*/}
                    {/*    className={`p-2 rounded-lg transition duration-200 ${*/}
                    {/*        theme === 'dark'*/}
                    {/*            ? 'text-gray-400 hover:bg-gray-700'*/}
                    {/*            : 'text-gray-500 hover:bg-gray-100'*/}
                    {/*    }`}*/}
                    {/*    aria-label={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}*/}
                    {/*>*/}
                    {/*    {isOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}*/}
                    {/*</button>*/}
                </div>

                <ul className="space-y-2">
                    {filteredMenuItems.map((item, index) => (
                        <li key={index}>
                            <Link
                                to={item.path}
                                className={`flex items-center p-3 text-base font-medium rounded-lg transition duration-200 ${
                                    location.pathname === item.path
                                        ? theme === 'dark'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-blue-600 text-white'
                                        : theme === 'dark'
                                            ? 'text-gray-200 hover:bg-gray-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                } ${!isOpen ? 'justify-center' : ''}`}
                            >
                                <div
                                    className={
                                        location.pathname === item.path
                                            ? 'text-white'
                                            : theme === 'dark'
                                                ? 'text-gray-400'
                                                : 'text-gray-500'
                                    }
                                >
                                    {item.icon}
                                </div>
                                {isOpen && <span className="ml-3 whitespace-nowrap">{item.title}</span>}
                                {!isOpen && <span className="sr-only">{item.title}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
