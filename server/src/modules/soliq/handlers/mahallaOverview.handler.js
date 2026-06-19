import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const mahallaOverview = asyncHandler(async (req, res) => {
  const data = await soliqService.mahallaOverview({ mahalla: req.query.mahalla });
  res.json({ success: true, data });
});

export default mahallaOverview;
