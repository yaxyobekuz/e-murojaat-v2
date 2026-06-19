import "dotenv/config";
import { connectDB, disconnectDB } from "../config/db.js";
import Taxpayer from "../models/taxpayer.model.js";
import TaxAssessment, { TAX_TYPES } from "../models/taxAssessment.model.js";
import TaxPayment, { PAYMENT_METHODS } from "../models/taxPayment.model.js";
import { REGIONS, districtsOf } from "../helpers/regions.helper.js";
import { computeTaxAmount, computePenya, TAX_RATES } from "../modules/soliq/services/soliq.provider.js";
import logger from "../config/logger.js";

// --- Kichik tasodif generatorlari (faker o'rnatilmagan) ---
const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const chance = (p) => Math.random() < p;

const FIRST_M = ["Akmal", "Bobur", "Sardor", "Jasur", "Aziz", "Dilshod", "Ulug'bek", "Sherzod", "Farhod", "Otabek", "Javohir", "Shoxrux"];
const FIRST_F = ["Dilnoza", "Gulnora", "Madina", "Nilufar", "Sevara", "Zarina", "Kamola", "Malika", "Feruza", "Shahnoza"];
const LAST = ["Karimov", "Rahimov", "Toshmatov", "Yusupov", "Abdullayev", "Sobirov", "Ergashev", "Qodirov", "Nazarov", "Umarov", "Saidov", "Aliyev"];
const ORG = ["Oq Buloq", "Zamin Savdo", "Yangi Hayot", "Buyuk Yo'l", "Oltin Vodiy", "Mehnat Plus", "Shifo Med", "Texno Group"];

const fullNameJismoniy = () => {
  const female = chance(0.45);
  const first = female ? pick(FIRST_F) : pick(FIRST_M);
  return `${pick(LAST)} ${first}`;
};

// 9 xonali STIR (boshlanishi 2/3, demo).
const genStir = () => String(2 + rand(2)) + String(rand(100000000)).padStart(8, "0");
// 14 xonali JSHSHIR (demo).
const genJshshir = () => String(3 + rand(2)) + String(Math.floor(Math.random() * 1e13)).padStart(13, "0");

// Bitta to'lovchi uchun soliq turlariga qarab baza qiymati.
const baseValueFor = (taxType) => {
  switch (taxType) {
    case "mol_mulk":
      return 120_000_000 + rand(120) * 1_000_000; // kvartira kadastr qiymati
    case "yer":
      return 30_000_000 + rand(60) * 1_000_000;
    case "daromad":
      return 8_000_000 + rand(40) * 1_000_000; // yillik daromad
    case "aylanma":
      return 60_000_000 + rand(120) * 1_000_000; // yillik aylanma
    default:
      return 50_000_000;
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

  const TAXPAYER_COUNT = 500;
  const YEAR = new Date().getFullYear();
  const now = new Date();

  const taxpayerDocs = [];
  for (let i = 0; i < TAXPAYER_COUNT; i += 1) {
    const region = pick(REGIONS).key;
    const type = chance(0.78) ? "jismoniy" : chance(0.6) ? "yatt" : "yuridik";
    taxpayerDocs.push({
      stir: genStir(),
      jshshir: type === "yuridik" ? undefined : genJshshir(),
      type,
      fullName: type === "yuridik" ? `"${pick(ORG)}" MChJ` : fullNameJismoniy(),
      region,
      district: pick(districtsOf(region)) || "",
      phone: `+99890${String(rand(10000000)).padStart(7, "0")}`,
      status: "aktiv",
    });
  }

  // Demo "One ID" fuqaro — qarzdor, penya bilan (login qilib ko'rsatish uchun).
  const demoRegion = "toshkent_shahri";
  taxpayerDocs.push({
    stir: "301234567",
    jshshir: "30101990010011",
    type: "jismoniy",
    fullName: "Demo Foydalanuvchi",
    region: demoRegion,
    district: "Yunusobod",
    phone: "+998901234567",
    isDemo: true,
    status: "aktiv",
  });

  const taxpayers = await Taxpayer.insertMany(taxpayerDocs);
  logger.info(`Soliq to'lovchilar: ${taxpayers.length}`);

  // --- Har to'lovchiga soliqlar + 12 oylik to'lov tarixi ---
  const assessments = [];
  const payments = [];

  for (const tp of taxpayers) {
    // Har to'lovchida mol-mulk solig'i bor, qolganlari ehtimollik bilan.
    const types = ["mol_mulk"];
    if (chance(0.4)) types.push("yer");
    if (tp.type === "jismoniy" && chance(0.5)) types.push("daromad");
    if (tp.type !== "jismoniy") types.push("aylanma");

    for (const taxType of types) {
      const baseValue = baseValueFor(taxType);
      const amount = computeTaxAmount(taxType, baseValue);
      // To'lov muddati: o'tgan yil 15-oktabr (muddat o'tgan → qarzdorlarda penya real ko'rinadi).
      const dueDate = new Date(YEAR - 1, 9, 15);

      // ~30% qarzdor, qolgani to'liq/qisman to'lagan.
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

      const a = new TaxAssessment({
        taxpayer: tp._id,
        region: tp.region,
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
      assessments.push(a);

      // To'langan summani 12 oyga tarqatib, to'lov yozuvlari yaratamiz (grafik uchun).
      if (paidAmount > 0) {
        const installments = 1 + rand(3);
        let left = paidAmount;
        for (let k = 0; k < installments; k += 1) {
          const part = k === installments - 1 ? left : Math.round(paidAmount / installments);
          left -= part;
          // Oxirgi 12 oy ichida tasodifiy sana, oktabr atrofida ko'proq.
          const monthsAgo = chance(0.5) ? rand(3) : rand(12);
          const paidAt = new Date(now);
          paidAt.setMonth(paidAt.getMonth() - monthsAgo);
          paidAt.setDate(1 + rand(27));
          payments.push({
            taxpayer: tp._id,
            assessment: a._id,
            amount_uzs: part,
            method: pick(PAYMENT_METHODS),
            paidAt,
          });
        }
      }
    }
  }

  await TaxAssessment.insertMany(assessments);
  await TaxPayment.insertMany(payments);
  logger.info(`Soliq hisob-kitoblari: ${assessments.length}`);
  logger.info(`To'lovlar: ${payments.length}`);

  const debtors = assessments.filter((a) => a.status !== "tolandi").length;
  logger.info(`Qarzdor hisob-kitoblar: ${debtors}`);
  logger.info("Demo to'lovchi: STIR 301234567 (Demo Foydalanuvchi, qarzdor)");

  await disconnectDB();
};

seed().catch((err) => {
  logger.error({ err }, "Soliq seed xato");
  process.exit(1);
});
