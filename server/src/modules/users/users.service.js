import ApiError from "../../utils/ApiError.js";
import User from "../../models/User.js";
import { hash } from "../../utils/password.js";

const countOwners = () => User.countDocuments({ role: "owner" });

export const usersService = {
  list: () => User.find().sort({ createdAt: 1 }),
  create: async ({ username, password, role, fullName }) => {
    const uname = String(username).toLowerCase().trim();
    if (await User.findOne({ username: uname })) throw new ApiError(409, "Bu login band", "USERNAME_TAKEN");
    return User.create({ username: uname, passwordHash: await hash(password), role, fullName });
  },
  update: async (id, { fullName, role, active, password }) => {
    const doc = await User.findById(id).catch(() => null);
    if (!doc) throw new ApiError(404, "Foydalanuvchi topilmadi", "NOT_FOUND");
    // oxirgi owner'ni boshqa rolga o'tkazish yoki o'chirib qo'yishni bloklash
    const losingOwner = doc.role === "owner" && ((role && role !== "owner") || active === false);
    if (losingOwner && (await countOwners()) <= 1)
      throw new ApiError(400, "Oxirgi owner rolini o'zgartirib bo'lmaydi", "LAST_OWNER");
    if (fullName !== undefined) doc.fullName = fullName;
    if (role !== undefined) doc.role = role;
    if (active !== undefined) doc.active = active;
    if (password) doc.passwordHash = await hash(password);
    await doc.save();
    return doc;
  },
  remove: async (id, actorId) => {
    const doc = await User.findById(id).catch(() => null);
    if (!doc) throw new ApiError(404, "Foydalanuvchi topilmadi", "NOT_FOUND");
    if (String(doc._id) === String(actorId)) throw new ApiError(400, "O'zingizni o'chira olmaysiz", "SELF_DELETE");
    if (doc.role === "owner" && (await countOwners()) <= 1)
      throw new ApiError(400, "Oxirgi owner'ni o'chirib bo'lmaydi", "LAST_OWNER");
    await User.findByIdAndDelete(id);
  },
};
