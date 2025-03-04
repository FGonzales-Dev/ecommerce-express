import { Request, Response, NextFunction } from 'express';
import Cart from '../models/Cart';
import Product from '../models/Product';

export const addToCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;
  const qty = quantity ? parseInt(quantity, 10) : 1;

  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    // Check if the product exists
    const product = await Product.findById(productId);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }

    // Find user's cart or create a new one if it doesn't exist
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    // Check if product is already in cart
    const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
    if (itemIndex > -1) {
      // Update quantity if item exists
      cart.items[itemIndex].quantity += qty;
    } else {
      // Add new item to cart
      cart.items.push({ product: productId, quantity: qty });
    }

    await cart.save();
    res.status(200).json(cart);
    return;
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const cart = await Cart.findOne({ user: userId }).populate('items.product', 'name price description');
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    res.status(200).json(cart);
    return;
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  const { productId, quantity } = req.body;
  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
    if (itemIndex === -1) {
      res.status(404).json({ message: 'Product not found in cart' });
      return;
    }
    if (quantity <= 0) {
      // Remove item if quantity is 0 or less
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    await cart.save();
    res.status(200).json(cart);
    return;
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const userId = req.user?.id;
  const { productId } = req.params;
  try {
    if (!userId) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      res.status(404).json({ message: 'Cart not found' });
      return;
    }
    cart.items = cart.items.filter(item => item.product.toString() !== productId);
    await cart.save();
    res.status(200).json(cart);
    return;
  } catch (error) {
    next(error);
  }
};
