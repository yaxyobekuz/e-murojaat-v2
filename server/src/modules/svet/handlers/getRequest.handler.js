import asyncHandler from "../../../middleware/asyncHandler.js";
import * as svetService from "../services/svet.service.js";

const getRequest = asyncHandler(async (req, res) => {
  const data = await svetService.getRequest(req.params.id);
  res.json({ success: true, data });
});

export default getRequest;
