import asyncHandler from "../../../middleware/asyncHandler.js";
import * as yerService from "../services/yer.service.js";
import { parsePagination, buildMeta } from "../../../utils/pagination.js";

const listProperties = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const { items, total } = await yerService.listProperties({
    region: req.query.region,
    district: req.query.district,
    type: req.query.type,
    status: req.query.status,
    search: req.query.search,
    page,
    limit,
  });
  res.json({ success: true, data: items, meta: buildMeta({ page, limit, total }) });
});

export default listProperties;
