const mongoose = require("mongoose");
const dns = require("dns");

// Fix for Windows/Local ISP DNS timing out on MongoDB Atlas SRV records
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
} catch (e) {
  // fallback if custom DNS cannot be set
}

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    if (error.message.includes("ECONNREFUSED")) {
      console.error("💡 TIP: It looks like MongoDB is not running on your machine. Please start your local MongoDB server (e.g., mongod).");
    }
    process.exit(1);
  }
};

module.exports = connectDB;