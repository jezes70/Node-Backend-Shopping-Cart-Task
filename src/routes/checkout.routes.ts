import express from 'express';
import { checkout } from '../controllers/checkout.controller';
const checkoutRoutes = express.Router();

checkoutRoutes.post('/', checkout);

export default checkoutRoutes;