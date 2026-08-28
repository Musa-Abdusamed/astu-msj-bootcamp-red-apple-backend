const Joi = require('joi');

const createUserSchema = Joi.object({
  fullName: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'mentor', 'student').required(), 
  phone: Joi.string().allow('', null).optional(),
  batchId: Joi.string().allow('', null).optional()
});

module.exports = { createUserSchema };