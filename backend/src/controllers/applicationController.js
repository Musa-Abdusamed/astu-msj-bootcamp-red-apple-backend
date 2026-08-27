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

  // ====================================================
  // SEND ACCEPTANCE EMAIL
  // ====================================================

  try {
    const emailSubject = "ASTU MSJ Bootcamp - Application Accepted (Login Credentials)";
    const emailText = `
Dear ${application.fullName},

Congratulations!

Your application to the ASTU MSJ Bootcamp has been accepted.

Your account has been created.

--------------------------------
YOUR LOGIN CREDENTIALS
--------------------------------

Unique ID: ${user.userId}
One-Time Password: ${temporaryPassword}
Role: ${user.role}

--------------------------------
LOGIN INSTRUCTIONS:
--------------------------------
1. Go to the ASTU MSJ Portal Login page.
2. Select your role (${user.role.toUpperCase()}).
3. Enter your Unique ID: ${user.userId}
4. Enter your One-Time Password: ${temporaryPassword}
5. Once you sign in, you will be automatically redirected to the password changing section to set your new permanent password.

For security reasons, you must change your one-time password immediately. Do not share your login credentials with anyone.

Welcome to the ASTU MSJ Bootcamp!

ASTU MSJ Bootcamp Team
`;

    const emailHtml = `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #1e293b; background-color: #f8fafc; border-radius: 12px; border: 1px solid #e2e8f0;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="color: #4f46e5; margin: 0; font-size: 24px;">ASTU MSJ Bootcamp</h1>
    <p style="color: #64748b; font-size: 14px; margin-top: 4px;">Summer Cohort Admission</p>
  </div>

  <div style="background-color: #ffffff; padding: 24px; border-radius: 8px; border: 1px solid #e2e8f0;">
    <h2 style="color: #0f172a; font-size: 18px; margin-top: 0;">Congratulations, ${application.fullName}! 🎉</h2>
    <p style="font-size: 14px; line-height: 1.6; color: #334155;">
      We are pleased to inform you that your application to the <strong>ASTU MSJ Bootcamp</strong> has been accepted. Your student account has been created.
    </p>

    <div style="background-color: #f1f5f9; border-left: 4px solid #4f46e5; padding: 16px; margin: 20px 0; border-radius: 4px;">
      <h3 style="margin: 0 0 12px 0; font-size: 15px; color: #1e293b;">Your Login Credentials</h3>
      <p style="margin: 6px 0; font-size: 14px;"><strong>Unique ID:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #4f46e5; background: #e0e7ff; padding: 2px 6px; border-radius: 4px;">${user.userId}</span></p>
      <p style="margin: 6px 0; font-size: 14px;"><strong>One-Time Password:</strong> <span style="font-family: monospace; font-size: 15px; font-weight: bold; color: #0f172a; background: #e2e8f0; padding: 2px 6px; border-radius: 4px;">${temporaryPassword}</span></p>
      <p style="margin: 6px 0; font-size: 14px;"><strong>Role:</strong> <span style="text-transform: capitalize;">${user.role}</span></p>
    </div>

    <h4 style="color: #0f172a; margin-bottom: 8px;">How to Sign In:</h4>
    <ol style="font-size: 14px; line-height: 1.6; color: #334155; padding-left: 20px;">
      <li>Navigate to the login portal.</li>
      <li>Select the <strong>${user.role.toUpperCase()}</strong> role.</li>
      <li>Log in using your <strong>Unique ID</strong> (<code>${user.userId}</code>) and <strong>One-Time Password</strong>.</li>
      <li>You will be directed straight to the password changing page to set your permanent password.</li>
    </ol>

    <div style="margin-top: 20px; padding: 12px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 6px; font-size: 13px; color: #92400e;">
      ⚠️ <strong>Important:</strong> For security reasons, please change your one-time password immediately after logging in. Never share your credentials.
    </div>
  </div>

  <div style="text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8;">
    &copy; 2026 ASTU MSJ Bootcamp. All rights reserved.
  </div>
</div>
`;

    await sendEmail({
      to: application.email,
      subject: emailSubject,
      text: emailText,
      html: emailHtml,
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
      user: {
        id: user._id,
        _id: user._id,
        userId: user.userId,
        email: user.email,
        role: user.role,
        fullName: user.fullName,
      },
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