// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate } from 'react-router-dom';
// import { loginUser } from '../../utils/api';
// import { setAuthToken, isAuthenticated, getUserRole } from '../../utils/auth';
//
// const Login = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//
//     // Check if user is already logged in
//     useEffect(() => {
//         const checkAuth = async () => {
//             // Only run role check if a token exists
//             if (isAuthenticated()) {
//                 try {
//                     const role = await getUserRole();
//                     console.log("User role detected:", role);
//                     redirectBasedOnRole(role);
//                 } catch (error) {
//                     console.error("Error checking role:", error);
//                 }
//             }
//         };
//
//         checkAuth();
//     }, []); // Removed `navigate` dependency to prevent re-running
//
//     const redirectBasedOnRole = (role) => {
//         console.log("Redirecting based on role:", role);
//         if (role === 'superuser') {
//             navigate('/dashboard/super-admin');
//         } else if (role === 'manager') {
//             navigate('/dashboard/manager');
//         } else if (role === 'user') {
//             navigate('/dashboard/user');
//         } else {
//             // If role is null or undefined, we'll stay on the login page
//             console.log("Unknown role, staying on login page");
//         }
//     };
//
//     const handleChange = (e) => {
//         setFormData({
//             ...formData,
//             [e.target.name]: e.target.value
//         });
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//
//         try {
//             const response = await loginUser(formData);
//             console.log("Login response:", response);
//
//             if (response.decryptedData) {
//                 const { access_token, status, message, role } = response.decryptedData;
//                 console.log(access_token);
//                 console.log(status);
//                 console.log(role);
//
//                 // Check if decryptedData has a status that indicates an error
//                 if (status && status !== "200") {
//                     setError(message || 'Authentication failed');
//                     setLoading(false);
//                     return;
//                 }
//
//                 // Ensure token is present
//                 if (!access_token) {
//                     setError('Invalid response: Missing access token');
//                     setLoading(false);
//                     return;
//                 }
//
//                 // Store only the token, not the role
//                 setAuthToken(access_token);
//
//                 // If the role is directly available in the login response, use it
//                 if (role) {
//                     redirectBasedOnRole(role);
//                 } else {
//                     // Otherwise determine role from backend and redirect
//                     const detectedRole = await getUserRole();
//                     console.log("checked role", detectedRole);
//                     redirectBasedOnRole(detectedRole);
//                 }
//             } else {
//                 setError('Invalid response from server');
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             setError(err.response?.data?.message || 'Failed to login. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                         Sign in to your account
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Indian Stock Market Bot
//                     </p>
//                 </div>
//
//                 {error && (
//                     <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
//                         <span className="block sm:inline">{error}</span>
//                     </div>
//                 )}
//
//                 <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
//                     <div className="rounded-md shadow-sm -space-y-px">
//                         <div>
//                             <label htmlFor="email" className="sr-only">Email address</label>
//                             <input
//                                 id="email"
//                                 name="email"
//                                 type="email"
//                                 autoComplete="email"
//                                 required
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                 placeholder="Email address"
//                                 value={formData.email}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="password" className="sr-only">Password</label>
//                             <input
//                                 id="password"
//                                 name="password"
//                                 type="password"
//                                 autoComplete="current-password"
//                                 required
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                 placeholder="Password"
//                                 value={formData.password}
//                                 onChange={handleChange}
//                             />
//                         </div>
//                     </div>
//
//                     <div className="flex items-center justify-between">
//                         <div className="text-sm">
//                             <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-800">
//                                 Forgot your password?
//                             </Link>
//                         </div>
//                     </div>
//
//                     <div>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                             {loading ? 'Signing in...' : 'Sign in'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default Login;



import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginUser } from '../../utils/api';
import { setAuthToken, isAuthenticated, getUserRole, clearCachedRole } from '../../utils/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [authChecking, setAuthChecking] = useState(true);
    const initialCheckDone = useRef(false);
    const navigate = useNavigate();

    // Check if user is already logged in - only once when component mounts
    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            if (!isAuthenticated()) {
                if (isMounted) setAuthChecking(false);
                return;
            }

            try {
                const role = await getUserRole();
                if (!role) {
                    clearCachedRole();
                    setAuthToken(null);
                    if (isMounted) setAuthChecking(false);
                    return;
                }

                // Navigate based on role
                if (isMounted) {
                    navigate(`/dashboard/${role}`, { replace: true });
                }
            } catch (error) {
                console.error('Error checking auth:', error);
                clearCachedRole();
                setAuthToken(null);
                if (isMounted) setAuthChecking(false);
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, [navigate]);


    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await loginUser(formData);

            if (response.decryptedData) {
                const { access_token, status, message, role } = response.decryptedData;

                // Check if decryptedData has a status that indicates an error
                if (status && status !== "200") {
                    setError(message || 'Authentication failed');
                    setLoading(false);
                    return;
                }

                // Ensure token is present
                if (!access_token) {
                    setError('Invalid response: Missing access token');
                    setLoading(false);
                    return;
                }

                // Clear any cached role before setting new token
                clearCachedRole();

                // Store only the token, not the role
                setAuthToken(access_token);

                // If the role is directly available in the login response, use it
                if (role) {
                    if (role === 'superuser') {
                        navigate('/dashboard/super-admin');
                    } else if (role === 'manager') {
                        navigate('/dashboard/manager');
                    } else if (role === 'user') {
                        navigate('/dashboard/user');
                    }
                } else {
                    // Otherwise determine role from backend and redirect
                    const detectedRole = await getUserRole();

                    if (detectedRole === 'superuser') {
                        navigate('/dashboard/super-admin');
                    } else if (detectedRole === 'manager') {
                        navigate('/dashboard/manager');
                    } else if (detectedRole === 'user') {
                        navigate('/dashboard/user');
                    } else {
                        // If we couldn't determine the role, show an error
                        setError('Could not determine user role. Please try again.');
                    }
                }
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.response?.data?.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // If we're still checking authentication, show a loading indicator
    if (authChecking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Checking authentication...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in to your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Indian Stock Market Bot
                    </p>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <label htmlFor="email" className="sr-only">Email address</label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Email address"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <Link to="/forgot-password" className="font-medium text-blue-600 hover:text-blue-800">
                                Forgot your password?
                            </Link>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
