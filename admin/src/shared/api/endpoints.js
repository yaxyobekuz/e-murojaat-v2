export const ENDPOINTS = Object.freeze({
  auth: {
    login: "/auth/login",
    logout: "/auth/logout",
    refresh: "/auth/refresh",
    me: "/auth/me",
    registerUser: "/auth/register-user",
  },
  users: {
    base: "/users",
    byId: (id) => `/users/${id}`,
  },
  activityLogs: {
    base: "/activity-logs",
    byId: (id) => `/activity-logs/${id}`,
    stats: "/activity-logs/stats",
  },
  soliq: {
    taxpayers: "/soliq/taxpayers",
    taxpayerById: (id) => `/soliq/taxpayers/${id}`,
    assessments: "/soliq/assessments",
    debtors: "/soliq/debtors",
    pay: (id) => `/soliq/assessments/${id}/pay`,
    summary: "/soliq/analytics/summary",
    timeseries: "/soliq/analytics/timeseries",
    breakdown: "/soliq/analytics/breakdown",
  },
});
