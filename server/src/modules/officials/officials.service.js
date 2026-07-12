import ApiError from "../../utils/ApiError.js";
import { store } from "./officials.store.js";
import { OFFICIAL_ROLES } from "./officials.constants.js";

const assertRole = (role) => {
  if (!OFFICIAL_ROLES.includes(role)) throw new ApiError(400, "Noma'lum lavozim", "INVALID_ROLE");
};

export const officialsService = {
  list: () => store.all(),
  getByRole: (role) => {
    assertRole(role);
    return store.get(role);
  },
  upsert: (role, data) => {
    assertRole(role);
    return store.upsert(role, data);
  },
  remove: (role) => {
    assertRole(role);
    if (!store.remove(role)) throw new ApiError(404, "Yozuv topilmadi", "NOT_FOUND");
  },
};
