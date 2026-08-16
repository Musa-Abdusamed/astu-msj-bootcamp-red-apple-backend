const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validate');
const { createBatchSchema } = require('../validators/batchValidator');
const batchController = require('../controllers/batchController');

const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/auth.middleware');

// Lock down ALL batch routes to Admins
router.use(protect);
router.use(restrictTo('admin'));

router.route('/')
    .post(validateRequest(createBatchSchema), batchController.createBatch)
    .get(batchController.getAllBatches);

router.route('/:id')
    .get(batchController.getBatchById);

router.post('/:id/students', batchController.enrollStudent);
router.post('/:id/mentors', batchController.assignMentor);

module.exports = router;