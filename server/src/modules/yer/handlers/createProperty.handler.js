import asyncHandler from "../../../middleware/asyncHandler.js";
import * as yerService from "../services/yer.service.js";

const createProperty = asyncHandler(async (req, res) => {
  const property = await yerService.createProperty(req.body);
  res.status(201).json({ success: true, data: property, message: "Obyekt qo'shildi" });
});

export default createProperty;
