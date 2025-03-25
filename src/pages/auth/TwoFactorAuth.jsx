// // TwoFactorAuth.jsx (place it in src/pages/auth/)
// import React, { useState } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { verify2FALogin } from '../../utils/api';
// import { setUserData } from '../../utils/auth';
//
// const TwoFactorAuth = () => {
//     const [otp, setOtp] = useState('');
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState('');
//     const navigate = useNavigate();
//     const location = useLocation();
//
//     const { email } = location.state || {};
//
//     const redirectBasedOnRole = (role) => {
//         if (role === 'superuser') {
//             navigate('/dashboard/super-admin', { replace: true });
//         } else if (role === 'manager') {
//             navigate('/dashboard/manager', { replace: true });
//         } else if (role === 'user') {
//             navigate('/dashboard/user', { replace: true });
//         } else {
//             navigate('/login', { replace: true });
//         }
//     };
//
//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         setLoading(true);
//         setError('');
//
//         try {
//             const response = await verify2FALogin(otp, email);
//             if (response.decryptedData) {
//                 const { access_token, role, status, message } = response.decryptedData;
//
//                 if (status !== "200") {
//                     setError(message || 'Invalid OTP');
//                     setLoading(false);
//                     return;
//                 }
//
//                 if (!access_token) {
//                     throw new Error('Missing access token');
//                 }
//
//                 setUserData({
//                     token: access_token,
//                     role: role || 'user'
//                 });
//
//                 redirectBasedOnRole(role || 'user');
//             } else {
//                 setError('Invalid response from server');
//             }
//         } catch (err) {
//             setError(err.message || 'Failed to verify OTP. Please try again.');
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     if (!email) {
//         return <div>Invalid access. Please log in again.</div>;
//     }
//
//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
//             <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
//                 <div>
//                     <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
//                         Two-Factor Authentication
//                     </h2>
//                     <p className="mt-2 text-center text-sm text-gray-600">
//                         Enter the OTP sent to {email}
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
//                             <label htmlFor="otp" className="sr-only">OTP</label>
//                             <input
//                                 id="otp"
//                                 name="otp"
//                                 type="text"
//                                 required
//                                 className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
//                                 placeholder="Enter OTP"
//                                 value={otp}
//                                 onChange={(e) => setOtp(e.target.value)}
//                             />
//                         </div>
//                     </div>
//
//                     <div>
//                         <button
//                             type="submit"
//                             disabled={loading}
//                             className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//                         >
//                             {loading ? 'Verifying...' : 'Verify OTP'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };
//
// export default TwoFactorAuth;


// TwoFactorAuth.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { verify2FALogin } from '../../utils/api';
import { setUserData } from '../../utils/auth';

const TwoFactorAuth = () => {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    const { email, tempToken } = location.state || {};

    const redirectBasedOnRole = (role) => {
        if (role === 'superuser') {
            navigate('/dashboard/super-admin', { replace: true });
        } else if (role === 'manager') {
            navigate('/dashboard/manager', { replace: true });
        } else if (role === 'user') {
            navigate('/dashboard/user', { replace: true });
        } else {
            navigate('/login', { replace: true });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await verify2FALogin(otp, tempToken);
            if (response.decryptedData) {
                const { access_token, role, status, message } = response.decryptedData;

                if (status !== "200") {
                    setError(message || 'Invalid OTP');
                    setLoading(false);
                    return;
                }

                if (!access_token) {
                    throw new Error('Missing access token');
                }

                setUserData({
                    token: access_token,
                    role: role || 'user'
                });

                redirectBasedOnRole(role || 'user');
            } else {
                setError('Invalid response from server');
            }
        } catch (err) {
            console.error("2FA error:", err);
            setError(err.message || 'Failed to verify OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (!email || !tempToken) {
        return <div>Invalid access. Please log in again.</div>;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-xl shadow-md">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Two-Factor Authentication
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Enter the OTP of Authenticator
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
                            <label htmlFor="otp" className="sr-only">OTP</label>
                            <input
                                id="otp"
                                name="otp"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            {loading ? 'Verifying...' : 'Verify OTP'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TwoFactorAuth;
