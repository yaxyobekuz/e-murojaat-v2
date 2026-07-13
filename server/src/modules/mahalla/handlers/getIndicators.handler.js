import asyncHandler from "../../../utils/asyncHandler.js";
import { mahallaService } from "../mahalla.service.js";

export default asyncHandler(async (req, res) => {
  res.json({ success: true, data: await mahallaService.getAll() });
});
