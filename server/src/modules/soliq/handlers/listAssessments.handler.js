import asyncHandler from "../../../middleware/asyncHandler.js";
import * as soliqService from "../services/soliq.service.js";
import { parsePagination, buildMeta } from "../../../utils/pagination.js";

const listAssessments = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const { items, total } = await soliqService.listAssessments({
    region: req.query.region,
    district: req.query.district,
    settlement: req.query.settlement,
    mahalla: req.query.mahalla,
    taxType: req.query.taxType,
    status: req.query.status,
    year: req.query.year,
    page,
    limit,
  });
  res.json({ success: true, data: items, meta: buildMeta({ page, limit, total }) });
});

export default listAssessments;
