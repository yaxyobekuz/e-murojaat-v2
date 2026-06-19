import asyncHandler from "../../../middleware/asyncHandler.js";
import * as yerService from "../services/yer.service.js";

const getRequest = asyncHandler(async (req, res) => {
  const request = await yerService.getRequest(req.params.id);
  res.json({ success: true, data: request });
});

export default getRequest;
