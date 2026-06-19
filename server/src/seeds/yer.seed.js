import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import Property from "../models/property.model.js";
import PropertyRequest from "../models/propertyRequest.model.js";
import PropertyOwner from "../models/propertyOwner.model.js";
import User from "../models/user.model.js";
import logger from "../config/logger.js";
import {
  REGIONS,
  randInt,
  pick,
  randomFullName,
  randomJshshir,
  randomPhone,
  randomPastDate,
} from "../helpers/demo.helper.js";
import {
  PROPERTY_TYPE_VALUES,
  OWNERSHIP_TYPE_VALUES,
  PROPERTY_STATUSES,
  PROPERTY_STATUS_VALUES,
  SERVICE_TYPE_VALUES,
  REQUEST_STATUSES,
} from "../modules/yer/yer.constants.js";

const PROPERTY_COUNT = 400;
const REQUEST_COUNT = 250;

// Fixed JSHSHIR for the demo "One ID" citizen (the seeded owner user)
const DEMO_JSHSHIR = "30101990010011";

const cadastreNumber = (regionCode, i) =>
  `${regionCode}:${String(randInt(1, 12)).padStart(2, "0")}:${String(
    randInt(1, 30),
  ).padStart(2, "0")}:${String(randInt(1, 20)).padStart(2, "0")}:${String(
    1000 + i,
  ).padStart(4, "0")}`;

const areaByType = (type) => {
  if (type === "kvartira") return randInt(35, 120);
  if (type === "uy") return randInt(80, 400);
  if (type === "yer") return randInt(300, 5000);
  return randInt(50, 1500); // noturar
};

const valueByArea = (type, area) => {
  const perM2 =
    type === "kvartira"
      ? randInt(7, 14) * 1_000_000
      : type === "uy"
        ? randInt(3, 9) * 1_000_000
        : type === "yer"
          ? randInt(200_000, 1_200_000)
          : randInt(2, 7) * 1_000_000;
  return Math.round((area * perM2) / 1_000_000) * 1_000_000;
};

// Build a realistic timeline up to `finalStatus`
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
    [REQUEST_STATUSES.REVIEW]: "Hujjatlar ko'rib chiqilmoqda",
    [REQUEST_STATUSES.MEASURE]: "O'lchov ishlari belgilandi",
    [REQUEST_STATUSES.PAYMENT]: "To'lov uchun invoys chiqarildi",
    [REQUEST_STATUSES.DONE]: "Xizmat yakunlandi",
    [REQUEST_STATUSES.REJECTED]: "Hujjatlar yetarli emas, rad etildi",
  };

  const events = [];
  let t = new Date(createdAt).getTime();
  const step = () => {
    t += randInt(1, 6) * 86400000;
    return new Date(t);
  };

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

const seed = async () => {
  await connectDB();

  await Promise.all([
    Property.deleteMany({}),
    PropertyRequest.deleteMany({}),
    PropertyOwner.deleteMany({}),
  ]);
  logger.info("Eski yer ma'lumotlari tozalandi");

  // ----- Owners + demo citizen -----
  const owners = [];
  for (let i = 0; i < 120; i++) {
    const region = pick(REGIONS);
    owners.push({
      jshshir: randomJshshir(),
      fullName: randomFullName(),
      phone: randomPhone(),
      region: region.name,
    });
  }

  // Demo One ID citizen
  const demoRegion = REGIONS[0];
  const demoOwner = {
    jshshir: DEMO_JSHSHIR,
    fullName: "Karimov Akmal",
    phone: "+998901234567",
    region: demoRegion.name,
  };
  owners.unshift(demoOwner);
  await PropertyOwner.insertMany(owners);

  // ----- Properties -----
  const properties = [];
  for (let i = 0; i < PROPERTY_COUNT; i++) {
    const region = pick(REGIONS);
    const owner = pick(owners);
    const type = pick(PROPERTY_TYPE_VALUES);
    const area = areaByType(type);
    const registeredAt = randomPastDate(36);
    properties.push({
      cadastreNumber: cadastreNumber(region.code, i),
      type,
      region: region.name,
      district: pick(region.districts),
      address: `${pick(region.districts)} tumani, ${randInt(1, 80)}-uy`,
      areaM2: area,
      valueUzs: valueByArea(type, area),
      ownershipType: pick(OWNERSHIP_TYPE_VALUES),
      ownerJshshir: owner.jshshir,
      status:
        Math.random() < 0.85
          ? PROPERTY_STATUSES.REGISTERED
          : pick(PROPERTY_STATUS_VALUES),
      registeredAt,
    });
  }

  // Guarantee the demo citizen owns 4 properties in their region
  for (let i = 0; i < 4; i++) {
    const type = pick(PROPERTY_TYPE_VALUES);
    const area = areaByType(type);
    properties.push({
      cadastreNumber: cadastreNumber(demoRegion.code, PROPERTY_COUNT + i),
      type,
      region: demoRegion.name,
      district: pick(demoRegion.districts),
      address: `${pick(demoRegion.districts)} tumani, ${randInt(1, 80)}-uy`,
      areaM2: area,
      valueUzs: valueByArea(type, area),
      ownershipType: "xususiy",
      ownerJshshir: DEMO_JSHSHIR,
      status: PROPERTY_STATUSES.REGISTERED,
      registeredAt: randomPastDate(24),
    });
  }

  const insertedProps = await Property.insertMany(properties);
  logger.info(`${insertedProps.length} ta obyekt yaratildi`);

  // ----- Requests -----
  const statusPool = [
    REQUEST_STATUSES.NEW, REQUEST_STATUSES.NEW,
    REQUEST_STATUSES.REVIEW, REQUEST_STATUSES.REVIEW,
    REQUEST_STATUSES.MEASURE,
    REQUEST_STATUSES.PAYMENT,
    REQUEST_STATUSES.DONE, REQUEST_STATUSES.DONE, REQUEST_STATUSES.DONE,
    REQUEST_STATUSES.REJECTED,
  ];

  const year = new Date().getFullYear();
  const requests = [];
  for (let i = 0; i < REQUEST_COUNT; i++) {
    const prop = pick(insertedProps);
    const status = pick(statusPool);
    const createdAt = randomPastDate(12);
    const events = buildEvents(createdAt, status);
    const reachedPayment =
      status === REQUEST_STATUSES.PAYMENT || status === REQUEST_STATUSES.DONE;
    requests.push({
      requestNumber: `YER-${year}-${String(i + 1).padStart(5, "0")}`,
      propertyId: prop._id,
      serviceType: pick(SERVICE_TYPE_VALUES),
      applicantJshshir: prop.ownerJshshir,
      applicantName: pick(owners.filter((o) => o.jshshir === prop.ownerJshshir)).fullName,
      region: prop.region,
      status,
      invoiceAmount: reachedPayment ? randInt(150, 850) * 1000 : null,
      paid: status === REQUEST_STATUSES.DONE,
      operatorNote: "",
      events,
      createdAt,
      updatedAt: events[events.length - 1].createdAt,
    });
  }

  // A few requests for the demo citizen, including one in-progress
  const demoProps = insertedProps.filter((p) => p.ownerJshshir === DEMO_JSHSHIR);
  const demoStatuses = [REQUEST_STATUSES.REVIEW, REQUEST_STATUSES.DONE, REQUEST_STATUSES.NEW];
  demoStatuses.forEach((status, idx) => {
    const prop = demoProps[idx % demoProps.length];
    const createdAt = randomPastDate(5);
    const events = buildEvents(createdAt, status);
    requests.push({
      requestNumber: `YER-${year}-${String(REQUEST_COUNT + idx + 1).padStart(5, "0")}`,
      propertyId: prop._id,
      serviceType: pick(SERVICE_TYPE_VALUES),
      applicantJshshir: DEMO_JSHSHIR,
      applicantName: demoOwner.fullName,
      region: prop.region,
      status,
      invoiceAmount: status === REQUEST_STATUSES.DONE ? 450000 : null,
      paid: status === REQUEST_STATUSES.DONE,
      operatorNote: "",
      events,
      createdAt,
      updatedAt: events[events.length - 1].createdAt,
    });
  });

  await PropertyRequest.insertMany(requests);
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
  logger.info("Yer seed yakunlandi");
};

seed().catch((err) => {
  logger.error({ err }, "Yer seed xato");
  process.exit(1);
});
