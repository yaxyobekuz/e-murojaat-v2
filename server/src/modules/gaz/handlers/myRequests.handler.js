import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as gazService from "../services/gaz.service.js";

// Citizen's own service requests, by JSHSHIR
const myRequests = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");
  const items = await gazService.getRequestsByApplicant(jshshir);
  res.json({ success: true, data: items });
});

export default myRequests;
