import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { faker } from '@faker-js/faker';
import Category from '../models/Category';
import Product from '../models/Product';

dotenv.config();

(async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/express_ts_auth';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Optionally, clear existing categories and products to avoid duplicates
    await Category.deleteMany({});
    await Product.deleteMany({});

    // Define the categories to seed
    const categoriesData = [
      { name: 'Over-Ear (Circumaural)', description: 'Comfortable headphones that cover the entire ear.' },
      { name: 'On-Ear (Supra-Aural)', description: 'Compact headphones that rest on the ear.' },
      { name: 'In-Ear (In-Ear Monitors or IEMs)', description: 'Earphones designed for detailed monitoring of audio.' },
      { name: 'Earbuds', description: 'Small, portable in-ear headphones.' },
    ];

    // Insert the categories and capture the inserted documents
    const insertedCategories = await Category.insertMany(categoriesData);
    console.log('Categories seeded');

    // For each category, create 10 products with dummy data
    const productsData = insertedCategories.flatMap(category => {
      return Array.from({ length: 10 }, () => ({
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat((Math.random() * (200 - 50) + 50).toFixed(2)), // Price between 50 and 200
        category: category._id,
      }));
    });

    await Product.insertMany(productsData);
    console.log('Products seeded');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding categories and products:', error);
    process.exit(1);
  }
})();
