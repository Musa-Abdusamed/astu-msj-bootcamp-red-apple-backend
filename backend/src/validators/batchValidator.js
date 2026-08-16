const Joi = require('joi');

const createBatchSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  description: Joi.string().max(1000).optional(),
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
  isActive: Joi.boolean().optional()
});

module.exports = { createBatchSchema };