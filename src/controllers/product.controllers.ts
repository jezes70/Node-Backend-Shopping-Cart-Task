import Product from '../models/product.model';
import { Request, Response } from 'express';

export const getAllProducts = async (_req: Request, res: Response) => {
  const products = await Product.find();
  res.json(products);
};

export const createProduct = async (req: Request, res: Response) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
};