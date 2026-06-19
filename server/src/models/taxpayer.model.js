import mongoose from "mongoose";

// Soliq to'lovchi (jismoniy shaxs / YaTT / yuridik shaxs).
const taxpayerSchema = new mongoose.Schema(
  {
    stir: { type: String, required: true, unique: true, trim: true }, // 9 raqam
    jshshir: { type: String, trim: true, index: true }, // 14 raqam (modullarni bog'lash kaliti)
    type: {
      type: String,
      enum: ["jismoniy", "yatt", "yuridik"],
      required: true,
      default: "jismoniy",
    },
    fullName: { type: String, trim: true, required: true }, // ism yoki tashkilot nomi
    region: { type: String, required: true, index: true },
    district: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    isDemo: { type: Boolean, default: false }, // "One ID" demo fuqaro
    status: { type: String, enum: ["aktiv", "nofaol"], default: "aktiv" },
  },
  { timestamps: true },
);

taxpayerSchema.index({ region: 1, type: 1 });

taxpayerSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const Taxpayer = mongoose.model("Taxpayer", taxpayerSchema);

export default Taxpayer;
