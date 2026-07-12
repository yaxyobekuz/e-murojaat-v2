import ApiError from "../../utils/ApiError.js";
import { store } from "./residents.store.js";

export const residentsService = {
  list: () => store.all(),
  getById: (id) => {
    const resident = store.get(id);
    if (!resident) throw new ApiError(404, "Fuqaro topilmadi", "NOT_FOUND");
    return resident;
  },
  create: (data) => store.create(data),
  update: (id, data) => {
    const resident = store.update(id, data);
    if (!resident) throw new ApiError(404, "Fuqaro topilmadi", "NOT_FOUND");
    return resident;
  },
  remove: (id) => {
    if (!store.remove(id)) throw new ApiError(404, "Fuqaro topilmadi", "NOT_FOUND");
  },
};
