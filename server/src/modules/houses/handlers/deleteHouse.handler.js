import asyncHandler from "../../../utils/asyncHandler.js";
import { housesService } from "../houses.service.js";

export default asyncHandler(async (req, res) => {
  await housesService.remove(req.params.osmId);
  res.json({ success: true, data: null, message: "Uy ma'lumotlari o'chirildi" });
});
