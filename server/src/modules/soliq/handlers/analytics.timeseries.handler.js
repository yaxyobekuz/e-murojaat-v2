import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const timeseries = asyncHandler(async (req, res) => {
  const { region, district, settlement, mahalla, months } = req.query;
  const data = await soliqService.timeseries({ region, district, settlement, mahalla, months });
  res.json({ success: true, data });
});

export default timeseries;
