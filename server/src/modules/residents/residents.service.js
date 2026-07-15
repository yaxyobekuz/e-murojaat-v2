import ApiError from "../../utils/ApiError.js";
import Resident from "../../models/Resident.js";

const notFound = () => new ApiError(404, "Fuqaro topilmadi", "NOT_FOUND");

// houseOsmId "" -> null (biriktirilmagan holat izchil bo'lsin)
const normalizeHouse = (data) => (data.houseOsmId === "" ? { ...data, houseOsmId: null } : data);

// bitta uyda faqat bitta "uy egasi" bo'ladi — qolganlarni a'zoga tushiradi
const enforceSingleOwner = async (doc) => {
  if (doc.householdRole === "owner" && doc.houseOsmId) {
    await Resident.updateMany(
      { houseOsmId: doc.houseOsmId, householdRole: "owner", _id: { $ne: doc._id } },
      { $set: { householdRole: "member" } },
    );
  }
};

export const residentsService = {
  list: (filter = {}) => Resident.find(filter).sort({ createdAt: -1 }),
  getById: async (id) => {
    const doc = await Resident.findById(id).catch(() => null);
    if (!doc) throw notFound();
    return doc;
  },
  create: async (data) => {
    const doc = await Resident.create(normalizeHouse(data));
    await enforceSingleOwner(doc);
    return doc;
  },
  update: async (id, data) => {
    const doc = await Resident.findByIdAndUpdate(id, normalizeHouse(data), { new: true, runValidators: true }).catch(() => null);
    if (!doc) throw notFound();
    await enforceSingleOwner(doc);
    return doc;
  },
  remove: async (id) => {
    const doc = await Resident.findByIdAndDelete(id).catch(() => null);
    if (!doc) throw notFound();
  },
};
