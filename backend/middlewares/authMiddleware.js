import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';

// Protect routes
const protect = async (req, res, next) => {
    console.log('Cookies received:', req.cookies);
    let token;

    token = req.cookies.jwt;

    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_for_local_dev');

            req.user = await User.findById(decoded.userId).select('-password');

            next();
        } catch (error) {
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    } else {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};

// Admin middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'Admin') {
        next();
    } else {
        res.status(401);
        next(new Error('Not authorized as an admin'));
    }
};

// Farmer middleware
const farmer = (req, res, next) => {
    if (req.user && (req.user.role === 'Farmer' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(401);
        next(new Error('Not authorized as a farmer'));
    }
};

export { protect, admin, farmer };
