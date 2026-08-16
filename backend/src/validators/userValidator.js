const Joi = require('joi');

const createUserSchema = Joi.object({
  fullName: Joi.string().min(2).required(), // Changed to fullName
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'mentor', 'student').required(), // Changed to lowercase
  phone: Joi.string().optional() // Added because it's in their model
});

module.exports = { createUserSchema };