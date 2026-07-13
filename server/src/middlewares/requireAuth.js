import ApiError from "../utils/ApiError.js";
import { authService } from "../modules/auth/auth.service.js";

// Har qanday login qilgan foydalanuvchi. req.user ga sessiya (rol bilan) biriktiriladi.
const requireAuth = (req, res, next) => {
  const session = authService.check(req.cookies?.bq_token);
  if (!session) return next(new ApiError(401, "Avtorizatsiya talab qilinadi", "UNAUTHORIZED"));
  req.user = session;
  next();
};

export default requireAuth;
