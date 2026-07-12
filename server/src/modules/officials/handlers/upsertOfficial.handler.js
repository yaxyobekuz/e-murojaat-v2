import asyncHandler from "../../../utils/asyncHandler.js";
import { officialsService } from "../officials.service.js";

export default asyncHandler(async (req, res) => {
  const data = await officialsService.upsert(req.params.role, req.body);
  res.json({ success: true, data, message: "Ma'lumotlar saqlandi" });
});
