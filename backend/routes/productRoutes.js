import express from 'express';
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
} from '../controllers/productController.js';
import { protect, farmer } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getProducts).post(protect, farmer, createProduct);
router
    .route('/:id')
    .get(getProductById)
    .put(protect, farmer, updateProduct)
    .delete(protect, farmer, deleteProduct);

export default router;
