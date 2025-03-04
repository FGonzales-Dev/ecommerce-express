import { Router } from 'express';
import { addToCart, getCart, updateCartItem, removeCartItem } from '../controllers/cartController';
import { authenticate } from '../middleware/authMiddleware';

const router = Router();

// Protect all routes with authentication
router.use(authenticate);

router.post('/add', addToCart);
router.get('/', getCart);
router.put('/update', updateCartItem);
router.delete('/remove/:productId', removeCartItem);

export default router;
