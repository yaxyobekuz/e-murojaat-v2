import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const getTaxpayer = asyncHandler(async (req, res) => {
  const data = await soliqService.getTaxpayer(req.params.id);
  res.json({ success: true, data });
});

export default getTaxpayer;
