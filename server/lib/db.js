import mongoose from "mongoose";

// MongoDB connection
export const connectDB = async () => {
  try {

    mongoose.connection.on('connected', () => console.log('Connected to MongoDB'));


    await mongoose.connect(`${process.env.MONGODB_URI}/chat-app`);
  } catch (err) {
    console.error('MongoDB connection error:', err);
  }
};