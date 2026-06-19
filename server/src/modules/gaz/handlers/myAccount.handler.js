import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as gazService from "../services/gaz.service.js";

// Citizen's own gas account, resolved from the logged-in user's JSHSHIR
const myAccount = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");
  const data = await gazService.getAccountByJshshir(jshshir);
  res.json({ success: true, data });
});

export default myAccount;
