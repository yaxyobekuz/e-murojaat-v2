import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as svetService from "../services/svet.service.js";

// Citizen tops up / pays off their own electric account (mock payment)
const createPayment = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");

  const subscriber = await svetService.getSubscriberByJshshir(jshshir);
  if (!subscriber) throw new ApiError(404, "Sizga biriktirilgan hisob topilmadi");

  const data = await svetService.createPayment({
    subscriberId: subscriber._id,
    amountUzs: req.body.amountUzs,
    method: req.body.method,
  });
  res.status(201).json({ success: true, data, message: "To'lov amalga oshirildi" });
});

export default createPayment;
