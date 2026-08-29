const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Batch = require("../models/Batch");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");

const checkStudentAccess = async (req, studentId) => {
  const student = await User.findById(studentId);

  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  if (student.role !== "student") {
    throw new AppError("The selected user is not a student.", 400);
  }

  if (req.user.role === "admin") {
    return student;
  }

  if (req.user.role === "student") {
    if (req.user._id.toString() !== student._id.toString()) {
      throw new AppError("You can only access your own attendance.", 403);
    }

    return student;
  }

  if (req.user.role === "mentor") {
    if (!student.batchId) {
      throw new AppError("This student is not assigned to a batch.", 403);
    }

    const batch = await Batch.findById(student.batchId);

    if (!batch) {
      throw new AppError("Student's batch not found.", 404);
    }

    const isMentorAssigned = batch.mentors.some(
      (mentorId) => mentorId.toString() === req.user._id.toString()
    );

    if (!isMentorAssigned) {
      throw new AppError(
        "You are not assigned to this student's batch.",
        403
      );
    }

    return student;
  }

  throw new AppError(
    "You do not have permission to access this student.",
    403
  );
};

// ======================================================
// MARK ATTENDANCE
// ======================================================

const markAttendance = asyncHandler(async (req, res, next) => {
  const { studentId, date, status, note } = req.body;

  if (!studentId || !date || !status) {
    return next(
      new AppError("Student, date, and status are required.", 400)
    );
  }

  const student = await checkStudentAccess(req, studentId);

  if (!student.batchId) {
    return next(
      new AppError("This student is not assigned to a batch.", 400)
    );
  }

  const batchId = student.batchId;

  let attendance = await Attendance.findOne({
    studentId,
    date,
  });

  if (attendance) {
    attendance.status = status;

    if (note !== undefined) {
      attendance.note = note;
    }

    attendance.markedBy = req.user._id;

    await attendance.save();

    return res.status(200).json({
      status: "success",
      message: "Attendance record updated successfully.",
      data: { attendance },
    });
  }

  attendance = await Attendance.create({
    studentId,
    batchId,
    date,
    status,
    markedBy: req.user._id,
    note,
  });

  res.status(201).json({
    status: "success",
    message: "Attendance marked successfully.",
    data: { attendance },
  });
});

// ======================================================
// UPDATE ATTENDANCE
// ======================================================

const updateAttendance = asyncHandler(async (req, res, next) => {
  const { status, date, note } = req.body;

  const attendance = await Attendance.findById(req.params.id);

  if (!attendance) {
    return next(
      new AppError("Attendance record not found.", 404)
    );
  }

  await checkStudentAccess(req, attendance.studentId);

  if (status !== undefined) {
    attendance.status = status;
  }

  if (date !== undefined) {
    attendance.date = date;
  }

  if (note !== undefined) {
    attendance.note = note;
  }

  attendance.markedBy = req.user._id;

  await attendance.save();

  res.status(200).json({
    status: "success",
    message: "Attendance updated successfully.",
    data: { attendance },
  });
});

// ======================================================
// GET STUDENT ATTENDANCE
// ======================================================

const getStudentAttendance = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;

  await checkStudentAccess(req, studentId);

  const attendance = await Attendance.find({ studentId })
    .populate("studentId", "fullName email role batchId")
    .populate("batchId", "name startDate endDate")
    .populate("markedBy", "fullName email role")
    .sort({ date: -1 });

  res.status(200).json({
    status: "success",
    results: attendance.length,
    data: { attendance },
  });
});

// ======================================================
// GET BATCH ATTENDANCE
// ======================================================

const getBatchAttendance = asyncHandler(async (req, res, next) => {
  const { batchId } = req.params;
  const { date } = req.query;

  const query = { batchId };

  if (date) {
    query.date = date;
  }

  const attendance = await Attendance.find(query)
    .populate("studentId", "fullName email userId phone")
    .populate("markedBy", "fullName email")
    .sort({ date: -1 });

  res.status(200).json({
    status: "success",
    results: attendance.length,
    data: { attendance },
  });
});

const getAttendancePercentage = asyncHandler(async (req, res, next) => {
  const { studentId } = req.params;

  await checkStudentAccess(req, studentId);

  const attendance = await Attendance.find({ studentId });
  const totalSessions = attendance.length;

  if (totalSessions === 0) {
    return res.status(200).json({
      status: "success",
      data: {
        percentage: 0,
        presentSessions: 0,
        totalSessions: 0,
      },
    });
  }

  const presentSessions = attendance.filter((r) => r.status === "present").length;
  const percentage = (presentSessions / totalSessions) * 100;

  res.status(200).json({
    status: "success",
    data: {
      percentage: Number(percentage.toFixed(2)),
      presentSessions,
      totalSessions,
    },
  });
});
// ======================================================
// GET ATTENDANCE PERCENTAGE
// ======================================================

const getAttendancePercentage = asyncHandler(
  async (req, res, next) => {
    const { studentId } = req.params;

    await checkStudentAccess(req, studentId);

    const attendance = await Attendance.find({ studentId });

    const totalSessions = attendance.length;

    if (totalSessions === 0) {
      return res.status(200).json({
        status: "success",
        data: {
          percentage: 0,
          presentSessions: 0,
          totalSessions: 0,
        },
      });
    }

    const presentSessions = attendance.filter(
      (record) => record.status === "present"
    ).length;

    const percentage =
      (presentSessions / totalSessions) * 100;

    res.status(200).json({
      status: "success",
      data: {
        percentage: Number(percentage.toFixed(2)),
        presentSessions,
        totalSessions,
      },
    });
  }
);

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  markAttendance,
  updateAttendance,
  getStudentAttendance,
  getBatchAttendance,
  getAttendancePercentage,
};