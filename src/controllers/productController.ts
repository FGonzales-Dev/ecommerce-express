import { Request, Response, NextFunction } from 'express';
import Product, { IProduct } from '../models/Product';

export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category } = req.body;
    const product: IProduct = await Product.create({ name, description, price, category });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find().populate('category', 'name description');
    res.json(products);
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name description');
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, price, category } = req.body;
    const product = await Product.findByIdAndUpdate(req.params.id, { name, description, price, category }, { new: true });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
};
