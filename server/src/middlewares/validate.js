import ApiError from "../utils/ApiError.js";

// zod sxema bilan body validatsiyasi
const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const first = result.error.issues[0];
    return next(new ApiError(400, `${first.path.join(".")}: ${first.message}`, "VALIDATION"));
  }
  req.body = result.data;
  next();
};

export default validate;
