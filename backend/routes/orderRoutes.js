import express from 'express';
const router = express.Router();
import {
    addOrderItems,
    getOrderById,
    updateOrderToPaid,
    updateOrderStatus,
    getMyOrders,
    getFarmerOrders,
    getOrders,
} from '../controllers/orderController.js';
import { protect, admin, farmer } from '../middlewares/authMiddleware.js';

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/farmerorders').get(protect, farmer, getFarmerOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/status').put(protect, farmer, updateOrderStatus);

export default router;
