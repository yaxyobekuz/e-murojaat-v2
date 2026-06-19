import asyncHandler from "../../../middleware/asyncHandler.js";
import * as gazService from "../services/gaz.service.js";

const getSubscriber = asyncHandler(async (req, res) => {
  const data = await gazService.getSubscriber(req.params.id);
  res.json({ success: true, data });
});

export default getSubscriber;
