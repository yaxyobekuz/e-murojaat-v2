import GasSubscriber from "../../../models/gasSubscriber.model.js";

// Mock provider for the gas billing system (hududgaz.uz / HG Billing).
// Demo: reads from our DB. Swap this single module for the real API later —
// callers stay unchanged.

export const getByAccountNumber = async (accountNumber) => {
  const subscriber = await GasSubscriber.findOne({ accountNumber }).populate(
    "meterId",
  );
  return subscriber || null;
};

export const isAccountNumberTaken = async (accountNumber) => {
  const count = await GasSubscriber.countDocuments({ accountNumber });
  return count > 0;
};
