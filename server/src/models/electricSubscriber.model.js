import mongoose from "mongoose";
import {
  SUBSCRIBER_TYPE_VALUES,
  SUBSCRIBER_STATUS_VALUES,
  SUBSCRIBER_STATUSES,
  METER_TYPE_VALUES,
  METER_TYPES,
} from "../modules/svet/svet.constants.js";

// Smart electric meter info, embedded in the subscriber. Demo data only.
const meterSchema = new mongoose.Schema(
  {
    serialNumber: { type: String, trim: true },
    type: { type: String, enum: METER_TYPE_VALUES, default: METER_TYPES.SMART },
    installedAt: { type: Date },
    lastCalibration: { type: Date },
    calibrationDue: { type: Date },
  },
  { _id: false },
);

// Electric consumer account (het.uz / HET Billing analogue). Demo data only.
const electricSubscriberSchema = new mongoose.Schema(
  {
    accountNumber: { type: String, unique: true, required: true, trim: true },
    type: { type: String, enum: SUBSCRIBER_TYPE_VALUES, required: true },
    fullName: { type: String, required: true, trim: true },
    region: { type: String, required: true, trim: true },
    district: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    balanceUzs: { type: Number, default: 0 },
    debtUzs: { type: Number, default: 0 },
    // Social norm: cheap-tariff monthly limit (kWh)
    socialNormKwh: { type: Number, default: 200 },
    meter: { type: meterSchema, default: () => ({}) },
    subscriberJshshir: { type: String, trim: true, index: true },
    status: {
      type: String,
      enum: SUBSCRIBER_STATUS_VALUES,
      default: SUBSCRIBER_STATUSES.ACTIVE,
    },
    registeredAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
);

electricSubscriberSchema.index({ region: 1, type: 1, status: 1 });

const ElectricSubscriber = mongoose.model(
  "ElectricSubscriber",
  electricSubscriberSchema,
);

export default ElectricSubscriber;
