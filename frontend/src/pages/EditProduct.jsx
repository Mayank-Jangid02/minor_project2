import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

const EditProduct = () => {
    const { id } = useParams();
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [unit, setUnit] = useState('kg');
    const [countInStock, setCountInStock] = useState('');
    const [description, setDescription] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const [updateLoading, setUpdateLoading] = useState(false);
    const [error, setError] = useState('');

    const { userInfo } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await axios.get(`http://localhost:5000/api/products/${id}`);
                setName(data.name);
                setPrice(data.price);
                setCategory(data.category);
                setUnit(data.unit || 'kg');
                setCountInStock(data.countInStock);
                setDescription(data.description);
                setImage(data.image);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
                setLoading(false);
            }
        };

        if (userInfo && userInfo.role === 'Farmer') {
            fetchProduct();
        } else {
            navigate('/dashboard');
        }
    }, [id, userInfo, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setUpdateLoading(true);
        setError('');

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                },
                withCredentials: true,
            };

            await axios.put(
                `http://localhost:5000/api/products/${id}`,
                {
                    name,
                    price: Number(price),
                    category,
                    unit,
                    countInStock: Number(countInStock),
                    description,
                    image,
                },
                config
            );

            setUpdateLoading(false);
            navigate('/dashboard');
        } catch (err) {
            setUpdateLoading(false);
            setError(err.response?.data?.message || err.message);
        }
    };

    if (loading) return <div className="text-center py-12">Loading...</div>;

    if (!userInfo || userInfo.role !== 'Farmer') {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-red-600">Access Denied</h2>
                <p className="text-gray-600 mt-2">Only farmers can edit products.</p>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-8">
            <div className="bg-white rounded-xl shadow-md p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Product</h1>

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
                        <label className="block text-gray-700 text-sm font-bold mb-2">Image URL</label>
                        <input
                            type="text"
                            value={image}
                            onChange={(e) => setImage(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-primary h-24"
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
                            disabled={updateLoading}
                            className={`bg-primary text-white font-bold py-2 px-6 rounded-lg ${updateLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {updateLoading ? 'Updating...' : 'Update Product'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProduct;
