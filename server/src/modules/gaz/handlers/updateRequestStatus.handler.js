import asyncHandler from "../../../middleware/asyncHandler.js";
import * as gazService from "../services/gaz.service.js";

const updateRequestStatus = asyncHandler(async (req, res) => {
  const data = await gazService.updateRequestStatus(req.params.id, req.body);
  res.json({ success: true, data, message: "Holat yangilandi" });
});

export default updateRequestStatus;
