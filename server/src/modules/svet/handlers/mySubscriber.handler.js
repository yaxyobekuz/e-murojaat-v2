import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as svetService from "../services/svet.service.js";

// Citizen's own electric account, resolved from the logged-in user's JSHSHIR
const mySubscriber = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");

  const subscriber = await svetService.getSubscriberByJshshir(jshshir);
  if (!subscriber) {
    return res.json({ success: true, data: null });
  }

  const [usage, payments, tariff] = await Promise.all([
    svetService.getUsageBySubscriber(subscriber._id),
    svetService.getPaymentsBySubscriber(subscriber._id),
    svetService.getCurrentTariff(),
  ]);

  res.json({ success: true, data: { subscriber, usage, payments, tariff } });
});

export default mySubscriber;
