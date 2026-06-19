import asyncHandler from "../../../middleware/asyncHandler.js";
import * as svetService from "../services/svet.service.js";

const updateSubscriber = asyncHandler(async (req, res) => {
  const data = await svetService.updateSubscriber(req.params.id, req.body);
  res.json({ success: true, data, message: "Abonent yangilandi" });
});

export default updateSubscriber;
