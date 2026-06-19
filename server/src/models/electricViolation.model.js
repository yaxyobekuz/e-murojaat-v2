import mongoose from "mongoose";
import {
  VIOLATION_TYPE_VALUES,
  VIOLATION_STATUS_VALUES,
  VIOLATION_STATUSES,
} from "../modules/svet/svet.constants.js";

// E-dalolatnoma — electric usage violation act (theft, bypass, illegal connection).
// Demo data only.
const electricViolationSchema = new mongoose.Schema(
  {
    actNumber: { type: String, unique: true, required: true, trim: true },
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ElectricSubscriber",
      default: null,
    },
    accountNumber: { type: String, trim: true },
    region: { type: String, trim: true },
    type: { type: String, enum: VIOLATION_TYPE_VALUES, required: true },
    date: { type: Date, default: Date.now },
    fineUzs: { type: Number, default: 0 },
    status: {
      type: String,
      enum: VIOLATION_STATUS_VALUES,
      default: VIOLATION_STATUSES.NEW,
    },
    note: { type: String, trim: true, default: "" },
  },
  { timestamps: true },
);

electricViolationSchema.index({ region: 1, type: 1, status: 1 });

const ElectricViolation = mongoose.model(
  "ElectricViolation",
  electricViolationSchema,
);

export default ElectricViolation;
