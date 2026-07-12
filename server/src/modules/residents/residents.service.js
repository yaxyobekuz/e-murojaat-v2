import ApiError from "../../utils/ApiError.js";
import Resident from "../../models/Resident.js";

const notFound = () => new ApiError(404, "Fuqaro topilmadi", "NOT_FOUND");

export const residentsService = {
  list: () => Resident.find().sort({ createdAt: -1 }),
  getById: async (id) => {
    const doc = await Resident.findById(id).catch(() => null);
    if (!doc) throw notFound();
    return doc;
  },
  create: (data) => Resident.create(data),
  update: async (id, data) => {
    const doc = await Resident.findByIdAndUpdate(id, data, { new: true, runValidators: true }).catch(() => null);
    if (!doc) throw notFound();
    return doc;
  },
  remove: async (id) => {
    const doc = await Resident.findByIdAndDelete(id).catch(() => null);
    if (!doc) throw notFound();
  },
};
