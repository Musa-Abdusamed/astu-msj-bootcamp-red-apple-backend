const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validate');
const { createBatchSchema } = require('../validators/batchValidator');
const batchController = require('../controllers/batchController');

router.route('/')
    .post(validateRequest(createBatchSchema), batchController.createBatch)
    .get(batchController.getAllBatches);

router.route('/:id')
    .get(batchController.getBatchById);

router.post('/:id/students', batchController.enrollStudent);
router.post('/:id/mentors', batchController.assignMentor);

module.exports = router;