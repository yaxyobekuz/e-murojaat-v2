import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as gazService from "../services/gaz.service.js";

// Citizen submits a gas service request for themselves
const createRequest = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");

  const fullName = `${req.user.firstName} ${req.user.lastName}`.trim();
  const request = await gazService.createRequest({
    ...req.body,
    applicantJshshir: jshshir,
    applicantName: fullName,
  });
  res.status(201).json({ success: true, data: request, message: "Ariza yuborildi" });
});

export default createRequest;
