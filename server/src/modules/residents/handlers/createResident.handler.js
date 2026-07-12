import asyncHandler from "../../../utils/asyncHandler.js";
import { residentsService } from "../residents.service.js";

export default asyncHandler(async (req, res) => {
  const data = residentsService.create(req.body);
  res.status(201).json({ success: true, data, message: "Fuqaro qo'shildi" });
});
