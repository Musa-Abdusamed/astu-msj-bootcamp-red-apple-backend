const crypto = require("crypto");

const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const { createSendToken } = require("../services/auth.service");
const sendEmail = require("../utils/sendEmail");

// ======================================================
// REGISTER
// ======================================================

const register = asyncHandler(async (req, res, next) => {
  const { fullName, email, password, role, userId } = req.body;

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return next(
      new AppError("An account with that email already exists.", 400)
    );
  }

  const newUser = await User.create({
    userId: userId || `msj-usr-${Date.now()}`,
    fullName,
    email,
    password,
    role: role || "student",
    mustChangeCredentials: true,
  });

  createSendToken(newUser, 201, res);
});

// ======================================================
// LOGIN
// ======================================================

// ======================================================
// LOGIN
// ======================================================

const login = asyncHandler(async (req, res, next) => {
  const { email, userId, password, role } = req.body;
  const identifier = (email || userId || '').trim();

  if (!identifier || !password) {
    return next(new AppError("Please provide your email or Unique ID and password.", 400));
  }

  const escapedIdentifier = identifier.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const user = await User.findOne({
    $or: [
      { userId: { $regex: new RegExp(`^${escapedIdentifier}$`, 'i') } },
      { email: identifier.toLowerCase() },
    ]
  }).select("+password");

  if (!user || !(await user.comparePassword(password))) {
    return next(new AppError("Incorrect credentials.", 401));
  }

  if (role && user.role.toLowerCase() !== role.toLowerCase()) {
    return next(
      new AppError(
        `This account is registered as a ${user.role}. Please select the ${user.role} role to sign in.`,
        403
      )
    );
  }

  if (user.isActive === false) {
    return next(new AppError("This account has been deactivated. Contact an admin.", 403));
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

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
});

// ======================================================
// GET CURRENT USER
// ======================================================

const getMe = asyncHandler(async (req, res) => {
  res.status(200).json({
    status: "success",
    data: {
      user: req.user,
    },
  });
});

// ======================================================
// CHANGE PASSWORD - LOGGED IN USER
// ======================================================

const changePassword = asyncHandler(async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user.id).select("+password");

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  if (!(await user.comparePassword(currentPassword))) {
    return next(
      new AppError("Your current password is incorrect.", 401)
    );
  }

  user.password = newPassword;
  user.mustChangeCredentials = false;
  user.passwordChangedAt = Date.now();

  await user.save({ validateModifiedOnly: true });

  createSendToken(user, 200, res);
});

// ======================================================
// UPDATE PROFILE PICTURE
// ======================================================

const updateProfilePicture = asyncHandler(async (req, res, next) => {
  if (!req.file) {
    return next(
      new AppError("Please upload a profile picture.", 400)
    );
  }

  const user = await User.findById(req.user.id);

  console.log("MULTER REQ.FILE:", req.file);

  if (!user) {
    return next(new AppError("User not found.", 404));
  }

  user.avatar = req.file.path;

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message: "Profile picture updated successfully.",
    data: {
      avatar: user.avatar,
    },
  });
});

// ======================================================
// FORGOT PASSWORD - SEND OTP
// ======================================================

const forgotPassword = asyncHandler(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  // Do not reveal whether an account exists
  if (!user) {
    return res.status(200).json({
      status: "success",
      message:
        "If an account exists with this email, a password reset OTP has been sent.",
    });
  }

  // Generate 6-digit OTP
  const otp = crypto.randomInt(100000, 1000000).toString();

  // Hash OTP before storing it
  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  user.passwordResetOTP = hashedOTP;

  // OTP valid for 10 minutes
  user.passwordResetOTPExpires = Date.now() + 10 * 60 * 1000;

  await user.save({
    validateBeforeSave: false,
  });

  try {
    await sendEmail({
      to: user.email,

      subject: "ASTU MSJ Bootcamp - Password Reset OTP",

      text: `
Dear ${user.fullName},

We received a request to reset your ASTU MSJ Bootcamp account password.

Your password reset OTP is:

${otp}

This OTP will expire in 10 minutes.

If you did not request a password reset, please ignore this email.

ASTU MSJ Bootcamp Team
`,
    });

    res.status(200).json({
      status: "success",
      message:
        "If an account exists with this email, a password reset OTP has been sent.",
    });
  } catch (error) {
    // Remove OTP if email sending fails
    user.passwordResetOTP = undefined;
    user.passwordResetOTPExpires = undefined;

    await user.save({
      validateBeforeSave: false,
    });

    return next(
      new AppError(
        "Unable to send password reset OTP. Please try again later.",
        500
      )
    );
  }
});

// ======================================================
// RESET PASSWORD - OTP + NEW PASSWORD
// ======================================================

const resetPassword = asyncHandler(async (req, res, next) => {
  const {
    email,
    otp,
    newPassword,
    confirmPassword,
  } = req.body;

  if (!email || !otp || !newPassword || !confirmPassword) {
    return next(
      new AppError(
        "Email, OTP, new password, and confirm password are required.",
        400
      )
    );
  }

  if (newPassword !== confirmPassword) {
    return next(
      new AppError(
        "New password and confirm password do not match.",
        400
      )
    );
  }

  if (newPassword.length < 8) {
    return next(
      new AppError(
        "New password must be at least 8 characters long.",
        400
      )
    );
  }

  // Hash submitted OTP
  const hashedOTP = crypto
    .createHash("sha256")
    .update(otp)
    .digest("hex");

  // Find user with valid OTP
  const user = await User.findOne({
    email,
    passwordResetOTP: hashedOTP,
    passwordResetOTPExpires: {
      $gt: Date.now(),
    },
  }).select(
    "+passwordResetOTP +passwordResetOTPExpires"
  );

  if (!user) {
    return next(
      new AppError("Invalid or expired OTP.", 400)
    );
  }

  // Update password
  user.password = newPassword;

  // Remove OTP
  user.passwordResetOTP = undefined;
  user.passwordResetOTPExpires = undefined;

  // Password is now changed
  user.mustChangeCredentials = false;
  user.passwordChangedAt = Date.now();

  await user.save({ validateModifiedOnly: true });

  res.status(200).json({
    status: "success",
    message:
      "Password reset successfully. You can now log in with your new password.",
  });
});

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  register,
  login,
  logout,
  getMe,
  changePassword,
  updateProfilePicture,
  forgotPassword,
  resetPassword,
};