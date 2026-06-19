import mongoose from "mongoose";
import Taxpayer from "../../../models/taxpayer.model.js";
import TaxAssessment from "../../../models/taxAssessment.model.js";
import TaxPayment from "../../../models/taxPayment.model.js";
import ApiError from "../../../utils/ApiError.js";
import { confirmPayment } from "./soliq.provider.js";

const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// Status'ni to'langan/qoldiq asosida qayta hisoblaydi.
const recomputeStatus = (a) => {
  const total = a.amount_uzs + a.penya_uzs;
  if (a.paidAmount_uzs <= 0) return "qarzdor"; // muddat tekshiruvi seedda/analitikada
  if (a.paidAmount_uzs >= total) return "tolandi";
  return "qisman";
};

// ---- To'lovchilar ----

export const listTaxpayers = async ({ region, type, search, page = 1, limit = 20 }) => {
  const filter = {};
  if (region) filter.region = region;
  if (type) filter.type = type;
  if (search && search.trim()) {
    const rx = new RegExp(escapeRegex(search.trim()), "i");
    filter.$or = [{ fullName: rx }, { stir: rx }, { jshshir: rx }];
  }

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    Taxpayer.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Taxpayer.countDocuments(filter),
  ]);
  return { items, total };
};

export const getTaxpayer = async (id) => {
  const taxpayer = await Taxpayer.findById(id);
  if (!taxpayer) throw new ApiError(404, "Soliq to'lovchi topilmadi");

  const assessments = await TaxAssessment.find({ taxpayer: id }).sort({ year: -1 });
  const payments = await TaxPayment.find({ taxpayer: id })
    .sort({ paidAt: -1 })
    .limit(50);

  const debt_uzs = assessments.reduce((sum, a) => sum + a.debt_uzs, 0);
  return { taxpayer, assessments, payments, debt_uzs };
};

export const createTaxpayer = async (body) => {
  const exists = await Taxpayer.findOne({ stir: body.stir });
  if (exists) throw new ApiError(409, "Bu STIR allaqachon ro'yxatda");
  return Taxpayer.create(body);
};

export const updateTaxpayer = async (id, body) => {
  const taxpayer = await Taxpayer.findById(id);
  if (!taxpayer) throw new ApiError(404, "Soliq to'lovchi topilmadi");
  Object.assign(taxpayer, body);
  await taxpayer.save();
  return taxpayer;
};

// ---- Soliqlar (hisob-kitoblar) ----

export const listAssessments = async ({
  region,
  taxType,
  status,
  year,
  page = 1,
  limit = 20,
}) => {
  const filter = {};
  if (region) filter.region = region;
  if (taxType) filter.taxType = taxType;
  if (status) filter.status = status;
  if (year) filter.year = Number(year);

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    TaxAssessment.find(filter)
      .populate("taxpayer", "fullName stir region")
      .sort({ dueDate: -1 })
      .skip(skip)
      .limit(limit),
    TaxAssessment.countDocuments(filter),
  ]);
  return { items, total };
};

// ---- Qarzdorlik ----

export const listDebtors = async ({ region, page = 1, limit = 20 }) => {
  const match = { status: { $in: ["qarzdor", "qisman"] } };
  if (region) match.region = region;

  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    TaxAssessment.find(match)
      .populate("taxpayer", "fullName stir region phone")
      .sort({ penya_uzs: -1 })
      .skip(skip)
      .limit(limit),
    TaxAssessment.countDocuments(match),
  ]);
  return { items, total };
};

// ---- To'lov qilish (mock) ----

export const payAssessment = async (assessmentId, { amount_uzs, method }) => {
  const assessment = await TaxAssessment.findById(assessmentId);
  if (!assessment) throw new ApiError(404, "Soliq hisob-kitobi topilmadi");

  const owed = assessment.amount_uzs + assessment.penya_uzs - assessment.paidAmount_uzs;
  if (owed <= 0) throw new ApiError(400, "Bu soliq allaqachon to'langan");
  const pay = Math.min(amount_uzs, owed);

  const confirm = await confirmPayment({ amount_uzs: pay, method });
  if (!confirm.ok) throw new ApiError(502, "To'lov tasdiqlanmadi");

  assessment.paidAmount_uzs += pay;
  assessment.status = recomputeStatus(assessment);
  await assessment.save();

  const payment = await TaxPayment.create({
    taxpayer: assessment.taxpayer,
    assessment: assessment._id,
    amount_uzs: pay,
    method,
  });

  return { assessment, payment };
};

// ---- Analitika ----

export const summary = async ({ region } = {}) => {
  const aMatch = region ? { region } : {};

  const [taxpayers, agg, paymentAgg] = await Promise.all([
    Taxpayer.countDocuments(region ? { region } : {}),
    TaxAssessment.aggregate([
      { $match: aMatch },
      {
        $group: {
          _id: null,
          assessed: { $sum: "$amount_uzs" },
          paid: { $sum: "$paidAmount_uzs" },
          penya: { $sum: "$penya_uzs" },
        },
      },
    ]),
    TaxPayment.aggregate([
      ...(region
        ? [
            {
              $lookup: {
                from: "taxpayers",
                localField: "taxpayer",
                foreignField: "_id",
                as: "tp",
              },
            },
            { $unwind: "$tp" },
            { $match: { "tp.region": region } },
          ]
        : []),
      { $group: { _id: null, total: { $sum: "$amount_uzs" } } },
    ]),
  ]);

  const a = agg[0] || { assessed: 0, paid: 0, penya: 0 };
  const revenue = paymentAgg[0]?.total || 0;
  const debt = Math.max(0, a.assessed + a.penya - a.paid);
  const collectionRate = a.assessed ? Math.round((a.paid / a.assessed) * 100) : 0;

  return [
    { key: "taxpayers", label: "Soliq to'lovchilar", value: taxpayers },
    { key: "revenue", label: "Jami tushum", value: revenue, isMoney: true },
    { key: "debt", label: "Umumiy qarzdorlik", value: debt, isMoney: true },
    { key: "collectionRate", label: "Undirish ulushi", value: collectionRate, suffix: "%" },
    { key: "penya", label: "Penya jami", value: a.penya, isMoney: true },
  ];
};

// Oxirgi N oydagi tushum dinamikasi.
export const timeseries = async ({ region, months = 12 } = {}) => {
  const since = new Date();
  since.setMonth(since.getMonth() - (months - 1));
  since.setDate(1);
  since.setHours(0, 0, 0, 0);

  const rows = await TaxPayment.aggregate([
    { $match: { paidAt: { $gte: since } } },
    ...(region
      ? [
          {
            $lookup: {
              from: "taxpayers",
              localField: "taxpayer",
              foreignField: "_id",
              as: "tp",
            },
          },
          { $unwind: "$tp" },
          { $match: { "tp.region": region } },
        ]
      : []),
    {
      $group: {
        _id: { y: { $year: "$paidAt" }, m: { $month: "$paidAt" } },
        value: { $sum: "$amount_uzs" },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);

  // Bo'sh oylarni 0 bilan to'ldirib, izchil 12 oy qaytaramiz.
  const map = new Map(rows.map((r) => [`${r._id.y}-${r._id.m}`, r.value]));
  const out = [];
  const cur = new Date(since);
  for (let i = 0; i < months; i += 1) {
    const y = cur.getFullYear();
    const m = cur.getMonth() + 1;
    out.push({ month: `${String(m).padStart(2, "0")}.${y}`, value: map.get(`${y}-${m}`) || 0 });
    cur.setMonth(cur.getMonth() + 1);
  }
  return out;
};

// Kesim: region | type | taxType | method.
export const breakdown = async ({ by = "region", region } = {}) => {
  if (by === "type") {
    const match = region ? { region } : {};
    const rows = await Taxpayer.aggregate([
      ...(region ? [{ $match: { region } }] : []),
      { $group: { _id: "$type", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    return rows.map((r) => ({ key: r._id, value: r.value }));
  }

  if (by === "taxType") {
    const match = region ? { region } : {};
    const rows = await TaxAssessment.aggregate([
      { $match: match },
      { $group: { _id: "$taxType", value: { $sum: "$amount_uzs" } } },
      { $sort: { value: -1 } },
    ]);
    return rows.map((r) => ({ key: r._id, value: r.value }));
  }

  if (by === "method") {
    const rows = await TaxPayment.aggregate([
      { $group: { _id: "$method", value: { $sum: "$amount_uzs" } } },
      { $sort: { value: -1 } },
    ]);
    return rows.map((r) => ({ key: r._id, value: r.value }));
  }

  // by === "region" (default): viloyatlar kesimida tushum.
  const rows = await TaxAssessment.aggregate([
    { $group: { _id: "$region", value: { $sum: "$paidAmount_uzs" } } },
    { $sort: { value: -1 } },
  ]);
  return rows.map((r) => ({ key: r._id, value: r.value }));
};
