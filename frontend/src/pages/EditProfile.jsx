import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { setCredentials } from '../redux/slices/authSlice';

const EditProfile = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { userInfo } = useSelector((state) => state.auth);

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else {
            setName(userInfo.name);
            setEmail(userInfo.email);
            setAvatar(userInfo.avatar || '');
        }
    }, [navigate, userInfo]);

    const submitHandler = async (e) => {
        e.preventDefault();
        
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);
        setMessage(null);
        setError(null);

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };

            const payload = { name, email, avatar };
            if (password) {
                payload.password = password;
            }

            const { data } = await axios.put('http://localhost:5000/api/users/profile', payload, config);

            dispatch(setCredentials({ ...data }));
            setMessage('Profile updated successfully!');
            setLoading(false);
            
            // Redirect back to profile after a short delay
            setTimeout(() => {
                navigate('/profile');
            }, 1500);

        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || err.message);
        }
    };

    return (
        <div className="max-w-2xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg p-8 sm:p-10 relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary to-blue-400"></div>
                
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Edit Profile</h1>

                {message && (
                    <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded shadow-sm" role="alert">
                        <p className="font-medium">{message}</p>
                    </div>
                )}
                {error && (
                    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded shadow-sm" role="alert">
                        <p className="font-medium">{error}</p>
                    </div>
                )}

                <form onSubmit={submitHandler} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 outline-none shadow-sm"
                                placeholder="Enter your name"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 outline-none shadow-sm"
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Avatar Image URL</label>
                        <div className="flex items-center space-x-4">
                            <div className="flex-grow">
                                <input
                                    type="text"
                                    value={avatar}
                                    onChange={(e) => setAvatar(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 outline-none shadow-sm"
                                    placeholder="https://example.com/your-image.jpg"
                                />
                                <p className="text-xs text-gray-500 mt-2">Provide a direct link to an image to use as your profile picture.</p>
                            </div>
                            
                            {/* Live Preview Avatar */}
                            <div className="flex-shrink-0 h-16 w-16 rounded-full overflow-hidden border-2 border-gray-200 bg-gray-100 flex items-center justify-center">
                                {avatar ? (
                                    <img src={avatar} alt="Avatar Preview" className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
                                ) : (
                                    <span className="text-xl font-bold text-gray-400 capitalize">{name ? name.charAt(0) : '?'}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Change Password</h3>
                        <p className="text-sm text-gray-500 mb-4">Leave empty if you do not want to change your password.</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 outline-none shadow-sm"
                                    placeholder="Enter new password"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-transparent transition duration-200 outline-none shadow-sm"
                                    placeholder="Confirm new password"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-end space-x-4 pt-6">
                        <button
                            type="button"
                            onClick={() => navigate('/profile')}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-8 py-3 bg-gradient-to-r from-primary to-blue-500 text-white rounded-xl font-bold shadow-md hover:shadow-lg transform transition duration-200 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Updating...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;
