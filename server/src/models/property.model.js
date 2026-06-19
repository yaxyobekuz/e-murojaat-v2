import mongoose from "mongoose";
import {
  PROPERTY_TYPE_VALUES,
  OWNERSHIP_TYPE_VALUES,
  PROPERTY_STATUS_VALUES,
  PROPERTY_STATUSES,
} from "../modules/yer/yer.constants.js";

// Real-estate object in the cadastre registry. Demo data only.
const propertySchema = new mongoose.Schema(
  {
    cadastreNumber: { type: String, unique: true, required: true, trim: true },
    type: { type: String, enum: PROPERTY_TYPE_VALUES, required: true },
    region: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    areaM2: { type: Number, required: true, min: 0 },
    valueUzs: { type: Number, required: true, min: 0 },
    ownershipType: { type: String, enum: OWNERSHIP_TYPE_VALUES, required: true },
    ownerJshshir: { type: String, trim: true, index: true },
    status: {
      type: String,
      enum: PROPERTY_STATUS_VALUES,
      default: PROPERTY_STATUSES.REGISTERED,
    },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

propertySchema.index({ region: 1, type: 1, status: 1 });

const Property = mongoose.model("Property", propertySchema);

export default Property;
