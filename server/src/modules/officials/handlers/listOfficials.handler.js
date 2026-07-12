import asyncHandler from "../../../utils/asyncHandler.js";
import { officialsService } from "../officials.service.js";

export default asyncHandler(async (req, res) => {
  res.json({ success: true, data: await officialsService.list() });
});
