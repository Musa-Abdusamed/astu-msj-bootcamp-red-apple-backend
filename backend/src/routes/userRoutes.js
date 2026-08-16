const express = require('express');
const router = express.Router();
const validateRequest = require('../middleware/validate');
const { createUserSchema } = require('../validators/userValidator');
const userController = require('../controllers/userController');

// All routes here should technically be protected by your teammate's auth middleware, e.g.:
// router.use(protect, authorize('Admin'));

router.route('/')
    .post(validateRequest(createUserSchema), userController.createUser)
    .get(userController.getAllUsers);

router.route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;