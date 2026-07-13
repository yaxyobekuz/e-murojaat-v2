// Har rol tahrirlashi mumkin bo'lgan house-maydonlari (owner — cheklovsiz, bu ro'yxatda yo'q).
// houses.validators.js dagi kalitlar bilan mos. Frontend houseFields.js shu ro'yxatning ko'zgusi.
export const HOUSE_FIELD_ROLES = {
  chairman: ["name", "owner", "phone", "members", "ownership", "address", "kind", "area", "floors", "heightM", "value", "notes", "familiesCount", "residentsCount", "menCount"],
  tax_inspector: ["taxAnnual", "taxDebt", "mibDebt", "officerName", "officerTitle", "officerPhone", "officerSector"],
  prevention_inspector: ["fireRiskPct", "fireFindings", "fireInspection", "fireOfficerName", "fireOfficerTitle", "fireOfficerDept", "fireOfficerPhone", "crimeClean", "crimeNote", "crimeOfficerName", "crimeOfficerTitle", "crimeOfficerPhone"],
  bank_officer: ["utilGas", "utilElectric", "utilWater", "utilInternet", "gasType", "gasMonthly", "gasYearly", "gasMeter", "gasPressure", "gasLimit", "gasCylinderFamilies", "elecMonthly", "elecNorm", "solarInstalled", "internetConnected", "internetSpeed", "internetProvider", "internetTech", "internetQuality"],
  youth_leader: ["youthLedger"],
  women_activist: ["womenCount", "womenLedger", "medicName", "medicTitle", "medicFacility", "medicPhone"],
  hokim_assistant: ["employedCount", "unemployedCount", "appealOfficerName", "appealOfficerTitle", "appealOfficerSector", "appealOfficerPhone", "trashLastPickup", "trashSchedule", "trashBins", "harvestsPerYear", "gardenArea", "cropName", "cropYieldKg", "cropPriceUzs", "livestockCattle", "livestockSheep", "livestockPoultry"],
};

// role uchun ruxsat etilgan maydonlargacha qisqartiradi (owner/noma'lum → o'zgarishsiz)
export const scopeHouseData = (data, role) => {
  if (!role || role === "owner") return data;
  const allowed = HOUSE_FIELD_ROLES[role] || [];
  return Object.fromEntries(Object.entries(data).filter(([k]) => allowed.includes(k)));
};
