const Application = require('../models/Application');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');
const generateCustomId = require('../utils/generateCustomId');
//const generateCredentials = require('../utils/generateCredentials');
//const sendEmail = require('../utils/sendEmail');

const submitApplication = asyncHandler(async (req, res, next) => {
  const { email, phone } = req.body;

  const existingPending = await Application.findOne({
    status: 'pending',
    $or: [{ email }, { phone }],
  });

  if (existingPending) {
    return next(
      new AppError(
        'A pending application already exists with this email or phone number.',
        409
      )
    );
  }

  const existingUser = await User.findOne({
    $or: [{ email }, { phone }],
  });

  if (existingUser) {
    return next(
      new AppError(
        'An account already exists with this email or phone number.',
        409
      )
    );
  }

  const application = await Application.create(req.body);

  res.status(201).json({
    status: 'success',
    message: 'Application submitted successfully.',
    data: {
      applicationId: application._id,
    },
  });
});

const getApplications = asyncHandler(async (req, res) => {
  const applications = await Application.find().sort({
    createdAt: -1,
  });

  res.status(200).json({
    status: 'success',
    results: applications.length,
    data: { applications },
  });
});

const acceptApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(
      new AppError('Application not found.', 404)
    );
  }

  if (application.status !== 'pending') {
    return next(
      new AppError(
        'This application has already been reviewed.',
        400
      )
    );
  }

  const role = req.body.role || application.requestedRole;
  const year = req.body.year || application.year;

  if (!['student', 'mentor'].includes(role)) {
    return next(
      new AppError(
        'Accepted role must be student or mentor.',
        400
      )
    );
  }

  const userId = await generateCustomId(role, year);
  const credentials = generateCredentials(application.fullName);

  const user = await User.create({
    userId,
    username: credentials.username,
    fullName: application.fullName,
    email: application.email,
    password: credentials.password,
    role,
    year,
    phone: application.phone,
    telegramUsername: application.telegramUsername,
    gender: application.gender,
    department: application.department,
    university: application.university,
    github: application.github,
    codeforces: application.codeforces,
    leetcode: application.leetcode,
    mustChangeCredentials: true,
    isFirstLogin: true,
    temporaryPasswordExpiresAt:
      new Date(Date.now() + 72 * 60 * 60 * 1000),
  });

  await sendEmail({
    to: user.email,
    subject: 'ASTU MSJ Bootcamp Application Accepted',
    text: `
Your application has been accepted.

User ID: ${user.userId}
Username: ${credentials.username}
Temporary Password: ${credentials.password}

Please log in and change your username and password on your first login.
    `,
  });

  application.status = 'accepted';
  await application.save();

  res.status(201).json({
    status: 'success',
    message: 'Application accepted and user account created.',
    data: {
      userId: user.userId,
      email: user.email,
    },
  });
});

const rejectApplication = asyncHandler(async (req, res, next) => {
  const application = await Application.findById(req.params.id);

  if (!application) {
    return next(
      new AppError('Application not found.', 404)
    );
  }

  if (application.status !== 'pending') {
    return next(
      new AppError(
        'This application has already been reviewed.',
        400
      )
    );
  }

  await sendEmail({
    to: application.email,
    subject: 'ASTU MSJ Bootcamp Application Decision',
    text: `
Dear ${application.fullName},

Thank you for applying to the ASTU MSJ Bootcamp.

After reviewing your application, we regret to inform you that your application was not accepted.

Thank you for your interest.
    `,
  });

  await Application.findByIdAndDelete(application._id);

  res.status(200).json({
    status: 'success',
    message: 'Application rejected and deleted successfully.',
  });
});

module.exports = {
  submitApplication,
  getApplications,
  acceptApplication,
  rejectApplication,
};