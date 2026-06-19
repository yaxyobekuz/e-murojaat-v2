import asyncHandler from "../../../middleware/asyncHandler.js";
import * as murojaatService from "../services/murojaat.service.js";

// Public status lookup by tracking number (no login required)
const trackAppeal = asyncHandler(async (req, res) => {
  const data = await murojaatService.trackByNumber(req.query.appealNumber);
  res.json({ success: true, data });
});

export default trackAppeal;
