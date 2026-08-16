const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/userRoutes");
const batchRoutes = require("./routes/batchRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);       
app.use("/api/users", userRoutes);      
app.use("/api/batches", batchRoutes); 

app.get("/", (req, res) => {
  res.json({
    message: "ASTU MSJ Bootcamp Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});