// import React from 'react';
// import { BrowserRouter as Router, useLocation } from 'react-router-dom';
// import AppRoutes from './routes';
// import Navbar from './components/Navbar';
// import Sidebar from './components/Sidebar';
// import { isAuthenticated, getUserRole } from './utils/auth';
//
// function App() {
//     const { pathname } = useLocation();
//     const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
//     const isPublicRoute = publicRoutes.includes(pathname);
//
//     const isLoggedIn = isAuthenticated();
//     const userRole = getUserRole();
//
//     return (
//         <div className="flex h-screen bg-gray-100">
//             {isLoggedIn && !isPublicRoute && <Sidebar role={userRole} />}
//             <div className="flex-1 flex flex-col overflow-hidden">
//                 {isLoggedIn && !isPublicRoute && <Navbar />}
//                 <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
//                     <AppRoutes />
//                 </main>
//             </div>
//         </div>
//     );
// }
//
// export default function AppWrapper() {
//     return (
//         <Router>
//             <App />
//         </Router>
//     );
// }




import React from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import AppRoutes from './routes';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import { isAuthenticated, getUserRole } from './utils/auth';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    const { pathname } = useLocation();
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    const isPublicRoute = publicRoutes.includes(pathname);

    const isLoggedIn = isAuthenticated();
    const userRole = getUserRole();

    return (
        <div className="flex h-screen bg-gray-100">
            {isLoggedIn && !isPublicRoute && <Sidebar role={userRole} />}
            <div className="flex-1 flex flex-col overflow-hidden">
                {isLoggedIn && !isPublicRoute && <Navbar />}
                <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
                    <AppRoutes />
                </main>
            </div>
        </div>
    );
}

export default function AppWrapper() {
    return (
        <Router>
            <ThemeProvider>
                <App />
            </ThemeProvider>
        </Router>
    );
}
