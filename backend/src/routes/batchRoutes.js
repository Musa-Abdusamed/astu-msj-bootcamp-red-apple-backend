const express = require("express");
const router = express.Router();
const validateRequest = require("../middleware/validate");
const { createBatchSchema } = require("../validators/batchValidator");
const batchController = require("../controllers/batchController");

const { protect } = require("../middleware/auth.middleware");
const { restrictTo } = require("../middleware/auth.middleware");

// Base protection
router.use(protect);

router
  .route("/")
  .post(restrictTo("admin"), validateRequest(createBatchSchema), batchController.createBatch)
  .get(restrictTo("admin", "mentor"), batchController.getAllBatches);

router.route("/:id").get(restrictTo("admin", "mentor"), batchController.getBatchById);

router.post("/:id/students", restrictTo("admin"), batchController.enrollStudent);
router.post("/:id/mentors", restrictTo("admin"), batchController.assignMentor);

module.exports = router;
