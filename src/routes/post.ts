import { Router } from 'express';
import { createPost, getPosts, getPostById, updatePost, deletePost } from '../controllers/postController';
import { authenticate } from '../middleware/authMiddleware';


const router = Router();

// Only logged-in users can access these endpoints
router.post('/', authenticate, createPost);
router.get('/', authenticate, getPosts);
router.get('/:id', authenticate, getPostById);
router.put('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);

// router.post('/', createPost);
// router.get('/', getPosts);
// router.get('/:id', getPostById);
// router.put('/:id', updatePost);
// router.delete('/:id', deletePost);

export default router;
