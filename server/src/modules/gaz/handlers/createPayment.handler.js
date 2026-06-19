import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as gazService from "../services/gaz.service.js";

// Citizen tops up / pays their gas bill (mock payment)
const createPayment = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");
  const { subscriber } = await gazService.getAccountByJshshir(jshshir);
  const data = await gazService.createPayment(subscriber._id, {
    amount: req.body.amount,
    method: req.body.method || "click",
  });
  res.status(201).json({ success: true, data, message: "To'lov amalga oshirildi" });
});

export default createPayment;
