import asyncHandler from "../../../middleware/asyncHandler.js";
import * as murojaatService from "../services/murojaat.service.js";

const listOrganizations = asyncHandler(async (_req, res) => {
  const data = await murojaatService.listOrganizations();
  res.json({ success: true, data });
});

export default listOrganizations;
