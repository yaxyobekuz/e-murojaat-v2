/**
 * Andijon viloyati uchun yirik hajmli demo ma'lumot generatori.
 * 30 000 honadon (soliq to'lovchi) × 4 soliq turi × 6 oylik hisobot.
 *
 * Ishga tushirish:  npm run seed:andijon
 *
 * Xususiyatlari (talabga ko'ra):
 *  - Realistik tasodifiy ma'lumot (o'zbek ism/manzil, hudud ierarxiyasi, mavsumiy summa)
 *  - Batch (partiyalab) yozish — xotira va tezlik uchun
 *  - Transaction (replica set bo'lsa) yoki ordered fallback (standalone mongod)
 *  - Progress (jarayon) konsolda ko'rsatiladi
 */

import "dotenv/config";
import mongoose from "mongoose";
import { connectDB, disconnectDB } from "../config/db.js";
import Taxpayer from "../models/taxpayer.model.js";
import TaxAssessment from "../models/taxAssessment.model.js";
import TaxPayment, { PAYMENT_METHODS } from "../models/taxPayment.model.js";
import { ALL_LOCATIONS } from "../helpers/regions.helper.js";
import { computeTaxAmount, computePenya, TAX_RATES } from "../modules/soliq/services/soliq.provider.js";
import logger from "../config/logger.js";

// ---------- Sozlamalar ----------
const HOUSEHOLD_COUNT = 30_000;     // honadon (soliq to'lovchi) soni
const MONTHS = 6;                   // oxirgi necha oylik hisobot
const TAX_TYPES = ["mol_mulk", "yer", "daromad", "aylanma"]; // mavjud 4 soliq turi
const BATCH_SIZE = 2_000;           // bitta insertdagi hujjatlar soni

// ---------- Kichik tasodif yordamchilari (faker o'rnatilmagan) ----------
const rand = (n) => Math.floor(Math.random() * n);
const pick = (arr) => arr[rand(arr.length)];
const chance = (p) => Math.random() < p;
const between = (min, max) => min + rand(max - min + 1);

const FIRST_M = ["Akmal", "Bobur", "Sardor", "Jasur", "Aziz", "Dilshod", "Ulug'bek", "Sherzod", "Farhod", "Otabek", "Javohir", "Shoxrux", "Bekzod", "Davron", "Ravshan", "Sanjar", "Eldor", "Islom", "Murod", "Komil"];
const FIRST_F = ["Dilnoza", "Gulnora", "Madina", "Nilufar", "Sevara", "Zarina", "Kamola", "Malika", "Feruza", "Shahnoza", "Maftuna", "Gulchehra", "Nodira", "Ozoda", "Dilbar", "Mohira", "Zulfiya", "Yulduz"];
const LAST = ["Karimov", "Rahimov", "Toshmatov", "Yusupov", "Abdullayev", "Sobirov", "Ergashev", "Qodirov", "Nazarov", "Umarov", "Saidov", "Aliyev", "Tursunov", "Mirzayev", "Yo'ldoshev", "Xolmatov", "Jo'rayev", "Ismoilov", "Rasulov", "Boboyev"];
const ORG = ["Oq Buloq", "Zamin Savdo", "Yangi Hayot", "Buyuk Yo'l", "Oltin Vodiy", "Mehnat Plus", "Shifo Med", "Texno Group", "Baraka Trade", "Universal Build"];

const fullNameJismoniy = () => {
  const first = chance(0.45) ? pick(FIRST_F) : pick(FIRST_M);
  return `${pick(LAST)} ${first}`;
};

// Faqat Andijon viloyati lokatsiyalari (region/district/settlement/mahalla)
const ANDIJON = ALL_LOCATIONS.filter((l) => l.region === "andijon");

// Hisob-kitob bazasi (soliq turiga qarab realistik qiymat)
const baseValueFor = (taxType) => {
  switch (taxType) {
    case "mol_mulk": return 120_000_000 + rand(120) * 1_000_000; // kvartira kadastr qiymati
    case "yer":      return 30_000_000 + rand(60) * 1_000_000;
    case "daromad":  return 8_000_000 + rand(40) * 1_000_000;    // yillik daromad
    case "aylanma":  return 60_000_000 + rand(120) * 1_000_000;  // yillik aylanma
    default:         return 50_000_000;
  }
};

// =====================================================================
//  QISM 1 — Honadon (soliq to'lovchi) ma'lumotlarini yaratish
// =====================================================================
// Bitta honadon hujjatini tayyorlaydi. `i` — global indeks (STIR/JSHSHIR unikalligi uchun).
const buildHousehold = (i) => {
  const loc = pick(ANDIJON);                       // Andijon ichidan tasodifiy mahalla
  const type = chance(0.82) ? "jismoniy" : chance(0.6) ? "yatt" : "yuridik";
  return {
    _id: new mongoose.Types.ObjectId(),            // _id ni oldindan beramiz — hisobotga bog'lash uchun
    stir: String(400000000 + i).slice(0, 9),       // unikal 9 xonali STIR (kolliziyasiz)
    jshshir: type === "yuridik" ? undefined : `4${String(10000000000000 + i).slice(0, 13)}`,
    type,
    fullName: type === "yuridik" ? `"${pick(ORG)}" MChJ` : fullNameJismoniy(),
    region: loc.region,
    district: loc.district,
    settlement: loc.settlement,
    mahalla: loc.mahalla,
    address: `${loc.mahallaLabel}, ${between(1, 120)}-uy`,
    phone: `+99890${String(rand(10000000)).padStart(7, "0")}`,
    status: "aktiv",
  };
};

// =====================================================================
//  QISM 2 — Soliq hisobotlarini yaratish (har honadon × 4 tur × 6 oy)
// =====================================================================
// Bitta honadon uchun assessment (hisob-kitob) va payment (to'lov) hujjatlarini qaytaradi.
const buildAssessmentsFor = (hh, year, now) => {
  const assessments = [];
  const payments = [];

  for (const taxType of TAX_TYPES) {
    // Oxirgi MONTHS oy uchun har oyga bitta hisob-kitob
    for (let mAgo = 0; mAgo < MONTHS; mAgo += 1) {
      const period = new Date(now.getFullYear(), now.getMonth() - mAgo, 1);
      const baseValue = baseValueFor(taxType);

      // Mavsumiylik: qish oylari (11,12,1,2) ~20% qimmatroq — realistik tebranish
      const month = period.getMonth();
      const seasonal = [10, 11, 0, 1].includes(month) ? 1.2 : 1.0;
      const amount = Math.round(computeTaxAmount(taxType, baseValue) * seasonal / 6); // oylik ulush

      // To'lov muddati: shu oyning 15-sanasi (o'tgan oylar → qarzdorlarda penya)
      const dueDate = new Date(period.getFullYear(), period.getMonth(), 15);

      // ~30% qarzdor / qisman, qolgani to'liq to'langan
      let paidAmount = amount;
      let status = "tolandi";
      if (chance(0.3)) {
        if (chance(0.5)) { paidAmount = 0; status = "qarzdor"; }
        else { paidAmount = Math.round(amount * (0.3 + Math.random() * 0.4)); status = "qisman"; }
      }

      const penya = computePenya(amount - paidAmount, dueDate, now);
      const aId = new mongoose.Types.ObjectId();

      assessments.push({
        _id: aId,
        taxpayer: hh._id,
        region: hh.region,
        district: hh.district,
        settlement: hh.settlement,
        mahalla: hh.mahalla,           // mahalla denormalizatsiya — filtr tez ishlashi uchun
        taxType,
        baseValue_uzs: baseValue,
        rate: TAX_RATES[taxType],
        amount_uzs: amount,
        paidAmount_uzs: paidAmount,
        penya_uzs: penya,
        year,
        dueDate,
        status,
      });

      // To'langan bo'lsa — to'lov yozuvi (grafik/tarix uchun)
      if (paidAmount > 0) {
        const paidAt = new Date(period.getFullYear(), period.getMonth(), between(16, 27));
        payments.push({
          taxpayer: hh._id,
          assessment: aId,
          amount_uzs: paidAmount,
          method: pick(PAYMENT_METHODS),
          paidAt,
        });
      }
    }
  }
  return { assessments, payments };
};

// =====================================================================
//  QISM 3 — Ma'lumotni batch + (transaction|fallback) bilan DB ga yozish
// =====================================================================

// Replica set bormi — transaction shu asosda yoqiladi.
const supportsTransactions = async () => {
  try {
    await mongoose.connection.db.admin().command({ replSetGetStatus: 1 });
    return true;
  } catch {
    return false;
  }
};

// Massivni partiyalab (batch) insert qiladi. Transaction bo'lsa session bilan.
const insertInBatches = async (Model, docs, session, label) => {
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const chunk = docs.slice(i, i + BATCH_SIZE);
    await Model.insertMany(chunk, { ordered: false, ...(session ? { session } : {}) });
    const done = Math.min(i + BATCH_SIZE, docs.length);
    process.stdout.write(`\r  ${label}: ${done}/${docs.length}   `);
  }
  process.stdout.write("\n");
};

const seed = async () => {
  const t0 = Date.now();
  await connectDB();

  const withTx = await supportsTransactions();
  logger.info(withTx ? "Transaction REJIMI (replica set)" : "FALLBACK rejimi (standalone — transaction yo'q)");

  // Andijon ma'lumotini tozalaymiz (boshqa viloyatlarga tegmaymiz)
  logger.info("Andijon eski ma'lumotlari tozalanmoqda...");
  const oldTp = await Taxpayer.find({ region: "andijon" }, "_id");
  const oldIds = oldTp.map((t) => t._id);
  await Promise.all([
    Taxpayer.deleteMany({ region: "andijon" }),
    TaxAssessment.deleteMany({ taxpayer: { $in: oldIds } }),
    TaxPayment.deleteMany({ taxpayer: { $in: oldIds } }),
  ]);

  // --- 1) Honadonlarni xotirada generatsiya qilamiz (progress bilan) ---
  logger.info(`${HOUSEHOLD_COUNT} honadon generatsiya qilinmoqda...`);
  const households = [];
  for (let i = 0; i < HOUSEHOLD_COUNT; i += 1) {
    households.push(buildHousehold(i));
    if ((i + 1) % 5000 === 0) process.stdout.write(`\r  honadon: ${i + 1}/${HOUSEHOLD_COUNT}   `);
  }
  process.stdout.write("\n");

  // --- 2) Hisobotlar (assessment + payment) ---
  logger.info("Soliq hisobotlari generatsiya qilinmoqda...");
  const year = new Date().getFullYear();
  const now = new Date();
  const assessments = [];
  const payments = [];
  households.forEach((hh, i) => {
    const built = buildAssessmentsFor(hh, year, now);
    assessments.push(...built.assessments);
    payments.push(...built.payments);
    if ((i + 1) % 5000 === 0) process.stdout.write(`\r  hisobot: ${i + 1}/${HOUSEHOLD_COUNT} honadon   `);
  });
  process.stdout.write("\n");
  logger.info(`Tayyor: ${households.length} honadon, ${assessments.length} hisob-kitob, ${payments.length} to'lov`);

  // --- 3) DB ga yozish: transaction (yoki fallback) + batch + progress ---
  const session = withTx ? await mongoose.startSession() : null;
  try {
    if (session) session.startTransaction();

    await insertInBatches(Taxpayer, households, session, "honadon →DB");
    await insertInBatches(TaxAssessment, assessments, session, "hisob-kitob →DB");
    await insertInBatches(TaxPayment, payments, session, "to'lov →DB");

    if (session) {
      await session.commitTransaction();
      logger.info("Transaction commit qilindi");
    }
  } catch (err) {
    if (session) await session.abortTransaction();
    throw err;
  } finally {
    if (session) await session.endSession();
  }

  const debtors = assessments.filter((a) => a.status !== "tolandi").length;
  const secs = ((Date.now() - t0) / 1000).toFixed(1);
  logger.info(`✅ Andijon seed tugadi: ${households.length} honadon, ${assessments.length} hisob-kitob, ${payments.length} to'lov, ${debtors} qarzdor (${secs}s)`);

  await disconnectDB();
};

seed().catch((err) => {
  logger.error({ err }, "Andijon seed xato");
  process.exit(1);
});
