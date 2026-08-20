const express = require("express");

const router = express.Router();

const {
  createProgress,
  updateProgress,
  getProgressById,
  getStudentProgress,
  deleteProgress,
} = require("../controllers/progressController");

const { protect, restrictTo } = require("../middleware/auth.middleware");

router.use(protect);


router.post("/", restrictTo("admin", "mentor"), createProgress);

router.get("/student/:studentId", getStudentProgress);

router.get("/:id", getProgressById);


router.patch("/:id", restrictTo("admin", "mentor"), updateProgress);


router.delete("/:id", restrictTo("admin", "mentor"), deleteProgress);

module.exports = router;
