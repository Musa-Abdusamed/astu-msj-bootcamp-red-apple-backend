const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

const authRoutes = require("./routes/auth.routes");
const userRoutes = require("./routes/userRoutes");
const batchRoutes = require("./routes/batchRoutes");
const progressRoutes = require("./routes/progressRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const messageRoutes = require("./routes/messageRoutes");
const attendanceRoute = require("./routes/attendanceRoutes");
const resourceRoutes = require("./routes/resourceRoutes");
const scheduleRoutes = require("./routes/scheduleRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const announcementRoutes = require("./routes/announcementRoutes");

dotenv.config();

const app = express();

connectDB();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/batches", batchRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/submissions", submissionRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/attendances", attendanceRoute);
app.use("/api/resources", resourceRoutes);
app.use("/api/schedules", scheduleRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/announcements", announcementRoutes);


app.get("/", (req, res) => {
  res.json({
    message: "ASTU MSJ Bootcamp Backend is running",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});