import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import Appeal from "../models/appeal.model.js";
import Organization from "../models/organization.model.js";
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
  APPEAL_TYPES,
  APPEAL_TYPE_VALUES,
  CATEGORIES,
  CATEGORY_VALUES,
  APPEAL_STATUSES,
  APPEAL_RESULTS,
  ORGANIZATION_TYPES,
  DEADLINE_DAYS,
} from "../modules/murojaat/murojaat.constants.js";

const APPEAL_COUNT = 600;
const DEMO_JSHSHIR = "30101990010011";

// 10 government bodies that answer appeals
const ORGANIZATIONS = [
  { name: "Viloyat hokimligi", type: ORGANIZATION_TYPES.HOKIMLIK },
  { name: "Tuman hokimligi", type: ORGANIZATION_TYPES.HOKIMLIK },
  { name: "Hududgaz AJ", type: ORGANIZATION_TYPES.ENTERPRISE },
  { name: "Hududiy elektr tarmoqlari AJ", type: ORGANIZATION_TYPES.ENTERPRISE },
  { name: "Suvta'minot boshqarmasi", type: ORGANIZATION_TYPES.ENTERPRISE },
  { name: "Xalq ta'limi boshqarmasi", type: ORGANIZATION_TYPES.VAZIRLIK },
  { name: "Sog'liqni saqlash boshqarmasi", type: ORGANIZATION_TYPES.VAZIRLIK },
  { name: "Avtomobil yo'llari qo'mitasi", type: ORGANIZATION_TYPES.VAZIRLIK },
  { name: "Ekologiya qo'mitasi", type: ORGANIZATION_TYPES.VAZIRLIK },
  { name: "Mehnat va aholini ijtimoiy himoya qilish", type: ORGANIZATION_TYPES.VAZIRLIK },
];

// Which organizations naturally handle which subject area
const CATEGORY_ORG = {
  [CATEGORIES.GAS]: "Hududgaz AJ",
  [CATEGORIES.ELECTRICITY]: "Hududiy elektr tarmoqlari AJ",
  [CATEGORIES.LAND]: "Tuman hokimligi",
  [CATEGORIES.ROAD]: "Avtomobil yo'llari qo'mitasi",
  [CATEGORIES.EDUCATION]: "Xalq ta'limi boshqarmasi",
  [CATEGORIES.UTILITIES]: "Suvta'minot boshqarmasi",
  [CATEGORIES.HEALTH]: "Sog'liqni saqlash boshqarmasi",
  [CATEGORIES.ECOLOGY]: "Ekologiya qo'mitasi",
  [CATEGORIES.SOCIAL]: "Mehnat va aholini ijtimoiy himoya qilish",
  [CATEGORIES.OTHER]: "Viloyat hokimligi",
};

// Subject lines per category for realistic-looking data
const SUBJECTS = {
  [CATEGORIES.GAS]: ["Gaz bosimi past", "Gaz uzilib qolmoqda", "Hisoblagich nosoz", "Yangi gaz ulanishi"],
  [CATEGORIES.ELECTRICITY]: ["Tez-tez svet o'chmoqda", "Kuchlanish past", "Hisob noto'g'ri", "Transformator nosoz"],
  [CATEGORIES.LAND]: ["Yer chegarasi nizosi", "Kadastr hujjati kechikmoqda", "Qurilishga ruxsat", "Mulk ro'yxati"],
  [CATEGORIES.ROAD]: ["Yo'l qatlami buzilgan", "Ko'cha yoritilmagan", "Svetofor ishlamayapti", "Piyodalar o'tish joyi yo'q"],
  [CATEGORIES.EDUCATION]: ["Maktab ta'miri kerak", "O'qituvchi yetishmaydi", "Darslik tarqatilmagan", "Bog'cha navbati"],
  [CATEGORIES.UTILITIES]: ["Suv ta'minoti uzilgan", "Kanalizatsiya muammosi", "Issiq suv yo'q", "Hovli tozalanmagan"],
  [CATEGORIES.HEALTH]: ["Shifoxonada navbat", "Dori yetishmovchiligi", "Tez yordam kechikdi", "Shifokor xizmati"],
  [CATEGORIES.ECOLOGY]: ["Chiqindi to'planib qolgan", "Havo ifloslanishi", "Daraxt kesilmoqda", "Suv ifloslangan"],
  [CATEGORIES.SOCIAL]: ["Nafaqa to'lanmadi", "Nogironlik bo'yicha yordam", "Ish bilan ta'minlash", "Ijtimoiy nafaqa"],
  [CATEGORIES.OTHER]: ["Umumiy murojaat", "Taklif bildirildi", "Ma'lumot so'rovi", "Boshqa masala"],
};

const BODY_TEXT =
  "Ushbu masala bo'yicha tegishli choralar ko'rilishini va menga rasmiy javob berilishini so'rayman. " +
  "Holat uzoq vaqtdan beri hal etilmagan, shuning uchun e'tiboringizni qaratishingizni iltimos qilaman.";

// Build a realistic timeline up to `finalStatus`
const buildEvents = (createdAt, finalStatus) => {
  const chain = [
    APPEAL_STATUSES.NEW,
    APPEAL_STATUSES.REVIEW,
    APPEAL_STATUSES.FORWARDED,
    APPEAL_STATUSES.ANSWERED,
    APPEAL_STATUSES.CLOSED,
  ];
  const comments = {
    [APPEAL_STATUSES.NEW]: "Murojaat qabul qilindi",
    [APPEAL_STATUSES.REVIEW]: "Murojaat ko'rib chiqilmoqda",
    [APPEAL_STATUSES.FORWARDED]: "Tegishli tashkilotga yo'naltirildi",
    [APPEAL_STATUSES.ANSWERED]: "Rasmiy javob yuborildi",
    [APPEAL_STATUSES.CLOSED]: "Murojaat yopildi",
  };

  const events = [];
  let t = new Date(createdAt).getTime();
  const stopIndex = chain.indexOf(finalStatus);
  for (let i = 0; i <= stopIndex; i++) {
    if (i > 0) t += randInt(1, 5) * 86400000;
    events.push({
      status: chain[i],
      comment: comments[chain[i]],
      byOperator: i !== 0,
      createdAt: new Date(t),
    });
  }
  return events;
};

const pickResult = () => {
  const r = Math.random();
  if (r < 0.6) return APPEAL_RESULTS.SATISFIED;
  if (r < 0.82) return APPEAL_RESULTS.EXPLAINED;
  return APPEAL_RESULTS.REJECTED;
};

const seed = async () => {
  await connectDB();

  await Promise.all([Appeal.deleteMany({}), Organization.deleteMany({})]);
  logger.info("Eski murojaat ma'lumotlari tozalandi");

  const insertedOrgs = await Organization.insertMany(
    ORGANIZATIONS.map((o) => ({ ...o, region: "" })),
  );
  const orgByName = new Map(insertedOrgs.map((o) => [o.name, o._id]));
  logger.info(`${insertedOrgs.length} ta tashkilot yaratildi`);

  // Status pool weighted toward resolved appeals (realistic ~54% resolved)
  const statusPool = [
    APPEAL_STATUSES.NEW, APPEAL_STATUSES.NEW,
    APPEAL_STATUSES.REVIEW, APPEAL_STATUSES.REVIEW,
    APPEAL_STATUSES.FORWARDED, APPEAL_STATUSES.FORWARDED,
    APPEAL_STATUSES.ANSWERED, APPEAL_STATUSES.ANSWERED, APPEAL_STATUSES.ANSWERED,
    APPEAL_STATUSES.CLOSED, APPEAL_STATUSES.CLOSED, APPEAL_STATUSES.CLOSED, APPEAL_STATUSES.CLOSED,
  ];
  const RESOLVED = [APPEAL_STATUSES.ANSWERED, APPEAL_STATUSES.CLOSED];

  const year = new Date().getFullYear();
  const appeals = [];

  const buildAppeal = (i, { jshshir, name, region, district, status, createdAt }) => {
    const category = pick(CATEGORY_VALUES);
    const type =
      category === CATEGORIES.OTHER
        ? pick(APPEAL_TYPE_VALUES)
        : Math.random() < 0.55
          ? APPEAL_TYPES.COMPLAINT
          : pick(APPEAL_TYPE_VALUES);
    const events = buildEvents(createdAt, status);
    const resolved = RESOLVED.includes(status);
    const orgId = orgByName.get(CATEGORY_ORG[category]);
    return {
      appealNumber: `M-${year}-${String(i + 1).padStart(7, "0")}`,
      type,
      category,
      organizationId: orgId,
      applicantJshshir: jshshir,
      applicantName: name,
      region,
      district,
      subject: pick(SUBJECTS[category]),
      body: BODY_TEXT,
      status,
      result: resolved ? pickResult() : null,
      deadline: new Date(new Date(createdAt).getTime() + DEADLINE_DAYS * 86400000),
      operatorNote: "",
      events,
      replies: resolved
        ? [{ body: "Murojaatingiz ko'rib chiqildi. Tegishli choralar ko'rildi.", createdAt: events[events.length - 1].createdAt }]
        : [],
      createdAt,
      updatedAt: events[events.length - 1].createdAt,
    };
  };

  for (let i = 0; i < APPEAL_COUNT; i++) {
    const region = pick(REGIONS);
    appeals.push(
      buildAppeal(i, {
        jshshir: randomJshshir(),
        name: randomFullName(),
        region: region.name,
        district: pick(region.districts),
        status: pick(statusPool),
        createdAt: randomPastDate(12),
      }),
    );
  }

  // Demo One ID citizen — a few appeals incl. answered, in-review and a fresh one
  const demoRegion = REGIONS[0];
  const demoSetups = [
    { status: APPEAL_STATUSES.CLOSED, createdAt: randomPastDate(4) },
    { status: APPEAL_STATUSES.ANSWERED, createdAt: randomPastDate(2) },
    { status: APPEAL_STATUSES.REVIEW, createdAt: randomPastDate(1) },
    { status: APPEAL_STATUSES.NEW, createdAt: new Date(Date.now() - 3 * 86400000) },
  ];
  demoSetups.forEach((s, idx) => {
    appeals.push(
      buildAppeal(APPEAL_COUNT + idx, {
        jshshir: DEMO_JSHSHIR,
        name: "Karimov Akmal",
        region: demoRegion.name,
        district: pick(demoRegion.districts),
        status: s.status,
        createdAt: s.createdAt,
      }),
    );
  });

  await Appeal.insertMany(appeals);
  logger.info(`${appeals.length} ta murojaat yaratildi`);

  // Link demo JSHSHIR to the owner user (demo One ID)
  const ownerUser = await User.findOne({ username: "owner" });
  if (ownerUser) {
    if (!ownerUser.jshshir) ownerUser.jshshir = DEMO_JSHSHIR;
    if (!ownerUser.phone) ownerUser.phone = "+998901234567";
    await ownerUser.save();
    logger.info(`Owner user JSHSHIR biriktirildi: ${ownerUser.jshshir}`);
  } else {
    logger.warn("Owner user topilmadi — avval seed:owner ishga tushiring");
  }

  await disconnectDB();
  logger.info("Murojaat seed yakunlandi");
};

seed().catch((err) => {
  logger.error({ err }, "Murojaat seed xato");
  process.exit(1);
});
