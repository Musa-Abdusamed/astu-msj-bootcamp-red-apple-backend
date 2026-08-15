const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema(
  {
    assignmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Assignment",
      required: [true, "Assignment is required"],
    },

    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Student is required"],
    },

    githubUrl: {
      type: String,
      required: [true, "GitHub repository URL is required"],
      trim: true,
      match: [
        /^https?:\/\/(www\.)?github\.com\/.+/i,
        "Please provide a valid GitHub repository URL",
      ],
    },

    liveDemoUrl: {
      type: String,
      trim: true,
      match: [
        /^https?:\/\/.+/i,
        "Please provide a valid URL",
      ],
    },

    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
    },

    score: {
      type: Number,
      min: [0, "Score cannot be negative"],
    },

    feedback: {
      type: String,
      trim: true,
      maxlength: [3000, "Feedback cannot exceed 3000 characters"],
    },

    status: {
      type: String,
      enum: {
        values: [
          "submitted",
          "graded",
          "resubmission_requested",
        ],
        message: "Invalid submission status",
      },
      default: "submitted",
    },

    gradedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    submittedAt: {
      type: Date,
      default: Date.now,
    },

    gradedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

submissionSchema.index(
  { assignmentId: 1, studentId: 1 },
  { unique: true }
);

submissionSchema.index({ studentId: 1 });
submissionSchema.index({ assignmentId: 1 });
submissionSchema.index({ status: 1 });

module.exports = mongoose.model("Submission", submissionSchema);