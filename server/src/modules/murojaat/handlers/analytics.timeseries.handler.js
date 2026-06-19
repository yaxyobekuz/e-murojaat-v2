import asyncHandler from "../../../middleware/asyncHandler.js";
import * as analytics from "../services/murojaat.analytics.service.js";

const timeseries = asyncHandler(async (req, res) => {
  const data = await analytics.timeseries({
    region: req.query.region,
    from: req.query.from,
    to: req.query.to,
    type: req.query.type,
    category: req.query.category,
  });
  res.json({ success: true, data });
});

export default timeseries;
