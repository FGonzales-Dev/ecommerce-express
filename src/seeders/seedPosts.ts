import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { faker } from '@faker-js/faker';
import User from '../models/User';
import Post from '../models/Post';

dotenv.config();

(async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/express_ts_auth';
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB');

    // Find an existing user or create a dummy user for seeding
    let user = await User.findOne({ email: 'seeder@example.com' });
    if (!user) {
      const hashedPassword = await bcrypt.hash('password', 10);
      user = await User.create({
        username: 'SeederUser',
        email: 'seeder@example.com',
        password: hashedPassword,
        friends: [],
      });
      console.log('Created dummy seeder user');
    }

    // Optionally, remove existing posts to avoid duplicates
    // await Post.deleteMany({});

    // Create 50 posts
    const posts = [];
    for (let i = 0; i < 50; i++) {
      posts.push({
        title: faker.lorem.sentence(),
        content: faker.lorem.paragraphs(2),
        author: user._id,
      });
    }

    await Post.insertMany(posts);
    console.log('Seeded 50 posts successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding posts:', error);
    process.exit(1);
  }
})();
