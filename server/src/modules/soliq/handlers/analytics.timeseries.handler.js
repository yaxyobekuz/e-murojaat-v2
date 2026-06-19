import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const timeseries = asyncHandler(async (req, res) => {
  const data = await soliqService.timeseries({
    region: req.query.region,
    months: req.query.months,
  });
  res.json({ success: true, data });
});

export default timeseries;
