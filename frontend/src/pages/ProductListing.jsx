import { useState, useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';

const ProductListing = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const { data } = await axios.get('http://localhost:5000/api/products');
                setProducts(data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products', error);
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const handleAddToCart = (product) => {
        dispatch(addToCart({ ...product, qty: 1 }));
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-8">Latest Farm Produce</h1>
            {loading ? (
                <div className="text-center py-20 text-xl text-gray-500 animate-pulse">Loading amazing produce...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <div key={product._id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                            <div className="h-48 bg-gray-200 overflow-hidden">
                                <img
                                    src={product.image || 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1000'}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                />
                            </div>
                            <div className="p-5">
                                <div className="uppercase tracking-wide text-sm text-primary font-semibold mb-1">
                                    {product.category}
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2 truncate">{product.name}</h3>
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{product.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-2xl font-bold text-gray-900">₹{product.price}</span>
                                    <button
                                        onClick={() => handleAddToCart(product)}
                                        className="bg-primary hover:bg-primary-dark text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm"
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductListing;
