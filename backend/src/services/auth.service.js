const jwt = require('jsonwebtoken');
const env = require('../config/env');

const signToken = (id, role) =>
  jwt.sign({ id, role }, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id, user.role);

  const cookieOptions = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

  res.cookie('token', token, cookieOptions);

  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    mustChangeCredentials: user.mustChangeCredentials, // [NEW] SRS Section 4.6: Expose flag for first login
    data: {
      user: {
        id: user._id,
        userId: user.userId, // [NEW] Added permanent custom userId as well
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        batch: user.batch,
        avatar: user.avatar, // [NEW] Added avatar support
      },
    },
  });
};

module.exports = { signToken, createSendToken };