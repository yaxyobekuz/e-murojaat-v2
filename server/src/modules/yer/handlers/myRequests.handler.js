import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as yerService from "../services/yer.service.js";

// Citizen's own cadastre requests
const myRequests = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");
  const items = await yerService.getRequestsByApplicant(jshshir);
  res.json({ success: true, data: items });
});

export default myRequests;
