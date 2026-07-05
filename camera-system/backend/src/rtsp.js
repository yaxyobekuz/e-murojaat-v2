// Hikvision RTSP manzilini yig'ish.
// Format: rtsp://USERNAME:PAROL@IP:PORT/Streaming/Channels/CHANNEL
//   CHANNEL: 101 = asosiy oqim (full HD), 102 = sub oqim (panel/grid uchun tavsiya).
// Username/parol maxsus belgili bo'lsa URL-encode qilinadi.
export function buildRtspUrl({ ip, port, username, password, channel }) {
  const user = encodeURIComponent(username);
  const pass = encodeURIComponent(password);
  const ch = channel || "102";
  const p = Number(port) || 554;
  return `rtsp://${user}:${pass}@${ip}:${p}/Streaming/Channels/${ch}`;
}
