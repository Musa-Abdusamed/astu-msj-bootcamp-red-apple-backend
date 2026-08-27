const express = require("express");
const router = express.Router();
const submissionController = require("../controllers/submissionController");
const { protect, restrictTo } = require("../middleware/auth.middleware");

router
  .route("/")
  .post(protect, restrictTo("student"), submissionController.submitAssignment)
  .get(protect, restrictTo("admin", "mentor"), submissionController.getAllSubmissions);

router
  .route("/my")
  .get(protect, restrictTo("student"), submissionController.getMySubmissions);

router
  .route("/:id/grade")
  .patch(protect, restrictTo("admin", "mentor"), submissionController.gradeSubmission);

router
  .route("/assignment/:assignmentId")
  .get(protect, restrictTo("admin", "mentor"), submissionController.getSubmissionsByAssignment);

module.exports = router;