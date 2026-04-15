import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { logout } from "../redux/slices/authSlice";

const Profile = () => {
    let navigate = useNavigate();
    useEffect(() => {
        const token = localStorage.getItem('userInfo');
        if (!token) {
            navigate('/login');
        }
    }, []);
    const { userInfo } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const handleLogout = async () => {
        try {
            const config = {
                withCredentials: true,
            };
            await axios.post('http://localhost:5000/api/users/logout', {}, config);
            dispatch(logout());
            navigate('/login');
        } catch (error) {
            console.error('Logout error', error);
            dispatch(logout());
            navigate('/login');
        }
    }
    return (
        <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl p-8 sm:p-10 flex flex-col items-center transform transition duration-300 hover:scale-[1.02] border-2 border-transparent hover:border-primary">
                
                {/* Avatar Section */}
                <div className="relative mb-6">
                    <div className="h-32 w-32 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white text-5xl font-bold uppercase shadow-inner transform transition duration-500 hover:rotate-6 overflow-hidden border-4 border-white">
                        {userInfo.avatar ? (
                            <img src={userInfo.avatar} alt={userInfo.name} className="h-full w-full object-cover" onError={(e) => { e.target.onerror = null; e.target.src = ''; }} />
                        ) : (
                            userInfo.name ? userInfo.name.charAt(0) : '?'
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="text-center w-full mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2 truncate">
                        {userInfo.name}
                    </h1>
                    <p className="text-lg text-gray-500 font-medium">
                        {userInfo.email}
                    </p>
                </div>
                
                {/* Actions Section */}
                <div className="w-full flex justify-center gap-4 border-t border-gray-100 pt-8 mt-4 flex-wrap">
                    <button 
                        onClick={() => navigate('/edit-profile')} 
                        className="group relative flex justify-center items-center py-3 px-8 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 hover:text-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-sm hover:shadow transform transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
                    >
                        <svg className="w-4 h-4 mr-2 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                        </svg>
                        Edit Profile
                    </button>
                    
                    <button 
                        onClick={handleLogout} 
                        className="group relative flex justify-center items-center py-3 px-8 border border-transparent text-sm font-semibold rounded-xl text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1 w-full sm:w-auto"
                    >
                        <svg className="w-5 h-5 mr-2 -ml-1 transition-transform group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Log Out
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Profile;