import asyncHandler from "../../../utils/asyncHandler.js";
import { residentsService } from "../residents.service.js";

export default asyncHandler(async (req, res) => {
  const data = await residentsService.update(req.params.id, req.body);
  res.json({ success: true, data, message: "Fuqaro ma'lumotlari saqlandi" });
});
