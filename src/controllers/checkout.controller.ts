
import mongoose from 'mongoose';
import Cart from '../models/cart.model';
import Product from '../models/product.model';
import Order from '../models/order.model';
import { Request, Response } from 'express';

export const checkout = async (req: Request, res: Response) => {
  const { userId } = req.body;
  const redisClient = req.app.locals.redis;

  const lockKey = `lock:user:${userId}`;
  const lock = await redisClient.set(lockKey, 'locked', { NX: true, PX: 5000 });

  if (!lock) {
    
    return res.status(423).json({ message: 'Checkout is locked. Please try again later.' });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart || cart.items.length === 0) {
        return    res.status(404).json({ message: 'Cart is empty' });

    }

    let total = 0;
    const itemsWithPrice = [];

    for (const item of cart.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product || product.stock < item.quantity) {
            return    res.status(404).json({ message: 'Product out of stock' });

      }

      product.stock -= item.quantity;
      await product.save();

      total += item.quantity * product.price;
      itemsWithPrice.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price
      });
    }

    const order = new Order({ userId, items: itemsWithPrice, total });
    await order.save({ session });

    await Cart.deleteOne({ userId }).session(session);

    await session.commitTransaction();
       return    res.status(200).json({ message: 'Checkout complete', order });
  } catch (err:unknown) {
    await session.abortTransaction();
       return    res.status(400).json({message: err });
  } finally {
    session.endSession();
    await redisClient.del(lockKey);
  }
};