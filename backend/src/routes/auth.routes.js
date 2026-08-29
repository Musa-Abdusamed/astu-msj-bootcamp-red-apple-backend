const express = require("express");
const { body } = require("express-validator");

const {
  register,
  login,
  logout,
  getMe,
  changePassword,
  updateProfilePicture,
} = require("../controllers/auth.controller");

const { protect } = require("../middleware/auth.middleware");
const validate = require("../middleware/validate.middleware");
const upload = require("../middleware/upload.middleware");

const router = express.Router();

// ======================================================
// REGISTER VALIDATION
// ======================================================

const registerValidation = [
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage("Full name is required"),

  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
];

// ======================================================
// LOGIN VALIDATION
// ======================================================

const loginValidation = [
  body().custom((value) => {
    const id = value.userId || value.uniqueId || value.identifier || value.email;
    if (!id || typeof id !== 'string' || !id.trim()) {
      throw new Error("Unique ID is required");
    }
    return true;
  }),

  body("password")
    .notEmpty()
    .withMessage("Password is required"),
];

// ======================================================
// CHANGE PASSWORD VALIDATION
// ======================================================

const changePasswordValidation = [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),
];

// ======================================================
// AUTH ROUTES
// ======================================================

// Register
router.post(
  "/register",
  registerValidation,
  validate,
  register
);

// Login
router.post(
  "/login",
  loginValidation,
  validate,
  login
);

// Logout
router.post(
  "/logout",
  protect,
  logout
);

// Get current user
router.get(
  "/me",
  protect,
  getMe
);

// Change password
router.patch(
  "/change-password",
  protect,
  changePasswordValidation,
  validate,
  changePassword
);

// ======================================================
// PROFILE PICTURE
// ======================================================

router.patch(
  "/profile-picture",
  protect,
  upload.single("profilePicture"),
  updateProfilePicture
);

module.exports = router;