import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import postRoutes from './routes/post';
import friendRoutes from './routes/friend';
import categoryRoutes from './routes/category';
import productRoutes from './routes/product';
import cartRoutes from './routes/cart';

dotenv.config();

// Extend the global namespace to include our connection cache
declare global {
  // eslint-disable-next-line no-var
  var __MONGO_CONNECTION__: Promise<typeof mongoose> | undefined;
}

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB and cache the connection if not already established
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/express_ts_auth';

if (!global.__MONGO_CONNECTION__) {
  global.__MONGO_CONNECTION__ = mongoose.connect(mongoURI);
}

global.__MONGO_CONNECTION__
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/friends', friendRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);

// Only start the server if not running in a serverless environment
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

export { app };