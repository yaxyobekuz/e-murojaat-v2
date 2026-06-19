import asyncHandler from "../../../middleware/asyncHandler.js";
import * as murojaatService from "../services/murojaat.service.js";

const createOrganization = asyncHandler(async (req, res) => {
  const data = await murojaatService.createOrganization(req.body);
  res
    .status(201)
    .json({ success: true, data, message: "Tashkilot qo'shildi" });
});

export default createOrganization;
