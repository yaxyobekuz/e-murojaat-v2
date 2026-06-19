import mongoose from "mongoose";

// Citizen who owns property; identified by JSHSHIR (PINFL). Demo data only.
const propertyOwnerSchema = new mongoose.Schema(
  {
    jshshir: { type: String, unique: true, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    region: { type: String, trim: true },
  },
  { timestamps: true },
);

const PropertyOwner = mongoose.model("PropertyOwner", propertyOwnerSchema);

export default PropertyOwner;
