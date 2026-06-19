import asyncHandler from "../../../middleware/asyncHandler.js";
import * as svetService from "../services/svet.service.js";

const getSubscriber = asyncHandler(async (req, res) => {
  const data = await svetService.getSubscriberCard(req.params.id);
  res.json({ success: true, data });
});

export default getSubscriber;
