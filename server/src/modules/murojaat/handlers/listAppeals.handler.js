import asyncHandler from "../../../middleware/asyncHandler.js";
import * as murojaatService from "../services/murojaat.service.js";
import { parsePagination, buildMeta } from "../../../utils/pagination.js";

const listAppeals = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const { items, total } = await murojaatService.listAppeals({
    type: req.query.type,
    category: req.query.category,
    status: req.query.status,
    region: req.query.region,
    organizationId: req.query.organizationId,
    overdue: req.query.overdue,
    search: req.query.search,
    page,
    limit,
  });
  res.json({ success: true, data: items, meta: buildMeta({ page, limit, total }) });
});

export default listAppeals;
