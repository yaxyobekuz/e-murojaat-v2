import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import Taxpayer from "../models/taxpayer.model.js";
import TaxAssessment from "../models/taxAssessment.model.js";
import TaxPayment, { PAYMENT_METHODS } from "../models/taxPayment.model.js";
import { ALL_LOCATIONS } from "../helpers/regions.helper.js";
import { computeTaxAmount, computePenya, TAX_RATES } from "../modules/soliq/services/soliq.provider.js";
import logger from "../config/logger.js";

// --- Tasodif generatorlari (faker o'rnatilmagan) ---
const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const chance = (p) => Math.random() < p;

const FIRST_M = ["Akmal", "Bobur", "Sardor", "Jasur", "Aziz", "Dilshod", "Ulug'bek", "Sherzod", "Farhod", "Otabek", "Javohir", "Shoxrux", "Bekzod", "Davron", "Ravshan", "Sanjar", "Eldor", "Islom", "Murod", "Komil"];
const FIRST_F = ["Dilnoza", "Gulnora", "Madina", "Nilufar", "Sevara", "Zarina", "Kamola", "Malika", "Feruza", "Shahnoza", "Maftuna", "Gulchehra", "Nodira", "Ozoda", "Dilbar", "Mohira", "Zulfiya", "Yulduz"];
const LAST = ["Karimov", "Rahimov", "Toshmatov", "Yusupov", "Abdullayev", "Sobirov", "Ergashev", "Qodirov", "Nazarov", "Umarov", "Saidov", "Aliyev", "Tursunov", "Mirzayev", "Yo'ldoshev", "Xolmatov", "Jo'rayev", "Ismoilov", "Rasulov", "Boboyev"];
const ORG = ["Oq Buloq", "Zamin Savdo", "Yangi Hayot", "Buyuk Yo'l", "Oltin Vodiy", "Mehnat Plus", "Shifo Med", "Texno Group", "Baraka Trade", "Universal Build", "Hilol Agro", "Sharq Tekstil"];

const fullNameJismoniy = () => {
  const female = chance(0.45);
  const first = female ? pick(FIRST_F) : pick(FIRST_M);
  return `${pick(LAST)} ${first}`;
};

// Unikal STIR: 3xxxxxxxx — indeks asosida (kolliziyasiz), 9 xona.
const genStir = (i) => String(300000000 + i).slice(0, 9);
const genJshshir = (i) => `3${String(10000000000000 + i).slice(0, 13)}`;

const baseValueFor = (taxType) => {
  switch (taxType) {
    case "mol_mulk":
      return 120_000_000 + rand(120) * 1_000_000;
    case "yer":
      return 30_000_000 + rand(60) * 1_000_000;
    case "daromad":
      return 8_000_000 + rand(40) * 1_000_000;
    case "aylanma":
      return 60_000_000 + rand(120) * 1_000_000;
    default:
      return 50_000_000;
  }
};

// Katta massivni partiyalab insert qilish (xotira/limit uchun).
const insertInChunks = async (Model, docs, size = 2000) => {
  for (let i = 0; i < docs.length; i += size) {
    await Model.insertMany(docs.slice(i, i + size), { ordered: false });
  }
};

const seed = async () => {
  await connectDB();

  logger.info("Eski soliq ma'lumotlari tozalanmoqda...");
  await Promise.all([
    Taxpayer.deleteMany({}),
    TaxAssessment.deleteMany({}),
    TaxPayment.deleteMany({}),
  ]);

  const TAXPAYER_COUNT = 5000;
  const YEAR = new Date().getFullYear();
  const now = new Date();

  // Demo "One ID" fuqaro uchun aniq mahalla (Andijon, Asaka, Qo'rg'ontepa) — demo'da topib ko'rsatish uchun.
  const demoLoc =
    ALL_LOCATIONS.find((l) => l.region === "andijon" && l.settlementLabel === "Qo'rg'ontepa") ||
    ALL_LOCATIONS.find((l) => l.region === "andijon");

  const taxpayerDocs = [];
  for (let i = 0; i < TAXPAYER_COUNT; i += 1) {
    const loc = pick(ALL_LOCATIONS); // 4-darajali real lokatsiya
    const type = chance(0.78) ? "jismoniy" : chance(0.6) ? "yatt" : "yuridik";
    taxpayerDocs.push({
      stir: genStir(i),
      jshshir: type === "yuridik" ? undefined : genJshshir(i),
      type,
      fullName: type === "yuridik" ? `"${pick(ORG)}" MChJ` : fullNameJismoniy(),
      region: loc.region,
      district: loc.district,
      settlement: loc.settlement,
      mahalla: loc.mahalla,
      address: `${loc.mahallaLabel}, ${1 + rand(120)}-uy`,
      phone: `+99890${String(rand(10000000)).padStart(7, "0")}`,
      status: "aktiv",
    });
  }

  // Demo to'lovchi — qarzdor, aniq mahallaga biriktirilgan.
  taxpayerDocs.push({
    stir: "301234567",
    jshshir: "30101990010011",
    type: "jismoniy",
    fullName: "Demo Foydalanuvchi",
    region: demoLoc.region,
    district: demoLoc.district,
    settlement: demoLoc.settlement,
    mahalla: demoLoc.mahalla,
    address: `${demoLoc.mahallaLabel}, 7-uy`,
    phone: "+998901234567",
    isDemo: true,
    status: "aktiv",
  });

  await insertInChunks(Taxpayer, taxpayerDocs);
  const taxpayers = await Taxpayer.find({}, "_id type region district settlement mahalla isDemo");
  logger.info(`Soliq to'lovchilar: ${taxpayers.length}`);

  // --- Har to'lovchiga soliqlar + 12 oylik to'lov tarixi ---
  const assessments = [];
  const payments = [];

  for (const tp of taxpayers) {
    const types = ["mol_mulk"];
    if (chance(0.4)) types.push("yer");
    if (tp.type === "jismoniy" && chance(0.5)) types.push("daromad");
    if (tp.type !== "jismoniy") types.push("aylanma");

    for (const taxType of types) {
      const baseValue = baseValueFor(taxType);
      const amount = computeTaxAmount(taxType, baseValue);
      const dueDate = new Date(YEAR - 1, 9, 15); // muddat o'tgan → qarzdorlarda penya

      let paidAmount = amount;
      let status = "tolandi";
      const isDemoDebtor = tp.isDemo && taxType === "mol_mulk";
      if (isDemoDebtor || chance(0.3)) {
        if (chance(0.5)) {
          paidAmount = 0;
          status = "qarzdor";
        } else {
          paidAmount = Math.round(amount * (0.3 + Math.random() * 0.4));
          status = "qisman";
        }
      }

      const unpaid = amount - paidAmount;
      const penya = computePenya(unpaid, dueDate, now);

      const aId = new TaxAssessment()._id;
      assessments.push({
        _id: aId,
        taxpayer: tp._id,
        region: tp.region,
        district: tp.district,
        settlement: tp.settlement,
        mahalla: tp.mahalla,
        taxType,
        baseValue_uzs: baseValue,
        rate: TAX_RATES[taxType],
        amount_uzs: amount,
        paidAmount_uzs: paidAmount,
        penya_uzs: penya,
        year: YEAR,
        dueDate,
        status,
      });

      if (paidAmount > 0) {
        const installments = 1 + rand(3);
        let left = paidAmount;
        for (let k = 0; k < installments; k += 1) {
          const part = k === installments - 1 ? left : Math.round(paidAmount / installments);
          left -= part;
          const monthsAgo = chance(0.5) ? rand(3) : rand(12);
          const paidAt = new Date(now);
          paidAt.setMonth(paidAt.getMonth() - monthsAgo);
          paidAt.setDate(1 + rand(27));
          payments.push({
            taxpayer: tp._id,
            assessment: aId,
            amount_uzs: part,
            method: pick(PAYMENT_METHODS),
            paidAt,
          });
        }
      }
    }
  }

  await insertInChunks(TaxAssessment, assessments);
  await insertInChunks(TaxPayment, payments);
  logger.info(`Soliq hisob-kitoblari: ${assessments.length}`);
  logger.info(`To'lovlar: ${payments.length}`);

  const debtors = assessments.filter((a) => a.status !== "tolandi").length;
  logger.info(`Qarzdor hisob-kitoblar: ${debtors} (${Math.round((debtors / assessments.length) * 100)}%)`);
  logger.info(`Demo to'lovchi: STIR 301234567 — ${demoLoc.mahallaLabel}, ${demoLoc.settlementLabel}, ${demoLoc.districtLabel}, Andijon`);

  await disconnectDB();
};

seed().catch((err) => {
  logger.error({ err }, "Soliq seed xato");
  process.exit(1);
});
