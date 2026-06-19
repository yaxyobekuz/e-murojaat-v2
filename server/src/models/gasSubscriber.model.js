import mongoose from "mongoose";
import {
  SUBSCRIBER_TYPE_VALUES,
  SUBSCRIBER_STATUS_VALUES,
  SUBSCRIBER_STATUSES,
} from "../modules/gaz/gaz.constants.js";

// Gas consumer (citizen or legal entity), identified by account number. Demo data only.
const gasSubscriberSchema = new mongoose.Schema(
  {
    accountNumber: { type: String, unique: true, required: true, trim: true },
    fullName: { type: String, required: true, trim: true },
    type: { type: String, enum: SUBSCRIBER_TYPE_VALUES, required: true },
    region: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    balanceUzs: { type: Number, default: 0 },
    debtUzs: { type: Number, default: 0 },
    meterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GasMeter",
      default: null,
    },
    // JSHSHIR (PINFL) links the subscriber to a citizen account (demo One ID).
    jshshir: { type: String, trim: true, index: true },
    status: {
      type: String,
      enum: SUBSCRIBER_STATUS_VALUES,
      default: SUBSCRIBER_STATUSES.ACTIVE,
    },
  },
  { timestamps: true },
);

gasSubscriberSchema.index({ region: 1, type: 1, status: 1 });

const GasSubscriber = mongoose.model("GasSubscriber", gasSubscriberSchema);

export default GasSubscriber;
