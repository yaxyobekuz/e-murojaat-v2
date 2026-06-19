import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as murojaatService from "../services/murojaat.service.js";

// Citizen submits an appeal for themselves
const createAppeal = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");

  const fullName = `${req.user.firstName} ${req.user.lastName}`.trim();
  const appeal = await murojaatService.createAppeal({
    ...req.body,
    applicantJshshir: jshshir,
    applicantName: fullName,
    applicantPhone: req.user.phone,
  });
  res
    .status(201)
    .json({ success: true, data: appeal, message: "Murojaat yuborildi" });
});

export default createAppeal;
