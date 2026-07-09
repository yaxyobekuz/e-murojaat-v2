import asyncHandler from "../../../utils/asyncHandler.js";
import { authService } from "../auth.service.js";

export default asyncHandler(async (req, res) => {
  authService.logout(req.cookies?.bq_token);
  res.clearCookie("bq_token");
  res.json({ success: true, data: null, message: "Chiqdingiz" });
});
