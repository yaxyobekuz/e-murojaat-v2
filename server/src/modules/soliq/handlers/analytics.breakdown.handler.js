import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const breakdown = asyncHandler(async (req, res) => {
  const { by, region, district, settlement, mahalla } = req.query;
  const data = await soliqService.breakdown({ by, region, district, settlement, mahalla });
  res.json({ success: true, data });
});

export default breakdown;
