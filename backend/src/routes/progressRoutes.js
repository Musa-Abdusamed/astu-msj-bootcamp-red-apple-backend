const express = require("express");

const router = express.Router();

const {
  createProgress,
  updateProgress,
  getProgressById,
  getStudentProgress,
  deleteProgress,
} = require("../controllers/progressController");

const {
  protect,
  restrictTo,
} = require("../middleware/auth.middleware");


// All progress routes require authentication
router.use(protect);

// ADMIN + MENTOR
// Create progress


router.post(
  "/",
  restrictTo("admin", "mentor"),
  createProgress
);

// STUDENT / ADMIN / MENTOR
// Get student's progress

router.get(
  "/student/:studentId",
  getStudentProgress
);

// Get a specific progress record

router.get(
  "/:id",
  getProgressById
);

// ADMIN + MENTOR
// Update progress

router.patch(
  "/:id",
  restrictTo("admin", "mentor"),
  updateProgress
);

// ADMIN + MENTOR
// Delete progress

router.delete(
  "/:id",
  restrictTo("admin", "mentor"),
  deleteProgress
);


module.exports = router;