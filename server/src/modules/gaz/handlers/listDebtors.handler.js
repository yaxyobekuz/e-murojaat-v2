import asyncHandler from "../../../middleware/asyncHandler.js";
import * as gazService from "../services/gaz.service.js";
import { parsePagination, buildMeta } from "../../../utils/pagination.js";

const listDebtors = asyncHandler(async (req, res) => {
  const { page, limit } = parsePagination(req.query);
  const { items, total, totalDebt } = await gazService.listDebtors({
    region: req.query.region,
    page,
    limit,
  });
  res.json({
    success: true,
    data: items,
    meta: { ...buildMeta({ page, limit, total }), totalDebt },
  });
});

export default listDebtors;
