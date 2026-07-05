// go2rtc REST API klienti — streamlarni dinamik qo'shish/o'chirish.
// go2rtc hujjati: PUT /api/streams?name=..&src=..  |  DELETE /api/streams?src=..
const API = process.env.GO2RTC_API || "http://localhost:1984";

// Yangi stream qo'shish (yoki mavjudini yangilash). src — to'liq RTSP manzil.
export async function addStream(name, src) {
  const url = `${API}/api/streams?name=${encodeURIComponent(name)}&src=${encodeURIComponent(src)}`;
  const r = await fetch(url, { method: "PUT" });
  if (!r.ok) throw new Error(`go2rtc addStream xato: ${r.status}`);
}

// Streamni o'chirish.
export async function removeStream(name) {
  const url = `${API}/api/streams?src=${encodeURIComponent(name)}`;
  await fetch(url, { method: "DELETE" }).catch(() => {});
}

// Stream ma'lumoti (producer/consumer holati).
export async function streamInfo(name) {
  try {
    const r = await fetch(`${API}/api/streams?src=${encodeURIComponent(name)}`);
    if (!r.ok) return null;
    return await r.json();
  } catch {
    return null;
  }
}
