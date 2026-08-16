const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

// 1. Import your route files
const userRoutes = require("./routes/userRoutes");
const batchRoutes = require("./routes/batchRoutes");

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// 2. Mount your routes to the API paths
app.use("/api/users", userRoutes);
app.use("/api/batches", batchRoutes);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "ASTU MSJ Bootcamp Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});