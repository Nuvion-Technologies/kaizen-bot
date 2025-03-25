// import React, { useEffect, useState } from 'react';
// import DashboardLayout from '../../components/DashboardLayout';
// import { User, Mail, Phone, Shield, Bell, Key, Unplug } from 'lucide-react';
// import { getAuthToken } from '../../utils/auth.js';
// import api, { encryptMessage } from '../../utils/api.js';
// import {decryptMessage} from "../../utils/crypto.js";
//
// const Profile = () => {
//     const [activeTab, setActiveTab] = useState('profile');
//     const [userData, setUserData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         address: '',
//         pincode: '',
//         city: ''
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [message, setMessage] = useState(null);
//     const [qrCode, setQrCode] = useState(null);
//     const [otp, setOtp] = useState('');
//     const [is2faEnabled, setIs2faEnabled] = useState(false);
//     const [angleOneData, setAngleOneData] = useState({
//         smartapi_key: '',
//         smartapi_username: '',
//         smartapi_password: '',
//         smartapi_totp_token: ''
//     });
//
//     const tabs = [
//         { id: 'profile', label: 'Profile', icon: <User size={18} /> },
//         { id: 'security', label: 'Security', icon: <Shield size={18} /> },
//         { id: 'notifications', label: 'Notifications', icon: <Bell size={18} /> },
//         { id: 'angleone', label: 'Angle One', icon: <Unplug size={18} /> },
//     ];
//
//     // Fetch user data on component mount
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 setLoading(true);
//                 const token = getAuthToken();
//                 const email = JSON.parse(atob(token.split('.')[1])).sub;
//
//                 const response = await api.get(`/user/${email}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 });
//
//                 if (response.decryptedData) {
//                     const decryptedData = response.decryptedData.user;
//                     console.log(decryptedData);
//                     setUserData({
//                         name: decryptedData.name || '',
//                         email: decryptedData.email || '',
//                         phone: decryptedData.phone || '',
//                         address: decryptedData.address || '',
//                         pincode: decryptedData.pincode || '',
//                         city: decryptedData.city || '',
//                     });
//                     setIs2faEnabled(decryptedData.totp_enabled || false);
//                 }
//             } catch (err) {
//                 setError('Failed to fetch profile data');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchUserProfile();
//     }, []);
//
//     // Handle profile form submission
//     const handleProfileSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setLoading(true);
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify(userData));
//
//             const response = await api.post('/user/edit-profile',
//                 { data: encryptedData },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );
//
//             if (response.status === 200 && response.decryptedData) {
//                 const { status, message } = response.decryptedData;
//                 if (status === "200") {
//                     alert('Profile updated successfully');
//                     return;
//                 } else {
//                     throw new Error(message || 'Profile update failed');
//                 }
//             } else {
//                 throw new Error('Invalid response from server');
//             }
//         } catch (err) {
//             setError('Failed to update profile: ' + (err.message || 'Unknown error'));
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Handle input changes for profile
//     const handleInputChange = (e) => {
//         const { id, value } = e.target;
//         setUserData(prev => ({
//             ...prev,
//             [id]: value
//         }));
//     };
//
//     // Generate 2FA QR Code
//     const handleGenerate2FA = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify({}));
//
//             const response = await api.post('/user/generate-2fa',
//                 { data: encryptedData },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//
//             if (response.status === 200 && response.decryptedData) {
//                 const { status, message, qr_code } = response.decryptedData;
//                 if (status === "200" && qr_code) {
//                     setQrCode(qr_code);
//                 } else {
//                     throw new Error(message || 'Invalid response format: QR code missing');
//                 }
//             } else {
//                 throw new Error('Invalid server response');
//             }
//         } catch (err) {
//             setError('Failed to generate 2FA QR code: ' + (err.message || 'Unknown error'));
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Verify OTP and Enable 2FA
//     const handleVerify2FA = async (e) => {
//         e.preventDefault();
//         try {
//             setLoading(true);
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify({ otp }));
//
//             const response = await api.post('/user/verify-2fa',
//                 { data: encryptedData },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//
//             if (response.status === 200 && response.decryptedData?.status === "200") {
//                 setIs2faEnabled(true);
//                 setQrCode(null);
//                 setOtp('');
//                 alert('2FA enabled successfully');
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to verify OTP');
//             }
//         } catch (err) {
//             setError('Failed to enable 2FA: ' + (err.message || 'Unknown error'));
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Handle Angle One form submission
//     const handleAngleOneSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setLoading(true);
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify(angleOneData));
//
//             const response = await api.post('/user/save-angel-credentials',
//                 { data: encryptedData },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`
//                     }
//                 }
//             );
//
//             if (response.status === 200 && response.decryptedData?.status === "200") {
//                 alert('Angle One credentials saved successfully');
//                 setAngleOneData({
//                     smartapi_key: '',
//                     smartapi_username: '',
//                     smartapi_password: '',
//                     smartapi_totp_token: ''
//                 });
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to save Angle One credentials');
//             }
//
//         } catch (err) {
//             setError('Failed to save Angle One credentials: ' + (err.message || 'Unknown error'));
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Handle Angle One input changes
//     const handleAngleOneInputChange = (e) => {
//         const { id, value } = e.target;
//         setAngleOneData(prev => ({
//             ...prev,
//             [id]: value
//         }));
//     };
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div className="flex justify-center items-center h-full">
//                     <p>Loading...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-max">
//                 <div className="flex flex-col md:flex-row">
//                     {/* Message Notification */}
//                     {message && (
//                         <div
//                             className="fixed top-4 right-4 z-50 w-80 bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center justify-between animate-fade-in"
//                             role="alert"
//                         >
//                             <div className="flex items-center">
//                                 <svg
//                                     className="w-5 h-5 mr-2"
//                                     fill="none"
//                                     stroke="currentColor"
//                                     viewBox="0 0 24 24"
//                                     xmlns="http://www.w3.org/2000/svg"
//                                 >
//                                     <path
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                         strokeWidth="2"
//                                         d="M5 13l4 4L19 7"
//                                     />
//                                 </svg>
//                                 <div>
//                                     <strong className="font-semibold">Success: </strong>
//                                     <span>{message}</span>
//                                 </div>
//                             </div>
//                             <button
//                                 onClick={() => setMessage(null)}
//                                 className="text-white hover:text-gray-200 transition-colors duration-200"
//                             >
//                                 <span className="text-2xl leading-none">×</span>
//                             </button>
//                         </div>
//                     )}
//
//                     {/* Sidebar */}
//                     <div className="w-full md:w-64 border-b md:border-b-0 md:border-r border-gray-200">
//                         <div className="p-6 border-b border-gray-200">
//                             <div className="flex flex-col items-center">
//                                 <div className="w-24 h-24 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4">
//                                     {userData.name.split(" ")[0]}
//                                 </div>
//                                 <h3 className="text-lg font-medium text-gray-900">{userData.name}</h3>
//                                 <p className="text-sm text-gray-500">{userData.email}</p>
//                             </div>
//                         </div>
//                         <nav className="p-4">
//                             <ul className="space-y-1">
//                                 {tabs.map((tab) => (
//                                     <li key={tab.id}>
//                                         <button
//                                             onClick={() => setActiveTab(tab.id)}
//                                             className={`w-full flex items-center px-4 py-3 rounded-lg text-sm ${
//                                                 activeTab === tab.id
//                                                     ? 'bg-blue-50 text-blue-600 font-medium'
//                                                     : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                                             }`}
//                                         >
//                                             <span className="mr-3">{tab.icon}</span>
//                                             {tab.label}
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </nav>
//                     </div>
//
//                     {/* Content */}
//                     <div className="flex-1 p-6">
//                         {error && (
//                             <div className="mb-4 p-4 bg-red-100 text-red-700 rounded">
//                                 {error}
//                             </div>
//                         )}
//                         {activeTab === 'profile' && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-gray-800 mb-6">Personal Information</h2>
//                                 <form onSubmit={handleProfileSubmit} className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Full Name
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="name"
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                                 value={userData.name}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
//                                             Email Address
//                                         </label>
//                                         <div className="relative">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <Mail size={18} className="text-gray-400" />
//                                             </div>
//                                             <input
//                                                 type="email"
//                                                 id="email"
//                                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                                 value={userData.email}
//                                                 onChange={handleInputChange}
//                                                 disabled
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
//                                             Phone Number
//                                         </label>
//                                         <div className="relative">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <Phone size={18} className="text-gray-400" />
//                                             </div>
//                                             <input
//                                                 type="tel"
//                                                 id="phone"
//                                                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                                 value={userData.phone}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Address
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="address"
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                                 value={userData.address}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 City
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="city"
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                                 value={userData.city}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
//                                                 Pin Code
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="pincode"
//                                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                                 value={userData.pincode}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="flex justify-end">
//                                         <button
//                                             type="submit"
//                                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
//                                             disabled={loading}
//                                         >
//                                             {loading ? 'Saving...' : 'Save Changes'}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         )}
//
//                         {activeTab === 'security' && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-gray-800 mb-6">Security Settings</h2>
//                                 <div className="space-y-8">
//
//
//                                     <div className="pt-6 border-t border-gray-200">
//                                         <h3 className="text-lg font-medium text-gray-800 mb-4">Two-Factor Authentication</h3>
//                                         <div className="space-y-4">
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-sm text-gray-600 mb-1">Enhance your account security with 2FA</p>
//                                                     <p className="text-xs text-gray-500">
//                                                         Status: <span className={is2faEnabled ? 'text-green-600' : 'text-red-600'}>
//                                                             {is2faEnabled ? 'Enabled' : 'Not Enabled'}
//                                                         </span>
//                                                     </p>
//                                                 </div>
//                                                 {!is2faEnabled && (
//                                                     <button
//                                                         onClick={handleGenerate2FA}
//                                                         className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
//                                                         disabled={loading}
//                                                     >
//                                                         {loading ? 'Generating...' : 'Enable'}
//                                                     </button>
//                                                 )}
//                                                 {is2faEnabled && (
//                                                     <p className="text-sm text-green-600 font-medium">2FA is currently enabled</p>
//                                                 )}
//                                             </div>
//
//                                             {qrCode && !is2faEnabled && (
//                                                 <div className="space-y-4">
//                                                     <div>
//                                                         <p className="text-sm text-gray-600">Scan this QR code with your authenticator app:</p>
//                                                         <img src={qrCode} alt="2FA QR Code" className="mt-2 max-w-xs" />
//                                                     </div>
//                                                     <form onSubmit={handleVerify2FA} className="space-y-4">
//                                                         <div>
//                                                             <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
//                                                                 Enter OTP
//                                                             </label>
//                                                             <input
//                                                                 type="text"
//                                                                 id="otp"
//                                                                 value={otp}
//                                                                 onChange={(e) => setOtp(e.target.value)}
//                                                                 className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                                                 placeholder="6-digit code"
//                                                                 maxLength={6}
//                                                             />
//                                                         </div>
//                                                         <div className="flex justify-end">
//                                                             <button
//                                                                 type="submit"
//                                                                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
//                                                                 disabled={loading || !otp}
//                                                             >
//                                                                 {loading ? 'Verifying...' : 'Verify'}
//                                                             </button>
//                                                         </div>
//                                                     </form>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//
//                         {activeTab === 'notifications' && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-gray-800 mb-6">Notification Preferences</h2>
//                                 <div className="space-y-6">
//                                     <div>
//                                         <h3 className="text-lg font-medium text-gray-800 mb-4">Email Notifications</h3>
//                                         <div className="space-y-3">
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-sm font-medium text-gray-700">Order Updates</p>
//                                                     <p className="text-xs text-gray-500">Receive updates about your stock orders</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" defaultChecked />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                                 </label>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-sm font-medium text-gray-700">Price Alerts</p>
//                                                     <p className="text-xs text-gray-500">Get notified when stocks hit your target price</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" defaultChecked />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                                 </label>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-sm font-medium text-gray-700">Market Updates</p>
//                                                     <p className="text-xs text-gray-500">Daily and weekly market summaries</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                                 </label>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-sm font-medium text-gray-700">Newsletter</p>
//                                                     <p className="text-xs text-gray-500">Monthly investment insights and tips</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" defaultChecked />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                     <div className="pt-6 border-t border-gray-200">
//                                         <h3 className="text-lg font-medium text-gray-800 mb-4">Push Notifications</h3>
//                                         <div className="space-y-3">
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-sm font-medium text-gray-700">Real-time Alerts</p>
//                                                     <p className="text-xs text-gray-500">Immediate notifications for critical events</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" defaultChecked />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                                 </label>
//                                             </div>
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p className="text-sm font-medium text-gray-700">Order Status</p>
//                                                     <p className="text-xs text-gray-500">Get notified when your orders are executed</p>
//                                                 </div>
//                                                 <label className="relative inline-flex items-center cursor-pointer">
//                                                     <input type="checkbox" className="sr-only peer" defaultChecked />
//                                                     <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
//                                                 </label>
//                                             </div>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//
//                         {activeTab === 'angleone' && (
//                             <div>
//                                 <h2 className="text-xl font-semibold text-gray-800 mb-6">Angle One Credentials</h2>
//                                 <form onSubmit={handleAngleOneSubmit} className="space-y-6">
//                                     <div>
//                                         <label htmlFor="smartapi_key" className="block text-sm font-medium text-gray-700 mb-1">
//                                             SmartAPI Key
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="smartapi_key"
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                             value={angleOneData.smartapi_key}
//                                             onChange={handleAngleOneInputChange}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="smartapi_username" className="block text-sm font-medium text-gray-700 mb-1">
//                                             SmartAPI Username
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="smartapi_username"
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                             value={angleOneData.smartapi_username}
//                                             onChange={handleAngleOneInputChange}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="smartapi_password" className="block text-sm font-medium text-gray-700 mb-1">
//                                             SmartAPI Password
//                                         </label>
//                                         <input
//                                             type="password"
//                                             id="smartapi_password"
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                             value={angleOneData.smartapi_password}
//                                             onChange={handleAngleOneInputChange}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label htmlFor="smartapi_totp_token" className="block text-sm font-medium text-gray-700 mb-1">
//                                             SmartAPI TOTP Token
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="smartapi_totp_token"
//                                             className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
//                                             value={angleOneData.smartapi_totp_token}
//                                             onChange={handleAngleOneInputChange}
//                                         />
//                                     </div>
//                                     <div className="flex justify-end">
//                                         <button
//                                             type="submit"
//                                             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
//                                             disabled={loading}
//                                         >
//                                             {loading ? 'Saving...' : 'Save Credentials'}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Profile;


// import React, { useEffect, useState, useContext } from 'react';
// import DashboardLayout from '../../components/DashboardLayout';
// import { User, Mail, Phone, Shield, Unplug } from 'lucide-react';
// import { getAuthToken } from '../../utils/auth.js';
// import api, { encryptMessage } from '../../utils/api.js';
// import { ThemeContext } from '../../context/ThemeContext';
// import {toast} from "react-toastify";
// import {useLocation} from "react-router-dom";
//
// const Profile = () => {
//     const [activeTab, setActiveTab] = useState('profile');
//     const [userData, setUserData] = useState({
//         name: '',
//         email: '',
//         phone: '',
//         address: '',
//         pincode: '',
//         city: '',
//     });
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [qrCode, setQrCode] = useState(null);
//     const [otp, setOtp] = useState('');
//     const [is2faEnabled, setIs2faEnabled] = useState(false);
//     const location = useLocation();
//     const queryParams = new URLSearchParams(location.search);
//     const section = queryParams.get('section');
//
//     useEffect(() => {
//         if (section === 'angel-one') {
//             // Scroll to or highlight the Angel One section
//             const angelOneSection = document.getElementById('angel-one-section');
//             if (angelOneSection) {
//                 angelOneSection.scrollIntoView({ behavior: 'smooth' });
//             }
//         }
//     }, [section]);
//     const [angleOneData, setAngleOneData] = useState({
//         smartapi_key: '',
//         smartapi_username: '',
//         smartapi_password: '',
//         smartapi_totp_token: '',
//     });
//
//     const { theme } = useContext(ThemeContext);
//
//
//     const tabs = [
//         { id: 'profile', label: 'Profile', icon: <User size={18} /> },
//         { id: 'security', label: 'Security', icon: <Shield size={18} /> },
//         { id: 'angleone', label: 'Angle One', icon: <Unplug size={18} /> },
//     ];
//
//     // Fetch user data on component mount
//     useEffect(() => {
//         const fetchUserProfile = async () => {
//             try {
//                 setLoading(true);
//                 const token = getAuthToken();
//                 const email = JSON.parse(atob(token.split('.')[1])).sub;
//
//                 const response = await api.get(`/user/${email}`, {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 });
//
//                 if (response.decryptedData) {
//                     const decryptedData = response.decryptedData.user;
//                     setUserData({
//                         name: decryptedData.name || '',
//                         email: decryptedData.email || '',
//                         phone: decryptedData.phone || '',
//                         address: decryptedData.address || '',
//                         pincode: decryptedData.pincode || '',
//                         city: decryptedData.city || '',
//                     });
//                     setIs2faEnabled(decryptedData.totp_enabled || false);
//                 }
//             } catch (err) {
//                 setError('Failed to fetch profile data');
//                 console.error(err);
//             } finally {
//                 setLoading(false);
//             }
//         };
//
//         fetchUserProfile();
//     }, []);
//
//     // Handle profile form submission
//     const handleProfileSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setLoading(true);
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify(userData));
//
//             const response = await api.post(
//                 '/user/edit-profile',
//                 { data: encryptedData },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//
//             if (response.status === 200 && response.decryptedData) {
//                 const { status, message } = response.decryptedData;
//                 if (status === "200") {
//                     alert('Profile updated successfully');
//                     return;
//                 } else {
//                     throw new Error(message || 'Profile update failed');
//                 }
//             } else {
//                 throw new Error('Invalid response from server');
//             }
//         } catch (err) {
//             setError('Failed to update profile: ' + (err.message || 'Unknown error'));
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Handle input changes for profile
//     const handleInputChange = (e) => {
//         const { id, value } = e.target;
//         setUserData((prev) => ({
//             ...prev,
//             [id]: value,
//         }));
//     };
//
//     // Generate 2FA QR Code
//     const handleGenerate2FA = async () => {
//         try {
//             setLoading(true);
//             setError(null);
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify({}));
//
//             const response = await api.post(
//                 '/user/generate-2fa',
//                 { data: encryptedData },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//
//             if (response.status === 200 && response.decryptedData) {
//                 const { status, message, qr_code } = response.decryptedData;
//                 if (status === "200" && qr_code) {
//                     setQrCode(qr_code);
//                 } else {
//                     throw new Error(message || 'Invalid response format: QR code missing');
//                 }
//             } else {
//                 throw new Error('Invalid server response');
//             }
//         } catch (err) {
//             setError('Failed to generate 2FA QR code: ' + (err.message || 'Unknown error'));
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Verify OTP and Enable 2FA
//     const handleVerify2FA = async (e) => {
//         e.preventDefault();
//         try {
//             setLoading(true);
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify({ otp }));
//
//             const response = await api.post(
//                 '/user/verify-2fa',
//                 { data: encryptedData },
//                 { headers: { Authorization: `Bearer ${token}` } }
//             );
//
//             if (response.status === 200 && response.decryptedData?.status === "200") {
//                 setIs2faEnabled(true);
//                 setQrCode(null);
//                 setOtp('');
//                 alert('2FA enabled successfully');
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to verify OTP');
//             }
//         } catch (err) {
//             setError('Failed to enable 2FA: ' + (err.message || 'Unknown error'));
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Handle Angle One form submission
//     const handleAngleOneSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             setLoading(true);
//             const token = getAuthToken();
//             const encryptedData = encryptMessage(JSON.stringify(angleOneData));
//
//             const response = await api.post(
//                 '/user/save-angel-credentials',
//                 { data: encryptedData },
//                 {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 }
//             );
//
//             if (response.status === 200 && response.decryptedData?.status === "200") {
//                 toast.success('Angle One credentials saved successfully', {
//                     position: "top-right",
//                     autoClose: 3000, // Toast will disappear after 3 seconds
//                     hideProgressBar: false,
//                     closeOnClick: true,
//                     pauseOnHover: true,
//                     draggable: true,
//                     progress: undefined,
//                     theme: "dark",
//                 });
//                 setAngleOneData({
//                     smartapi_key: '',
//                     smartapi_username: '',
//                     smartapi_password: '',
//                     smartapi_totp_token: '',
//                 });
//             } else {
//                 throw new Error(response.decryptedData?.message || 'Failed to save Angle One credentials');
//             }
//         } catch (err) {
//             setError('Failed to save Angle One credentials: ' + (err.message || 'Unknown error'));
//             console.error(err);
//         } finally {
//             setLoading(false);
//         }
//     };
//
//     // Handle Angle One input changes
//     const handleAngleOneInputChange = (e) => {
//         const { id, value } = e.target;
//         setAngleOneData((prev) => ({
//             ...prev,
//             [id]: value,
//         }));
//     };
//
//     if (loading) {
//         return (
//             <DashboardLayout>
//                 <div
//                     className={`flex justify-center items-center h-full ${
//                         theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
//                     }`}
//                 >
//                     <p>Loading...</p>
//                 </div>
//             </DashboardLayout>
//         );
//     }
//
//     return (
//         <DashboardLayout>
//             <div
//                 className={`rounded-lg shadow-sm border overflow-hidden h-max ${
//                     theme === 'dark'
//                         ? 'bg-gray-900 border-gray-700 text-gray-200'
//                         : 'bg-white border-gray-200 text-gray-700'
//                 }`}
//             >
//                 <div className="flex flex-col md:flex-row">
//                     {/* Sidebar */}
//                     <div
//                         className={`w-full md:w-64 border-b md:border-b-0 md:border-r ${
//                             theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//                         }`}
//                     >
//                         <div
//                             className={`p-6 border-b ${
//                                 theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//                             }`}
//                         >
//                             <div className="flex flex-col items-center">
//                                 <div className="w-29 h-29 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4">
//                                     {userData.name.split(" ")[0]}
//                                 </div>
//                                 <h3
//                                     className={`text-lg font-medium ${
//                                         theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
//                                     }`}
//                                 >
//                                     {userData.name}
//                                 </h3>
//                                 <p
//                                     className={`text-sm ${
//                                         theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
//                                     }`}
//                                 >
//                                     {userData.email}
//                                 </p>
//                             </div>
//                         </div>
//                         <nav className="p-4">
//                             <ul className="space-y-1">
//                                 {tabs.map((tab) => (
//                                     <li key={tab.id}>
//                                         <button
//                                             onClick={() => setActiveTab(tab.id)}
//                                             className={`w-full flex items-center px-4 py-3 rounded-lg text-sm ${
//                                                 activeTab === tab.id
//                                                     ? theme === 'dark'
//                                                         ? 'bg-blue-900 text-blue-300 font-medium'
//                                                         : 'bg-blue-50 text-blue-600 font-medium'
//                                                     : theme === 'dark'
//                                                         ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
//                                                         : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
//                                             }`}
//                                         >
//                                             <span
//                                                 className={`mr-3 ${
//                                                     activeTab === tab.id
//                                                         ? theme === 'dark'
//                                                             ? 'text-blue-300'
//                                                             : 'text-blue-600'
//                                                         : theme === 'dark'
//                                                             ? 'text-gray-400'
//                                                             : 'text-gray-500'
//                                                 }`}
//                                             >
//                                                 {tab.icon}
//                                             </span>
//                                             {tab.label}
//                                         </button>
//                                     </li>
//                                 ))}
//                             </ul>
//                         </nav>
//                     </div>
//
//                     {/* Content */}
//                     <div className="flex-1 p-6">
//                         {error && (
//                             <div
//                                 className={`mb-4 p-4 rounded ${
//                                     theme === 'dark'
//                                         ? 'bg-red-900 text-red-300'
//                                         : 'bg-red-100 text-red-700'
//                                 }`}
//                             >
//                                 {error}
//                             </div>
//                         )}
//                         {activeTab === 'profile' && (
//                             <div>
//                                 <h2
//                                     className={`text-xl font-semibold mb-6 ${
//                                         theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                     }`}
//                                 >
//                                     Personal Information
//                                 </h2>
//                                 <form onSubmit={handleProfileSubmit} className="space-y-6">
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label
//                                                 htmlFor="name"
//                                                 className={`block text-sm font-medium mb-1 ${
//                                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                                 }`}
//                                             >
//                                                 Full Name
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="name"
//                                                 className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                     theme === 'dark'
//                                                         ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                         : 'bg-white border-gray-300 text-gray-900'
//                                                 }`}
//                                                 value={userData.name}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label
//                                             htmlFor="email"
//                                             className={`block text-sm font-medium mb-1 ${
//                                                 theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                             }`}
//                                         >
//                                             Email Address
//                                         </label>
//                                         <div className="relative">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <Mail
//                                                     size={18}
//                                                     className={`${
//                                                         theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
//                                                     }`}
//                                                 />
//                                             </div>
//                                             <input
//                                                 type="email"
//                                                 id="email"
//                                                 className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                     theme === 'dark'
//                                                         ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                         : 'bg-white border-gray-300 text-gray-900'
//                                                 }`}
//                                                 value={userData.email}
//                                                 onChange={handleInputChange}
//                                                 disabled
//                                             />
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <label
//                                             htmlFor="phone"
//                                             className={`block text-sm font-medium mb-1 ${
//                                                 theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                             }`}
//                                         >
//                                             Phone Number
//                                         </label>
//                                         <div className="relative">
//                                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                                 <Phone
//                                                     size={18}
//                                                     className={`${
//                                                         theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
//                                                     }`}
//                                                 />
//                                             </div>
//                                             <input
//                                                 type="tel"
//                                                 id="phone"
//                                                 className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                     theme === 'dark'
//                                                         ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                         : 'bg-white border-gray-300 text-gray-900'
//                                                 }`}
//                                                 value={userData.phone}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label
//                                                 htmlFor="address"
//                                                 className={`block text-sm font-medium mb-1 ${
//                                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                                 }`}
//                                             >
//                                                 Address
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="address"
//                                                 className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                     theme === 'dark'
//                                                         ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                         : 'bg-white border-gray-300 text-gray-900'
//                                                 }`}
//                                                 value={userData.address}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label
//                                                 htmlFor="city"
//                                                 className={`block text-sm font-medium mb-1 ${
//                                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                                 }`}
//                                             >
//                                                 City
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="city"
//                                                 className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                     theme === 'dark'
//                                                         ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                         : 'bg-white border-gray-300 text-gray-900'
//                                                 }`}
//                                                 value={userData.city}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                                         <div>
//                                             <label
//                                                 htmlFor="pincode"
//                                                 className={`block text-sm font-medium mb-1 ${
//                                                     theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                                 }`}
//                                             >
//                                                 Pin Code
//                                             </label>
//                                             <input
//                                                 type="text"
//                                                 id="pincode"
//                                                 className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                     theme === 'dark'
//                                                         ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                         : 'bg-white border-gray-300 text-gray-900'
//                                                 }`}
//                                                 value={userData.pincode}
//                                                 onChange={handleInputChange}
//                                             />
//                                         </div>
//                                     </div>
//                                     <div className="flex justify-end">
//                                         <button
//                                             type="submit"
//                                             className={`px-4 py-2 rounded-lg transition-colors disabled:bg-blue-300 ${
//                                                 theme === 'dark'
//                                                     ? 'bg-blue-500 text-white hover:bg-blue-600'
//                                                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                                             }`}
//                                             disabled={loading}
//                                         >
//                                             {loading ? 'Saving...' : 'Save Changes'}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         )}
//
//                         {activeTab === 'security' && (
//                             <div>
//                                 <h2
//                                     className={`text-xl font-semibold mb-6 ${
//                                         theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                     }`}
//                                 >
//                                     Security Settings
//                                 </h2>
//                                 <div className="space-y-8">
//                                     <div
//                                         className={`pt-6 border-t ${
//                                             theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
//                                         }`}
//                                     >
//                                         <h3
//                                             className={`text-lg font-medium mb-4 ${
//                                                 theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                             }`}
//                                         >
//                                             Two-Factor Authentication
//                                         </h3>
//                                         <div className="space-y-4">
//                                             <div className="flex items-center justify-between">
//                                                 <div>
//                                                     <p
//                                                         className={`text-sm mb-1 ${
//                                                             theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
//                                                         }`}
//                                                     >
//                                                         Enhance your account security with 2FA
//                                                     </p>
//                                                     <p
//                                                         className={`text-xs ${
//                                                             theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
//                                                         }`}
//                                                     >
//                                                         Status:{' '}
//                                                         <span
//                                                             className={
//                                                                 is2faEnabled
//                                                                     ? 'text-green-600'
//                                                                     : 'text-red-600'
//                                                             }
//                                                         >
//                                                             {is2faEnabled ? 'Enabled' : 'Not Enabled'}
//                                                         </span>
//                                                     </p>
//                                                 </div>
//                                                 {!is2faEnabled && (
//                                                     <button
//                                                         onClick={handleGenerate2FA}
//                                                         className={`px-4 py-2 rounded-lg transition-colors disabled:bg-green-300 ${
//                                                             theme === 'dark'
//                                                                 ? 'bg-green-500 text-white hover:bg-green-600'
//                                                                 : 'bg-green-600 text-white hover:bg-green-700'
//                                                         }`}
//                                                         disabled={loading}
//                                                     >
//                                                         {loading ? 'Generating...' : 'Enable'}
//                                                     </button>
//                                                 )}
//                                                 {is2faEnabled && (
//                                                     <p
//                                                         className={`text-sm font-medium ${
//                                                             theme === 'dark'
//                                                                 ? 'text-green-400'
//                                                                 : 'text-green-600'
//                                                         }`}
//                                                     >
//                                                         2FA is currently enabled
//                                                     </p>
//                                                 )}
//                                             </div>
//
//                                             {qrCode && !is2faEnabled && (
//                                                 <div className="space-y-4">
//                                                     <div>
//                                                         <p
//                                                             className={`text-sm ${
//                                                                 theme === 'dark'
//                                                                     ? 'text-gray-400'
//                                                                     : 'text-gray-600'
//                                                             }`}
//                                                         >
//                                                             Scan this QR code with your authenticator app:
//                                                         </p>
//                                                         <img
//                                                             src={qrCode}
//                                                             alt="2FA QR Code"
//                                                             className="mt-2 max-w-xs"
//                                                         />
//                                                     </div>
//                                                     <form onSubmit={handleVerify2FA} className="space-y-4">
//                                                         <div>
//                                                             <label
//                                                                 htmlFor="otp"
//                                                                 className={`block text-sm font-medium mb-1 ${
//                                                                     theme === 'dark'
//                                                                         ? 'text-gray-300'
//                                                                         : 'text-gray-700'
//                                                                 }`}
//                                                             >
//                                                                 Enter OTP
//                                                             </label>
//                                                             <input
//                                                                 type="text"
//                                                                 id="otp"
//                                                                 value={otp}
//                                                                 onChange={(e) =>
//                                                                     setOtp(e.target.value)
//                                                                 }
//                                                                 className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                                     theme === 'dark'
//                                                                         ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                                         : 'bg-white border-gray-300 text-gray-900'
//                                                                 }`}
//                                                                 placeholder="6-digit code"
//                                                                 maxLength={6}
//                                                             />
//                                                         </div>
//                                                         <div className="flex justify-end">
//                                                             <button
//                                                                 type="submit"
//                                                                 className={`px-4 py-2 rounded-lg transition-colors disabled:bg-blue-300 ${
//                                                                     theme === 'dark'
//                                                                         ? 'bg-blue-500 text-white hover:bg-blue-600'
//                                                                         : 'bg-blue-600 text-white hover:bg-blue-700'
//                                                                 }`}
//                                                                 disabled={loading || !otp}
//                                                             >
//                                                                 {loading ? 'Verifying...' : 'Verify'}
//                                                             </button>
//                                                         </div>
//                                                     </form>
//                                                 </div>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         )}
//
//                         {activeTab === 'angleone' && (
//                             <div id="angel-one-section">
//                                 <h2
//                                     className={`text-xl font-semibold mb-6 ${
//                                         theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
//                                     }`}
//                                 >
//                                     Angle One Credentials
//                                 </h2>
//                                 <form onSubmit={handleAngleOneSubmit} className="space-y-6">
//                                     <div>
//                                         <label
//                                             htmlFor="smartapi_key"
//                                             className={`block text-sm font-medium mb-1 ${
//                                                 theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                             }`}
//                                         >
//                                             SmartAPI Key
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="smartapi_key"
//                                             className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                 theme === 'dark'
//                                                     ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                     : 'bg-white border-gray-300 text-gray-900'
//                                             }`}
//                                             value={angleOneData.smartapi_key}
//                                             onChange={handleAngleOneInputChange}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label
//                                             htmlFor="smartapi_username"
//                                             className={`block text-sm font-medium mb-1 ${
//                                                 theme === 'dark' ? 'text-gray- praia700' : 'text-gray-700'
//                                             }`}
//                                         >
//                                             Angel One Username
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="smartapi_username"
//                                             className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                 theme === 'dark'
//                                                     ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                     : 'bg-white border-gray-300 text-gray-900'
//                                             }`}
//                                             value={angleOneData.smartapi_username}
//                                             onChange={handleAngleOneInputChange}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label
//                                             htmlFor="smartapi_password"
//                                             className={`block text-sm font-medium mb-1 ${
//                                                 theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                             }`}
//                                         >
//                                             Angel One PIN
//                                         </label>
//                                         <input
//                                             type="password"
//                                             id="smartapi_password"
//                                             className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                 theme === 'dark'
//                                                     ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                     : 'bg-white border-gray-300 text-gray-900'
//                                             }`}
//                                             value={angleOneData.smartapi_password}
//                                             onChange={handleAngleOneInputChange}
//                                         />
//                                     </div>
//                                     <div>
//                                         <label
//                                             htmlFor="smartapi_totp_token"
//                                             className={`block text-sm font-medium mb-1 ${
//                                                 theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
//                                             }`}
//                                         >
//                                             SmartAPI TOTP Token
//                                         </label>
//                                         <input
//                                             type="text"
//                                             id="smartapi_totp_token"
//                                             className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
//                                                 theme === 'dark'
//                                                     ? 'bg-gray-800 border-gray-600 text-gray-200'
//                                                     : 'bg-white border-gray-300 text-gray-900'
//                                             }`}
//                                             value={angleOneData.smartapi_totp_token}
//                                             onChange={handleAngleOneInputChange}
//                                         />
//                                     </div>
//                                     <div className="flex justify-end">
//                                         <button
//                                             type="submit"
//                                             className={`px-4 py-2 rounded-lg transition-colors disabled:bg-blue-300 ${
//                                                 theme === 'dark'
//                                                     ? 'bg-blue-500 text-white hover:bg-blue-600'
//                                                     : 'bg-blue-600 text-white hover:bg-blue-700'
//                                             }`}
//                                             disabled={loading}
//                                         >
//                                             {loading ? 'Saving...' : 'Save Credentials'}
//                                         </button>
//                                     </div>
//                                 </form>
//                             </div>
//                         )}
//                     </div>
//                 </div>
//             </div>
//         </DashboardLayout>
//     );
// };
//
// export default Profile;




import React, { useEffect, useState, useContext } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { User, Mail, Phone, Shield, Unplug } from 'lucide-react';
import { getAuthToken } from '../../utils/auth.js';
import api, { encryptMessage } from '../../utils/api.js';
import { ThemeContext } from '../../context/ThemeContext';
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom"; // Added useNavigate

const Profile = () => {
    const [activeTab, setActiveTab] = useState('profile');
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        pincode: '',
        city: '',
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [qrCode, setQrCode] = useState(null);
    const [otp, setOtp] = useState('');
    const [is2faEnabled, setIs2faEnabled] = useState(false);
    const location = useLocation();
    const navigate = useNavigate(); // Added for navigation
    const [angleOneData, setAngleOneData] = useState({
        smartapi_key: '',
        smartapi_username: '',
        smartapi_password: '',
        smartapi_totp_token: '',
    });

    const { theme } = useContext(ThemeContext);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: <User size={18} /> },
        { id: 'security', label: 'Security', icon: <Shield size={18} /> },
        { id: 'angleone', label: 'Angle One', icon: <Unplug size={18} /> },
    ];

    // Sync activeTab with URL hash on mount and hash change
    useEffect(() => {
        const hash = location.hash.replace('#', '').toLowerCase();
        const validTab = tabs.find(tab => tab.id === hash);
        setActiveTab(validTab ? hash : 'profile'); // Default to 'profile' if invalid
    }, [location.hash]);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true);
                const token = getAuthToken();
                const email = JSON.parse(atob(token.split('.')[1])).sub;

                const response = await api.get(`/user/${email}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.decryptedData) {
                    const decryptedData = response.decryptedData.user;
                    setUserData({
                        name: decryptedData.name || '',
                        email: decryptedData.email || '',
                        phone: decryptedData.phone || '',
                        address: decryptedData.address || '',
                        pincode: decryptedData.pincode || '',
                        city: decryptedData.city || '',
                    });
                    setIs2faEnabled(decryptedData.totp_enabled || false);
                }
            } catch (err) {
                setError('Failed to fetch profile data');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, []);

    // Handle tab change and update URL hash
    const handleTabChange = (tabId) => {
        setActiveTab(tabId);
        navigate(`/profile#${tabId}`, { replace: true }); // Update URL with hash
    };

    // Handle profile form submission
    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = getAuthToken();
            const encryptedData = encryptMessage(JSON.stringify(userData));

            const response = await api.post(
                '/user/edit-profile',
                { data: encryptedData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 && response.decryptedData) {
                const { status, message } = response.decryptedData;
                if (status === "200") {
                    alert('Profile updated successfully');
                    return;
                } else {
                    throw new Error(message || 'Profile update failed');
                }
            } else {
                throw new Error('Invalid response from server');
            }
        } catch (err) {
            setError('Failed to update profile: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes for profile
    const handleInputChange = (e) => {
        const { id, value } = e.target;
        setUserData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    // Generate 2FA QR Code
    const handleGenerate2FA = async () => {
        try {
            setLoading(true);
            setError(null);
            const token = getAuthToken();
            const encryptedData = encryptMessage(JSON.stringify({}));

            const response = await api.post(
                '/user/generate-2fa',
                { data: encryptedData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 && response.decryptedData) {
                const { status, message, qr_code } = response.decryptedData;
                if (status === "200" && qr_code) {
                    setQrCode(qr_code);
                } else {
                    throw new Error(message || 'Invalid response format: QR code missing');
                }
            } else {
                throw new Error('Invalid server response');
            }
        } catch (err) {
            setError('Failed to generate 2FA QR code: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Verify OTP and Enable 2FA
    const handleVerify2FA = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = getAuthToken();
            const encryptedData = encryptMessage(JSON.stringify({ otp }));

            const response = await api.post(
                '/user/verify-2fa',
                { data: encryptedData },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200 && response.decryptedData?.status === "200") {
                setIs2faEnabled(true);
                setQrCode(null);
                setOtp('');
                alert('2FA enabled successfully');
            } else {
                throw new Error(response.decryptedData?.message || 'Failed to verify OTP');
            }
        } catch (err) {
            setError('Failed to enable 2FA: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle Angle One form submission
    const handleAngleOneSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const token = getAuthToken();
            const encryptedData = encryptMessage(JSON.stringify(angleOneData));

            const response = await api.post(
                '/user/save-angel-credentials',
                { data: encryptedData },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (response.status === 200 && response.decryptedData?.status === "200") {
                toast.success('Angle One credentials saved successfully', {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setAngleOneData({
                    smartapi_key: '',
                    smartapi_username: '',
                    smartapi_password: '',
                    smartapi_totp_token: '',
                });
            } else {
                throw new Error(response.decryptedData?.message || 'Failed to save Angle One credentials');
            }
        } catch (err) {
            setError('Failed to save Angle One credentials: ' + (err.message || 'Unknown error'));
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle Angle One input changes
    const handleAngleOneInputChange = (e) => {
        const { id, value } = e.target;
        setAngleOneData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    if (loading) {
        return (
            <DashboardLayout>
                <div
                    className={`flex justify-center items-center h-full ${
                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                    }`}
                >
                    <p>Loading...</p>
                </div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout>
            <div
                className={`rounded-lg shadow-sm border overflow-hidden h-max ${
                    theme === 'dark'
                        ? 'bg-gray-900 border-gray-700 text-gray-200'
                        : 'bg-white border-gray-200 text-gray-700'
                }`}
            >
                <div className="flex flex-col md:flex-row">
                    {/* Sidebar */}
                    <div
                        className={`w-full md:w-64 border-b md:border-b-0 md:border-r ${
                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                        }`}
                    >
                        <div
                            className={`p-6 border-b ${
                                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                            }`}
                        >
                            <div className="flex flex-col items-center">
                                <div className="w-29 h-29 rounded-full bg-blue-600 text-white flex items-center justify-center text-3xl font-bold mb-4">
                                    {userData.name.split(" ")[0]}
                                </div>
                                <h3
                                    className={`text-lg font-medium ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
                                    }`}
                                >
                                    {userData.name}
                                </h3>
                                <p
                                    className={`text-sm ${
                                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                                    }`}
                                >
                                    {userData.email}
                                </p>
                            </div>
                        </div>
                        <nav className="p-4">
                            <ul className="space-y-1">
                                {tabs.map((tab) => (
                                    <li key={tab.id}>
                                        <button
                                            onClick={() => handleTabChange(tab.id)}
                                            className={`w-full flex items-center px-4 py-3 rounded-lg text-sm ${
                                                activeTab === tab.id
                                                    ? theme === 'dark'
                                                        ? 'bg-blue-900 text-blue-300 font-medium'
                                                        : 'bg-blue-50 text-blue-600 font-medium'
                                                    : theme === 'dark'
                                                        ? 'text-gray-300 hover:bg-gray-700 hover:text-gray-100'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                            }`}
                                        >
                                            <span
                                                className={`mr-3 ${
                                                    activeTab === tab.id
                                                        ? theme === 'dark'
                                                            ? 'text-blue-300'
                                                            : 'text-blue-600'
                                                        : theme === 'dark'
                                                            ? 'text-gray-400'
                                                            : 'text-gray-500'
                                                }`}
                                            >
                                                {tab.icon}
                                            </span>
                                            {tab.label}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-6">
                        {error && (
                            <div
                                className={`mb-4 p-4 rounded ${
                                    theme === 'dark'
                                        ? 'bg-red-900 text-red-300'
                                        : 'bg-red-100 text-red-700'
                                }`}
                            >
                                {error}
                            </div>
                        )}
                        {activeTab === 'profile' && (
                            <div>
                                <h2
                                    className={`text-xl font-semibold mb-6 ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                    }`}
                                >
                                    Personal Information
                                </h2>
                                <form onSubmit={handleProfileSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="name"
                                                className={`block text-sm font-medium mb-1 ${
                                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                            >
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                value={userData.name}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="email"
                                            className={`block text-sm font-medium mb-1 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                        >
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Mail
                                                    size={18}
                                                    className={`${
                                                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            <input
                                                type="email"
                                                id="email"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                value={userData.email}
                                                onChange={handleInputChange}
                                                disabled
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="phone"
                                            className={`block text-sm font-medium mb-1 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                        >
                                            Phone Number
                                        </label>
                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <Phone
                                                    size={18}
                                                    className={`${
                                                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                                                    }`}
                                                />
                                            </div>
                                            <input
                                                type="tel"
                                                id="phone"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                value={userData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="address"
                                                className={`block text-sm font-medium mb-1 ${
                                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                            >
                                                Address
                                            </label>
                                            <input
                                                type="text"
                                                id="address"
                                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                value={userData.address}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="city"
                                                className={`block text-sm font-medium mb-1 ${
                                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                            >
                                                City
                                            </label>
                                            <input
                                                type="text"
                                                id="city"
                                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                value={userData.city}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label
                                                htmlFor="pincode"
                                                className={`block text-sm font-medium mb-1 ${
                                                    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                            >
                                                Pin Code
                                            </label>
                                            <input
                                                type="text"
                                                id="pincode"
                                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                    theme === 'dark'
                                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                        : 'bg-white border-gray-300 text-gray-900'
                                                }`}
                                                value={userData.pincode}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className={`px-4 py-2 rounded-lg transition-colors disabled:bg-blue-300 ${
                                                theme === 'dark'
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Changes'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {activeTab === 'security' && (
                            <div>
                                <h2
                                    className={`text-xl font-semibold mb-6 ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                    }`}
                                >
                                    Security Settings
                                </h2>
                                <div className="space-y-8">
                                    <div
                                        className={`pt-6 border-t ${
                                            theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
                                        }`}
                                    >
                                        <h3
                                            className={`text-lg font-medium mb-4 ${
                                                theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                            }`}
                                        >
                                            Two-Factor Authentication
                                        </h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <p
                                                        className={`text-sm mb-1 ${
                                                            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                                                        }`}
                                                    >
                                                        Enhance your account security with 2FA
                                                    </p>
                                                    <p
                                                        className={`text-xs ${
                                                            theme === 'dark' ? 'text-gray-500' : 'text-gray-500'
                                                        }`}
                                                    >
                                                        Status:{' '}
                                                        <span
                                                            className={
                                                                is2faEnabled
                                                                    ? 'text-green-600'
                                                                    : 'text-red-600'
                                                            }
                                                        >
                                                            {is2faEnabled ? 'Enabled' : 'Not Enabled'}
                                                        </span>
                                                    </p>
                                                </div>
                                                {!is2faEnabled && (
                                                    <button
                                                        onClick={handleGenerate2FA}
                                                        className={`px-4 py-2 rounded-lg transition-colors disabled:bg-green-300 ${
                                                            theme === 'dark'
                                                                ? 'bg-green-500 text-white hover:bg-green-600'
                                                                : 'bg-green-600 text-white hover:bg-green-700'
                                                        }`}
                                                        disabled={loading}
                                                    >
                                                        {loading ? 'Generating...' : 'Enable'}
                                                    </button>
                                                )}
                                                {is2faEnabled && (
                                                    <p
                                                        className={`text-sm font-medium ${
                                                            theme === 'dark'
                                                                ? 'text-green-400'
                                                                : 'text-green-600'
                                                        }`}
                                                    >
                                                        2FA is currently enabled
                                                    </p>
                                                )}
                                            </div>

                                            {qrCode && !is2faEnabled && (
                                                <div className="space-y-4">
                                                    <div>
                                                        <p
                                                            className={`text-sm ${
                                                                theme === 'dark'
                                                                    ? 'text-gray-400'
                                                                    : 'text-gray-600'
                                                            }`}
                                                        >
                                                            Scan this QR code with your authenticator app:
                                                        </p>
                                                        <img
                                                            src={qrCode}
                                                            alt="2FA QR Code"
                                                            className="mt-2 max-w-xs"
                                                        />
                                                    </div>
                                                    <form onSubmit={handleVerify2FA} className="space-y-4">
                                                        <div>
                                                            <label
                                                                htmlFor="otp"
                                                                className={`block text-sm font-medium mb-1 ${
                                                                    theme === 'dark'
                                                                        ? 'text-gray-300'
                                                                        : 'text-gray-700'
                                                                }`}
                                                            >
                                                                Enter OTP
                                                            </label>
                                                            <input
                                                                type="text"
                                                                id="otp"
                                                                value={otp}
                                                                onChange={(e) =>
                                                                    setOtp(e.target.value)
                                                                }
                                                                className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                                    theme === 'dark'
                                                                        ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                                        : 'bg-white border-gray-300 text-gray-900'
                                                                }`}
                                                                placeholder="6-digit code"
                                                                maxLength={6}
                                                            />
                                                        </div>
                                                        <div className="flex justify-end">
                                                            <button
                                                                type="submit"
                                                                className={`px-4 py-2 rounded-lg transition-colors disabled:bg-blue-300 ${
                                                                    theme === 'dark'
                                                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                                                }`}
                                                                disabled={loading || !otp}
                                                            >
                                                                {loading ? 'Verifying...' : 'Verify'}
                                                            </button>
                                                        </div>
                                                    </form>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'angleone' && (
                            <div id="angel-one-section">
                                <h2
                                    className={`text-xl font-semibold mb-6 ${
                                        theme === 'dark' ? 'text-gray-200' : 'text-gray-800'
                                    }`}
                                >
                                    Angle One Credentials
                                </h2>
                                <form onSubmit={handleAngleOneSubmit} className="space-y-6">
                                    <div>
                                        <label
                                            htmlFor="smartapi_key"
                                            className={`block text-sm font-medium mb-1 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                        >
                                            SmartAPI Key
                                        </label>
                                        <input
                                            type="text"
                                            id="smartapi_key"
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            value={angleOneData.smartapi_key}
                                            onChange={handleAngleOneInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="smartapi_username"
                                            className={`block text-sm font-medium mb-1 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                        >
                                            Angel One Username
                                        </label>
                                        <input
                                            type="text"
                                            id="smartapi_username"
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            value={angleOneData.smartapi_username}
                                            onChange={handleAngleOneInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="smartapi_password"
                                            className={`block text-sm font-medium mb-1 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                        >
                                            Angel One PIN
                                        </label>
                                        <input
                                            type="password"
                                            id="smartapi_password"
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            value={angleOneData.smartapi_password}
                                            onChange={handleAngleOneInputChange}
                                        />
                                    </div>
                                    <div>
                                        <label
                                            htmlFor="smartapi_totp_token"
                                            className={`block text-sm font-medium mb-1 ${
                                                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                                            }`}
                                        >
                                            SmartAPI TOTP Token
                                        </label>
                                        <input
                                            type="text"
                                            id="smartapi_totp_token"
                                            className={`w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                                theme === 'dark'
                                                    ? 'bg-gray-800 border-gray-600 text-gray-200'
                                                    : 'bg-white border-gray-300 text-gray-900'
                                            }`}
                                            value={angleOneData.smartapi_totp_token}
                                            onChange={handleAngleOneInputChange}
                                        />
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="submit"
                                            className={`px-4 py-2 rounded-lg transition-colors disabled:bg-blue-300 ${
                                                theme === 'dark'
                                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                    : 'bg-blue-600 text-white hover:bg-blue-700'
                                            }`}
                                            disabled={loading}
                                        >
                                            {loading ? 'Saving...' : 'Save Credentials'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
};

export default Profile;

