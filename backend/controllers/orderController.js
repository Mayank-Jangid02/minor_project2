import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error('No order items');
    } else {
        const order = new Order({
            buyer: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
        });

        const createdOrder = await order.save();

        // Optionally update product count in stock here if you are managing inventory 

        res.status(201).json(createdOrder);
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        'buyer',
        'name email'
    );

    if (order) {
        // Verify the user is either the buyer, an admin, or a farmer involved in the order
        const isBuyer = req.user._id.toString() === order.buyer._id.toString();
        const isAdmin = req.user.role === 'Admin';

        // Check if any item in the order is sold by this farmer
        let isRelatedFarmer = false;
        if (req.user.role === 'Farmer') {
            isRelatedFarmer = order.orderItems.some(item => item.farmer.toString() === req.user._id.toString());
        }

        if (isBuyer || isAdmin || isRelatedFarmer) {
            res.json(order);
        } else {
            res.status(401);
            throw new Error('Not authorized to view this order');
        }
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
            id: req.body.id,
            status: req.body.status,
            update_time: req.body.update_time,
            email_address: req.body.payer.email_address,
        };

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private (Admin or Farmer)
const updateOrderStatus = async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (order) {
        if (req.body.status) {
            order.orderStatus = req.body.status;
            if (req.body.status === 'Delivered') {
                order.deliveredAt = Date.now();
            }
        }

        const updatedOrder = await order.save();
        res.json(updatedOrder);
    } else {
        res.status(404);
        throw new Error('Order not found');
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    const orders = await Order.find({ buyer: req.user._id });
    res.json(orders);
};

// @desc    Get orders for a specific farmer
// @route   GET /api/orders/farmerorders
// @access  Private (Farmer)
const getFarmerOrders = async (req, res) => {
    // Find orders where an item's farmer field matches the logged-in farmer
    const orders = await Order.find({ 'orderItems.farmer': req.user._id }).populate('buyer', 'id name');
    res.json(orders);
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    const orders = await Order.find({}).populate('buyer', 'id name');
    res.json(orders);
};

export {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getFarmerOrders,
    getOrders,
};
