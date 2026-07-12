import asyncHandler from "../../../utils/asyncHandler.js";
import { officialsService } from "../officials.service.js";

export default asyncHandler(async (req, res) => {
  officialsService.remove(req.params.role);
  res.json({ success: true, data: null, message: "Yozuv o'chirildi" });
});
