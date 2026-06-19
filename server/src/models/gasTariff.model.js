import mongoose from "mongoose";

// Gas price per m³ (history kept by validFrom). Demo data only.
const gasTariffSchema = new mongoose.Schema(
  {
    pricePerM3: { type: Number, required: true, min: 0 },
    validFrom: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const GasTariff = mongoose.model("GasTariff", gasTariffSchema);

export default GasTariff;
