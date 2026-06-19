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
    pay: (id) => `/soliq/assessments/${id}/pay`,
  },
  yer: {
    myProperties: "/yer/my/properties",
    myRequests: "/yer/my/requests",
    propertyById: (id) => `/yer/properties/${id}`,
    registryCheck: "/yer/registry/check",
  },
  gaz: {
    myAccount: "/gaz/my/account",
    myUsage: "/gaz/my/usage",
    myPayments: "/gaz/my/payments",
    myRequests: "/gaz/my/requests",
    registryCheck: "/gaz/registry/check",
  },
  svet: {
    myAccount: "/svet/my/account",
    myRequests: "/svet/my/requests",
    myPayments: "/svet/my/payments",
    accountCheck: "/svet/account/check",
  },
  murojaat: {
    myAppeals: "/murojaat/my/appeals",
    organizations: "/murojaat/organizations",
    track: "/murojaat/track",
  },
});
