import mongoose from "mongoose";

// Mahalla yettiligi a'zosi — kalit = lavozim kodi (role), unikal
const officialSchema = new mongoose.Schema(
  {
    role: { type: String, required: true, unique: true, index: true },
    fullName: { type: String, required: true, trim: true },
    phone: String,
    birthDate: String,
    appointedDate: String,
    education: String,
    receptionDays: String,
    office: String,
    telegram: String,
    notes: String,
  },
  { timestamps: true, versionKey: false },
);

officialSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("Official", officialSchema);
