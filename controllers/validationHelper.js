const {validationResult} = require("express-validator");

exports.processValidationResults = (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
      const validationErrors = errors.array();

      return res.status(400).json({
        error: "Please fix the errors below.",
        subErrors: validationErrors.map((validationError) => ({
          field: validationError.param,
          error: validationError.msg
        }))
      });
  }

  next();
}
