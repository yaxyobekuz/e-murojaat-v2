import asyncHandler from "../../../middleware/asyncHandler.js";
import * as svetService from "../services/svet.service.js";

// Open lookup by account number (citizen self-check before applying)
const checkAccount = asyncHandler(async (req, res) => {
  const data = await svetService.checkAccount(req.query.accountNumber);
  res.json({ success: true, data });
});

export default checkAccount;
