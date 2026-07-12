import asyncHandler from "../../../utils/asyncHandler.js";
import { officialsService } from "../officials.service.js";

export default asyncHandler(async (req, res) => {
  // topilmasa null qaytadi — frontend "kiritilmagan" holatini ko'rsatadi
  res.json({ success: true, data: officialsService.getByRole(req.params.role) });
});
