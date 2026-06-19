import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const breakdown = asyncHandler(async (req, res) => {
  const data = await soliqService.breakdown({
    by: req.query.by,
    region: req.query.region,
  });
  res.json({ success: true, data });
});

export default breakdown;
