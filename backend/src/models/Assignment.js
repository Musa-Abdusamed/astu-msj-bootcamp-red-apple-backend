const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Assignment title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    description: {
      type: String,
      required: [true, "Assignment description is required"],
      trim: true,
      maxlength: [2000, "Description cannot exceed 2000 characters"],
    },

    instructions: {
      type: String,
      required: [true, "Assignment instructions are required"],
      trim: true,
      maxlength: [5000, "Instructions cannot exceed 5000 characters"],
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      required: [true, "Batch is required"],
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },

    deadline: {
      type: Date,
      required: [true, "Deadline is required"],
    },

    maxScore: {
      type: Number,
      required: [true, "Maximum score is required"],
      min: [1, "Maximum score must be at least 1"],
      max: [1000, "Maximum score cannot exceed 1000"],
    },
  },
  {
    timestamps: true,
  }
);

assignmentSchema.index({ batchId: 1, deadline: 1 });
assignmentSchema.index({ createdBy: 1 });
assignmentSchema.index({ deadline: 1 });

module.exports = mongoose.model("Assignment", assignmentSchema);