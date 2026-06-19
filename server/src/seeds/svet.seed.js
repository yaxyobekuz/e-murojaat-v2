import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import ElectricSubscriber from "../models/electricSubscriber.model.js";
import ElectricUsage from "../models/electricUsage.model.js";
import ElectricPayment from "../models/electricPayment.model.js";
import ElectricRequest from "../models/electricRequest.model.js";
import ElectricViolation from "../models/electricViolation.model.js";
import ElectricTariff from "../models/electricTariff.model.js";
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
  SUBSCRIBER_TYPE_VALUES,
  SUBSCRIBER_STATUSES,
  METER_TYPES,
  PAYMENT_METHOD_VALUES,
  SERVICE_TYPE_VALUES,
  REQUEST_STATUSES,
  VIOLATION_TYPE_VALUES,
  VIOLATION_STATUSES,
  VIOLATION_STATUS_VALUES,
} from "../modules/svet/svet.constants.js";

const SUBSCRIBER_COUNT = 400;
const REQUEST_COUNT = 150;
const VIOLATION_COUNT = 80;

// Same demo "One ID" citizen as the other modules (one owner user, all domains)
const DEMO_JSHSHIR = "30101990010011";

// Tariff (so'm/kWh) — social price within the norm, full price above it
const SOCIAL_PRICE = 295;
const FULL_PRICE = 450;

// Summer-peak seasonality factor by calendar month (1..12) — A/C usage in Jun–Aug
const SEASON = {
  1: 0.85, 2: 0.8, 3: 0.75, 4: 0.7, 5: 0.85, 6: 1.25,
  7: 1.5, 8: 1.45, 9: 1.1, 10: 0.8, 11: 0.85, 12: 1.0,
};

// Loop accounts start at 40000100 so the demo "40000001" can stay reserved
const accountNumber = (i) => String(40000100 + i);

const meterFor = () => {
  const installedAt = randomPastDate(96);
  const lastCalibration = randomPastDate(24);
  const calibrationDue = new Date(lastCalibration);
  calibrationDue.setFullYear(calibrationDue.getFullYear() + 4);
  return {
    serialNumber: `EHU-${randInt(100000, 999999)}`,
    type: Math.random() < 0.7 ? METER_TYPES.SMART : METER_TYPES.ORDINARY,
    installedAt,
    lastCalibration,
    calibrationDue,
  };
};

// One usage doc per month for the last 12 months, with within/over-norm split
const buildUsage = (subscriber) => {
  const now = new Date();
  const isLegal = subscriber.type === SUBSCRIBER_TYPES.LEGAL;
  const base = isLegal ? randInt(1500, 7000) : randInt(120, 380);
  const docs = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 15);
    const factor = SEASON[d.getMonth() + 1] * (0.9 + Math.random() * 0.2);
    const usage = Math.round(base * factor);
    const within = Math.min(usage, subscriber.socialNormKwh);
    const over = Math.max(0, usage - subscriber.socialNormKwh);
    const amount = Math.round(within * SOCIAL_PRICE + over * FULL_PRICE);
    docs.push({
      subscriberId: subscriber._id,
      accountNumber: subscriber.accountNumber,
      region: subscriber.region,
      date: d,
      usageKwh: usage,
      withinNormKwh: within,
      overNormKwh: over,
      amountUzs: amount,
    });
  }
  return docs;
};

// Realistic request timeline up to `finalStatus`
const buildEvents = (createdAt, finalStatus) => {
  const chain = [
    REQUEST_STATUSES.NEW,
    REQUEST_STATUSES.REVIEW,
    REQUEST_STATUSES.MEASURE,
    REQUEST_STATUSES.PAYMENT,
    REQUEST_STATUSES.DONE,
  ];
  const comments = {
    [REQUEST_STATUSES.NEW]: "Ariza qabul qilindi",
    [REQUEST_STATUSES.REVIEW]: "Ariza ko'rib chiqilmoqda",
    [REQUEST_STATUSES.MEASURE]: "Texnik ko'rik belgilandi",
    [REQUEST_STATUSES.PAYMENT]: "To'lov uchun invoys chiqarildi",
    [REQUEST_STATUSES.DONE]: "Xizmat yakunlandi",
    [REQUEST_STATUSES.REJECTED]: "Hujjatlar yetarli emas, rad etildi",
  };

  let t = new Date(createdAt).getTime();
  const step = () => {
    t += randInt(1, 6) * 86400000;
    return new Date(t);
  };

  if (finalStatus === REQUEST_STATUSES.REJECTED) {
    return [
      { status: REQUEST_STATUSES.NEW, comment: comments[REQUEST_STATUSES.NEW], createdAt: new Date(t) },
      { status: REQUEST_STATUSES.REVIEW, comment: comments[REQUEST_STATUSES.REVIEW], createdAt: step() },
      { status: REQUEST_STATUSES.REJECTED, comment: comments[REQUEST_STATUSES.REJECTED], createdAt: step() },
    ];
  }

  const stopIndex = chain.indexOf(finalStatus);
  const events = [];
  for (let i = 0; i <= stopIndex; i++) {
    events.push({
      status: chain[i],
      comment: comments[chain[i]],
      createdAt: i === 0 ? new Date(t) : step(),
    });
  }
  return events;
};

const seed = async () => {
  await connectDB();

  await Promise.all([
    ElectricSubscriber.deleteMany({}),
    ElectricUsage.deleteMany({}),
    ElectricPayment.deleteMany({}),
    ElectricRequest.deleteMany({}),
    ElectricViolation.deleteMany({}),
    ElectricTariff.deleteMany({}),
  ]);
  logger.info("Eski svet ma'lumotlari tozalandi");

  // ----- Tariff -----
  await ElectricTariff.create({
    pricePerKwh: FULL_PRICE,
    socialPricePerKwh: SOCIAL_PRICE,
    validFrom: new Date(new Date().getFullYear(), 0, 1),
  });

  // ----- Subscribers -----
  const subscriberDocs = [];
  for (let i = 0; i < SUBSCRIBER_COUNT; i++) {
    const region = pick(REGIONS);
    const isLegal = Math.random() < 0.18;
    const hasDebt = Math.random() < 0.25;
    const debt = hasDebt ? randInt(50, 1200) * 1000 : 0;
    subscriberDocs.push({
      accountNumber: accountNumber(i),
      type: isLegal ? SUBSCRIBER_TYPES.LEGAL : SUBSCRIBER_TYPES.INDIVIDUAL,
      fullName: isLegal ? `"${pick(["Oq yo'l", "Baraka", "Nur", "Ziyo", "Mehr"])}" MChJ` : randomFullName(),
      region: region.name,
      district: pick(region.districts),
      address: `${pick(region.districts)} tumani, ${randInt(1, 90)}-uy`,
      balanceUzs: hasDebt ? 0 : randInt(0, 200) * 1000,
      debtUzs: debt,
      socialNormKwh: isLegal ? randInt(800, 2000) : pick([150, 200, 200, 250, 300]),
      meter: meterFor(),
      subscriberJshshir: randomJshshir(),
      status: hasDebt && debt > 600000 ? SUBSCRIBER_STATUSES.DEBTOR : SUBSCRIBER_STATUSES.ACTIVE,
      registeredAt: randomPastDate(60),
    });
  }

  // Demo One ID subscriber
  const demoRegion = REGIONS[0];
  subscriberDocs.unshift({
    accountNumber: "40000001",
    type: SUBSCRIBER_TYPES.INDIVIDUAL,
    fullName: "Karimov Akmal",
    region: demoRegion.name,
    district: pick(demoRegion.districts),
    address: `${demoRegion.districts[0]} tumani, 12-uy`,
    balanceUzs: 35000,
    debtUzs: 180000,
    socialNormKwh: 200,
    meter: meterFor(),
    subscriberJshshir: DEMO_JSHSHIR,
    status: SUBSCRIBER_STATUSES.ACTIVE,
    registeredAt: randomPastDate(48),
  });

  const subscribers = await ElectricSubscriber.insertMany(subscriberDocs);
  logger.info(`${subscribers.length} ta abonent yaratildi`);

  // ----- Usage (12 months each) -----
  let usageDocs = [];
  for (const s of subscribers) {
    usageDocs.push(...buildUsage(s));
    if (usageDocs.length >= 4000) {
      await ElectricUsage.insertMany(usageDocs);
      usageDocs = [];
    }
  }
  if (usageDocs.length) await ElectricUsage.insertMany(usageDocs);
  logger.info(`${subscribers.length * 12} ta oylik sarf yozuvi yaratildi`);

  // ----- Payments (~2-5 per subscriber over 12 months) -----
  const paymentDocs = [];
  for (const s of subscribers) {
    const count = randInt(2, 5);
    for (let j = 0; j < count; j++) {
      paymentDocs.push({
        subscriberId: s._id,
        accountNumber: s.accountNumber,
        region: s.region,
        amountUzs: randInt(50, 900) * 1000,
        method: pick(PAYMENT_METHOD_VALUES),
        paidAt: randomPastDate(12),
      });
    }
  }
  await ElectricPayment.insertMany(paymentDocs);
  logger.info(`${paymentDocs.length} ta to'lov yaratildi`);

  // ----- Service requests -----
  const statusPool = [
    REQUEST_STATUSES.NEW, REQUEST_STATUSES.NEW,
    REQUEST_STATUSES.REVIEW, REQUEST_STATUSES.REVIEW,
    REQUEST_STATUSES.MEASURE,
    REQUEST_STATUSES.PAYMENT,
    REQUEST_STATUSES.DONE, REQUEST_STATUSES.DONE, REQUEST_STATUSES.DONE,
    REQUEST_STATUSES.REJECTED,
  ];
  const year = new Date().getFullYear();
  const requestDocs = [];
  for (let i = 0; i < REQUEST_COUNT; i++) {
    const s = pick(subscribers);
    const status = pick(statusPool);
    const createdAt = randomPastDate(12);
    const events = buildEvents(createdAt, status);
    const reachedPayment =
      status === REQUEST_STATUSES.PAYMENT || status === REQUEST_STATUSES.DONE;
    requestDocs.push({
      requestNumber: `ELK-${year}-${String(i + 1).padStart(5, "0")}`,
      subscriberId: s._id,
      serviceType: pick(SERVICE_TYPE_VALUES),
      applicantJshshir: s.subscriberJshshir,
      applicantName: s.fullName,
      region: s.region,
      status,
      invoiceAmount: reachedPayment ? randInt(80, 600) * 1000 : null,
      paid: status === REQUEST_STATUSES.DONE,
      operatorNote: "",
      events,
      createdAt,
      updatedAt: events[events.length - 1].createdAt,
    });
  }

  // A few requests for the demo citizen, including one in-progress
  const demoSub = subscribers[0];
  [REQUEST_STATUSES.REVIEW, REQUEST_STATUSES.DONE, REQUEST_STATUSES.NEW].forEach(
    (status, idx) => {
      const createdAt = randomPastDate(5);
      const events = buildEvents(createdAt, status);
      requestDocs.push({
        requestNumber: `ELK-${year}-${String(REQUEST_COUNT + idx + 1).padStart(5, "0")}`,
        subscriberId: demoSub._id,
        serviceType: pick(SERVICE_TYPE_VALUES),
        applicantJshshir: DEMO_JSHSHIR,
        applicantName: demoSub.fullName,
        region: demoSub.region,
        status,
        invoiceAmount: status === REQUEST_STATUSES.DONE ? 250000 : null,
        paid: status === REQUEST_STATUSES.DONE,
        operatorNote: "",
        events,
        createdAt,
        updatedAt: events[events.length - 1].createdAt,
      });
    },
  );

  await ElectricRequest.insertMany(requestDocs);
  logger.info(`${requestDocs.length} ta ariza yaratildi`);

  // ----- Violations (e-dalolatnoma) -----
  const violationDocs = [];
  for (let i = 0; i < VIOLATION_COUNT; i++) {
    const s = pick(subscribers);
    const status = pick(VIOLATION_STATUS_VALUES);
    const fined =
      status === VIOLATION_STATUSES.FINED || status === VIOLATION_STATUSES.CLOSED;
    violationDocs.push({
      actNumber: `ACT-${year}-${String(i + 1).padStart(4, "0")}`,
      subscriberId: s._id,
      accountNumber: s.accountNumber,
      region: s.region,
      type: pick(VIOLATION_TYPE_VALUES),
      date: randomPastDate(12),
      fineUzs: fined ? randInt(300, 2500) * 1000 : 0,
      status,
      note: "",
    });
  }
  await ElectricViolation.insertMany(violationDocs);
  logger.info(`${violationDocs.length} ta e-dalolatnoma yaratildi`);

  // ----- Link demo JSHSHIR to the owner user (demo One ID) -----
  const ownerUser = await User.findOne({ username: "owner" });
  if (ownerUser) {
    if (!ownerUser.jshshir) ownerUser.jshshir = DEMO_JSHSHIR;
    await ownerUser.save();
    logger.info(`Owner user JSHSHIR: ${ownerUser.jshshir}`);
  } else {
    logger.warn("Owner user topilmadi — avval seed:owner ishga tushiring");
  }

  await disconnectDB();
  logger.info("Svet seed yakunlandi");
};

seed().catch((err) => {
  logger.error({ err }, "Svet seed xato");
  process.exit(1);
});
