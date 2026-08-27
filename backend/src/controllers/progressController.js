const Progress = require("../models/Progress");
const User = require("../models/User");
const Batch = require("../models/Batch");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

// CREATE PROGRESS
// Admin / Mentor

const createProgress = asyncHandler(async (req, res, next) => {
  const { studentId, title, description, score, status, feedback } = req.body;

  if (!studentId || !title) {
    return next(new AppError("Student and title are required.", 400));
  }

  const student = await checkStudentAccess(req, studentId);

  if (!student.batchId) {
    return next(new AppError("This student is not assigned to a batch.", 400));
  }

  const progress = await Progress.create({
    studentId,
    batchId: student.batchId,
    title,
    description,
    score,
    status,
    feedback,
    recordedBy: req.user._id,
  });

  res.status(201).json({
    status: "success",
    data: {
      progress,
    },
  });
});

// UPDATE PROGRESS
// Admin / Mentor

const updateProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findById(req.params.id);

  if (!progress) {
    return next(new AppError("Progress record not found.", 404));
  }

  await checkStudentAccess(req, progress.studentId);

  const { title, description, score, status, feedback } = req.body;

  if (title !== undefined) {
    progress.title = title;
  }

  if (description !== undefined) {
    progress.description = description;
  }

  if (score !== undefined) {
    progress.score = score;
  }

  if (status !== undefined) {
    progress.status = status;
  }

  if (feedback !== undefined) {
    progress.feedback = feedback;
  }

  progress.recordedBy = req.user._id;

  await progress.save();

  res.status(200).json({
    status: "success",
    data: {
      progress,
    },
  });
});

// GET ONE PROGRESS

const getProgressById = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findById(req.params.id)
    .populate("studentId", "fullName email role batchId")
    .populate("batchId", "name startDate endDate")
    .populate("recordedBy", "fullName email role");

  if (!progress) {
    return next(new AppError("Progress record not found.", 404));
  }

  await checkStudentAccess(req, progress.studentId._id);

  res.status(200).json({
    status: "success",
    data: {
      progress,
    },
  });
});

// GET ALL PROGRESS FOR A STUDENT

const getStudentProgress = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;

  await checkStudentAccess(req, studentId);

  const progress = await Progress.find({
    studentId,
  })
    .populate("studentId", "fullName email role")
    .populate("batchId", "name startDate endDate")
    .populate("recordedBy", "fullName email role")
    .sort({ createdAt: -1 });

  res.status(200).json({
    status: "success",
    results: progress.length,
    data: {
      progress,
    },
  });
});

// DELETE PROGRESS
// Admin / Mentor

const deleteProgress = asyncHandler(async (req, res, next) => {
  const progress = await Progress.findById(req.params.id);

  if (!progress) {
    return next(new AppError("Progress record not found.", 404));
  }

  await checkStudentAccess(req, progress.studentId);

  await Progress.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});

// STUDENT ACCESS CHECK

const checkStudentAccess = async (req, studentId) => {
  const student = await User.findById(studentId);

  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  if (student.role !== "student") {
    throw new AppError("The selected user is not a student.", 400);
  }

  // ADMIN

  if (req.user.role === "admin") {
    return student;
  }

  // STUDENT

  if (req.user.role === "student") {
    if (req.user._id.toString() !== student._id.toString()) {
      throw new AppError("You can only access your own progress.", 403);
    }

    return student;
  }

  // MENTOR

  if (req.user.role === "mentor") {
    if (!student.batchId) {
      throw new AppError("This student is not assigned to a batch.", 403);
    }

    const batch = await Batch.findById(student.batchId);

    if (!batch) {
      throw new AppError("Student's batch not found.", 404);
    }

    const isMentorAssigned = batch.mentors.some(
      (mentorId) => mentorId.toString() === req.user._id.toString(),
    );

    if (!isMentorAssigned) {
      throw new AppError("You are not assigned to this student's batch.", 403);
    }

    return student;
  }

  throw new AppError("You do not have permission to access this student.", 403);
};

module.exports = {
  createProgress,
  updateProgress,
  getProgressById,
  getStudentProgress,
  deleteProgress,
};
