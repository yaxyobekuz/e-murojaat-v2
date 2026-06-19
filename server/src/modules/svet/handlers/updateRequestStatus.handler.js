import asyncHandler from "../../../middleware/asyncHandler.js";
import * as svetService from "../services/svet.service.js";

const updateRequestStatus = asyncHandler(async (req, res) => {
  const data = await svetService.updateRequestStatus(req.params.id, req.body);
  res.json({ success: true, data, message: "Holat yangilandi" });
});

export default updateRequestStatus;
