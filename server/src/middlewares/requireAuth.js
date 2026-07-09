import ApiError from "../utils/ApiError.js";
import { authService } from "../modules/auth/auth.service.js";

// Boshqaruv amallari (yozish/o'chirish) faqat owner sessiyasi bilan
const requireAuth = (req, res, next) => {
  if (!authService.check(req.cookies?.bq_token))
    return next(new ApiError(401, "Avtorizatsiya talab qilinadi", "UNAUTHORIZED"));
  next();
};

export default requireAuth;
