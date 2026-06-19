import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as gazService from "../services/gaz.service.js";

// Monthly usage series for the citizen's own account
const myUsage = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");
  const { subscriber } = await gazService.getAccountByJshshir(jshshir);
  const data = await gazService.getMonthlyUsageBySubscriber(subscriber._id);
  res.json({ success: true, data });
});

export default myUsage;
