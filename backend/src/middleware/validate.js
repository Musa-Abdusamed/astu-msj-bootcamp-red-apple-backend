const validateRequest = (schema) => {
  return (req, res, next) => {
    // abortEarly: false ensures Joi returns ALL errors, not just the first one it finds
    const { error } = schema.validate(req.body, { abortEarly: false });
    
    if (error) {
      // Map Joi's error details into a clean array of messages
      const errorMessages = error.details.map(detail => detail.message);
      
      return res.status(400).json({
        success: false,
        message: "Validation Error",
        errors: errorMessages
      });
    }
    
    // If no errors, proceed to the controller
    next();
  };
};

module.exports = validateRequest;