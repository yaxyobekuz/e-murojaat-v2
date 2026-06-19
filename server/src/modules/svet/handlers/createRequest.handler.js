import asyncHandler from "../../../middleware/asyncHandler.js";
import ApiError from "../../../utils/ApiError.js";
import * as svetService from "../services/svet.service.js";

// Citizen submits an electric service request for themselves
const createRequest = asyncHandler(async (req, res) => {
  const jshshir = req.user?.jshshir;
  if (!jshshir) throw new ApiError(400, "Foydalanuvchiga JSHSHIR biriktirilmagan");

  // Attach the citizen's own account when present
  let region = req.body.region;
  let subscriberId = req.body.subscriberId;
  if (!subscriberId) {
    const own = await svetService.getSubscriberByJshshir(jshshir);
    if (own) {
      subscriberId = own._id;
      region = region || own.region;
    }
  }

  const fullName = `${req.user.firstName} ${req.user.lastName}`.trim();
  const request = await svetService.createRequest({
    serviceType: req.body.serviceType,
    subscriberId,
    region,
    applicantJshshir: jshshir,
    applicantName: fullName,
  });
  res.status(201).json({ success: true, data: request, message: "Ariza yuborildi" });
});

export default createRequest;
