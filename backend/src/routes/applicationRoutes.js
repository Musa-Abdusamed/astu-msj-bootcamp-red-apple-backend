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


// PUBLIC - CHECK APPLICATION STATUS


router.get(
  "/status",
  getApplicationStatus
);


// ADMIN - CREATE / OPEN APPLICATION PERIOD

router.post(
  "/settings",
  protect,
  restrictTo("admin"),
  createApplicationSetting
);

// ADMIN - CLOSE APPLICATIONS MANUALLY


router.patch(
  "/settings/close",
  protect,
  restrictTo("admin"),
  closeApplications
);


// PUBLIC APPLICATION SUBMISSION



router.post(
  "/",
  applicationValidation,
  validate,
  submitApplication
);


// ADMIN - GET ALL APPLICATIONS

router.get(
  "/",
  protect,
  restrictTo("admin"),
  getApplications
);

// ADMIN - ACCEPT APPLICATION


router.patch(
  "/:id/accept",
  protect,
  restrictTo("admin"),
  acceptApplication
);


router.patch(
  "/:id/reject",
  protect,
  restrictTo("admin"),
  rejectApplication
);

module.exports = router;