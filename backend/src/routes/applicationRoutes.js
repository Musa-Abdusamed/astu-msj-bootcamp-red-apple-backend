const express = require('express');

const {
  submitApplication,
  getApplications,
  acceptApplication,
  rejectApplication,
} = require('../controllers/applicationController');

const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/role.middleware');
const validate = require('../middleware/validate.middleware');

const {
  applicationValidation,
} = require('../validators/applicationValidator');

const router = express.Router();

router.post(
  '/',
  applicationValidation,
  validate,
  submitApplication
);

router.get(
  '/',
  protect,
  restrictTo('admin'),
  getApplications
);

router.patch(
  '/:id/accept',
  protect,
  restrictTo('admin'),
  acceptApplication
);

router.delete(
  '/:id/reject',
  protect,
  restrictTo('admin'),
  rejectApplication
);

module.exports = router;