import ApiError from "../utils/ApiError.js";
import { authService } from "../modules/auth/auth.service.js";

// Rolga asoslangan himoya — owner doim o'tadi. req.user ga sessiya biriktiriladi.
const requireRole = (...roles) => (req, res, next) => {
  const session = authService.getSession(req.cookies?.bq_token);
  if (!session) return next(new ApiError(401, "Avtorizatsiya talab qilinadi", "UNAUTHORIZED"));
  req.user = session;
  if (session.role === "owner") return next(); // owner super-admin
  // rol berilmasa — faqat owner (yuqorida o'tdi); aks holda ro'yxatda bo'lishi shart
  if (!roles.includes(session.role)) return next(new ApiError(403, "Ruxsat yo'q", "FORBIDDEN"));
  next();
};

export default requireRole;
