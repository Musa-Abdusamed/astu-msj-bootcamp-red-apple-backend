const express = require('express');
const router = express.Router();
const { 
    createSchedule, 
    getSchedules, 
    updateSchedule, 
    deleteSchedule 
} = require('../controllers/scheduleController');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.use(protect);

router.route('/')
    .get(getSchedules)
    .post(restrictTo('admin'), createSchedule);

router.route('/:id')
    .patch(restrictTo('admin'), updateSchedule)
    .delete(restrictTo('admin'), deleteSchedule);

module.exports = router;