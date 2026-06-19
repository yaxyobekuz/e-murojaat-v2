import mongoose from "mongoose";

// Daily gas consumption for a subscriber. Demo data only.
const gasUsageSchema = new mongoose.Schema(
  {
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GasSubscriber",
      required: true,
    },
    date: { type: Date, required: true },
    volumeM3: { type: Number, required: true, min: 0 },
    amountUzs: { type: Number, required: true, min: 0 },
  },
  { timestamps: false },
);

gasUsageSchema.index({ subscriberId: 1, date: 1 });
gasUsageSchema.index({ date: 1 });

const GasUsage = mongoose.model("GasUsage", gasUsageSchema);

export default GasUsage;
