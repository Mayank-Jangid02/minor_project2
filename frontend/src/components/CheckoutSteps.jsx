import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
    return (
        <nav className="flex justify-center mb-8 space-x-4">
            <div className="flex items-center">
                {step1 ? (
                    <Link to="/login" className="text-primary font-bold">Sign In</Link>
                ) : (
                    <span className="text-gray-400 cursor-not-allowed">Sign In</span>
                )}
            </div>

            <div className="flex items-center text-gray-400">
                <span className="mx-2">/</span>
                {step2 ? (
                    <Link to="/shipping" className="text-primary font-bold">Shipping</Link>
                ) : (
                    <span className="text-gray-400 cursor-not-allowed">Shipping</span>
                )}
            </div>

            <div className="flex items-center text-gray-400">
                <span className="mx-2">/</span>
                {step3 ? (
                    <Link to="/payment" className="text-primary font-bold">Payment</Link>
                ) : (
                    <span className="text-gray-400 cursor-not-allowed">Payment</span>
                )}
            </div>

            <div className="flex items-center text-gray-400">
                <span className="mx-2">/</span>
                {step4 ? (
                    <Link to="/placeorder" className="text-primary font-bold">Place Order</Link>
                ) : (
                    <span className="text-gray-400 cursor-not-allowed">Place Order</span>
                )}
            </div>
        </nav>
    );
};

export default CheckoutSteps;
