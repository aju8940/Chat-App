// db.js
const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("DATABASE CONNECTED");
  } catch (error) {
    console.error("DB CONNECTION FAILED:", error.message);
  }
};

module.exports = connectDB;
