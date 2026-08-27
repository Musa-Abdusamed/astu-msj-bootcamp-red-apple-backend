const express = require("express");

const {
  markAttendance,
  updateAttendance,
  getStudentAttendance,
  getBatchAttendance,
  getAttendancePercentage,
} = require("../controllers/attendanceController");

const { protect, restrictTo } = require("../middleware/auth.middleware");

const router = express.Router();

// Mark attendance
router.post("/", protect, restrictTo("admin", "mentor"), markAttendance);

// Update attendance
router.put("/:id", protect, restrictTo("admin", "mentor"), updateAttendance);

<<<<<<< HEAD
// Get batch attendance (with optional ?date=YYYY-MM-DD query)
=======
// Get batch attendance
>>>>>>> f23b272061739ad39957c55b321398292205d88d
router.get(
  "/batch/:batchId",
  protect,
  restrictTo("admin", "mentor"),
  getBatchAttendance
);

// Get student's attendance
router.get(
  "/student/:studentId",
  protect,
  restrictTo("admin", "mentor", "student"),
  getStudentAttendance
);

// Get attendance percentage
router.get(
  "/student/:studentId/percentage",
  protect,
  restrictTo("admin", "mentor", "student"),
  getAttendancePercentage
);

module.exports = router;
