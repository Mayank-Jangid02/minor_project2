import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { savePaymentMethod } from '../redux/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const Payment = () => {
    const { shippingAddress } = useSelector((state) => state.cart);

    if (!shippingAddress.address) {
        navigate('/shipping');
    }

    const [paymentMethod, setPaymentMethod] = useState('PayPal');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(savePaymentMethod(paymentMethod));
        navigate('/placeorder');
    };

    return (
        <div className="max-w-md mx-auto py-8">
            <CheckoutSteps step1 step2 step3 />
            <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Payment Method</h1>
                <form onSubmit={submitHandler}>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-4">Select Method</label>
                        <div className="space-y-4">
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="PayPal"
                                    name="paymentMethod"
                                    value="PayPal"
                                    checked={paymentMethod === 'PayPal'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="PayPal" className="ml-3 block text-sm font-medium text-gray-700">
                                    PayPal or Credit Card
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="Stripe"
                                    name="paymentMethod"
                                    value="Stripe"
                                    checked={paymentMethod === 'Stripe'}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300"
                                />
                                <label htmlFor="Stripe" className="ml-3 block text-sm font-medium text-gray-700">
                                    Stripe
                                </label>
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Continue to Place Order
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Payment;
