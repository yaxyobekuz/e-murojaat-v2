import asyncHandler from "../../../utils/asyncHandler.js";
import { housesService } from "../houses.service.js";

export default asyncHandler(async (req, res) => {
  res.json({ success: true, data: housesService.list() });
});
