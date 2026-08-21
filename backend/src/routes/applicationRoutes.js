const express = require("express");

const {
  submitApplication,
  getApplications,
  acceptApplication,
  rejectApplication,
  getApplicationStatus,
  createApplicationSetting,
  closeApplications,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/auth.middleware");

const { restrictTo } = require("../middleware/role.middleware");

const validate = require("../middleware/validate.middleware");

const {
  applicationValidation,
} = require("../validators/applicationValidator");

const router = express.Router();

// ======================================================
// PUBLIC - CHECK APPLICATION STATUS
// GET /api/applications/status
// ======================================================

router.get(
  "/status",
  getApplicationStatus
);

// ======================================================
// ADMIN - CREATE / OPEN APPLICATION PERIOD
// POST /api/applications/settings
// ======================================================

router.post(
  "/settings",
  protect,
  restrictTo("admin"),
  createApplicationSetting
);

// ======================================================
// ADMIN - CLOSE APPLICATIONS MANUALLY
// PATCH /api/applications/settings/close
// ======================================================

router.patch(
  "/settings/close",
  protect,
  restrictTo("admin"),
  closeApplications
);

// ======================================================
// PUBLIC APPLICATION SUBMISSION
// POST /api/applications
// ======================================================

router.post(
  "/",
  applicationValidation,
  validate,
  submitApplication
);

// ======================================================
// ADMIN - GET ALL APPLICATIONS
// GET /api/applications
// ======================================================

router.get(
  "/",
  protect,
  restrictTo("admin"),
  getApplications
);

// ======================================================
// ADMIN - ACCEPT APPLICATION
// PATCH /api/applications/:id/accept
// ======================================================

router.patch(
  "/:id/accept",
  protect,
  restrictTo("admin"),
  acceptApplication
);

// ======================================================
// ADMIN - REJECT APPLICATION
// PATCH /api/applications/:id/reject
// ======================================================

router.patch(
  "/:id/reject",
  protect,
  restrictTo("admin"),
  rejectApplication
);

module.exports = router;