import asyncHandler from "../../../utils/asyncHandler.js";
import { authService } from "../auth.service.js";

const WEEK_MS = 7 * 24 * 60 * 60 * 1000;

export default asyncHandler(async (req, res) => {
  const { token, user } = await authService.login(req.body.username, req.body.password);
  // localhost'da portlar farqi same-site hisoblanadi — lax kifoya
  res.cookie("bq_token", token, { httpOnly: true, sameSite: "lax", maxAge: WEEK_MS });
  res.json({ success: true, data: user, message: "Xush kelibsiz" });
});
