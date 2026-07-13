import asyncHandler from "../../../utils/asyncHandler.js";
import { usersService } from "../users.service.js";

export default asyncHandler(async (req, res) => {
  const data = await usersService.create(req.body);
  res.status(201).json({ success: true, data, message: "Hisob yaratildi" });
});
