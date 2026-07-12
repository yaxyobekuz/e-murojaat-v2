import asyncHandler from "../../../utils/asyncHandler.js";
import { housesService } from "../houses.service.js";

export default asyncHandler(async (req, res) => {
  const data = await housesService.upsert(req.params.osmId, req.body);
  res.json({ success: true, data, message: "Uy ma'lumotlari saqlandi" });
});
