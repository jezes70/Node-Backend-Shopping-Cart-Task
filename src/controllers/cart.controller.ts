import Cart from '../models/cart.model';
import Product from '../models/product.model';
import { Request, Response } from 'express';

export const getCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const cart = await Cart.findOne({ userId }).populate('items.productId');
  res.json(cart);
};

export const updateCart = async (req: Request, res: Response) => {
  const { userId } = req.params;
  const { productId, quantity } = req.body;

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const index = cart.items.findIndex(item => item.productId.toString() === productId);
  if (index > -1) {
    if (quantity === 0) {
      cart.items.splice(index, 1);
    } else {
      cart.items[index].quantity = quantity;
    }
  } else {
    cart.items.push({ productId, quantity });
  }

  await cart.save();
  res.json(cart);
};