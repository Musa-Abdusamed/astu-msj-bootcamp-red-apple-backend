const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validate');
const { createUserSchema } = require('../validators/userValidator');
const userController = require('../controllers/userController');

const { protect } = require('../middleware/auth.middleware');
const { restrictTo } = require('../middleware/auth.middleware');

router.use(protect);
router.use(restrictTo('admin'));

router.route('/')
    .post(validateRequest(createUserSchema), userController.createUser)
    .get(userController.getAllUsers);

router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;