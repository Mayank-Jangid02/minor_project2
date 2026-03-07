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
        <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto flex flex-col items-center">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Profile</h1>
            <p>Name: {userInfo.name}</p>
            <p>Email: {userInfo.email}</p>
            <p>Role: {userInfo.role}</p>
            <button onClick={handleLogout} className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm">log out</button>
        </div>
    );
};

export default Profile;