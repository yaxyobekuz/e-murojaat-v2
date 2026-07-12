import asyncHandler from "../../../utils/asyncHandler.js";
import { residentsService } from "../residents.service.js";

export default asyncHandler(async (req, res) => {
  res.json({ success: true, data: await residentsService.list() });
});
