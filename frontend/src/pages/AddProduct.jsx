import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [unit, setUnit] = useState('kg');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };

            await axios.post(
                'http://localhost:5000/api/products',
                {
                    name,
                    price: Number(price),
                    category,
                    unit,
                    countInStock: Number(countInStock),
                    description,
                    image: image || 'https://via.placeholder.com/150',
                },
                config
            );

            setLoading(false);
            navigate('/dashboard'); // Go back to dashboard after adding
        } catch (err) {
            setLoading(false);
            setError(err.response?.data?.message || err.message);
        }
    };

    if (!userInfo || userInfo.role !== 'Farmer') {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-gray-600 mt-2">Only farmers can add products.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">List a New Product</h1>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={submitHandler}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Product Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g., Organic Tomatoes"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Category</label>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                                required
                            >
                                <option value="">Select Category</option>
                                <option value="Vegetables">Vegetables</option>
                                <option value="Fruits">Fruits</option>
                                <option value="Grains">Grains</option>
                                <option value="Dairy">Dairy</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Price (₹)</label>
                            <input
                                type="number"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="0.00"
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Quantity</label>
                            <input
                                type="number"
                                value={countInStock}
                                onChange={(e) => setCountInStock(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                                placeholder="e.g., 50"
                                min="0"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 text-sm font-bold mb-2">Unit</label>
                            <select
                                value={unit}
                                onChange={(e) => setUnit(e.target.value)}
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                            >
                                <option value="kg">kg</option>
                                <option value="dozen">dozen</option>
                            </select>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Image URL (Optional)</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                            placeholder="https://example.com/image.jpg"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary h-24"
                            placeholder="Describe your produce..."
                            required
                        ></textarea>
                    </div>

                    <div className="flex items-center justify-between">
                        <button
                            type="button"
                            onClick={() => navigate('/dashboard')}
                            className="text-gray-600 hover:text-gray-800 font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`bg-primary text-white font-bold py-2 px-6 rounded-lg ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Adding...' : 'List Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;
