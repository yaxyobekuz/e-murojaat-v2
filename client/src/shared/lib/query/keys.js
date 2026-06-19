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
  },
  yer: {
    all: () => ["yer"],
    myProperties: () => ["yer", "my", "properties"],
    myRequests: () => ["yer", "my", "requests"],
    property: (id) => ["yer", "property", id],
    registry: (cadastreNumber) => ["yer", "registry", cadastreNumber],
  },
  gaz: {
    all: () => ["gaz"],
    myAccount: () => ["gaz", "my", "account"],
    myUsage: () => ["gaz", "my", "usage"],
    myPayments: () => ["gaz", "my", "payments"],
    myRequests: () => ["gaz", "my", "requests"],
    registry: (accountNumber) => ["gaz", "registry", accountNumber],
  },
  svet: {
    all: () => ["svet"],
    myAccount: () => ["svet", "my", "account"],
    myRequests: () => ["svet", "my", "requests"],
  },
  murojaat: {
    all: () => ["murojaat"],
    myAppeals: () => ["murojaat", "my", "appeals"],
    organizations: () => ["murojaat", "organizations"],
    track: (appealNumber) => ["murojaat", "track", appealNumber],
  },
});
