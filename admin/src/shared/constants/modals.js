// Modal keys - also used as the Redux store name; never hardcode the string elsewhere
export const MODAL = Object.freeze({
  USER_CREATE: "user:create",
  USER_EDIT: "user:edit",
  USER_DELETE: "user:delete",
  ACTIVITY_LOG_DETAIL: "activityLog:detail",

  SOLIQ_TAXPAYER_CREATE: "soliq:taxpayerCreate",
  SOLIQ_PAY: "soliq:pay",
  SOLIQ_BUSINESS_HISTORY: "soliq:businessHistory",

  YER_REQUEST_STATUS: "yer:requestStatus",
  GAZ_REQUEST_STATUS: "gaz:requestStatus",
  SVET_REQUEST_STATUS: "svet:requestStatus",
  MUROJAAT_APPEAL_ACTION: "murojaat:appealAction",
  MUROJAAT_ORG_CREATE: "murojaat:orgCreate",

  MSK_APPEAL_DETAIL: "msk:appealDetail",
});
