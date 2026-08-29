const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validate');
const { createUserSchema } = require('../validators/userValidator');
const userController = require('../controllers/userController');

const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/auth.middleware');
const { uploadUserAvatar } = require('../middleware/uploadMiddleware');


router.patch(
    '/avatar', 
    protect, 
    uploadUserAvatar, 
    userController.updateAvatar
);

router.use(protect);

router.route('/')
    .post(restrictTo('admin'), validateRequest(createUserSchema), userController.createUser)
    .get(restrictTo('admin', 'mentor'), userController.getAllUsers);

router.route('/:id')
    .get(restrictTo('admin', 'mentor'), userController.getUserById)
    .put(restrictTo('admin'), userController.updateUser)
    .delete(restrictTo('admin'), userController.deleteUser);

module.exports = router;