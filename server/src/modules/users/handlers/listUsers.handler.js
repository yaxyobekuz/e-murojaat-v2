import asyncHandler from "../../../utils/asyncHandler.js";
import { usersService } from "../users.service.js";

export default asyncHandler(async (req, res) => {
  res.json({ success: true, data: await usersService.list() });
});
