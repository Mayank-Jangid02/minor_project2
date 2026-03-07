import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { FaShoppingCart, FaUserCircle } from 'react-icons/fa';

const Navbar = () => {
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);
    let navigate = useNavigate();
    const handleProfile = (e) => {
        e.preventDefault();
        navigate('/profile');
    }
    return (
        <nav className="bg-primary text-white shadow-md">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold tracking-tight">
                    AgriMarket
                </Link>
                <div className="flex items-center space-x-6">
                    <Link to="/cart" className="flex items-center hover:text-gray-200 transition-colors">
                        <FaShoppingCart className="mr-2" size={20} />
                        <span>Cart</span>
                        {cartItems.length > 0 && (
                            <span className="ml-1 bg-secondary text-xs rounded-full px-2 py-0.5 font-bold">
                                {cartItems.length}
                            </span>
                        )}
                    </Link>
                    {userInfo ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/dashboard" className="hover:text-gray-200 transition-colors">
                                Dashboard
                            </Link>
                            <div className="flex items-center">
                                <button onClick={handleProfile}>
                                    <span> <FaUserCircle className="mr-2" size={20} />
                                        </span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link to="/login" className="hover:text-gray-200 transition-colors">SignIn</Link>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
