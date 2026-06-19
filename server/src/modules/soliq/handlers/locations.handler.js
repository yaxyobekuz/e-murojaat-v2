import asyncHandler from "../../../middleware/asyncHandler.js";
import {
  REGIONS,
  districtsOf,
  settlementsOf,
  mahallasOf,
} from "../../../helpers/regions.helper.js";

// Frontend drilldown filtri uchun hudud ma'lumotnomasi.
// ?region=&district=&settlement= bo'yicha keyingi darajani qaytaradi.
const locations = asyncHandler(async (req, res) => {
  const { region, district, settlement } = req.query;

  if (settlement) {
    return res.json({ success: true, data: { level: "mahalla", items: mahallasOf(settlement) } });
  }
  if (district && region) {
    const items = settlementsOf(region, district).map((s) => ({ key: s.key, label: s.label, type: s.type }));
    return res.json({ success: true, data: { level: "settlement", items } });
  }
  if (region) {
    const items = districtsOf(region).map((d) => ({ key: d.key, label: d.label }));
    return res.json({ success: true, data: { level: "district", items } });
  }
  return res.json({ success: true, data: { level: "region", items: REGIONS } });
});

export default locations;
