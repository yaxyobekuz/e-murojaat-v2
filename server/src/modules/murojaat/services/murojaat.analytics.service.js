import Appeal from "../../../models/appeal.model.js";
import Organization from "../../../models/organization.model.js";
import {
  APPEAL_STATUSES,
  APPEAL_RESULTS,
  OPEN_STATUSES,
} from "../murojaat.constants.js";

// Shared Mongo filter for every analytics query
const buildFilter = ({ region, from, to, type, category }) => {
  const filter = {};
  if (region) filter.region = region;
  if (type) filter.type = type;
  if (category) filter.category = category;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  return filter;
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

// Days between appeal creation and its first "answered" timeline event
const responseDays = (appeal) => {
  const answered = appeal.events?.find(
    (e) => e.status === APPEAL_STATUSES.ANSWERED,
  );
  if (!answered) return null;
  const days = (new Date(answered.createdAt) - new Date(appeal.createdAt)) / 86400000;
  return Math.max(0, days);
};

export const summary = async (filters) => {
  const base = buildFilter(filters);
  const now = new Date();
  const monthStart = startOfMonth(now);

  const [total, newThisMonth, inReview, resolved, satisfied, overdue, answered] =
    await Promise.all([
      Appeal.countDocuments(base),
      Appeal.countDocuments({
        ...base,
        createdAt: { ...(base.createdAt || {}), $gte: monthStart },
      }),
      Appeal.countDocuments({ ...base, status: { $in: OPEN_STATUSES } }),
      Appeal.countDocuments({ ...base, result: { $ne: null } }),
      Appeal.countDocuments({ ...base, result: APPEAL_RESULTS.SATISFIED }),
      Appeal.countDocuments({
        ...base,
        deadline: { $lt: now },
        status: { $in: OPEN_STATUSES },
      }),
      Appeal.find({ ...base, status: { $ne: APPEAL_STATUSES.NEW } }).select(
        "createdAt events",
      ),
    ]);

  const satisfactionRate = resolved
    ? Math.round((satisfied / resolved) * 100)
    : 0;

  const durations = answered.map(responseDays).filter((d) => d !== null);
  const avgResponseDays = durations.length
    ? Math.round((durations.reduce((a, b) => a + b, 0) / durations.length) * 10) / 10
    : 0;

  return [
    { key: "total", label: "Jami murojaatlar", value: total },
    { key: "newThisMonth", label: "Bu oydagi yangi", value: newThisMonth },
    { key: "inReview", label: "Ko'rib chiqilmoqda", value: inReview },
    { key: "satisfactionRate", label: "Qanoatlantirish ulushi", value: satisfactionRate },
    { key: "overdue", label: "Muddati o'tgan", value: overdue },
    { key: "avgResponseDays", label: "O'rtacha javob (kun)", value: avgResponseDays },
  ];
};

// Monthly appeal dynamics over the last 12 months
export const timeseries = async (filters) => {
  const base = buildFilter(filters);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const rows = await Appeal.aggregate([
    { $match: { ...base, createdAt: { ...(base.createdAt || {}), $gte: start } } },
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
        value: { $sum: 1 },
      },
    },
  ]);

  const map = new Map(rows.map((r) => [`${r._id.y}-${r._id.m}`, r.value]));
  const result = [];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
    const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
    const month = `${String(d.getMonth() + 1).padStart(2, "0")}.${d.getFullYear()}`;
    result.push({ month, value: map.get(key) || 0 });
  }
  return result;
};

// Breakdown by region | type | category | status | result | organization
export const breakdown = async (filters, by = "category") => {
  const base = buildFilter(filters);

  // Organization rating: average response time (days), slowest first
  if (by === "organization") {
    const appeals = await Appeal.find({
      ...base,
      organizationId: { $ne: null },
      status: { $in: [APPEAL_STATUSES.ANSWERED, APPEAL_STATUSES.CLOSED] },
    }).select("organizationId createdAt events");

    const acc = new Map();
    for (const a of appeals) {
      const d = responseDays(a);
      if (d === null || !a.organizationId) continue;
      const id = String(a.organizationId);
      const cur = acc.get(id) || { sum: 0, count: 0 };
      cur.sum += d;
      cur.count += 1;
      acc.set(id, cur);
    }

    const orgs = await Organization.find().select("name");
    const nameById = new Map(orgs.map((o) => [String(o._id), o.name]));
    return [...acc.entries()]
      .map(([id, { sum, count }]) => ({
        key: nameById.get(id) || "Noma'lum",
        value: Math.round((sum / count) * 10) / 10,
      }))
      .sort((a, b) => b.value - a.value);
  }

  const fieldMap = {
    region: "$region",
    type: "$type",
    category: "$category",
    status: "$status",
    result: "$result",
  };
  const field = fieldMap[by] || "$category";

  const match = { ...base };
  if (by === "result") match.result = { $ne: null };

  const rows = await Appeal.aggregate([
    { $match: match },
    { $group: { _id: field, value: { $sum: 1 } } },
    { $sort: { value: -1 } },
  ]);
  return rows.filter((r) => r._id).map((r) => ({ key: r._id, value: r.value }));
};
