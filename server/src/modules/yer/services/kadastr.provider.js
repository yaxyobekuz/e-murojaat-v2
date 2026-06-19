import Property from "../../../models/property.model.js";

// Mock provider for the cadastre registry (davreestr.uz). Demo: reads from our DB.
// Swap this single module for the real API later — callers stay unchanged.

export const getByCadastreNumber = async (cadastreNumber) => {
  const property = await Property.findOne({ cadastreNumber });
  return property || null;
};

export const isCadastreNumberTaken = async (cadastreNumber) => {
  const count = await Property.countDocuments({ cadastreNumber });
  return count > 0;
};
