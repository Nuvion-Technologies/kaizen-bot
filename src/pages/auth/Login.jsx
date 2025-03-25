// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { loginUser } from '../../utils/api';
// import { setUserData, isAuthenticated, getUserRole } from '../../utils/auth';
//
// const Login = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [authChecked, setAuthChecked] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     // Check if user is already logged in, but only once
//     useEffect(() => {
//         if (!authChecked) {
//             if (isAuthenticated()) {
//                 const role = getUserRole();
//                 if (role) {
//                     redirectBasedOnRole(role);
//                 }
//             }
//             setAuthChecked(true);
//         }
//     }, [authChecked]);
//
//     const redirectBasedOnRole = (role) => {
//         console.log("Redirecting based on role:", role);
//         if (role === 'superuser') {
//             navigate('/dashboard/super-admin', { replace: true });
//         } else if (role === 'manager') {
//             navigate('/dashboard/manager', { replace: true });
//         } else if (role === 'user') {
//             navigate('/dashboard/user', { replace: true });
//         } else {
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
//                 const { access_token, status, message,role } = response.decryptedData;
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
//                 // Store user data (token and role)
//                 setUserData({
//                     token: access_token,
//                     role: role || 'user' // Default to 'user' if role is not provided
//                 });
//
//                 // Redirect based on role
//                 redirectBasedOnRole(role || 'user');
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


// login.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { loginUser } from '../../utils/api';
// import { setUserData, isAuthenticated, getUserRole } from '../../utils/auth';
//
// const Login = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [authChecked, setAuthChecked] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     useEffect(() => {
//         if (!authChecked) {
//             if (isAuthenticated()) {
//                 const role = getUserRole();
//                 if (role) {
//                     redirectBasedOnRole(role);
//                 }
//             }
//             setAuthChecked(true);
//         }
//     }, [authChecked]);
//
//     const redirectBasedOnRole = (role) => {
//         console.log("Redirecting based on role:", role);
//         if (role === 'superuser') {
//             navigate('/dashboard/super-admin', { replace: true });
//         } else if (role === 'manager') {
//             navigate('/dashboard/manager', { replace: true });
//         } else if (role === 'user') {
//             navigate('/dashboard/user', { replace: true });
//         } else {
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
//             console.log(response.decryptedData.status);
//
//             if (response.decryptedData) {
//                 const { access_token, ss, message, role } = response.decryptedData;
//
//                 console.log("Status from decrypted data:", ss);
//
//                 if (ss === "402") {
//                     console.log("Redirecting to 2FA page...");
//                     navigate('/2fa', { state: { email: formData.email } });
//                     setLoading(false);
//                     return;
//                 }
//
//                 if (ss === "200") {
//                     if (!access_token) {
//                         setError('Invalid response: Missing access token');
//                         setLoading(false);
//                         return;
//                     }
//
//                     setUserData({
//                         token: access_token,
//                         role: role || 'user'
//                     });
//
//                     redirectBasedOnRole(role || 'user');
//                 } else {
//                     console.log("Come here");
//                     setError(message || 'Authentication failed');
//                     setLoading(false);
//                     return;
//                 }
//             } else {
//                 setError('Invalid response from server');
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             setError(err.message || 'Failed to login. Please try again.');
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





// login.jsx
// import React, { useState, useEffect } from 'react';
// import { Link, useNavigate, useLocation } from 'react-router-dom';
// import { loginUser } from '../../utils/api';
// import { setUserData, isAuthenticated, getUserRole } from '../../utils/auth';
//
// const Login = () => {
//     const [formData, setFormData] = useState({
//         email: '',
//         password: ''
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [authChecked, setAuthChecked] = useState(false);
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     useEffect(() => {
//         if (!authChecked) {
//             if (isAuthenticated()) {
//                 const role = getUserRole();
//                 if (role) {
//                     redirectBasedOnRole(role);
//                 }
//             }
//             setAuthChecked(true);
//         }
//     }, [authChecked]);
//
//     const redirectBasedOnRole = (role) => {
//         console.log("Redirecting based on role:", role);
//         if (role === 'superuser') {
//             navigate('/dashboard/super-admin', { replace: true });
//         } else if (role === 'manager') {
//             navigate('/dashboard/manager', { replace: true });
//         } else if (role === 'user') {
//             navigate('/dashboard/user', { replace: true });
//         } else {
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
//             console.log("Raw decryptedData:", response.decryptedData);
//
//             if (response.decryptedData) {
//                 const { access_token, status, message, role } = response.decryptedData;
//
//                 console.log("Status from decrypted data:", status);
//
//                 if (status === "402") {
//                     console.log("Redirecting to 2FA page...");
//                     navigate('/2fa', { state: { email: formData.email } });
//                     setLoading(false);
//                     return;
//                 }
//
//                 if (status === "200") {
//                     if (!access_token) {
//                         setError('Invalid response: Missing access token');
//                         setLoading(false);
//                         return;
//                     }
//
//                     setUserData({
//                         token: access_token,
//                         role: role || 'user'
//                     });
//
//                     redirectBasedOnRole(role || 'user');
//                 } else {
//                     console.log("Authentication failed with status:", status);
//                     setError(message || 'Authentication failed');
//                     setLoading(false);
//                     return;
//                 }
//             } else {
//                 setError('Invalid response from server');
//             }
//         } catch (err) {
//             console.error("Login error:", err);
//             setError(err.message || 'Failed to login. Please try again.');
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





// login.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { loginUser } from '../../utils/api';
import { setUserData, isAuthenticated, getUserRole } from '../../utils/auth';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [authChecked, setAuthChecked] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!authChecked) {
            if (isAuthenticated()) {
                const role = getUserRole();
                if (role) {
                    redirectBasedOnRole(role);
                }
            }
            setAuthChecked(true);
        }
    }, [authChecked]);

    const redirectBasedOnRole = (role) => {
        console.log("Redirecting based on role:", role);
        if (role === 'superuser') {
            navigate('/dashboard/super-admin', { replace: true });
        } else if (role === 'manager') {
            navigate('/dashboard/manager', { replace: true });
        } else if (role === 'user') {
            navigate('/dashboard/user', { replace: true });
        } else {
            console.log("Unknown role, staying on login page");
        }
    };

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
            console.log("Login response:", response);

            if (response.decryptedData) {
                const { access_token, status, message, role, temp_token } = response.decryptedData;

                console.log("Status from decrypted data:", status);

                if (status === "402") {
                    console.log("Redirecting to 2FA page with temp_token:", temp_token);
                    navigate('/2fa', { state: { email: formData.email, tempToken: temp_token } });
                    setLoading(false);
                    return;
                }

                if (status === "200") {
                    if (!access_token) {
                        setError('Invalid response: Missing access token');
                        setLoading(false);
                        return;
                    }

                    setUserData({
                        token: access_token,
                        role: role || 'user'
                    });

                    redirectBasedOnRole(role || 'user');
                } else {
                    console.log("Authentication failed with status:", status);
                    setError(message || 'Authentication failed');
                    setLoading(false);
                    return;
                }
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error("Login error:", err);
            setError(err.message || 'Failed to login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Rest of the component (form JSX) remains unchanged
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
