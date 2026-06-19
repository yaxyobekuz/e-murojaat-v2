import mongoose from "mongoose";
import { ORGANIZATION_TYPE_VALUES } from "../modules/murojaat/murojaat.constants.js";

// Government body that receives and answers appeals. Demo data only.
const organizationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    type: { type: String, enum: ORGANIZATION_TYPE_VALUES, required: true },
    region: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

const Organization = mongoose.model("Organization", organizationSchema);

export default Organization;
