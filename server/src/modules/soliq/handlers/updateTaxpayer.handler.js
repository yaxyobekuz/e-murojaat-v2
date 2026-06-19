import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const updateTaxpayer = asyncHandler(async (req, res) => {
  const taxpayer = await soliqService.updateTaxpayer(req.params.id, req.body);
  res.json({ success: true, data: taxpayer, message: "Saqlandi" });
});

export default updateTaxpayer;
