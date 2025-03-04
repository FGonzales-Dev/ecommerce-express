import { Router } from 'express';
import { createCategory, getCategories, getCategoryById, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticate } from '../middleware/authMiddleware';


const router = Router();

// Apply the authentication middleware to all category routes
router.use(authenticate);

router.post('/', createCategory);
router.get('/', getCategories);
router.get('/:id', getCategoryById);
router.put('/:id', updateCategory);
router.delete('/:id', deleteCategory);

export default router;
