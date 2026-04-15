import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import { useEffect } from 'react';
import axios from 'axios';
import { removeFromCart } from '../redux/slices/cartSlice';

const Cart = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { cartItems } = useSelector((state) => state.cart);
    const { userInfo } = useSelector((state) => state.auth);

    const checkoutHandler = () => {
        if (userInfo) {
            navigate('/shipping');
        } else {
            navigate('/login?redirect=/shipping');
        }
    };

    useEffect(() => {
        const validateCartItems = async () => {
            const itemsToValidate = [...cartItems];
            for (const item of itemsToValidate) {
                try {
                    await axios.get(`http://localhost:5000/api/products/${item._id}`);
                } catch (error) {
                    if (error.response && error.response.status === 404) {
                        dispatch(removeFromCart(item._id));
                    }
                }
            }
        };

        if (cartItems.length > 0) {
            validateCartItems();
        }
    }, [cartItems, dispatch]);

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0);

    if (cartItems.length === 0) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Your Cart is Empty</h2>
                <p className="text-gray-500 mb-8">Looks like you haven't added any fresh produce yet.</p>
                <Link to="/" className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-dark transition-colors inline-block">
                    Browse Marketplace
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
            <div className="flex flex-col md:flex-row gap-8">
                <div className="md:w-2/3">
                    <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
                        <ul className="divide-y divide-gray-200">
                            {cartItems.map((item) => (
                                <li key={item._id} className="p-6 flex flex-col sm:flex-row items-center hover:bg-gray-50 transition-colors">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 mb-4 sm:mb-0">
                                        <img
                                            src={item.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80'}
                                            alt={item.name}
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="sm:ml-6 flex-1 flex flex-col justify-center">
                                        <div className="flex justify-between w-full">
                                            <h3 className="text-lg font-medium text-gray-900">
                                                <Link to={`/product/${item._id}`}>{item.name}</Link>
                                            </h3>
                                            <p className="text-lg font-bold text-gray-900">₹{item.price}</p>
                                        </div>
                                        <p className="mt-1 text-sm text-gray-500">{item.category}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="md:w-1/3">
                    <div className="bg-white rounded-xl shadow-sm p-6 sticky top-8">
                        <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                        <div className="flex justify-between text-base text-gray-600 mb-4">
                            <p>Subtotal ({cartItems.reduce((acc, item) => acc + (item.qty || 1), 0)} items)</p>
                            <p className="font-medium text-gray-900">₹{subtotal.toFixed(2)}</p>
                        </div>
                        <p className="text-sm text-gray-500 mb-6">Shipping and taxes calculated at checkout.</p>
                        <div className="mt-6">
                            <button
                                onClick={checkoutHandler}
                                className="w-full bg-secondary hover:bg-yellow-600 text-white font-medium px-6 py-3 rounded-lg shadow-sm transition-colors text-lg"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
