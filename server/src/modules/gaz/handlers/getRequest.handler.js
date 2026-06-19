import asyncHandler from "../../../middleware/asyncHandler.js";
import * as gazService from "../services/gaz.service.js";

const getRequest = asyncHandler(async (req, res) => {
  const data = await gazService.getRequest(req.params.id);
  res.json({ success: true, data });
});

export default getRequest;
