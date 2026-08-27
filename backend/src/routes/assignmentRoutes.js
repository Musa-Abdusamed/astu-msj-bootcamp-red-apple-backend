const express = require("express");
const router = express.Router();
const assignmentController = require("../controllers/assignmentController");
const { protect, restrictTo } = require("../middleware/auth.middleware");

router
  .route("/")
  .post(protect, restrictTo("admin", "mentor"), assignmentController.createAssignment)
  .get(protect, assignmentController.getAllAssignments);

router
  .route("/batch/:batchId")
  .get(protect, assignmentController.getBatchAssignments);

module.exports = router;