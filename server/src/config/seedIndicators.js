import MahallaIndicator from "../models/MahallaIndicator.js";

// Kanonik qiymatlar — mahallaData.js + sarnovul.data.js dagi hozirgi raqamlar.
// Dashboard birinchi kundan aynan shu raqamlarni ko'rsatadi (keyin rollar tahrirlaydi).
const SEED = {
  population: { population: 4306, households: 763, streets: 14, ageChildren: 1420, ageWorking: 2280, ageElderly: 606, residentialBuildings: 452, realEstateDeals: 19, populationDelta: 1.8, householdsDelta: 0.6 },
  education: { students: 1124, studentsDelta: 2.1, schools: 2, kindergartens: 6, clinics: 1, mosques: 3, chronicAbsentees: 7 },
  utilities: { waterPct: 91, waterDelta: 1.2, internetPct: 84, internetDelta: 5.2, electricPct: 98, gasPct: 92, sewagePct: 18, greenAreas: 84 },
  tax: { taxCollectedMln: 486, taxDelta: 6.4, enterprises: 13, enterprisesDelta: 3.3, newBusinesses: 5 },
  finance: { gasDebtMln: 38, gasDebtDelta: -4.2, electricDebtMln: 29, electricDebtDelta: -2.8 },
  safety: { preventionFamilies: 9, preventionDelta: -8.0, hazardObjects: 6, hazardDelta: -1.0, emergencies: 1, foreignVehicles: 4, wantedPersons: 1 },
  youth: { youthRegistered: 0, youthDelta: 0 },
  women: { births: 86, marriages: 41, improvementPct: 78, improvementDelta: 5.5, greenTrees: 1850, greenDelta: 24.1, employmentPct: 74 },
  land: { landObjects: 812, landDelta: 0.4 },
  appeals: { appealsTotal: 38, appealsDelta: 12.0, resolvedPct: 61, todayAppeals: 9, mskOrders: 6 },
};

export const seedIndicators = async () => {
  for (const [domain, data] of Object.entries(SEED)) {
    const exists = await MahallaIndicator.findOne({ domain }).select("_id");
    if (!exists) await MahallaIndicator.create({ domain, data, updatedByRole: "seed" });
  }
};
