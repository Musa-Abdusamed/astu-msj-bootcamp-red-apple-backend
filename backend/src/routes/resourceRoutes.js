const express = require('express');
const router = express.Router();
const { 
    createResource, 
    getResources, 
    deleteResource 
} = require('../controllers/resourceController');
const { protect, restrictTo } = require('../middleware/auth.middleware');

router.use(protect);
router.route('/')
    .get(getResources)
    .post(restrictTo('mentor', 'admin'), createResource);

router.route('/:id')
    .delete(restrictTo('mentor', 'admin'), deleteResource);

module.exports = router;