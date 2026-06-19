import mongoose from "mongoose";
import {
  SERVICE_TYPE_VALUES,
  REQUEST_STATUS_VALUES,
  REQUEST_STATUSES,
} from "../modules/yer/yer.constants.js";

// One timeline entry per status change (embedded for simplicity).
const requestEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: REQUEST_STATUS_VALUES, required: true },
    comment: { type: String, trim: true, default: "" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const propertyRequestSchema = new mongoose.Schema(
  {
    requestNumber: { type: String, unique: true, required: true, trim: true },
    propertyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Property",
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

propertyRequestSchema.index({ status: 1, serviceType: 1, region: 1 });

const PropertyRequest = mongoose.model(
  "PropertyRequest",
  propertyRequestSchema,
);

export default PropertyRequest;
