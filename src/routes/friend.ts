import { Router } from 'express';
import { sendFriendRequest, acceptFriendRequest, declineFriendRequest, getFriendRequests } from '../controllers/friendController';
import { authenticate } from '../middleware/authMiddleware';


const router = Router();

// Send a friend request (expects { toUserId: string } in body)
router.post('/request', authenticate, sendFriendRequest);

// Get all incoming friend requests for the logged-in user
router.get('/requests', authenticate, getFriendRequests);

// Accept a friend request by its ID
router.post('/request/:id/accept', authenticate, acceptFriendRequest);

// Decline a friend request by its ID
router.post('/request/:id/decline', authenticate, declineFriendRequest);

export default router;
