import ApiError from "../../utils/ApiError.js";
import { store } from "./houses.store.js";

export const housesService = {
  list: () => store.all(),
  getByOsmId: (osmId) => store.get(osmId),
  upsert: (osmId, data) => store.upsert(osmId, data),
  remove: (osmId) => {
    if (!store.remove(osmId)) throw new ApiError(404, "Uy topilmadi", "NOT_FOUND");
  },
};
