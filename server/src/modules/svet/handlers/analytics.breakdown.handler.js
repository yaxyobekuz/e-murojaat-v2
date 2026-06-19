import asyncHandler from "../../../middleware/asyncHandler.js";
import * as analytics from "../services/svet.analytics.service.js";

const breakdown = asyncHandler(async (req, res) => {
  const data = await analytics.breakdown(
    {
      region: req.query.region,
      from: req.query.from,
      to: req.query.to,
      type: req.query.type,
    },
    req.query.by || "region",
  );
  res.json({ success: true, data });
});

export default breakdown;
