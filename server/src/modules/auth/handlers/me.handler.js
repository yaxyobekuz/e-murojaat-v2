import ApiError from "../../../utils/ApiError.js";
import asyncHandler from "../../../utils/asyncHandler.js";
import { authService } from "../auth.service.js";

export default asyncHandler(async (req, res) => {
  const session = authService.check(req.cookies?.bq_token);
  if (!session) throw new ApiError(401, "Avtorizatsiya talab qilinadi", "UNAUTHORIZED");
  res.json({ success: true, data: { username: session.username, role: session.role, fullName: session.fullName } });
});
