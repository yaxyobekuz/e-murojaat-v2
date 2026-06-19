import asyncHandler from "../../../middleware/asyncHandler.js";
import * as yerService from "../services/yer.service.js";

const updateProperty = asyncHandler(async (req, res) => {
  const property = await yerService.updateProperty(req.params.id, req.body);
  res.json({ success: true, data: property, message: "Saqlandi" });
});

export default updateProperty;
