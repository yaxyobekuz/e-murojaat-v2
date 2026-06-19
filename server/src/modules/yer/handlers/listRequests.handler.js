import asyncHandler from "../../../middleware/asyncHandler.js";
import * as yerService from "../services/yer.service.js";
import { parsePagination, buildMeta } from "../../../utils/pagination.js";

const listRequests = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const { items, total } = await yerService.listRequests({
    status: req.query.status,
    serviceType: req.query.serviceType,
    region: req.query.region,
    search: req.query.search,
    page,
    limit,
  });
  res.json({ success: true, data: items, meta: buildMeta({ page, limit, total }) });
});

export default listRequests;
