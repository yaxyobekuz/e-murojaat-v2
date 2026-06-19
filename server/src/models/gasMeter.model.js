import mongoose from "mongoose";
import { METER_TYPE_VALUES, METER_TYPES } from "../modules/gaz/gaz.constants.js";

// Gas meter assigned to a subscriber. Demo data only.
const gasMeterSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, unique: true, required: true, trim: true },
    type: { type: String, enum: METER_TYPE_VALUES, default: METER_TYPES.SMART },
    installedAt: { type: Date, default: Date.now },
    lastCalibration: { type: Date, default: Date.now },
    calibrationDue: { type: Date },
  },
  { timestamps: true },
);

const GasMeter = mongoose.model("GasMeter", gasMeterSchema);

export default GasMeter;
