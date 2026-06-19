import Property from "../../../models/property.model.js";
import PropertyRequest from "../../../models/propertyRequest.model.js";
import {
  REQUEST_STATUSES,
  PROPERTY_TYPE_VALUES,
} from "../yer.constants.js";

// Build a Mongo date/region/type filter shared by every analytics query
// `type` (property type) doesn't apply to requests — only region/date/serviceType do
const buildRequestFilter = ({ region, from, to, serviceType }) => {
  const filter = {};
  if (region) filter.region = region;
  if (serviceType) filter.serviceType = serviceType;
  if (from || to) {
    filter.createdAt = {};
    if (from) filter.createdAt.$gte = new Date(from);
    if (to) filter.createdAt.$lte = new Date(to);
  }
  return filter;
};

const buildPropertyFilter = ({ region, type }) => {
  const filter = {};
  if (region) filter.region = region;
  if (type) filter.type = type;
  return filter;
};

const startOfMonth = (d) => new Date(d.getFullYear(), d.getMonth(), 1);

export const summary = async (filters) => {
  const reqFilter = buildRequestFilter(filters);
  const propFilter = buildPropertyFilter(filters);

  const now = new Date();
  const monthStart = startOfMonth(now);

  const [totalProperties, newRequests, pending, doneRequests] =
    await Promise.all([
      Property.countDocuments(propFilter),
      PropertyRequest.countDocuments({
        ...reqFilter,
        createdAt: { ...(reqFilter.createdAt || {}), $gte: monthStart },
      }),
      PropertyRequest.countDocuments({
        ...reqFilter,
        status: {
          $in: [
            REQUEST_STATUSES.NEW,
            REQUEST_STATUSES.REVIEW,
            REQUEST_STATUSES.MEASURE,
            REQUEST_STATUSES.PAYMENT,
          ],
        },
      }),
      PropertyRequest.find({
        ...reqFilter,
        status: REQUEST_STATUSES.DONE,
      }).select("createdAt events"),
    ]);

  // Average review duration (days) for completed requests
  let avgReviewDays = 0;
  if (doneRequests.length) {
    const totalDays = doneRequests.reduce((sum, r) => {
      const doneEvent = [...r.events]
        .reverse()
        .find((e) => e.status === REQUEST_STATUSES.DONE);
      const end = doneEvent ? doneEvent.createdAt : r.createdAt;
      const days = (new Date(end) - new Date(r.createdAt)) / 86400000;
      return sum + Math.max(0, days);
    }, 0);
    avgReviewDays = Math.round((totalDays / doneRequests.length) * 10) / 10;
  }

  return [
    { key: "totalProperties", label: "Ro'yxatdagi obyektlar", value: totalProperties },
    { key: "newRequests", label: "Bu oydagi yangi arizalar", value: newRequests },
    { key: "pending", label: "Ko'rib chiqilmoqda", value: pending },
    { key: "avgReviewDays", label: "O'rtacha muddat (kun)", value: avgReviewDays },
  ];
};

// Monthly request dynamics over the last 12 months
export const timeseries = async (filters) => {
  const reqFilter = buildRequestFilter(filters);
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 11, 1);

  const rows = await PropertyRequest.aggregate([
    { $match: { ...reqFilter, createdAt: { ...(reqFilter.createdAt || {}), $gte: start } } },
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

// Breakdown by region | type | status | serviceType
export const breakdown = async (filters, by = "region") => {
  if (by === "type") {
    const propFilter = buildPropertyFilter(filters);
    const rows = await Property.aggregate([
      { $match: propFilter },
      { $group: { _id: "$type", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    // Ensure all property types appear even with 0
    const map = new Map(rows.map((r) => [r._id, r.value]));
    return PROPERTY_TYPE_VALUES.map((t) => ({ key: t, value: map.get(t) || 0 }));
  }

  if (by === "region") {
    const propFilter = buildPropertyFilter(filters);
    const rows = await Property.aggregate([
      { $match: propFilter },
      { $group: { _id: "$region", value: { $sum: 1 } } },
      { $sort: { value: -1 } },
    ]);
    return rows.map((r) => ({ key: r._id, value: r.value }));
  }

  // status | serviceType → from requests
  const field = by === "serviceType" ? "$serviceType" : "$status";
  const reqFilter = buildRequestFilter(filters);
  const rows = await PropertyRequest.aggregate([
    { $match: reqFilter },
    { $group: { _id: field, value: { $sum: 1 } } },
    { $sort: { value: -1 } },
  ]);
  return rows.map((r) => ({ key: r._id, value: r.value }));
};
