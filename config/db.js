// backend/config/db.js
const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // simple connect — options ki zarurat nahi
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1); // exit process with failure
  }
};

module.exports = connectDB;
