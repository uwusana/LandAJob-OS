import mongoose from 'mongoose';
import { app } from './app.js';
import { env } from './config/env.js';

try {
  await mongoose.connect(env.mongoUri);
  console.log('MongoDB connected');
  app.listen(env.port, () => {
    console.log(`API running on port ${env.port}`);
  });
} catch (error) {
  console.error('Unable to connect to MongoDB.', error);
  process.exit(1);
}
