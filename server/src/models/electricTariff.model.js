import mongoose from "mongoose";

// Electric tariff (so'm per kWh). Social price applies within the social norm.
// Demo data only.
const electricTariffSchema = new mongoose.Schema(
  {
    pricePerKwh: { type: Number, required: true, min: 0 },
    socialPricePerKwh: { type: Number, required: true, min: 0 },
    validFrom: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

const ElectricTariff = mongoose.model("ElectricTariff", electricTariffSchema);

export default ElectricTariff;
