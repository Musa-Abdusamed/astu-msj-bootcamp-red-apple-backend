const Announcement = require("../models/Announcement");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// CREATE ANNOUNCEMENT
// POST /api/announcements
// Private - Admin / Mentor
const createAnnouncement = asyncHandler(async (req, res, next) => {
  const { title, content, targetAudience, targetYear, batchId, publishDate } =
    req.body;

  // Basic validation
  if (!title || !content || !targetAudience) {
    return next(
      new AppError("Title, content, and target audience are required", 400),
    );
  }

  // If target audience is batch, batchId is required
  if (targetAudience === "batch" && !batchId) {
    return next(
      new AppError("Batch ID is required when target audience is batch", 400),
    );
  }

  const announcement = await Announcement.create({
    title,
    content,
    targetAudience,
    targetYear: targetYear || null,
    batchId: batchId || null,
    createdBy: req.user.id,
    publishDate: publishDate || Date.now(),
  });

  // Populate creator information
  await announcement.populate("createdBy", "fullName email role");

  res.status(201).json({
    success: true,
    message: "Announcement created successfully",
    announcement,
  });
});

// GET ALL ANNOUNCEMENTS
// GET /api/announcements
// Private
const getAnnouncements = asyncHandler(async (req, res, next) => {
  const { targetAudience, targetYear, batchId } = req.query;

  // Build filter dynamically
  const filter = {};

  if (targetAudience) {
    filter.targetAudience = targetAudience;
  }

  if (targetYear) {
    filter.targetYear = targetYear;
  }

  if (batchId) {
    filter.batchId = batchId;
  }

  const announcements = await Announcement.find(filter)
    .populate("createdBy", "fullName email role")
    .populate("batchId", "name")
    .sort({ publishDate: -1 });

  res.status(200).json({
    success: true,
    count: announcements.length,
    announcements,
  });
});

// GET SINGLE ANNOUNCEMENT

const getAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id)
    .populate("createdBy", "fullName email role")
    .populate("batchId", "name");

  if (!announcement) {
    return next(new AppError("Announcement not found", 404));
  }

  res.status(200).json({
    success: true,
    announcement,
  });
});

// UPDATE ANNOUNCEMENT
const updateAnnouncement = asyncHandler(async (req, res, next) => {
  const { title, content, targetAudience, targetYear, batchId, publishDate } =
    req.body;

  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next(new AppError("Announcement not found", 404));
  }

  // If changing target audience to batch,
  // batchId must be provided
  if (targetAudience === "batch" && !batchId && !announcement.batchId) {
    return next(
      new AppError("Batch ID is required when target audience is batch", 400),
    );
  }

  // Update only provided fields
  if (title !== undefined) {
    announcement.title = title;
  }

  if (content !== undefined) {
    announcement.content = content;
  }

  if (targetAudience !== undefined) {
    announcement.targetAudience = targetAudience;
  }

  if (targetYear !== undefined) {
    announcement.targetYear = targetYear || null;
  }

  if (batchId !== undefined) {
    announcement.batchId = batchId || null;
  }

  if (publishDate !== undefined) {
    announcement.publishDate = publishDate;
  }

  await announcement.save();

  await announcement.populate([
    {
      path: "createdBy",
      select: "fullName email role",
    },
    {
      path: "batchId",
      select: "name",
    },
  ]);

  res.status(200).json({
    success: true,
    message: "Announcement updated successfully",
    announcement,
  });
});

// DELETE ANNOUNCEMENT
// DELETE /api/announcements/:id
// Private - Admin / Mentor
const deleteAnnouncement = asyncHandler(async (req, res, next) => {
  const announcement = await Announcement.findById(req.params.id);

  if (!announcement) {
    return next(new AppError("Announcement not found", 404));
  }

  await Announcement.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: "Announcement deleted successfully",
  });
});

module.exports = {
  createAnnouncement,
  getAnnouncements,
  getAnnouncement,
  updateAnnouncement,
  deleteAnnouncement,
};
