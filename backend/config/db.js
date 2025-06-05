import mongoose from "mongoose";
import dotEnv from "dotenv";

dotEnv.config()

const uri = process.env.ATLAS_URI;


const connectDB = async() => {
  try {
    await mongoose.connect(uri);
    console.log('✅ Mongoose connected');
  } catch (err) {
    console.error('❌ Mongoose connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

