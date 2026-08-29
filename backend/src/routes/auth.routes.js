const express = require("express");
const { body } = require("express-validator");

const {
  register,
  login,
  logout,
  getMe,
  changePassword,
  updateProfilePicture,
  forgotPassword,
  resetPassword,
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
// FORGOT PASSWORD VALIDATION
// ======================================================

const forgotPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),
];

// ======================================================
// RESET PASSWORD VALIDATION
// ======================================================

const resetPasswordValidation = [
  body("email")
    .isEmail()
    .withMessage("A valid email is required")
    .normalizeEmail(),

  body("otp")
    .trim()
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be 6 digits")
    .isNumeric()
    .withMessage("OTP must contain only numbers"),

  body("newPassword")
    .isLength({ min: 8 })
    .withMessage("New password must be at least 8 characters long"),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required")
    .custom((value, { req }) => {
      return value === req.body.newPassword;
    })
    .withMessage("Passwords do not match"),
];

// ======================================================
// REGISTER
// ======================================================

router.post(
  "/register",
  registerValidation,
  validate,
  register
);

// ======================================================
// LOGIN
// ======================================================

router.post(
  "/login",
  loginValidation,
  validate,
  login
);

// ======================================================
// LOGOUT
// ======================================================

router.post(
  "/logout",
  protect,
  logout
);

// ======================================================
// GET CURRENT USER
// ======================================================

router.get(
  "/me",
  protect,
  getMe
);

// ======================================================
// CHANGE PASSWORD
// ======================================================

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

// ======================================================
// FORGOT PASSWORD
// ======================================================

// User enters email.
// Server sends OTP to that email.
router.post(
  "/forgot-password",
  forgotPasswordValidation,
  validate,
  forgotPassword
);

// ======================================================
// RESET PASSWORD
// ======================================================

// User provides:
// email + OTP + new password + confirmation
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  resetPassword
);

module.exports = router;