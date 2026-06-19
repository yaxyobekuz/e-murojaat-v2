import mongoose from "mongoose";

export const PAYMENT_METHODS = ["click", "payme", "uzum", "bank"];

// To'lov yozuvi (bitta hisob-kitob uchun bir yoki bir necha to'lov bo'lishi mumkin).
const taxPaymentSchema = new mongoose.Schema(
  {
    taxpayer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Taxpayer",
      required: true,
      index: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaxAssessment",
      required: true,
      index: true,
    },
    amount_uzs: { type: Number, required: true },
    method: { type: String, enum: PAYMENT_METHODS, default: "click" },
    paidAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true },
);

taxPaymentSchema.index({ paidAt: -1 });

taxPaymentSchema.set("toJSON", {
  transform: (_doc, ret) => {
    delete ret.__v;
    return ret;
  },
});

const TaxPayment = mongoose.model("TaxPayment", taxPaymentSchema);

export default TaxPayment;
