// import React from 'react';
// import { Routes, Route, Navigate } from 'react-router-dom';
// import { isAuthenticated, getUserRole } from './utils/auth';
//
// // Auth Pages
// import Login from './pages/auth/Login';
// import Register from './pages/auth/Register';
// import ForgotPassword from './pages/auth/ForgotPassword';
// import ResetPassword from './pages/auth/ResetPassword';
//
// // Dashboard Pages
// import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
// import ManagerDashboard from './pages/dashboard/ManagerDashboard';
// import UserDashboard from './pages/dashboard/UserDashboard';
//
// // Common Pages
// import Portfolio from './pages/common/Portfolio';
// import Orders from './pages/common/Orders';
// import Profile from './pages/common/Profile';
// import NotFound from './pages/NotFound';
// import Analytics from "./pages/common/Analytics.jsx";
// import Dummy from "./pages/common/Dummy.jsx";
//
// // Protected Route Component
// const ProtectedRoute = ({ children, allowedRoles }) => {
//     if (!isAuthenticated()) {
//         return <Navigate to="/login" replace />;
//     }
//
//     const userRole = getUserRole();
//
//     // Ensure users can only access their respective dashboard
//     if (!allowedRoles.includes(userRole)) {
//         return <Navigate to={`/dashboard/${userRole === 'superuser' ? 'super-admin' : userRole}`} replace />;
//     }
//
//     return children;
// };
//
//
// const AppRoutes = () => {
//     return (
//         <Routes>
//             {/* Auth Routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/register" element={<Register />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/reset-password" element={<ResetPassword />} />
//
//             {/* Dashboard Routes */}
//             <Route
//                 path="/dashboard/super-admin"
//                 element={
//                     <ProtectedRoute allowedRoles={['superuser']}>
//                         <SuperAdminDashboard />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/dashboard/manager"
//                 element={
//                     <ProtectedRoute allowedRoles={['manager']}>
//                         <ManagerDashboard />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/dashboard/user"
//                 element={
//                     <ProtectedRoute allowedRoles={['user']}>
//                         <UserDashboard />
//                     </ProtectedRoute>
//                 }
//             />
//
//
//             {/* Common Routes */}
//             <Route
//                 path="/portfolio"
//                 element={
//                     <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
//                         <Portfolio />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/orders"
//                 element={
//                     <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
//                         <Orders />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/analytics"
//                 element={
//                     <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
//                         <Analytics />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/profile"
//                 element={
//                     <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
//                         <Profile />
//                     </ProtectedRoute>
//                 }
//             />
//             <Route
//                 path="/dummy"
//                 element={
//                     <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
//                         <Dummy />
//                     </ProtectedRoute>
//                 }
//             />
//
//             {/* Redirect based on role */}
//             <Route path="/" element={
//                 <Navigate to={
//                     isAuthenticated()
//                         ? getUserRole() === 'superuser'
//                             ? '/dashboard/super-admin'
//                             : getUserRole() === 'manager'
//                                 ? '/dashboard/manager'
//                                 : '/dashboard/user'
//                         : '/login'
//                 } replace />
//             } />
//
//             {/* 404 Route */}
//             <Route path="*" element={<NotFound />} />
//         </Routes>
//     );
// };
//
// export default AppRoutes;


// routes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from './utils/auth';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import TwoFactorAuth from './pages/auth/TwoFactorAuth';

// Dashboard Pages
import SuperAdminDashboard from './pages/dashboard/SuperAdminDashboard';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import UserDashboard from './pages/dashboard/UserDashboard';

// Common Pages
import Portfolio from './pages/common/Portfolio';
import Orders from './pages/common/Orders';
import Profile from './pages/common/Profile';
import NotFound from './pages/NotFound';
import Analytics from './pages/common/Analytics.jsx';
// import Dummy from './pages/common/Dummy.jsx';
import BotOrder from './pages/common/BotOrder.jsx';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles }) => {
    if (!isAuthenticated()) {
        return <Navigate to="/login" replace />;
    }

    const userRole = getUserRole();

    if (!allowedRoles.includes(userRole)) {
        return <Navigate to={`/dashboard/${userRole === 'superuser' ? 'super-admin' : userRole}`} replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/2fa" element={<TwoFactorAuth />} />

            {/* Dashboard Routes */}
            <Route
                path="/dashboard/super-admin"
                element={
                    <ProtectedRoute allowedRoles={['superuser']}>
                        <SuperAdminDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/manager"
                element={
                    <ProtectedRoute allowedRoles={['manager']}>
                        <ManagerDashboard />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/dashboard/user"
                element={
                    <ProtectedRoute allowedRoles={['user']}>
                        <UserDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Common Routes */}
            <Route
                path="/portfolio"
                element={
                    <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
                        <Portfolio />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/orders"
                element={
                    <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
                        <Orders />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/analytics"
                element={
                    <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
                        <Analytics />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/profile"
                element={
                    <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/botorder"
                element={
                    <ProtectedRoute allowedRoles={['user', 'manager', 'superuser']}>
                        <BotOrder />
                    </ProtectedRoute>
                }
            />

            {/* Redirect based on role */}
            <Route path="/" element={
                <Navigate to={
                    isAuthenticated()
                        ? getUserRole() === 'superuser'
                            ? '/dashboard/super-admin'
                            : getUserRole() === 'manager'
                                ? '/dashboard/manager'
                                : '/dashboard/user'
                        : '/login'
                } replace />
            } />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

export default AppRoutes;
