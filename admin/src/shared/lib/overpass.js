// Overpass API mijozi — bir nechta public endpoint, ishlagani eslab qolinadi.
// Ba'zi tarmoqlarda ayrim instansiyalar bloklanadi/uziladi (ERR_CONNECTION_RESET),
// shuning uchun navbat bilan sinab, birinchi javob berganidan foydalanamiz.
const ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://maps.mail.ru/osm/tools/overpass/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

let preferred = 0; // oxirgi muvaffaqiyatli endpoint keyingi safar birinchi sinaladi

export const overpassQuery = async (query) => {
  for (let i = 0; i < ENDPOINTS.length; i++) {
    const idx = (preferred + i) % ENDPOINTS.length;
    try {
      const res = await fetch(ENDPOINTS[idx], {
        method: "POST",
        // User-Agent node uchun (overpass-api.de default node UA'ni 406 qiladi); brauzer uni o'zi filtrlaydi
        headers: { "Content-Type": "application/x-www-form-urlencoded", "User-Agent": "e-murojaat-demo/1.0" },
        body: "data=" + encodeURIComponent(query),
      });
      if (!res.ok) continue;
      const json = await res.json();
      preferred = idx;
      return json.elements || [];
    } catch {
      // ulanish uzildi/bloklangan — keyingi endpoint
    }
  }
  return null;
};
