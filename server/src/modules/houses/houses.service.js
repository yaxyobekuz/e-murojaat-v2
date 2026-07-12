import ApiError from "../../utils/ApiError.js";
import House from "../../models/House.js";

export const housesService = {
  list: () => House.find(),
  // topilmasa null qaytadi — frontend "kiritilmagan" holatini o'zi ko'rsatadi
  getByOsmId: (osmId) => House.findOne({ osmId }),
  upsert: (osmId, data) =>
    House.findOneAndUpdate(
      { osmId },
      { $set: { ...data, osmId } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    ),
  remove: async (osmId) => {
    const doc = await House.findOneAndDelete({ osmId });
    if (!doc) throw new ApiError(404, "Uy topilmadi", "NOT_FOUND");
  },
};
