const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
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

    date: {
      type: Date,
      required: [true, "Attendance date is required"],
    },

    status: {
      type: String,
      required: [true, "Attendance status is required"],
      enum: {
        values: ["present", "absent", "late", "excused"],
        message: "Invalid attendance status",
      },
    },

    markedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Marked by is required"],
    },

    note: {
      type: String,
      trim: true,
      maxlength: [500, "Note cannot exceed 500 characters"],
    },
  },
  {
    timestamps: true,
  }
);

attendanceSchema.index(
  { studentId: 1, date: 1 },
  { unique: true }
);

attendanceSchema.index({ batchId: 1, date: -1 });
attendanceSchema.index({ studentId: 1, date: -1 });

module.exports = mongoose.model("Attendance", attendanceSchema);