import GasSubscriber from "../../../models/gasSubscriber.model.js";
import GasRequest from "../../../models/gasRequest.model.js";
import GasUsage from "../../../models/gasUsage.model.js";
import GasPayment from "../../../models/gasPayment.model.js";
import GasTariff from "../../../models/gasTariff.model.js";
import ApiError from "../../../utils/ApiError.js";
import * as billing from "./billing.provider.js";
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_VALUES,
  TERMINAL_STATUSES,
  SUBSCRIBER_STATUSES,
} from "../gaz.constants.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ----- Subscribers -----

export const listSubscribers = async ({
  region,
  type,
  status,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = {};
  if (region) filter.region = region;
  if (type) filter.type = type;
  if (status) filter.status = status;

  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ accountNumber: rx }, { fullName: rx }, { jshshir: rx }];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    GasSubscriber.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("meterId", "serialNumber type"),
    GasSubscriber.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

export const getSubscriber = async (id) => {
  const subscriber = await GasSubscriber.findById(id).populate("meterId");
  if (!subscriber) throw new ApiError(404, "Abonent topilmadi");

  const [usage, payments] = await Promise.all([
    GasUsage.find({ subscriberId: id }).sort({ date: -1 }).limit(30),
    GasPayment.find({ subscriberId: id }).sort({ paidAt: -1 }).limit(10),
  ]);
  return { subscriber, usage, payments };
};

// Debtor subscribers (debt > 0), highest debt first
export const listDebtors = async ({ region, page = 1, limit = 20 }) => {
  const filter = { debtUzs: { $gt: 0 } };
  if (region) filter.region = region;

  const skip = (page - 1) * limit;
  const [items, total, totalDebtAgg] = await Promise.all([
    GasSubscriber.find(filter).sort({ debtUzs: -1 }).skip(skip).limit(limit),
    GasSubscriber.countDocuments(filter),
    GasSubscriber.aggregate([
      { $match: filter },
      { $group: { _id: null, sum: { $sum: "$debtUzs" } } },
    ]),
  ]);
  return { items, total, page, limit, totalDebt: totalDebtAgg[0]?.sum || 0 };
};

// Public registry lookup by account number (open service)
export const checkRegistry = async (accountNumber) => {
  const subscriber = await billing.getByAccountNumber(accountNumber);
  if (!subscriber) throw new ApiError(404, "Abonent topilmadi");
  return subscriber;
};

// ----- Citizen account (demo One ID) -----

export const getAccountByJshshir = async (jshshir) => {
  const subscriber = await GasSubscriber.findOne({ jshshir }).populate(
    "meterId",
  );
  if (!subscriber) throw new ApiError(404, "Sizga biriktirilgan abonent topilmadi");
  const tariff = await getCurrentTariff();
  return { subscriber, tariff };
};

// Monthly usage series (last 12 months) for a subscriber
export const getMonthlyUsageBySubscriber = async (subscriberId) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const rows = await GasUsage.aggregate([
    { $match: { subscriberId, date: { $gte: start } } },
    {
      $group: {
        _id: { y: { $year: "$date" }, m: { $month: "$date" } },
        volumeM3: { $sum: "$volumeM3" },
        amountUzs: { $sum: "$amountUzs" },
      },
    },
  ]);
  const map = new Map(
    rows.map((r) => [`${r._id.y}-${r._id.m}`, r]),
  );
  const result = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const month = `${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
    const row = map.get(key);
    result.push({
      month,
      value: Math.round(row?.volumeM3 || 0),
      amountUzs: Math.round(row?.amountUzs || 0),
    });
  }
  return result;
};

export const getPaymentsBySubscriber = async (subscriberId) => {
  return GasPayment.find({ subscriberId }).sort({ paidAt: -1 }).limit(50);
};

// Admin: all payments (optionally by method), newest first
export const listPayments = async ({ method, page = 1, limit = 20 }) => {
  const filter = {};
  if (method) filter.method = method;

  const skip = (page - 1) * limit;
  const [items, total, totalAgg] = await Promise.all([
    GasPayment.find(filter)
      .sort({ paidAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("subscriberId", "accountNumber fullName region"),
    GasPayment.countDocuments(filter),
    GasPayment.aggregate([
      { $match: filter },
      { $group: { _id: null, sum: { $sum: "$amountUzs" } } },
    ]),
  ]);
  return { items, total, page, limit, totalAmount: totalAgg[0]?.sum || 0 };
};

// Mock payment: reduces debt, then tops up balance with the remainder
export const createPayment = async (subscriberId, { amount, method }) => {
  const subscriber = await GasSubscriber.findById(subscriberId);
  if (!subscriber) throw new ApiError(404, "Abonent topilmadi");
  if (!amount || amount <= 0) throw new ApiError(400, "To'lov summasi noto'g'ri");

  const payment = await GasPayment.create({
    subscriberId,
    amountUzs: amount,
    method,
    paidAt: new Date(),
  });

  const payOffDebt = Math.min(subscriber.debtUzs, amount);
  subscriber.debtUzs -= payOffDebt;
  subscriber.balanceUzs += amount - payOffDebt;
  if (subscriber.debtUzs <= 0 && subscriber.status === SUBSCRIBER_STATUSES.DEBTOR) {
    subscriber.status = SUBSCRIBER_STATUSES.ACTIVE;
  }
  await subscriber.save();

  return { payment, subscriber };
};

// ----- Requests -----

const genRequestNumber = async () => {
  const year = new Date().getFullYear();
  const count = await GasRequest.countDocuments();
  const seq = String(count + 1).padStart(5, "0");
  return `GAZ-${year}-${seq}`;
};

export const listRequests = async ({
  status,
  serviceType,
  region,
  applicantJshshir,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = {};
  if (status) filter.status = status;
  if (serviceType) filter.serviceType = serviceType;
  if (region) filter.region = region;
  if (applicantJshshir) filter.applicantJshshir = applicantJshshir;

  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [
      { requestNumber: rx },
      { applicantJshshir: rx },
      { applicantName: rx },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    GasRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("subscriberId", "accountNumber fullName region address"),
    GasRequest.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

export const getRequest = async (id) => {
  const request = await GasRequest.findById(id).populate(
    "subscriberId",
    "accountNumber fullName region address type",
  );
  if (!request) throw new ApiError(404, "Ariza topilmadi");
  return request;
};

export const createRequest = async (body) => {
  const requestNumber = await genRequestNumber();
  const request = await GasRequest.create({
    requestNumber,
    subscriberId: body.subscriberId || null,
    serviceType: body.serviceType,
    applicantJshshir: body.applicantJshshir,
    applicantName: body.applicantName || "",
    region: body.region || "",
    status: REQUEST_STATUSES.NEW,
    events: [{ status: REQUEST_STATUSES.NEW, comment: "Ariza qabul qilindi" }],
  });
  return request;
};

export const updateRequestStatus = async (id, body) => {
  const request = await getRequest(id);
  if (TERMINAL_STATUSES.includes(request.status)) {
    throw new ApiError(409, "Ariza yakunlangan, holatni o'zgartirib bo'lmaydi");
  }

  if (body.status !== undefined) {
    if (!REQUEST_STATUS_VALUES.includes(body.status)) {
      throw new ApiError(400, "Holat noto'g'ri");
    }
    request.status = body.status;
    request.events.push({ status: body.status, comment: body.comment || "" });
  }

  if (body.operatorNote !== undefined) request.operatorNote = body.operatorNote;

  await request.save();
  return request;
};

export const getRequestsByApplicant = async (jshshir) => {
  return GasRequest.find({ applicantJshshir: jshshir })
    .sort({ createdAt: -1 })
    .populate("subscriberId", "accountNumber fullName region");
};

// ----- Tariff -----

export const getCurrentTariff = async () => {
  const tariff = await GasTariff.findOne().sort({ validFrom: -1 });
  return tariff;
};
