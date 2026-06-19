import mongoose from "mongoose";

export const TAX_TYPES = ["mol_mulk", "yer", "daromad", "aylanma"];
export const ASSESSMENT_STATUSES = ["hisoblandi", "qisman", "tolandi", "qarzdor"];

// Soliq hisob-kitobi (bitta to'lovchining bitta yildagi bitta soliq turi).
const taxAssessmentSchema = new mongoose.Schema(
  {
    taxpayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Taxpayer",
      required: true,
      index: true,
    },
    region: { type: String, required: true, index: true }, // tez analitika uchun denormalizatsiya
    taxType: { type: String, enum: TAX_TYPES, required: true, index: true },
    baseValue_uzs: { type: Number, default: 0 }, // kadastr qiymati / daromad
    rate: { type: Number, default: 0 }, // stavka (0.34 = 0.34%)
    amount_uzs: { type: Number, required: true, default: 0 }, // hisoblangan soliq
    paidAmount_uzs: { type: Number, default: 0 },
    penya_uzs: { type: Number, default: 0 }, // kechikkanlik jarimasi
    year: { type: Number, required: true, index: true },
    dueDate: { type: Date, required: true },
    status: {
      type: String,
      enum: ASSESSMENT_STATUSES,
      default: "hisoblandi",
      index: true,
    },
  },
  { timestamps: true },
);

taxAssessmentSchema.index({ region: 1, taxType: 1 });
taxAssessmentSchema.index({ status: 1, dueDate: 1 });

// Qarz = hisoblangan - to'langan (penyani qo'shib).
taxAssessmentSchema.virtual("debt_uzs").get(function () {
  return Math.max(0, this.amount_uzs + this.penya_uzs - this.paidAmount_uzs);
});

taxAssessmentSchema.set("toJSON", {
  virtuals: true,
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const TaxAssessment = mongoose.model("TaxAssessment", taxAssessmentSchema);

export default TaxAssessment;
