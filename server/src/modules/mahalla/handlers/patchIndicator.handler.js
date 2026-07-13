import asyncHandler from "../../../utils/asyncHandler.js";
import { mahallaService } from "../mahalla.service.js";

export default asyncHandler(async (req, res) => {
  const data = await mahallaService.patchDomain(req.params.domain, req.body, req.user.role);
  res.json({ success: true, data, message: "Ko'rsatkichlar saqlandi" });
});
