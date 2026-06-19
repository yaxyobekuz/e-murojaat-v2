import mongoose from "mongoose";
import {
  PAYMENT_METHOD_VALUES,
  PAYMENT_METHODS,
} from "../modules/gaz/gaz.constants.js";

// A balance top-up / bill payment by a subscriber. Demo data only.
const gasPaymentSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GasSubscriber",
      required: true,
    },
    amountUzs: { type: Number, required: true, min: 0 },
    method: {
      type: String,
      enum: PAYMENT_METHOD_VALUES,
      default: PAYMENT_METHODS.CLICK,
    },
    paidAt: { type: Date, default: Date.now },
  },
  { timestamps: false },
);

gasPaymentSchema.index({ subscriberId: 1, paidAt: -1 });
gasPaymentSchema.index({ paidAt: 1 });

const GasPayment = mongoose.model("GasPayment", gasPaymentSchema);

export default GasPayment;
