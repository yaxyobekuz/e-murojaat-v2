import asyncHandler from "../../../utils/asyncHandler.js";
import { residentsService } from "../residents.service.js";

export default asyncHandler(async (req, res) => {
  const filter = req.query.houseOsmId ? { houseOsmId: req.query.houseOsmId } : {};
  res.json({ success: true, data: await residentsService.list(filter) });
});
