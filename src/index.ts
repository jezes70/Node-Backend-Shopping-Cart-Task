import express from 'express';
import mongoose from 'mongoose';
import { createClient } from 'redis';
import productRoutes from './routes/product.routes';
import dotenv from 'dotenv';
import checkoutRoutes from './routes/checkout.routes';
import cartRoutes from './routes/cart.routes';
import authRouter from './routes/auth.routes';

dotenv.config();

const app = express();
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cart';
const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const redisClient = createClient({ url: REDIS_URL });
    await redisClient.connect();
    console.log('Connected to Redis');

    app.locals.redis = redisClient;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Startup Error:', error);
    process.exit(1);
  }
})();