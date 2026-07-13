import mongoose from "mongoose";

import { DOMAINS } from "../modules/mahalla/mahalla.constants.js";

// Mahalla dashboard ko'rsatkichlari — har domen uchun bitta hujjat. data = erkin blob
// (frontend kutgan shaklda), patchda to'liq almashtiriladi (markModified kerak emas).
const mahallaIndicatorSchema = new mongoose.Schema(
  {
    domain: { type: String, required: true, unique: true, index: true, enum: DOMAINS },
    data: { type: Object, default: {} },
    updatedByRole: String,
  },
  { timestamps: true, versionKey: false, minimize: false },
);

mahallaIndicatorSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("MahallaIndicator", mahallaIndicatorSchema);
