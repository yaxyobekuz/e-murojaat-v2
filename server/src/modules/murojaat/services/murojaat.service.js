import Appeal from "../../../models/appeal.model.js";
import Organization from "../../../models/organization.model.js";
import ApiError from "../../../utils/ApiError.js";
import * as sms from "./sms.provider.js";
import {
  APPEAL_STATUSES,
  APPEAL_STATUS_VALUES,
  APPEAL_RESULT_VALUES,
  OPEN_STATUSES,
  TERMINAL_STATUSES,
  DEADLINE_DAYS,
} from "../murojaat.constants.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const genAppealNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Appeal.countDocuments();
  const seq = String(count + 1).padStart(7, "0");
  return `M-${year}-${seq}`;
};

// ----- Organizations -----

export const listOrganizations = async () => {
  return Organization.find().sort({ name: 1 });
};

export const createOrganization = async (body) => {
  const exists = await Organization.findOne({ name: body.name });
  if (exists) throw new ApiError(409, "Bunday tashkilot allaqachon mavjud");
  return Organization.create(body);
};

// ----- Appeals (admin) -----

export const listAppeals = async ({
  type,
  category,
  status,
  region,
  organizationId,
  overdue,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = {};
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (status) filter.status = status;
  if (region) filter.region = region;
  if (organizationId) filter.organizationId = organizationId;

  // Overdue = deadline passed and still in the operator's queue
  if (overdue === true || overdue === "true") {
    filter.deadline = { $lt: new Date() };
    filter.status = { $in: OPEN_STATUSES };
  }

  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [
      { appealNumber: rx },
      { subject: rx },
      { applicantName: rx },
      { applicantJshshir: rx },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Appeal.find(filter)
      .sort({ deadline: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("organizationId", "name type"),
    Appeal.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

export const getAppeal = async (id) => {
  const appeal = await Appeal.findById(id).populate(
    "organizationId",
    "name type region",
  );
  if (!appeal) throw new ApiError(404, "Murojaat topilmadi");
  return appeal;
};

export const createAppeal = async (body) => {
  const appealNumber = await genAppealNumber();
  const deadline = new Date(Date.now() + DEADLINE_DAYS * 86400000);
  const appeal = await Appeal.create({
    appealNumber,
    type: body.type,
    category: body.category,
    organizationId: body.organizationId || null,
    applicantJshshir: body.applicantJshshir,
    applicantName: body.applicantName || "",
    region: body.region || "",
    district: body.district || "",
    subject: body.subject,
    body: body.body,
    status: APPEAL_STATUSES.NEW,
    deadline,
    events: [
      {
        status: APPEAL_STATUSES.NEW,
        comment: "Murojaat qabul qilindi",
        byOperator: false,
      },
    ],
  });

  // demo: SMS confirmation with the tracking number
  if (body.applicantPhone) {
    await sms.sendSms(
      body.applicantPhone,
      `Murojaatingiz qabul qilindi. Raqam: ${appealNumber}`,
    );
  }
  return appeal;
};

// Operator action: change status, forward, reply, set result, internal note
export const updateAppeal = async (id, body) => {
  const appeal = await getAppeal(id);
  if (TERMINAL_STATUSES.includes(appeal.status)) {
    throw new ApiError(409, "Murojaat yopilgan, o'zgartirib bo'lmaydi");
  }

  if (body.organizationId !== undefined) {
    appeal.organizationId = body.organizationId || null;
  }

  // An official reply automatically moves the appeal to "answered"
  if (body.reply && body.reply.trim()) {
    appeal.replies.push({ body: body.reply.trim() });
    if (!body.status) {
      appeal.status = APPEAL_STATUSES.ANSWERED;
      appeal.events.push({
        status: APPEAL_STATUSES.ANSWERED,
        comment: "Rasmiy javob yuborildi",
      });
    }
  }

  if (body.status !== undefined) {
    if (!APPEAL_STATUS_VALUES.includes(body.status)) {
      throw new ApiError(400, "Holat noto'g'ri");
    }
    // Closing an appeal requires an outcome
    if (body.status === APPEAL_STATUSES.CLOSED && !body.result && !appeal.result) {
      throw new ApiError(400, "Murojaatni yopish uchun natija belgilang");
    }
    appeal.status = body.status;
    appeal.events.push({ status: body.status, comment: body.comment || "" });
  }

  if (body.result !== undefined) {
    if (body.result && !APPEAL_RESULT_VALUES.includes(body.result)) {
      throw new ApiError(400, "Natija noto'g'ri");
    }
    appeal.result = body.result || null;
  }

  if (body.operatorNote !== undefined) appeal.operatorNote = body.operatorNote;

  await appeal.save();
  return appeal;
};

// ----- Citizen (own data) -----

export const getAppealsByApplicant = async (jshshir) => {
  return Appeal.find({ applicantJshshir: jshshir })
    .sort({ createdAt: -1 })
    .populate("organizationId", "name type");
};

// Public lookup by tracking number (no login required)
export const trackByNumber = async (appealNumber) => {
  const appeal = await Appeal.findOne({
    appealNumber: appealNumber.trim().toUpperCase(),
  })
    .select(
      "appealNumber type category subject status result deadline createdAt events replies region",
    )
    .populate("organizationId", "name type");
  if (!appeal) throw new ApiError(404, "Bunday raqamli murojaat topilmadi");
  return appeal;
};
