const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const { createSendToken } = require('../services/auth.service');

const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, role, userId } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(new AppError('An account with that email already exists.', 400));
  }

  const newUser = await User.create({
    userId: userId || `msj-usr-${Date.now()}`,
    fullName,
    email,
    password,
    role: role || 'student',
    mustChangeCredentials: true 
  });

  createSendToken(newUser, 201, res);
});

// ======================================================
// LOGIN
// ======================================================

const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password.', 400));
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError('Incorrect email or password.', 401));
  }

  if (!user.isActive) {
    return next(new AppError('This account has been deactivated. Contact an admin.', 403));
  }

  createSendToken(user, 200, res);
});

// ======================================================
// LOGOUT
// ======================================================

const logout = asyncHandler(async (req, res) => {
  res.cookie("token", "loggedout", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully.' });
});

// ======================================================
// GET CURRENT USER
// ======================================================

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: { user: req.user },
  });
});

// ======================================================
// CHANGE PASSWORD
// ======================================================

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    return next(new AppError('Your current password is incorrect.', 401));
  }

  user.password = newPassword;
  user.mustChangeCredentials = false;
  user.passwordChangedAt = Date.now();

  await user.save();

  createSendToken(user, 200, res);
});

const updateProfilePicture = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(new AppError("Please upload a profile picture.", 400));
  }

  const user = await User.findById(req.user.id);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  user.avatar = req.file.path;

  await user.save();

  res.status(200).json({
    status: "success",
    message: "Profile picture updated successfully.",
    data: {
      user,
    },
  });
});

module.exports = { register, login, logout, getMe, changePassword, updateProfilePicture };