import ApiError from "../../utils/ApiError.js";
import House from "../../models/House.js";
import { scopeHouseData } from "./houses.fields.js";

export const housesService = {
  list: () => House.find(),
  // topilmasa null qaytadi — frontend "kiritilmagan" holatini o'zi ko'rsatadi
  getByOsmId: (osmId) => House.findOne({ osmId }),
  // role — owner emas bo'lsa, faqat o'sha rolning maydonlari saqlanadi
  upsert: (osmId, data, role) =>
    House.findOneAndUpdate(
      { osmId },
      { $set: { ...scopeHouseData(data, role), osmId } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    ),
  remove: async (osmId) => {
    const doc = await House.findOneAndDelete({ osmId });
    if (!doc) throw new ApiError(404, "Uy topilmadi", "NOT_FOUND");
  },
};
