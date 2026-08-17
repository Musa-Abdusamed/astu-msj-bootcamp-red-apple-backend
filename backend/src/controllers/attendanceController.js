const Attendance = require("../models/Attendance");
const User = require("../models/User");
const Batch = require("../models/Batch");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");


// ======================================================
// CHECK STUDENT ACCESS
// ======================================================

const checkStudentAccess = async (req, studentId) => {
  const student = await User.findById(studentId);

  // Student does not exist
  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  // User must actually be a student
  if (student.role !== "student") {
    throw new AppError(
      "The selected user is not a student.",
      400
    );
  }

  // ====================================================
  // ADMIN
  // ====================================================

  if (req.user.role === "admin") {
    return student;
  }

  // ====================================================
  // STUDENT
  // ====================================================

  if (req.user.role === "student") {
    if (
      req.user._id.toString() !== student._id.toString()
    ) {
      throw new AppError(
        "You can only access your own attendance.",
        403
      );
    }

    return student;
  }

  // ====================================================
  // MENTOR
  // ====================================================

  if (req.user.role === "mentor") {
    // Student must have a batch
    if (!student.batchId) {
      throw new AppError(
        "This student is not assigned to a batch.",
        403
      );
    }

    // Find student's batch
    const batch = await Batch.findById(student.batchId);

    if (!batch) {
      throw new AppError(
        "Student's batch not found.",
        404
      );
    }

    // Check whether this mentor belongs to the batch
    const isMentorAssigned = batch.mentors.some(
      (mentorId) =>
        mentorId.toString() === req.user._id.toString()
    );

    if (!isMentorAssigned) {
      throw new AppError(
        "You are not assigned to this student's batch.",
        403
      );
    }

    return student;
  }

  // ====================================================
  // UNKNOWN ROLE
  // ====================================================

  throw new AppError(
    "You do not have permission to access this student.",
    403
  );
};


// ======================================================
// MARK ATTENDANCE
// ======================================================

const markAttendance = asyncHandler(
  async (req, res, next) => {
    const {
      studentId,
      date,
      status,
      note,
    } = req.body;

    // Check required fields
    if (!studentId || !date || !status) {
      return next(
        new AppError(
          "Student, date, and status are required.",
          400
        )
      );
    }

    // Check student access
    const student = await checkStudentAccess(
      req,
      studentId
    );

    // Student must belong to a batch
    if (!student.batchId) {
      return next(
        new AppError(
          "This student is not assigned to a batch.",
          400
        )
      );
    }

    // Get batch from student's account
    const batchId = student.batchId;

    // Check duplicate attendance
    const existingAttendance =
      await Attendance.findOne({
        studentId,
        date,
      });

    if (existingAttendance) {
      return next(
        new AppError(
          "Attendance has already been recorded for this student on this date.",
          409
        )
      );
    }

    // Create attendance
    const attendance = await Attendance.create({
      studentId,
      batchId,
      date,
      status,
      markedBy: req.user._id,
      note,
    });

    // Response
    res.status(201).json({
      status: "success",
      message: "Attendance marked successfully.",
      data: {
        attendance,
      },
    });
  }
);


// ======================================================
// UPDATE ATTENDANCE
// ======================================================

const updateAttendance = asyncHandler(
  async (req, res, next) => {
    const { status, date, note } = req.body;

    // Find attendance record
    const attendance = await Attendance.findById(
      req.params.id
    );

    if (!attendance) {
      return next(
        new AppError(
          "Attendance record not found.",
          404
        )
      );
    }

    // Check whether current user can access
    // the student who owns this attendance
    await checkStudentAccess(
      req,
      attendance.studentId
    );

    // Update status if provided
    if (status !== undefined) {
      attendance.status = status;
    }

    // Update date if provided
    if (date !== undefined) {
      attendance.date = date;
    }

    // Update note if provided
    if (note !== undefined) {
      attendance.note = note;
    }

    // Record who made the latest change
    attendance.markedBy = req.user._id;

    // Save changes
    await attendance.save();

    res.status(200).json({
      status: "success",
      message: "Attendance updated successfully.",
      data: {
        attendance,
      },
    });
  }
);


// ======================================================
// GET ONE STUDENT'S ATTENDANCE
// ======================================================

const getStudentAttendance = asyncHandler(
  async (req, res, next) => {
    const { studentId } = req.params;

    // Check access
    await checkStudentAccess(
      req,
      studentId
    );

    // Find attendance
    const attendance = await Attendance.find({
      studentId,
    })
      .populate(
        "studentId",
        "fullName email role batchId"
      )
      .populate(
        "batchId",
        "name startDate endDate"
      )
      .populate(
        "markedBy",
        "fullName email role"
      )
      .sort({
        date: -1,
      });

    res.status(200).json({
      status: "success",
      results: attendance.length,
      data: {
        attendance,
      },
    });
  }
);


// ======================================================
// GET ATTENDANCE PERCENTAGE
// ======================================================

const getAttendancePercentage = asyncHandler(
  async (req, res, next) => {
    const { studentId } = req.params;

    // Check access
    await checkStudentAccess(
      req,
      studentId
    );

    // Get student's attendance
    const attendance = await Attendance.find({
      studentId,
    });

    // Total sessions
    const totalSessions = attendance.length;

    // No attendance records
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

    // Count present sessions
    const presentSessions = attendance.filter(
      (record) => record.status === "present"
    ).length;

    // Calculate percentage
    const percentage =
      (presentSessions / totalSessions) * 100;

    res.status(200).json({
      status: "success",
      data: {
        percentage: Number(
          percentage.toFixed(2)
        ),
        presentSessions,
        totalSessions,
      },
    });
  }
);


// ======================================================
// EXPORT CONTROLLERS
// ======================================================

module.exports = {
  markAttendance,
  updateAttendance,
  getStudentAttendance,
  getAttendancePercentage,
};