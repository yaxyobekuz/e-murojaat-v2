import asyncHandler from "../../../middleware/asyncHandler.js";
import * as analytics from "../services/gaz.analytics.service.js";

const timeseries = asyncHandler(async (req, res) => {
  const data = await analytics.timeseries({
    region: req.query.region,
    from: req.query.from,
    to: req.query.to,
    type: req.query.type,
  });
  res.json({ success: true, data });
});

export default timeseries;
