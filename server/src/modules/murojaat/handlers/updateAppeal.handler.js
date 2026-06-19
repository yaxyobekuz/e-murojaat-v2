import asyncHandler from "../../../middleware/asyncHandler.js";
import * as murojaatService from "../services/murojaat.service.js";

const updateAppeal = asyncHandler(async (req, res) => {
  const data = await murojaatService.updateAppeal(req.params.id, req.body);
  res.json({ success: true, data, message: "Murojaat yangilandi" });
});

export default updateAppeal;
