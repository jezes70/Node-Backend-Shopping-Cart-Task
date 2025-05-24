import express from 'express';
import { getCart, updateCart } from '../controllers/cart.controller';
const cartRoutes = express.Router();

cartRoutes.get('/:userId', getCart);
cartRoutes.post('/:userId', updateCart);

export default cartRoutes;