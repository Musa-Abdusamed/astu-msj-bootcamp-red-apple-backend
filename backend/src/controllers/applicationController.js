const Application = require("../models/Application");
const ApplicationSetting = require("../models/ApplicationSetting");
const User = require("../models/User");
const AppError = require("../utils/AppError");
const asyncHandler = require("../utils/asyncHandler");
const generateCustomId = require("../utils/generateCustomId");
const sendEmail = require("../utils/sendEmail");

// ======================================================
// GET APPLICATION STATUS
// ======================================================

const getApplicationStatus = asyncHandler(async (req, res) => {
  const settings = await ApplicationSetting.findOne().sort({
    createdAt: -1,
  });

  // No application settings have been created yet
  if (!settings) {
    return res.status(200).json({
      status: "success",
      data: {
        isOpen: false,
        startDate: null,
        endDate: null,
      },
    });
  }

  const now = new Date();

  const isOpen =
    settings.enabled &&
    now >= settings.startDate &&
    now <= settings.endDate;

  res.status(200).json({
    status: "success",
    data: {
      isOpen,
      enabled: settings.enabled,
      startDate: settings.startDate,
      endDate: settings.endDate,
    },
  });
});

// ======================================================
// CREATE / OPEN APPLICATION PERIOD - ADMIN
// ======================================================

const createApplicationSetting = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.body;

  if (!startDate || !endDate) {
    return next(
      new AppError(
        "Start date and end date are required.",
        400
      )
    );
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return next(
      new AppError(
        "Invalid start date or end date.",
        400
      )
    );
  }

  if (end <= start) {
    return next(
      new AppError(
        "Application end date must be after the start date.",
        400
      )
    );
  }

  const setting = await ApplicationSetting.create({
    enabled: true,
    startDate: start,
    endDate: end,
    createdBy: req.user._id,
  });

  res.status(201).json({
    status: "success",
    message: "Application period created successfully.",
    data: {
      setting,
    },
  });
});

// ======================================================
// CLOSE APPLICATIONS MANUALLY - ADMIN
// ======================================================

const closeApplications = asyncHandler(async (req, res, next) => {
  const settings = await ApplicationSetting.findOne().sort({
    createdAt: -1,
  });

  if (!settings) {
    return next(
      new AppError(
        "No application settings have been created.",
        404
      )
    );
  }

  settings.enabled = false;

  await settings.save();

  res.status(200).json({
    status: "success",
    message: "Applications have been closed successfully.",
    data: {
      enabled: settings.enabled,
      startDate: settings.startDate,
      endDate: settings.endDate,
    },
  });
});

// ======================================================
// SUBMIT APPLICATION
// ======================================================

const submitApplication = asyncHandler(async (req, res, next) => {
  // ====================================================
  // CHECK APPLICATION PERIOD
  // ====================================================

  const settings = await ApplicationSetting.findOne().sort({
    createdAt: -1,
  });

  // No settings exist
  if (!settings) {
    return next(
      new AppError(
        "Applications are currently closed.",
        403
      )
    );
  }

  const now = new Date();

  const applicationOpen =
    settings.enabled &&
    now >= settings.startDate &&
    now <= settings.endDate;

  if (!applicationOpen) {
    return next(
      new AppError(
        "Applications are currently closed.",
        403
      )
    );
  }

  // ====================================================
  // EXISTING APPLICATION LOGIC
  // ====================================================

  const { email, phone } = req.body;

  // Check for an existing pending application
  const existingPending = await Application.findOne({
    status: "Pending",
    $or: [{ email }, { phone }],
  });

  if (existingPending) {
    return next(
      new AppError(
        "A pending application already exists with this email or phone number.",
        409
      )
    );
  }

  // Check whether an account already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    return next(
      new AppError(
        "An account already exists with this email or phone number.",
        409
      )
    );
  }

  // Create application
  const application = await Application.create(req.body);

  res.status(201).json({
    status: "success",
    message: "Application submitted successfully.",
    data: {
      applicationId: application._id,
    },
  });
});

// ======================================================
// GET ALL APPLICATIONS - ADMIN
// ======================================================

const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: "success",
    results: applications.length,
    data: {
      applications,
    },
  });
});

// ======================================================
// ACCEPT APPLICATION - ADMIN
// ======================================================

const acceptApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  // Application does not exist
  if (!application) {
    return next(
      new AppError("Application not found.", 404)
    );
  }

  // Application already reviewed
  if (application.status !== "Pending") {
    return next(
      new AppError(
        "This application has already been reviewed.",
        400
      )
    );
  }

  // Get role from application
  const role = application.roleAtApplication;

  if (!["student", "mentor"].includes(role)) {
    return next(
      new AppError(
        "Application role must be either student or mentor.",
        400
      )
    );
  }

  // ====================================================
  // CHECK EXISTING USER
  // ====================================================

  const existingUser = await User.findOne({
    $or: [
      { email: application.email },
      { phone: application.phone },
    ],
  });

  if (existingUser) {
    return next(
      new AppError(
        "A user account already exists with this email or phone number.",
        409
      )
    );
  }

  // ====================================================
  // GENERATE CUSTOM ID
  // ====================================================

  const userId = await generateCustomId(
    role,
    application.year
  );

  // ====================================================
  // GENERATE TEMPORARY PASSWORD
  // ====================================================

  const temporaryPassword =
    Math.random().toString(36).slice(-10) + "A1!";

  // ====================================================
  // CREATE USER
  // ====================================================

  let user;

  try {
    user = await User.create({
      userId,
      fullName: application.fullName,
      email: application.email,
      password: temporaryPassword,
      role,
      phone: application.phone,
      batchId: null,
      mustChangeCredentials: true,
    });
  } catch (error) {
    return next(error);
  }

  // ====================================================
  // SEND ACCEPTANCE EMAIL
  // ====================================================

  try {
    await sendEmail({
      to: application.email,

      subject:
        "ASTU MSJ Bootcamp - Application Accepted",

      text: `
Dear ${application.fullName},

Congratulations!

Your application to the ASTU MSJ Bootcamp has been accepted.

Your account has been created.

--------------------------------
ACCOUNT INFORMATION
--------------------------------

Custom ID: ${user.userId}
Email: ${user.email}
Temporary Password: ${temporaryPassword}
Role: ${user.role}

--------------------------------

Please log in using the information above.

For security reasons, you must change your password after your first login.

Do not share your login credentials with anyone.

Welcome to the ASTU MSJ Bootcamp!

ASTU MSJ Bootcamp Team
`,
    });
  } catch (emailError) {
    // Email failed.
    // Remove the newly created user.
    await User.findByIdAndDelete(user._id);

    return next(
      new AppError(
        "Application could not be accepted because the acceptance email could not be sent. No user account was created.",
        500
      )
    );
  }

  // ====================================================
  // EMAIL SUCCESSFUL → ACCEPT APPLICATION
  // ====================================================

  application.status = "Accepted";
  await application.save();

  // ====================================================
  // RESPONSE
  // ====================================================

  res.status(201).json({
    status: "success",
    message:
      "Application accepted, account created, and credentials sent by email.",
    data: {
      userId: user.userId,
      email: user.email,
      role: user.role,
    },
  });
});

// ======================================================
// REJECT APPLICATION - ADMIN
// ======================================================

const rejectApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(
      new AppError("Application not found.", 404)
    );
  }

  if (application.status !== "Pending") {
    return next(
      new AppError(
        "This application has already been reviewed.",
        400
      )
    );
  }

  // Send rejection email
  try {
    await sendEmail({
      to: application.email,

      subject:
        "ASTU MSJ Bootcamp - Application Decision",

      text: `
Dear ${application.fullName},

Thank you for applying to the ASTU MSJ Bootcamp.

After carefully reviewing your application, we regret to inform you that your application was not accepted at this time.

We appreciate your interest and encourage you to continue developing your programming skills.

Best regards,

ASTU MSJ Bootcamp Team
`,
    });
  } catch (emailError) {
    return next(
      new AppError(
        "Application could not be rejected because the rejection email could not be sent.",
        500
      )
    );
  }

  // Keep application for admin history
  application.status = "Rejected";
  await application.save();

  res.status(200).json({
    status: "success",
    message:
      "Application rejected and rejection email sent successfully.",
  });
});

// ======================================================
// EXPORTS
// ======================================================

module.exports = {
  getApplicationStatus,
  createApplicationSetting,
  closeApplications,
  submitApplication,
  getApplications,
  acceptApplication,
  rejectApplication,
};