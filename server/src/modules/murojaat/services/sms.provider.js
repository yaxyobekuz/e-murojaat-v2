import logger from "../../../config/logger.js";

// demo: notifies the citizen by SMS; later swap for a real gateway (Eskiz/Play Mobile).
export const sendSms = async (phone, message) => {
  logger.info({ phone, message }, "SMS (mock) yuborildi");
  return { delivered: true };
};
