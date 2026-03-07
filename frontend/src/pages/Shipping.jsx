import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { saveShippingAddress } from '../redux/slices/cartSlice';
import CheckoutSteps from '../components/CheckoutSteps';

const Shipping = () => {
    const { shippingAddress } = useSelector((state) => state.cart);

    const [address, setAddress] = useState(shippingAddress?.address || '');
    const [city, setCity] = useState(shippingAddress?.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
    const [country, setCountry] = useState(shippingAddress?.country || '');

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const submitHandler = (e) => {
        e.preventDefault();
        dispatch(saveShippingAddress({ address, city, postalCode, country }));
        navigate('/payment');
    };

    return (
        <div className="max-w-xl mx-auto py-8">
            <CheckoutSteps step1 step2 />
            <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Shipping Information</h1>
                <form onSubmit={submitHandler}>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
                        <input
                            type="text"
                            placeholder="Enter address"
                            value={address}
                            required
                            onChange={(e) => setAddress(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
                        <input
                            type="text"
                            placeholder="Enter city"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Postal Code</label>
                        <input
                            type="text"
                            placeholder="Enter postal code"
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Country</label>
                        <input
                            type="text"
                            placeholder="Enter country"
                            value={country}
                            required
                            onChange={(e) => setCountry(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-primary text-white font-bold py-3 px-6 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                        Continue to Payment
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Shipping;
