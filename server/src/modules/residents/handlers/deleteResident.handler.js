import asyncHandler from "../../../utils/asyncHandler.js";
import { residentsService } from "../residents.service.js";

export default asyncHandler(async (req, res) => {
  residentsService.remove(req.params.id);
  res.json({ success: true, data: null, message: "Fuqaro o'chirildi" });
});
