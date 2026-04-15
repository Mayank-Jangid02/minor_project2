import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import CheckoutSteps from '../components/CheckoutSteps';
import { clearCart } from '../redux/slices/cartSlice';

const PlaceOrder = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cart = useSelector((state) => state.cart);

    if (!cart.shippingAddress.address) {
        navigate('/shipping');
    } else if (!cart.paymentMethod) {
        navigate('/payment');
    }

    // Calculate prices
    const addDecimals = (num) => {
        return (Math.round(num * 100) / 100).toFixed(2);
    };

    const itemsPrice = addDecimals(
        cart.cartItems.reduce((acc, item) => acc + item.price * (item.qty || 1), 0)
    );
    const shippingPrice = addDecimals(itemsPrice > 100 ? 0 : 10);
    const taxPrice = addDecimals(Number((0.15 * itemsPrice).toFixed(2)));
    const totalPrice = (
        Number(itemsPrice) +
        Number(shippingPrice) +
        Number(taxPrice)
    ).toFixed(2);

    const placeOrderHandler = async () => {
        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };

            const { data } = await axios.post(
                'http://localhost:5000/api/orders',
                {
                    orderItems: cart.cartItems.map((item) => ({
                        name: item.name,
                        qty: item.qty || 1,
                        image: item.image,
                        price: item.price,
                        product: item._id,
                        farmer: item.farmer._id || item.farmer,
                    })),
                    shippingAddress: cart.shippingAddress,
                    paymentMethod: cart.paymentMethod,
                    itemsPrice: Number(itemsPrice),
                    shippingPrice: Number(shippingPrice),
                    taxPrice: Number(taxPrice),
                    totalPrice: Number(totalPrice),
                },
                config
            );

            dispatch(clearCart());
            navigate(`/dashboard`); // Navigate to dashboard or order success
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Error placing order');
        }
    };

    return (
        <div className="max-w-6xl mx-auto py-8">
            <CheckoutSteps step1 step2 step3 step4 />
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-2/3">
                    <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Shipping</h2>
                        <p className="text-gray-700">
                            <span className="font-semibold">Address: </span>
                            {cart.shippingAddress.address}, {cart.shippingAddress.city}{' '}
                            {cart.shippingAddress.postalCode}, {cart.shippingAddress.country}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-8 mb-6">
                        <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
                        <p className="text-gray-700">
                            <span className="font-semibold">Method: </span>
                            {cart.paymentMethod}
                        </p>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-8">
                        <h2 className="text-2xl font-bold mb-4">Order Items</h2>
                        {cart.cartItems.length === 0 ? (
                            <p>Your cart is empty</p>
                        ) : (
                            <ul className="divide-y divide-gray-200">
                                {cart.cartItems.map((item, index) => (
                                    <li key={index} className="py-4 flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="h-16 w-16 object-cover rounded"
                                            />
                                            <div className="ml-4">
                                                <Link to={`/product/${item._id}`} className="text-primary hover:underline font-medium">
                                                    {item.name}
                                                </Link>
                                            </div>
                                        </div>
                                        <div className="text-gray-700">
                                            {item.qty || 1} x ₹{item.price} = ₹{((item.qty || 1) * item.price).toFixed(2)}
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                <div className="lg:w-1/3">
                    <div className="bg-white rounded-xl shadow-md p-8 sticky top-8">
                        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Items</span>
                                <span className="font-medium">₹{itemsPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">₹{shippingPrice}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Tax</span>
                                <span className="font-medium">₹{taxPrice}</span>
                            </div>
                            <hr />
                            <div className="flex justify-between text-xl font-bold border-t pt-4">
                                <span>Total</span>
                                <span>₹{totalPrice}</span>
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full bg-secondary text-white font-bold py-4 rounded-lg hover:bg-yellow-600 transition-colors shadow-lg disabled:opacity-50"
                            disabled={cart.cartItems.length === 0}
                            onClick={placeOrderHandler}
                        >
                            Place Order
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlaceOrder;
