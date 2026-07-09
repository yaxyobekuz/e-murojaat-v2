import asyncHandler from "../../../utils/asyncHandler.js";
import { housesService } from "../houses.service.js";

export default asyncHandler(async (req, res) => {
  // topilmasa null qaytadi — frontend "kiritilmagan" holatini o'zi ko'rsatadi
  res.json({ success: true, data: housesService.getByOsmId(req.params.osmId) });
});
