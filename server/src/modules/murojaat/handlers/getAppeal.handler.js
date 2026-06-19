import asyncHandler from "../../../middleware/asyncHandler.js";
import * as murojaatService from "../services/murojaat.service.js";

const getAppeal = asyncHandler(async (req, res) => {
  const data = await murojaatService.getAppeal(req.params.id);
  res.json({ success: true, data });
});

export default getAppeal;
