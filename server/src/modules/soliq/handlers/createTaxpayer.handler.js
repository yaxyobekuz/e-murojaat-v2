import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const createTaxpayer = asyncHandler(async (req, res) => {
  const taxpayer = await soliqService.createTaxpayer(req.body);
  res.status(201).json({ success: true, data: taxpayer, message: "Soliq to'lovchi qo'shildi" });
});

export default createTaxpayer;
