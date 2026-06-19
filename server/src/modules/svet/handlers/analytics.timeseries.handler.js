import asyncHandler from "../../../middleware/asyncHandler.js";
import * as analytics from "../services/svet.analytics.service.js";

// metric: "usage" (default) | "norm" (within vs over) | "revenue"
const timeseries = asyncHandler(async (req, res) => {
  const filters = {
    region: req.query.region,
    from: req.query.from,
    to: req.query.to,
    type: req.query.type,
  };
  const metric = req.query.metric || "usage";

  let data;
  if (metric === "norm") data = await analytics.normSeries(filters);
  else if (metric === "revenue") data = await analytics.revenueDebtSeries(filters);
  else data = await analytics.timeseries(filters);

  res.json({ success: true, data });
});

export default timeseries;
