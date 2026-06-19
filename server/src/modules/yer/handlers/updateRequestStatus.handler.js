import asyncHandler from "../../../middleware/asyncHandler.js";
import * as yerService from "../services/yer.service.js";

const updateRequestStatus = asyncHandler(async (req, res) => {
  const request = await yerService.updateRequestStatus(req.params.id, req.body);
  res.json({ success: true, data: request, message: "Holat yangilandi" });
});

export default updateRequestStatus;
