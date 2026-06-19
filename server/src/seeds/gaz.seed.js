import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import GasSubscriber from "../models/gasSubscriber.model.js";
import GasMeter from "../models/gasMeter.model.js";
import GasUsage from "../models/gasUsage.model.js";
import GasPayment from "../models/gasPayment.model.js";
import GasRequest from "../models/gasRequest.model.js";
import GasTariff from "../models/gasTariff.model.js";
import User from "../models/user.model.js";
import logger from "../config/logger.js";
import {
  REGIONS,
  randInt,
  pick,
  randomFullName,
  randomJshshir,
  randomPastDate,
} from "../helpers/demo.helper.js";
import {
  SUBSCRIBER_TYPES,
  SUBSCRIBER_STATUSES,
  METER_TYPES,
  PAYMENT_METHOD_VALUES,
  SERVICE_TYPE_VALUES,
  REQUEST_STATUSES,
} from "../modules/gaz/gaz.constants.js";

const SUBSCRIBER_COUNT = 400;
const PAYMENT_COUNT = 1500;
const REQUEST_COUNT = 150;
const PRICE_PER_M3 = 1380; // so'm/m³ (demo tarif)

// Fixed JSHSHIR for the demo "One ID" citizen (shared with the owner user)
const DEMO_JSHSHIR = "30101990010011";
const DEMO_ACCOUNT = "9000000007";

const ORG_NAMES = [
  "Oqtepa MChJ", "Baraka Savdo MChJ", "Yangi Hayot QK", "Mehnat Non MChJ",
  "Ziyo Ta'lim MChJ", "Shifo Med MChJ", "Quyosh Tekstil MChJ", "Dehqon Bozori MChJ",
];

// Higher gas consumption in winter, lower in summer (month index 0..11)
const SEASON = [1.6, 1.5, 1.2, 0.8, 0.5, 0.35, 0.3, 0.3, 0.45, 0.8, 1.2, 1.5];

const accountNumber = (i) => String(1_000_000_000 + i);
const meterSerial = (i) => `EGHU-${String(100000 + i)}`;

// Daily usage rows for a subscriber across the last 365 days
const buildUsageForSubscriber = (subscriberId, baseDaily) => {
  const rows = [];
  const today = new Date();
  for (let d = 364; d >= 0; d--) {
    const date = new Date(today.getTime() - d * 86400000);
    const mult = SEASON[date.getMonth()];
    const noise = 0.85 + Math.random() * 0.3;
    const volumeM3 = Math.round(baseDaily * mult * noise * 10) / 10;
    rows.push({
      subscriberId,
      date,
      volumeM3,
      amountUzs: Math.round(volumeM3 * PRICE_PER_M3),
    });
  }
  return rows;
};

// Build a realistic request timeline up to `finalStatus`
const buildEvents = (createdAt, finalStatus) => {
  const chain = [
    REQUEST_STATUSES.NEW,
    REQUEST_STATUSES.REVIEW,
    REQUEST_STATUSES.ASSIGNED,
    REQUEST_STATUSES.DONE,
  ];
  const comments = {
    [REQUEST_STATUSES.NEW]: "Ariza qabul qilindi",
    [REQUEST_STATUSES.REVIEW]: "Ariza ko'rib chiqilmoqda",
    [REQUEST_STATUSES.ASSIGNED]: "Brigada/usta biriktirildi",
    [REQUEST_STATUSES.DONE]: "Xizmat ko'rsatildi",
    [REQUEST_STATUSES.REJECTED]: "Ariza rad etildi",
  };

  let t = new Date(createdAt).getTime();
  const step = () => {
    t += randInt(1, 5) * 86400000;
    return new Date(t);
  };

  const events = [];
  if (finalStatus === REQUEST_STATUSES.REJECTED) {
    events.push({ status: REQUEST_STATUSES.NEW, comment: comments[REQUEST_STATUSES.NEW], createdAt: new Date(t) });
    events.push({ status: REQUEST_STATUSES.REVIEW, comment: comments[REQUEST_STATUSES.REVIEW], createdAt: step() });
    events.push({ status: REQUEST_STATUSES.REJECTED, comment: comments[REQUEST_STATUSES.REJECTED], createdAt: step() });
    return events;
  }

  const stopIndex = chain.indexOf(finalStatus);
  for (let i = 0; i <= stopIndex; i++) {
    events.push({
      status: chain[i],
      comment: comments[chain[i]],
      createdAt: i === 0 ? new Date(t) : step(),
    });
  }
  return events;
};

const insertInChunks = async (Model, docs, size = 5000) => {
  for (let i = 0; i < docs.length; i += size) {
    await Model.insertMany(docs.slice(i, i + size));
  }
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    GasSubscriber.deleteMany({}),
    GasMeter.deleteMany({}),
    GasUsage.deleteMany({}),
    GasPayment.deleteMany({}),
    GasRequest.deleteMany({}),
    GasTariff.deleteMany({}),
  ]);
  logger.info("Eski gaz ma'lumotlari tozalandi");

  await GasTariff.create({ pricePerM3: PRICE_PER_M3, validFrom: new Date(new Date().getFullYear(), 0, 1) });

  // ----- Meters (one per subscriber, + demo) -----
  const meterDocs = [];
  for (let i = 0; i < SUBSCRIBER_COUNT + 1; i++) {
    const installedAt = randomPastDate(96);
    const lastCalibration = randomPastDate(36);
    meterDocs.push({
      serialNumber: meterSerial(i),
      type: Math.random() < 0.7 ? METER_TYPES.SMART : METER_TYPES.REGULAR,
      installedAt,
      lastCalibration,
      calibrationDue: new Date(lastCalibration.getTime() + 5 * 365 * 86400000),
    });
  }
  const meters = await GasMeter.insertMany(meterDocs);
  logger.info(`${meters.length} ta hisoblagich yaratildi`);

  // ----- Subscribers (+ demo One ID subscriber) -----
  const subscriberDocs = [];
  for (let i = 0; i < SUBSCRIBER_COUNT; i++) {
    const region = pick(REGIONS);
    const isLegal = Math.random() < 0.15;
    const debt = Math.random() < 0.25 ? randInt(80, 1500) * 1000 : 0;
    let status = SUBSCRIBER_STATUSES.ACTIVE;
    if (debt > 0) status = Math.random() < 0.2 ? SUBSCRIBER_STATUSES.CUTOFF : SUBSCRIBER_STATUSES.DEBTOR;
    subscriberDocs.push({
      accountNumber: accountNumber(i),
      fullName: isLegal ? pick(ORG_NAMES) : randomFullName(),
      type: isLegal ? SUBSCRIBER_TYPES.LEGAL : SUBSCRIBER_TYPES.INDIVIDUAL,
      region: region.name,
      district: pick(region.districts),
      address: `${pick(region.districts)} tumani, ${randInt(1, 120)}-uy`,
      balanceUzs: debt > 0 ? 0 : randInt(0, 300) * 1000,
      debtUzs: debt,
      meterId: meters[i]._id,
      jshshir: randomJshshir(),
      status,
    });
  }

  // Demo One ID subscriber
  const demoRegion = REGIONS[0];
  subscriberDocs.push({
    accountNumber: DEMO_ACCOUNT,
    fullName: "Karimov Akmal",
    type: SUBSCRIBER_TYPES.INDIVIDUAL,
    region: demoRegion.name,
    district: pick(demoRegion.districts),
    address: `${pick(demoRegion.districts)} tumani, 14-uy`,
    balanceUzs: 0,
    debtUzs: 420000,
    meterId: meters[SUBSCRIBER_COUNT]._id,
    jshshir: DEMO_JSHSHIR,
    status: SUBSCRIBER_STATUSES.DEBTOR,
  });

  const subscribers = await GasSubscriber.insertMany(subscriberDocs);
  logger.info(`${subscribers.length} ta abonent yaratildi`);

  // ----- Daily usage (365 days, seasonal) -----
  let usageTotal = 0;
  let usageBuffer = [];
  for (const sub of subscribers) {
    const baseDaily = sub.type === SUBSCRIBER_TYPES.LEGAL ? randInt(30, 90) : randInt(4, 14);
    usageBuffer.push(...buildUsageForSubscriber(sub._id, baseDaily));
    if (usageBuffer.length >= 5000) {
      await insertInChunks(GasUsage, usageBuffer);
      usageTotal += usageBuffer.length;
      usageBuffer = [];
    }
  }
  if (usageBuffer.length) {
    await insertInChunks(GasUsage, usageBuffer);
    usageTotal += usageBuffer.length;
  }
  logger.info(`${usageTotal} ta kunlik sarf yozuvi yaratildi`);

  // ----- Payments (last 12 months) -----
  const payments = [];
  for (let i = 0; i < PAYMENT_COUNT; i++) {
    const sub = pick(subscribers);
    payments.push({
      subscriberId: sub._id,
      amountUzs: randInt(50, 600) * 1000,
      method: pick(PAYMENT_METHOD_VALUES),
      paidAt: randomPastDate(12),
    });
  }
  // Guaranteed payments for the demo subscriber
  const demoSub = subscribers[subscribers.length - 1];
  for (let i = 0; i < 4; i++) {
    payments.push({
      subscriberId: demoSub._id,
      amountUzs: randInt(150, 400) * 1000,
      method: pick(PAYMENT_METHOD_VALUES),
      paidAt: randomPastDate(8),
    });
  }
  await GasPayment.insertMany(payments);
  logger.info(`${payments.length} ta to'lov yaratildi`);

  // ----- Service requests (with timelines) -----
  const statusPool = [
    REQUEST_STATUSES.NEW, REQUEST_STATUSES.NEW,
    REQUEST_STATUSES.REVIEW, REQUEST_STATUSES.REVIEW,
    REQUEST_STATUSES.ASSIGNED,
    REQUEST_STATUSES.DONE, REQUEST_STATUSES.DONE, REQUEST_STATUSES.DONE,
    REQUEST_STATUSES.REJECTED,
  ];
  const year = new Date().getFullYear();
  const requests = [];
  for (let i = 0; i < REQUEST_COUNT; i++) {
    const sub = pick(subscribers);
    const status = pick(statusPool);
    const createdAt = randomPastDate(12);
    const events = buildEvents(createdAt, status);
    requests.push({
      requestNumber: `GAZ-${year}-${String(i + 1).padStart(5, "0")}`,
      subscriberId: sub._id,
      serviceType: pick(SERVICE_TYPE_VALUES),
      applicantJshshir: sub.jshshir,
      applicantName: sub.fullName,
      region: sub.region,
      status,
      operatorNote: "",
      events,
      createdAt,
      updatedAt: events[events.length - 1].createdAt,
    });
  }

  // A few requests for the demo citizen, including one in-progress
  const demoStatuses = [REQUEST_STATUSES.REVIEW, REQUEST_STATUSES.DONE, REQUEST_STATUSES.NEW];
  demoStatuses.forEach((status, idx) => {
    const createdAt = randomPastDate(4);
    const events = buildEvents(createdAt, status);
    requests.push({
      requestNumber: `GAZ-${year}-${String(REQUEST_COUNT + idx + 1).padStart(5, "0")}`,
      subscriberId: demoSub._id,
      serviceType: pick(SERVICE_TYPE_VALUES),
      applicantJshshir: DEMO_JSHSHIR,
      applicantName: demoSub.fullName,
      region: demoSub.region,
      status,
      operatorNote: "",
      events,
      createdAt,
      updatedAt: events[events.length - 1].createdAt,
    });
  });

  await GasRequest.insertMany(requests);
  logger.info(`${requests.length} ta ariza yaratildi`);

  // ----- Link demo JSHSHIR to the owner user (demo One ID) -----
  const ownerUser = await User.findOne({ username: "owner" });
  if (ownerUser) {
    ownerUser.jshshir = DEMO_JSHSHIR;
    await ownerUser.save();
    logger.info(`Owner user JSHSHIR biriktirildi: ${DEMO_JSHSHIR}`);
  } else {
    logger.warn("Owner user topilmadi — avval seed:owner ishga tushiring");
  }

  await disconnectDB();
  logger.info("Gaz seed yakunlandi");
};

seed().catch((err) => {
  logger.error({ err }, "Gaz seed xato");
  process.exit(1);
});
