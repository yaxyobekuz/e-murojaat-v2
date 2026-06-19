import mongoose from "mongoose";
import {
  SERVICE_TYPE_VALUES,
  REQUEST_STATUS_VALUES,
  REQUEST_STATUSES,
} from "../modules/svet/svet.constants.js";

// One timeline entry per status change (embedded for simplicity).
const requestEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: REQUEST_STATUS_VALUES, required: true },
    comment: { type: String, trim: true, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const electricRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, unique: true, required: true, trim: true },
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ElectricSubscriber",
      default: null,
    },
    serviceType: { type: String, enum: SERVICE_TYPE_VALUES, required: true },
    applicantJshshir: { type: String, required: true, trim: true, index: true },
    applicantName: { type: String, trim: true, default: "" },
    region: { type: String, trim: true },
    status: {
      type: String,
      enum: REQUEST_STATUS_VALUES,
      default: REQUEST_STATUSES.NEW,
    },
    invoiceAmount: { type: Number, default: null },
    paid: { type: Boolean, default: false },
    operatorNote: { type: String, trim: true, default: "" },
    events: { type: [requestEventSchema], default: [] },
  },
  { timestamps: true },
);

electricRequestSchema.index({ status: 1, serviceType: 1, region: 1 });

const ElectricRequest = mongoose.model("ElectricRequest", electricRequestSchema);

export default ElectricRequest;
