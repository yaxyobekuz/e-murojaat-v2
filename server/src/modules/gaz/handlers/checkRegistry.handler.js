import asyncHandler from "../../../middleware/asyncHandler.js";
import * as gazService from "../services/gaz.service.js";

const checkRegistry = asyncHandler(async (req, res) => {
  const data = await gazService.checkRegistry(req.query.accountNumber);
  res.json({ success: true, data });
});

export default checkRegistry;
