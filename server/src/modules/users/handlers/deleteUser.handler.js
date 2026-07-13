import asyncHandler from "../../../utils/asyncHandler.js";
import { usersService } from "../users.service.js";

export default asyncHandler(async (req, res) => {
  await usersService.remove(req.params.id, req.user.userId);
  res.json({ success: true, data: null, message: "Hisob o'chirildi" });
});
