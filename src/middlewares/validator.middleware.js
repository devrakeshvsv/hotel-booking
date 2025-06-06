const Joi = require("joi");
const httpStatus = require("http-status");
const { helpers, ApiError } = require("../utils");

const validate = (schema) => (req, res, next) => {
  const validSchema = helpers.pick(schema, ["params", "query", "body"]);
  const object = helpers.pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: "key" }, abortEarly: false })
    .validate(object);

  if (error) {
    const errorMessage = error.details.map((details) => details.message).join(", ");
    return next(new ApiError(httpStatus.BAD_REQUEST, errorMessage));
  }
  Object.assign(req, value);
  return next();
};

module.exports = { validate };
