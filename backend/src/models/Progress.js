const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "Batch is required"],
    },

    topic: {
      type: String,
      required: [true, "Topic is required"],
      trim: true,
      minlength: [2, "Topic must be at least 2 characters"],
      maxlength: [100, "Topic cannot exceed 100 characters"],
    },

    status: {
      type: String,
      required: [true, "Progress status is required"],
      enum: {
        values: [
          "not_started",
          "in_progress",
          "completed",
          "needs_improvement",
        ],
        message: "Invalid progress status",
      },
      default: "not_started",
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [1000, "Progress notes cannot exceed 1000 characters"],
    },

    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Updated by is required"],
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index(
  { studentId: 1, topic: 1 },
  { unique: true }
);

module.exports = mongoose.model("Progress", progressSchema);