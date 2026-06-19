// Central registry of TanStack Query keys - extend here when adding a feature
export const qk = Object.freeze({
  auth: {
    me: () => ["auth", "me"],
  },
  users: {
    all: () => ["users"],
    list: (params) => ["users", "list", params],
    one: (id) => ["users", "detail", id],
  },
  activityLogs: {
    all: () => ["activityLogs"],
    list: (params) => ["activityLogs", "list", params],
    one: (id) => ["activityLogs", "detail", id],
    stats: (params) => ["activityLogs", "stats", params],
  },
  soliq: {
    all: () => ["soliq"],
    taxpayers: (params) => ["soliq", "taxpayers", params],
    taxpayer: (id) => ["soliq", "taxpayer", id],
    assessments: (params) => ["soliq", "assessments", params],
    debtors: (params) => ["soliq", "debtors", params],
    summary: (params) => ["soliq", "summary", params],
    timeseries: (params) => ["soliq", "timeseries", params],
    breakdown: (params) => ["soliq", "breakdown", params],
  },
});
