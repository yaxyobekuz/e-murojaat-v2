import mongoose from "mongoose";
import { PAYMENT_METHOD_VALUES } from "../modules/svet/svet.constants.js";

// A single (mock) payment toward an electric account. Demo data only.
const electricPaymentSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ElectricSubscriber",
      required: true,
      index: true,
    },
    accountNumber: { type: String, trim: true },
    region: { type: String, trim: true },
    amountUzs: { type: Number, required: true, min: 0 },
    method: { type: String, enum: PAYMENT_METHOD_VALUES, required: true },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

electricPaymentSchema.index({ region: 1, paidAt: 1 });

const ElectricPayment = mongoose.model("ElectricPayment", electricPaymentSchema);

export default ElectricPayment;
