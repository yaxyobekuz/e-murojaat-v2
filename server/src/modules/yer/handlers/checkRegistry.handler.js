import asyncHandler from "../../../middleware/asyncHandler.js";
import * as yerService from "../services/yer.service.js";

// Open service: look up a property by cadastre number
const checkRegistry = asyncHandler(async (req, res) => {
  const property = await yerService.checkRegistry(req.query.cadastreNumber);
  res.json({ success: true, data: property });
});

export default checkRegistry;
