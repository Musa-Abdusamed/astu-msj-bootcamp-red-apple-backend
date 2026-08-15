const mongoose = require("mongoose");

const announcementSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Announcement title is required"],
      trim: true,
      minlength: [2, "Title must be at least 2 characters"],
      maxlength: [200, "Title cannot exceed 200 characters"],
    },

    content: {
      type: String,
      required: [true, "Announcement content is required"],
      trim: true,
      minlength: [2, "Content must be at least 2 characters"],
      maxlength: [5000, "Content cannot exceed 5000 characters"],
    },

    targetAudience: {
      type: String,
      required: [true, "Target audience is required"],
      enum: {
        values: [
          "all",
          "students",
          "mentors",
          "batch",
        ],
        message: "Invalid target audience",
      },
    },

    batchId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Batch",
      default: null,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator is required"],
    },

    publishDate: {
      type: Date,
      required: [true, "Publish date is required"],
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

announcementSchema.index({
  targetAudience: 1,
  publishDate: -1,
});

announcementSchema.index({
  batchId: 1,
  publishDate: -1,
});

announcementSchema.index({
  createdBy: 1,
});

module.exports = mongoose.model(
  "Announcement",
  announcementSchema
);