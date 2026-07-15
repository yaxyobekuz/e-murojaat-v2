import mongoose from "mongoose";

// Aholi (fuqaro) — barcha maydonlar (residents.validators.js bilan mos)
const residentSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    jshshir: String,
    birthDate: String,
    gender: String,
    nationality: String,
    phone: String,
    passportSeries: String,
    address: String,
    registrationType: String,
    maritalStatus: String,
    education: String,
    employment: String,
    workplace: String,
    position: String,
    monthlyIncome: Number,
    disability: String,
    militaryStatus: String,
    pensioner: Boolean,
    ironNotebook: Boolean,
    womenNotebook: Boolean,
    youthNotebook: Boolean,
    notes: String,
    // uyga bog'lanish — qaysi bino (OSM id) va xonadondagi roli
    houseOsmId: { type: String, default: null, index: true },
    householdRole: { type: String, enum: ["owner", "member"], default: "member" },
  },
  { timestamps: true, versionKey: false },
);

residentSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret._id;
    return ret;
  },
});

export default mongoose.model("Resident", residentSchema);
