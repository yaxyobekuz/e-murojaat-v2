import ApiError from "../../utils/ApiError.js";
import Official from "../../models/Official.js";
import { OFFICIAL_ROLES } from "./officials.constants.js";

const assertRole = (role) => {
  if (!OFFICIAL_ROLES.includes(role)) throw new ApiError(400, "Noma'lum lavozim", "INVALID_ROLE");
};

export const officialsService = {
  list: () => Official.find(),
  getByRole: (role) => {
    assertRole(role);
    return Official.findOne({ role });
  },
  upsert: (role, data) => {
    assertRole(role);
    return Official.findOneAndUpdate(
      { role },
      { $set: { ...data, role } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
  },
  remove: async (role) => {
    assertRole(role);
    const doc = await Official.findOneAndDelete({ role });
    if (!doc) throw new ApiError(404, "Yozuv topilmadi", "NOT_FOUND");
  },
};
