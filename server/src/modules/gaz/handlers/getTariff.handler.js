import asyncHandler from "../../../middleware/asyncHandler.js";
import * as gazService from "../services/gaz.service.js";

const getTariff = asyncHandler(async (req, res) => {
  const data = await gazService.getCurrentTariff();
  res.json({ success: true, data });
});

export default getTariff;
