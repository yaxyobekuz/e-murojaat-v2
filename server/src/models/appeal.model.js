import mongoose from "mongoose";
import {
  APPEAL_TYPE_VALUES,
  CATEGORY_VALUES,
  APPEAL_STATUS_VALUES,
  APPEAL_STATUSES,
  APPEAL_RESULT_VALUES,
} from "../modules/murojaat/murojaat.constants.js";

// One timeline entry per status change (embedded for simplicity).
const appealEventSchema = new mongoose.Schema(
  {
    status: { type: String, enum: APPEAL_STATUS_VALUES, required: true },
    comment: { type: String, trim: true, default: "" },
    byOperator: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

// Official answer(s) sent to the citizen.
const appealReplySchema = new mongoose.Schema(
  {
    body: { type: String, trim: true, required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const appealSchema = new mongoose.Schema(
  {
    appealNumber: { type: String, unique: true, required: true, trim: true },
    type: { type: String, enum: APPEAL_TYPE_VALUES, required: true },
    category: { type: String, enum: CATEGORY_VALUES, required: true },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
      default: null,
    },
    applicantJshshir: { type: String, required: true, trim: true, index: true },
    applicantName: { type: String, trim: true, default: "" },
    region: { type: String, trim: true },
    district: { type: String, trim: true, default: "" },
    subject: { type: String, required: true, trim: true },
    body: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: APPEAL_STATUS_VALUES,
      default: APPEAL_STATUSES.NEW,
    },
    result: { type: String, enum: APPEAL_RESULT_VALUES, default: null },
    deadline: { type: Date, required: true },
    operatorNote: { type: String, trim: true, default: "" },
    events: { type: [appealEventSchema], default: [] },
    replies: { type: [appealReplySchema], default: [] },
  },
  { timestamps: true },
);

appealSchema.index({ status: 1, type: 1, category: 1, region: 1 });

const Appeal = mongoose.model("Appeal", appealSchema);

export default Appeal;
