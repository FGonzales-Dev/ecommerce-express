import { Request, Response, NextFunction } from 'express';
import Post from '../models/Post';
import { createErrorResponse, handleValidationError } from '../utils/errorHandler';

export const createPost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, content } = req.body;
  const userId = req.user?.id;
 
  try {
    if (!userId) {
      res.status(401).json(createErrorResponse(401, 'Unauthorized'));
      return;
    }

    const post = await Post.create({
      title,
      content,
      author: userId,
    });

    res.status(201).json(post);
    return;
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      res.status(400).json(handleValidationError(error));
    } else {
      next(error);
    }
  }
};

export const getPosts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Parse pagination parameters from query string with defaults
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Fetch posts with pagination and populate the author field
    const posts = await Post.find()
      .populate('author', 'username email')
      .skip(skip)
      .limit(limit);

    // Get the total count of posts for pagination metadata
    const totalPosts = await Post.countDocuments();
    const totalPages = Math.ceil(totalPosts / limit);

    res.json({
      posts,
      pagination: {
        page,
        limit,
        totalPosts,
        totalPages,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getPostById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id).populate('author', 'username email');
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }
    res.json(post);
    return;
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json({ message: 'Post not found' });
      return;
    }

    // Only the author can update the post
    if (post.author.toString() !== userId) {
      res.status(403).json({ message: 'Not authorized to update this post' });
      return;
    }

    post.title = title || post.title;
    post.content = content || post.content;
    await post.save();

    res.json(post);
    return;
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { id } = req.params;
  const userId = req.user?.id;

  try {
    const post = await Post.findById(id);
    if (!post) {
      res.status(404).json(createErrorResponse(404, 'Post not found'));
      return;
    }

    // Only the author can delete the post
    if (post.author.toString() !== userId) {
      res.status(403).json(createErrorResponse(403, 'Not authorized to delete this post'));
      return;
    }

    await post.deleteOne();
    res.json({ message: 'Post removed' });
    return;
  } catch (error) {
    next(error);
  }
};
