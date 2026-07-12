import mongoose from "mongoose";

// Xonadon — kalit = OSM bino id. Maydonlar ko'p (houses.validators.js) bo'lgani uchun
// strict:false — validatsiyadan o'tgan (zod) barcha maydonlar saqlanadi.
const houseSchema = new mongoose.Schema(
  { osmId: { type: String, required: true, unique: true, index: true } },
  { timestamps: true, versionKey: false, strict: false, minimize: false },
);

houseSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("House", houseSchema);
