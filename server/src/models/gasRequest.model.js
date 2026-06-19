import mongoose from "mongoose";
import {
  SERVICE_TYPE_VALUES,
  REQUEST_STATUS_VALUES,
  REQUEST_STATUSES,
} from "../modules/gaz/gaz.constants.js";

// One timeline entry per status change (embedded for simplicity).
const requestEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: REQUEST_STATUS_VALUES, required: true },
    comment: { type: String, trim: true, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const gasRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, unique: true, required: true, trim: true },
    subscriberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "GasSubscriber",
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
    operatorNote: { type: String, trim: true, default: "" },
    events: { type: [requestEventSchema], default: [] },
  },
  { timestamps: true },
);

gasRequestSchema.index({ status: 1, serviceType: 1, region: 1 });

const GasRequest = mongoose.model("GasRequest", gasRequestSchema);

export default GasRequest;
