import asyncHandler from "../../../utils/asyncHandler.js";
import { usersService } from "../users.service.js";

export default asyncHandler(async (req, res) => {
  const data = await usersService.update(req.params.id, req.body);
  res.json({ success: true, data, message: "Hisob yangilandi" });
});
