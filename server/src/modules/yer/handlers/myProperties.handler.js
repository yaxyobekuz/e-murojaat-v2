import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as yerService from "../services/yer.service.js";

// Citizen's own properties, resolved from the logged-in user's JSHSHIR
const myProperties = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");
  const items = await yerService.getPropertiesByOwner(jshshir);
  res.json({ success: true, data: items });
});

export default myProperties;
