import asyncHandler from "../../../middleware/asyncHandler.js";
import * as analytics from "../services/svet.analytics.service.js";

const summary = asyncHandler(async (req, res) => {
  const data = await analytics.summary({
    region: req.query.region,
    from: req.query.from,
    to: req.query.to,
    type: req.query.type,
  });
  res.json({ success: true, data });
});

export default summary;
