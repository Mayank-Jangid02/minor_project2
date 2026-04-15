import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';

const Dashboard = () => {
    const [farmerProducts, setFarmerProducts] = useState([]);
    const [myOrders, setMyOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        if (!userInfo) {
            navigate('/login');
        } else if (userInfo.role === 'Farmer') {
            const fetchFarmerProducts = async () => {
                try {
                    const config = {
                        withCredentials: true,
                    };
                    const { data } = await axios.get('http://localhost:5000/api/products', config);
                    // Filter products for this farmer
                    const myProducts = data.filter(p => p.farmer === userInfo._id || p.farmer?._id === userInfo._id);
                    setFarmerProducts(myProducts);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching farmer products', error);
                    setLoading(false);
                }
            };
            fetchFarmerProducts();
        } else if (userInfo.role === 'Buyer') {
            const fetchMyOrders = async () => {
                try {
                    const config = {
                        withCredentials: true,
                    };
                    const { data } = await axios.get('http://localhost:5000/api/orders/myorders', config);
                    setMyOrders(data);
                    setLoading(false);
                } catch (error) {
                    console.error('Error fetching my orders', error);
                    setLoading(false);
                }
            };
            fetchMyOrders();
        } else {
            setLoading(false);
        }
    }, [userInfo, navigate]);

    const deleteHandler = async (id) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            try {
                const config = {
                    withCredentials: true,
                };
                await axios.delete(`http://localhost:5000/api/products/${id}`, config);
                // Refresh the list
                setFarmerProducts(farmerProducts.filter((p) => p._id !== id));
                // Also remove from cart if present
                dispatch({ type: 'cart/removeFromCart', payload: id });
            } catch (error) {
                console.error('Error deleting product', error);
                alert(error.response?.data?.message || 'Error deleting product');
            }
        }
    };

    if (!userInfo) return null;

    return (
        <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-xl shadow-sm p-8 mb-8 border-l-4 border-primary">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome, {userInfo.name}!</h1>
                <p className="text-gray-600 text-lg">Role: <span className="font-semibold text-primary">{userInfo.role}</span></p>
            </div>

            {userInfo.role === 'Farmer' && (
                <div>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-800">Your Produce</h2>
                        <button
                            onClick={() => navigate('/add-product')}
                            className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-6 rounded-lg transition-colors shadow-sm"
                        >
                            Add New Product
                        </button>
                    </div>

                    {loading ? (
                        <div className="text-center py-10 text-gray-500 animate-pulse">Loading your products...</div>
                    ) : farmerProducts.length === 0 ? (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center">
                            <p className="text-gray-500 mb-4 text-lg">You haven't listed any products yet.</p>
                            <button
                                onClick={() => navigate('/add-product')}
                                className="text-primary font-medium hover:underline"
                            >
                                List your first product
                            </button>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {farmerProducts.map((product) => (
                                        <tr key={product._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <div className="h-10 w-10 flex-shrink-0">
                                                        <img className="h-10 w-10 rounded-md object-cover" src={product.image || 'https://via.placeholder.com/40'} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                                    {product.category}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                                                ₹{product.price}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {product.countInStock} {product.unit}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                <button
                                                    onClick={() => navigate(`/edit-product/${product._id}`)}
                                                    className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteHandler(product._id)}
                                                    className="text-red-600 hover:text-red-900"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {userInfo.role === 'Buyer' && (
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Recent Orders</h2>
                    {loading ? (
                        <div className="text-center py-10 text-gray-500 animate-pulse">Loading your orders...</div>
                    ) : myOrders.length === 0 ? (
                        <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-10 text-center">
                            <p className="text-gray-500 mb-4 text-lg">You haven't placed any orders yet.</p>
                            <Link to="/" className="text-primary font-medium hover:underline">Start shopping</Link>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Paid</th>
                                        <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {myOrders.map((order) => (
                                        <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id.substring(0, 10)}...</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.createdAt.substring(0, 10)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">₹{order.totalPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {order.isPaid ? 'Yes' : 'No'}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                    }`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
