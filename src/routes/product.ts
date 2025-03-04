import { Router } from 'express';
import { createProduct, getProducts, getProductById, updateProduct, deleteProduct } from '../controllers/productController';
import { authenticate } from '../middleware/authMiddleware';


const router = Router();

// Apply the authentication middleware to all product routes
router.use(authenticate);

router.post('/', createProduct);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

export default router;
