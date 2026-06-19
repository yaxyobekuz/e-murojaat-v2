import ElectricSubscriber from "../../../models/electricSubscriber.model.js";
import ElectricUsage from "../../../models/electricUsage.model.js";
import ElectricPayment from "../../../models/electricPayment.model.js";
import ElectricViolation from "../../../models/electricViolation.model.js";
import {
  SUBSCRIBER_TYPE_VALUES,
  PAYMENT_METHOD_VALUES,
  VIOLATION_TYPE_VALUES,
} from "../svet.constants.js";

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);
const monthLabel = (d) =>
  `${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;

const dateRange = ({ from, to }) => {
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) range.$lte = new Date(to);
  return Object.keys(range).length ? range : null;
};

const subscriberFilter = ({ region, type }) => {
  const filter = {};
  if (region) filter.region = region;
  if (type) filter.type = type;
  return filter;
};

// KPI cards
export const summary = async (filters) => {
  const subFilter = subscriberFilter(filters);
  const now = new Date();
  const monthStart = startOfMonth(now);
  const range = dateRange(filters);

  const usageMatch = { region: filters.region || undefined };
  if (!filters.region) delete usageMatch.region;

  const [totalSubscribers, debtAgg, monthUsageAgg, monthRevenueAgg] =
    await Promise.all([
      ElectricSubscriber.countDocuments(subFilter),
      ElectricSubscriber.aggregate([
        { $match: subFilter },
        { $group: { _id: null, debt: { $sum: "$debtUzs" } } },
      ]),
      ElectricUsage.aggregate([
        {
          $match: {
            ...usageMatch,
            date: { $gte: range?.$gte || monthStart, ...(range?.$lte ? { $lte: range.$lte } : {}) },
          },
        },
        { $group: { _id: null, kwh: { $sum: "$usageKwh" } } },
      ]),
      ElectricPayment.aggregate([
        {
          $match: {
            ...usageMatch,
            paidAt: { $gte: range?.$gte || monthStart, ...(range?.$lte ? { $lte: range.$lte } : {}) },
          },
        },
        { $group: { _id: null, sum: { $sum: "$amountUzs" } } },
      ]),
    ]);

  return [
    { key: "totalSubscribers", label: "Jami abonentlar", value: totalSubscribers },
    { key: "monthUsage", label: "Bu oylik sarf (kVt·soat)", value: monthUsageAgg[0]?.kwh || 0 },
    { key: "monthRevenue", label: "Bu oylik tushum", value: monthRevenueAgg[0]?.sum || 0 },
    { key: "totalDebt", label: "Umumiy qarzdorlik", value: debtAgg[0]?.debt || 0 },
  ];
};

// Monthly consumption (kWh) over the last 12 months — summer peak shows up
export const timeseries = async (filters) => {
  const match = {};
  if (filters.region) match.region = filters.region;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const range = dateRange(filters);
  match.date = { $gte: range?.$gte || start, ...(range?.$lte ? { $lte: range.$lte } : {}) };

  const rows = await ElectricUsage.aggregate([
    { $match: match },
    {
      $group: {
        _id: { y: { $year: "$date" }, m: { $month: "$date" } },
        value: { $sum: "$usageKwh" },
      },
    },
  ]);

  const map = new Map(rows.map((r) => [`${r._id.y}-${r._id.m}`, Math.round(r.value)]));
  const result = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    result.push({ month: monthLabel(d), value: map.get(`${d.getFullYear()}-${d.getMonth() + 1}`) || 0 });
  }
  return result;
};

// Stacked: within-norm vs over-norm consumption per month (Svet-specific)
export const normSeries = async (filters) => {
  const match = {};
  if (filters.region) match.region = filters.region;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  match.date = { $gte: start };

  const rows = await ElectricUsage.aggregate([
    { $match: match },
    {
      $group: {
        _id: { y: { $year: "$date" }, m: { $month: "$date" } },
        within: { $sum: "$withinNormKwh" },
        over: { $sum: "$overNormKwh" },
      },
    },
  ]);

  const map = new Map(
    rows.map((r) => [
      `${r._id.y}-${r._id.m}`,
      { within: Math.round(r.within), over: Math.round(r.over) },
    ]),
  );
  const result = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const v = map.get(`${d.getFullYear()}-${d.getMonth() + 1}`) || { within: 0, over: 0 };
    result.push({ month: monthLabel(d), within: v.within, over: v.over });
  }
  return result;
};

// Combo: monthly revenue (payments) vs outstanding debt snapshot
export const revenueDebtSeries = async (filters) => {
  const match = {};
  if (filters.region) match.region = filters.region;
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const rows = await ElectricPayment.aggregate([
    { $match: { ...match, paidAt: { $gte: start } } },
    {
      $group: {
        _id: { y: { $year: "$paidAt" }, m: { $month: "$paidAt" } },
        revenue: { $sum: "$amountUzs" },
      },
    },
  ]);

  const map = new Map(rows.map((r) => [`${r._id.y}-${r._id.m}`, r.revenue]));
  const result = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const revenue = map.get(`${d.getFullYear()}-${d.getMonth() + 1}`) || 0;
    result.push({ month: monthLabel(d), revenue: Math.round(revenue) });
  }
  return result;
};

// Breakdown by region | type | method | violationType | status
export const breakdown = async (filters, by = "region") => {
  if (by === "type") {
    const rows = await ElectricSubscriber.aggregate([
      { $match: subscriberFilter(filters) },
      { $group: { _id: "$type", value: { $sum: 1 } } },
    ]);
    const map = new Map(rows.map((r) => [r._id, r.value]));
    return SUBSCRIBER_TYPE_VALUES.map((t) => ({ key: t, value: map.get(t) || 0 }));
  }

  if (by === "region") {
    const rows = await ElectricSubscriber.aggregate([
      { $match: subscriberFilter(filters) },
      { $group: { _id: "$region", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    return rows.map((r) => ({ key: r._id, value: r.value }));
  }

  if (by === "method") {
    const match = {};
    if (filters.region) match.region = filters.region;
    const rows = await ElectricPayment.aggregate([
      { $match: match },
      { $group: { _id: "$method", value: { $sum: 1 } } },
    ]);
    const map = new Map(rows.map((r) => [r._id, r.value]));
    return PAYMENT_METHOD_VALUES.map((m) => ({ key: m, value: map.get(m) || 0 }));
  }

  if (by === "violationType") {
    const match = {};
    if (filters.region) match.region = filters.region;
    const rows = await ElectricViolation.aggregate([
      { $match: match },
      { $group: { _id: "$type", value: { $sum: 1 } } },
    ]);
    const map = new Map(rows.map((r) => [r._id, r.value]));
    return VIOLATION_TYPE_VALUES.map((t) => ({ key: t, value: map.get(t) || 0 }));
  }

  // status → from violations (act status overview)
  const match = {};
  if (filters.region) match.region = filters.region;
  const rows = await ElectricViolation.aggregate([
    { $match: match },
    { $group: { _id: "$status", value: { $sum: 1 } } },
    { $sort: { value: -1 } },
  ]);
  return rows.map((r) => ({ key: r._id, value: r.value }));
};
