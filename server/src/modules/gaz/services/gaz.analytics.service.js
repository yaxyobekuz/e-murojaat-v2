import GasSubscriber from "../../../models/gasSubscriber.model.js";
import GasUsage from "../../../models/gasUsage.model.js";
import GasPayment from "../../../models/gasPayment.model.js";
import GasRequest from "../../../models/gasRequest.model.js";
import GasMeter from "../../../models/gasMeter.model.js";
import {
  SUBSCRIBER_TYPE_VALUES,
  SUBSCRIBER_STATUS_VALUES,
  METER_TYPE_VALUES,
  PAYMENT_METHOD_VALUES,
} from "../gaz.constants.js";

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

const buildSubscriberFilter = ({ region, type }) => {
  const filter = {};
  if (region) filter.region = region;
  if (type) filter.type = type;
  return filter;
};

// Resolve subscriber ids for a region (so usage/payment metrics can be region-scoped)
const subscriberIdsForRegion = async (region) => {
  if (!region) return null;
  const subs = await GasSubscriber.find({ region }).select("_id");
  return subs.map((s) => s._id);
};

const dateRange = ({ from, to }) => {
  const range = {};
  if (from) range.$gte = new Date(from);
  if (to) range.$lte = new Date(to);
  return Object.keys(range).length ? range : null;
};

export const summary = async (filters) => {
  const subFilter = buildSubscriberFilter(filters);
  const ids = await subscriberIdsForRegion(filters.region);
  const now = new Date();
  const monthStart = startOfMonth(now);

  const usageMatch = { date: { $gte: monthStart } };
  const payMatch = { paidAt: { $gte: monthStart } };
  if (ids) {
    usageMatch.subscriberId = { $in: ids };
    payMatch.subscriberId = { $in: ids };
  }

  const [totalSubscribers, monthUsage, monthRevenue, debtAgg] =
    await Promise.all([
      GasSubscriber.countDocuments(subFilter),
      GasUsage.aggregate([
        { $match: usageMatch },
        { $group: { _id: null, sum: { $sum: "$volumeM3" } } },
      ]),
      GasPayment.aggregate([
        { $match: payMatch },
        { $group: { _id: null, sum: { $sum: "$amountUzs" } } },
      ]),
      GasSubscriber.aggregate([
        { $match: subFilter },
        { $group: { _id: null, sum: { $sum: "$debtUzs" } } },
      ]),
    ]);

  return [
    { key: "totalSubscribers", label: "Jami abonentlar", value: totalSubscribers },
    { key: "monthUsageM3", label: "Bu oylik sarf (m³)", value: Math.round(monthUsage[0]?.sum || 0) },
    { key: "monthRevenue", label: "Bu oylik tushum", value: Math.round(monthRevenue[0]?.sum || 0) },
    { key: "totalDebt", label: "Umumiy qarzdorlik", value: Math.round(debtAgg[0]?.sum || 0) },
  ];
};

// Monthly usage (m³), revenue (paid) and charged (billed) over the last 12 months
export const timeseries = async (filters) => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);
  const ids = await subscriberIdsForRegion(filters.region);

  const usageMatch = { date: { $gte: start } };
  const payMatch = { paidAt: { $gte: start } };
  if (ids) {
    usageMatch.subscriberId = { $in: ids };
    payMatch.subscriberId = { $in: ids };
  }

  const [usageRows, payRows] = await Promise.all([
    GasUsage.aggregate([
      { $match: usageMatch },
      {
        $group: {
          _id: { y: { $year: "$date" }, m: { $month: "$date" } },
          volumeM3: { $sum: "$volumeM3" },
          amountUzs: { $sum: "$amountUzs" },
        },
      },
    ]),
    GasPayment.aggregate([
      { $match: payMatch },
      {
        $group: {
          _id: { y: { $year: "$paidAt" }, m: { $month: "$paidAt" } },
          amountUzs: { $sum: "$amountUzs" },
        },
      },
    ]),
  ]);

  const usageMap = new Map(usageRows.map((r) => [`${r._id.y}-${r._id.m}`, r]));
  const payMap = new Map(payRows.map((r) => [`${r._id.y}-${r._id.m}`, r]));

  const result = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const month = `${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
    const u = usageMap.get(key);
    const p = payMap.get(key);
    result.push({
      month,
      value: Math.round(u?.volumeM3 || 0),
      charged: Math.round(u?.amountUzs || 0),
      revenue: Math.round(p?.amountUzs || 0),
    });
  }
  return result;
};

// Breakdown by region | type | status | serviceType | method | meterType
export const breakdown = async (filters, by = "region") => {
  const subFilter = buildSubscriberFilter(filters);

  if (by === "type" || by === "status" || by === "region") {
    const field = by === "type" ? "$type" : by === "status" ? "$status" : "$region";
    const rows = await GasSubscriber.aggregate([
      { $match: subFilter },
      { $group: { _id: field, value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    if (by === "type") {
      const map = new Map(rows.map((r) => [r._id, r.value]));
      return SUBSCRIBER_TYPE_VALUES.map((t) => ({ key: t, value: map.get(t) || 0 }));
    }
    if (by === "status") {
      const map = new Map(rows.map((r) => [r._id, r.value]));
      return SUBSCRIBER_STATUS_VALUES.map((s) => ({ key: s, value: map.get(s) || 0 }));
    }
    return rows.map((r) => ({ key: r._id, value: r.value }));
  }

  if (by === "meterType") {
    const rows = await GasMeter.aggregate([
      { $group: { _id: "$type", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    const map = new Map(rows.map((r) => [r._id, r.value]));
    return METER_TYPE_VALUES.map((t) => ({ key: t, value: map.get(t) || 0 }));
  }

  if (by === "method") {
    const range = dateRange(filters);
    const match = range ? { paidAt: range } : {};
    const rows = await GasPayment.aggregate([
      { $match: match },
      { $group: { _id: "$method", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    const map = new Map(rows.map((r) => [r._id, r.value]));
    return PAYMENT_METHOD_VALUES.map((m) => ({ key: m, value: map.get(m) || 0 }));
  }

  // serviceType | requestStatus → from requests
  const field = by === "serviceType" ? "$serviceType" : "$status";
  const reqFilter = {};
  if (filters.region) reqFilter.region = filters.region;
  const range = dateRange(filters);
  if (range) reqFilter.createdAt = range;
  const rows = await GasRequest.aggregate([
    { $match: reqFilter },
    { $group: { _id: field, value: { $sum: 1 } } },
    { $sort: { value: -1 } },
  ]);
  return rows.map((r) => ({ key: r._id, value: r.value }));
};
