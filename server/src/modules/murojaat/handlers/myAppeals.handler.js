import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as murojaatService from "../services/murojaat.service.js";

// Citizen's own appeals
const myAppeals = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");
  const items = await murojaatService.getAppealsByApplicant(jshshir);
  res.json({ success: true, data: items });
});

export default myAppeals;
