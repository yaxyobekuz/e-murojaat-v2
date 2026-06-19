import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";

const pay = asyncHandler(async (req, res) => {
  const data = await soliqService.payAssessment(req.params.id, req.body);
  res.json({ success: true, data, message: "To'lov qabul qilindi" });
});

export default pay;
