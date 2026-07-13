import ApiError from "../../utils/ApiError.js";
import MahallaIndicator from "../../models/MahallaIndicator.js";
import { DOMAINS, DOMAIN_OWNER } from "./mahalla.constants.js";

export const mahallaService = {
  // barcha domenlar bitta keyed obyekt bo'lib qaytadi
  getAll: async () => {
    const docs = await MahallaIndicator.find();
    return docs.reduce((acc, d) => {
      acc[d.domain] = d.data || {};
      return acc;
    }, {});
  },
  patchDomain: async (domain, patch, role) => {
    if (!DOMAINS.includes(domain)) throw new ApiError(400, "Noma'lum domen", "INVALID_DOMAIN");
    if (role !== "owner" && role !== DOMAIN_OWNER[domain]) throw new ApiError(403, "Ruxsat yo'q", "FORBIDDEN");
    const existing = await MahallaIndicator.findOne({ domain });
    const data = { ...(existing?.data || {}), ...patch };
    const doc = await MahallaIndicator.findOneAndUpdate(
      { domain },
      { $set: { data, updatedByRole: role } },
      { upsert: true, new: true },
    );
    return { domain: doc.domain, data: doc.data };
  },
};
