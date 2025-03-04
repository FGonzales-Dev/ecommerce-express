import { Request, Response, NextFunction } from 'express';
import FriendRequest from '../models/FriendRequest';
import User from '../models/User';
import mongoose from 'mongoose';


export const getFriends = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const userId = req.user?.id;
    try {
      if (!userId) {
        res.status(401).json({ message: 'Unauthorized' });
        return;
      }
      // Find the current user and populate their friends list
      const user = await User.findById(userId).populate('friends', 'username email');
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user.friends);
      return;
    } catch (error) {
      next(error);
    }
  };

export const sendFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const fromUserId = req.user?.id;
  const { toUserId } = req.body; // Expect the recipient's user id in the request body

  try {
    if (!fromUserId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    if (!toUserId) {
      res.status(400).json({ message: 'toUserId is required' });
      return;
    }
    if (fromUserId === toUserId) {
      res.status(400).json({ message: 'Cannot send friend request to yourself' });
      return;
    }
    // Check for an existing pending friend request between these users
    const existingRequest = await FriendRequest.findOne({
      $or: [
        { from: fromUserId, to: toUserId },
        { from: toUserId, to: fromUserId }
      ],
      status: 'pending'
    });
    if (existingRequest) {
      res.status(400).json({ message: 'Friend request already exists' });
      return;
    }
    // Check if they are already friends
    const fromUser = await User.findById(fromUserId);
    if (fromUser?.friends.includes(new mongoose.Types.ObjectId(toUserId))) {
      res.status(400).json({ message: 'You are already friends' });
      return;
    }

    const friendRequest = await FriendRequest.create({
      from: fromUserId,
      to: toUserId,
      status: 'pending'
    });
    res.status(201).json(friendRequest);
    return;
  } catch (error) {
    next(error);
  }
};

export const acceptFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const friendRequestId = req.params.id;
  const userId = req.user?.id;
  
  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const friendRequest = await FriendRequest.findById(friendRequestId);
    if (!friendRequest || friendRequest.status !== 'pending') {
      res.status(404).json({ message: 'Friend request not found or already processed' });
      return;
    }
    // Only the recipient can accept the friend request
    if (friendRequest.to.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to accept this friend request' });
      return;
    }
    friendRequest.status = 'accepted';
    await friendRequest.save();

    // Add each other as friends
    await User.findByIdAndUpdate(friendRequest.from, { $addToSet: { friends: friendRequest.to } });
    await User.findByIdAndUpdate(friendRequest.to, { $addToSet: { friends: friendRequest.from } });

    res.json({ message: 'Friend request accepted', friendRequest });
    return;
  } catch (error) {
    next(error);
  }
};

export const declineFriendRequest = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const friendRequestId = req.params.id;
  const userId = req.user?.id;
  
  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const friendRequest = await FriendRequest.findById(friendRequestId);
    if (!friendRequest || friendRequest.status !== 'pending') {
      res.status(404).json({ message: 'Friend request not found or already processed' });
      return;
    }
    // Only the recipient can decline the friend request
    if (friendRequest.to.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to decline this friend request' });
      return;
    }
    friendRequest.status = 'declined';
    await friendRequest.save();

    res.json({ message: 'Friend request declined', friendRequest });
    return;
  } catch (error) {
    next(error);
  }
};

export const getFriendRequests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    // Get pending friend requests sent to the authenticated user
    const requests = await FriendRequest.find({ to: userId, status: 'pending' })
      .populate('from', 'username email');
    res.json(requests);
    return;
  } catch (error) {
    next(error);
  }
};
