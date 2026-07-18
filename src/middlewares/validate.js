const { fail } = require('../utils/apiResponse');

// Factory: validate(schema) returns a middleware that parses req.body
// against a zod schema. On success, req.body is replaced with the
// parsed/coerced value. On failure, responds 400 with field errors.
function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      const details = result.error.issues
        .map((issue) => `${issue.path.join('.') || 'body'}: ${issue.message}`)
        .join('; ');
      return fail(res, `Validation error: ${details}`, 400);
    }
    req.body = result.data;
    return next();
  };
}

module.exports = validate;
