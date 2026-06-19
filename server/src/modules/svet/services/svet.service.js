import ElectricSubscriber from "../../../models/electricSubscriber.model.js";
import ElectricUsage from "../../../models/electricUsage.model.js";
import ElectricPayment from "../../../models/electricPayment.model.js";
import ElectricRequest from "../../../models/electricRequest.model.js";
import ElectricViolation from "../../../models/electricViolation.model.js";
import ElectricTariff from "../../../models/electricTariff.model.js";
import ApiError from "../../../utils/ApiError.js";
import {
  REQUEST_STATUSES,
  REQUEST_STATUS_VALUES,
  TERMINAL_STATUSES,
  PAYMENT_METHODS,
  SUBSCRIBER_STATUSES,
} from "../svet.constants.js";

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
    filter.$or = [
      { accountNumber: rx },
      { fullName: rx },
      { subscriberJshshir: rx },
    ];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    ElectricSubscriber.find(filter)
      .sort({ debtUzs: -1, registeredAt: -1 })
      .skip(skip)
      .limit(limit),
    ElectricSubscriber.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

export const getSubscriber = async (id) => {
  const subscriber = await ElectricSubscriber.findById(id);
  if (!subscriber) throw new ApiError(404, "Abonent topilmadi");
  return subscriber;
};

// Subscriber card: account + recent usage + payments
export const getSubscriberCard = async (id) => {
  const subscriber = await getSubscriber(id);
  const [usage, payments] = await Promise.all([
    ElectricUsage.find({ subscriberId: id }).sort({ date: 1 }),
    ElectricPayment.find({ subscriberId: id }).sort({ paidAt: -1 }).limit(20),
  ]);
  return { subscriber, usage, payments };
};

export const updateSubscriber = async (id, body) => {
  const subscriber = await getSubscriber(id);
  const fields = [
    "fullName",
    "region",
    "district",
    "address",
    "type",
    "socialNormKwh",
    "balanceUzs",
    "debtUzs",
    "status",
  ];
  for (const f of fields) {
    if (body[f] !== undefined) subscriber[f] = body[f];
  }
  await subscriber.save();
  return subscriber;
};

// Public lookup by account number (open service)
export const checkAccount = async (accountNumber) => {
  const subscriber = await ElectricSubscriber.findOne({ accountNumber });
  if (!subscriber) throw new ApiError(404, "Bunday hisob raqami topilmadi");
  return subscriber;
};

// ----- Citizen (own account, by JSHSHIR) -----

export const getSubscriberByJshshir = async (jshshir) => {
  return ElectricSubscriber.findOne({ subscriberJshshir: jshshir });
};

export const getUsageBySubscriber = async (subscriberId) => {
  return ElectricUsage.find({ subscriberId }).sort({ date: 1 });
};

export const getPaymentsBySubscriber = async (subscriberId) => {
  return ElectricPayment.find({ subscriberId }).sort({ paidAt: -1 });
};

// Mock payment: records a payment and reduces debt/refills balance
export const createPayment = async ({ subscriberId, amountUzs, method }) => {
  const subscriber = await getSubscriber(subscriberId);
  const payment = await ElectricPayment.create({
    subscriberId,
    accountNumber: subscriber.accountNumber,
    region: subscriber.region,
    amountUzs,
    method: method || PAYMENT_METHODS.CLICK,
  });

  // Pay off debt first, remainder tops up the balance
  let amount = amountUzs;
  if (subscriber.debtUzs > 0) {
    const paid = Math.min(subscriber.debtUzs, amount);
    subscriber.debtUzs -= paid;
    amount -= paid;
  }
  subscriber.balanceUzs += amount;
  if (subscriber.debtUzs <= 0 && subscriber.status === SUBSCRIBER_STATUSES.DEBTOR) {
    subscriber.status = SUBSCRIBER_STATUSES.ACTIVE;
  }
  await subscriber.save();
  return { payment, subscriber };
};

// ----- Requests -----

const genRequestNumber = async () => {
  const year = new Date().getFullYear();
  const count = await ElectricRequest.countDocuments();
  const seq = String(count + 1).padStart(5, "0");
  return `ELK-${year}-${seq}`;
};

export const listRequests = async ({
  status,
  serviceType,
  region,
  search,
  page = 1,
  limit = 20,
}) => {
  const filter = {};
  if (status) filter.status = status;
  if (serviceType) filter.serviceType = serviceType;
  if (region) filter.region = region;

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
    ElectricRequest.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("subscriberId", "accountNumber fullName region address"),
    ElectricRequest.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

export const getRequest = async (id) => {
  const request = await ElectricRequest.findById(id).populate(
    "subscriberId",
    "accountNumber fullName region address type",
  );
  if (!request) throw new ApiError(404, "Ariza topilmadi");
  return request;
};

export const createRequest = async (body) => {
  const requestNumber = await genRequestNumber();
  const request = await ElectricRequest.create({
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

  if (body.invoiceAmount !== undefined) request.invoiceAmount = body.invoiceAmount;
  if (body.paid !== undefined) request.paid = !!body.paid;
  if (body.operatorNote !== undefined) request.operatorNote = body.operatorNote;

  await request.save();
  return request;
};

export const getRequestsByApplicant = async (jshshir) => {
  return ElectricRequest.find({ applicantJshshir: jshshir })
    .sort({ createdAt: -1 })
    .populate("subscriberId", "accountNumber fullName region");
};

// ----- Violations (e-dalolatnoma) -----

export const listViolations = async ({
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
    filter.$or = [{ actNumber: rx }, { accountNumber: rx }];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    ElectricViolation.find(filter)
      .sort({ date: -1 })
      .skip(skip)
      .limit(limit)
      .populate("subscriberId", "accountNumber fullName region"),
    ElectricViolation.countDocuments(filter),
  ]);
  return { items, total, page, limit };
};

// ----- Tariff -----

export const getCurrentTariff = async () => {
  const tariff = await ElectricTariff.findOne().sort({ validFrom: -1 });
  return tariff;
};
