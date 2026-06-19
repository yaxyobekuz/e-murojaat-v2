import ElectricSubscriber from "../../../models/electricSubscriber.model.js";

// Mock provider for HET Billing (het.uz). Demo: reads from our DB.
// Swap this single module for the real billing API later — callers stay unchanged.

export const getByAccountNumber = async (accountNumber) => {
  const subscriber = await ElectricSubscriber.findOne({ accountNumber });
  return subscriber || null;
};

export const isAccountNumberTaken = async (accountNumber) => {
  const count = await ElectricSubscriber.countDocuments({ accountNumber });
  return count > 0;
};
