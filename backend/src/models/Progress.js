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

    title: {
      type: String,
      required: [true, "Progress title is required"],
      trim: true,
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      trim: true,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },

    score: {
      type: Number,
      min: [0, "Score cannot be less than 0"],
      max: [100, "Score cannot exceed 100"],
    },

    status: {
      type: String,
      enum: {
        values: ["not-started", "in-progress", "completed"],
        message: "Invalid progress status",
      },
      default: "not-started",
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: [1000, "Feedback cannot exceed 1000 characters"],
    },

    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Recorded by is required"],
    },
  },
  {
    timestamps: true,
  }
);

progressSchema.index({ studentId: 1, batchId: 1 });
progressSchema.index({ batchId: 1, createdAt: -1 });

module.exports = mongoose.model("Progress", progressSchema);