import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const summary = asyncHandler(async (req, res) => {
  const { region, district, settlement, mahalla } = req.query;
  const data = await soliqService.summary({ region, district, settlement, mahalla });
  res.json({ success: true, data });
});

export default summary;
