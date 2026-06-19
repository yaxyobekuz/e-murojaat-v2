import mongoose from "mongoose";

// Monthly electric consumption per subscriber. `withinNorm`/`overNorm` split
// supports the "social norm vs over-norm" analytics. Demo data only.
const electricUsageSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ElectricSubscriber",
      required: true,
      index: true,
    },
    accountNumber: { type: String, trim: true },
    region: { type: String, trim: true },
    date: { type: Date, required: true },
    usageKwh: { type: Number, required: true, min: 0 },
    withinNormKwh: { type: Number, default: 0 },
    overNormKwh: { type: Number, default: 0 },
    amountUzs: { type: Number, default: 0 },
  },
  { timestamps: true },
);

electricUsageSchema.index({ subscriberId: 1, date: 1 });
electricUsageSchema.index({ region: 1, date: 1 });

const ElectricUsage = mongoose.model("ElectricUsage", electricUsageSchema);

export default ElectricUsage;
