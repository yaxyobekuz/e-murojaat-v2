import asyncHandler from "../../../middleware/asyncHandler.js";
import * as yerService from "../services/yer.service.js";

const getProperty = asyncHandler(async (req, res) => {
  const property = await yerService.getProperty(req.params.id);
  res.json({ success: true, data: property });
});

export default getProperty;
