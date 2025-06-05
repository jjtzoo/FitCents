
const mongoose = require('mongoose');
require("dotenv").config({path: "./config.env"})

const uri = process.env.ATLAS_URI;


const connectDB = async() => {
  try {
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverApi: { version: '1', strict: true, deprecationErrors: true}
    });
    console.log('✅ Mongoose connected');
  } catch (err) {
    console.error('❌ Mongoose connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;

