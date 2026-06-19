import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const summary = asyncHandler(async (req, res) => {
  const data = await soliqService.summary({ region: req.query.region });
  res.json({ success: true, data });
});

export default summary;
