import Product from '../models/productModel.js';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
    try {
        const keyword = req.query.keyword
            ? {
                name: {
                    $regex: req.query.keyword,
                    $options: 'i',
                },
            }
            : {};

        const category = req.query.category ? { category: req.query.category } : {};

        const query = { ...keyword, ...category };

        const products = await Product.find(query).populate('farmer', 'name email');
        res.status(200).json(products);
    } catch (error) {
        next(error);
    }
};

// @desc    Fetch a single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id).populate('farmer', 'name email');

        if (product) {
            res.status(200).json(product);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Farmer
const createProduct = async (req, res, next) => {
    try {
        const { name, price, description, image, category, countInStock, unit } = req.body;

        const product = new Product({
            name: name || 'Sample name',
            price: price || 0,
            user: req.user._id,
            farmer: req.user._id, // Assign the farmer role
            image: image || '/images/sample.jpg',
            category: category || 'Sample category',
            countInStock: countInStock || 0,
            unit: unit || 'kg',
            description: description || 'Sample description',
        });

        const createdProduct = await product.save();
        console.log(createdProduct);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Farmer
const updateProduct = async (req, res, next) => {
    try {
        const { name, price, description, image, category, countInStock, unit } = req.body;

        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if user is the farmer who created the product or an admin
            if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                res.status(401);
                throw new Error('User not authorized to update this product');
            }

            product.name = name || product.name;
            product.price = price || product.price;
            product.description = description || product.description;
            product.image = image || product.image;
            product.category = category || product.category;
            product.countInStock = countInStock || product.countInStock;
            product.unit = unit || product.unit;

            const updatedProduct = await product.save();
            res.status(200).json(updatedProduct);
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Farmer
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            // Check if user is the farmer who created the product or an admin
            if (product.farmer.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
                res.status(401);
                throw new Error('User not authorized to delete this product');
            }

            await Product.deleteOne({ _id: product._id });
            res.status(200).json({ message: 'Product removed' });
        } else {
            res.status(404);
            throw new Error('Product not found');
        }
    } catch (error) {
        next(error);
    }
};

export {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
};
