const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: [true, "User ID is required"],
      unique: true,
      immutable: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minlength: [2, "Full name must be at least 2 characters"],
      maxlength: [100, "Full name cannot exceed 100 characters"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [150, "Email cannot exceed 150 characters"],
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [8, "Password must be at least 8 characters"],
      select: false,
    },

    role: {
      type: String,
      required: true,
      enum: {
        values: ["admin", "mentor", "student"],
        message: "Role must be admin, mentor, or student",
      },
      default: "student",
    },

    phone: {
      type: String,
      trim: true,
      maxlength: [20, "Phone number cannot exceed 20 characters"],
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    avatar: {
      type: String,
      default: "default-avatar.png",
    },

    mustChangeCredentials: {
      type: Boolean,
      default: true,
    },

    passwordChangedAt: Date,

    // ==========================================
    // PASSWORD RESET
    // ==========================================

    passwordResetOTP: {
      type: String,
      select: false,
    },

    passwordResetOTPExpires: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
  }
);

// ==========================================
// HASH PASSWORD
// ==========================================

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

// ==========================================
// COMPARE PASSWORD
// ==========================================

userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ==========================================
// CHECK PASSWORD CHANGE AFTER JWT
// ==========================================

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (!this.passwordChangedAt) {
    return false;
  }

  const changedTimestamp = parseInt(
    this.passwordChangedAt.getTime() / 1000,
    10
  );

  return JWTTimestamp < changedTimestamp;
};

module.exports = mongoose.model("User", userSchema);