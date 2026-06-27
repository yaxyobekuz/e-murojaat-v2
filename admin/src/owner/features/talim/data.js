// Ta'lim — namunaviy (sintetik) ma'lumotlar. Faqat bitta mahalla ichki tizimi.
import studentFace from "./assets/student-faceid.png";

export const fmt = (n) => Math.round(n).toLocaleString("uz-UZ").replace(/,/g, " ");
export const rng = (s) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
export const dayLabel = (b) => { const d = new Date(2026, 5, 24); d.setDate(d.getDate() - b); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`; };
const pad = (n) => String(n).padStart(2, "0");

export const M = { name: "Sarnovul MFY", area: "Baliqchi tumani, Andijon", children6_18: 2680, inSchool: 2540, outOfSchool: 31, preschool: 78, chronic: 24, present: 2392, excused: 89, absent: 59 };
export const SCHOOLS3 = ["12-maktab", "47-maktab", "Bilim xususiy maktabi"];
export const SUBJECTS = ["Matematika", "Ona tili", "Ingliz tili", "Fizika", "Tarix", "Kimyo", "Biologiya", "Geografiya", "Informatika", "Jismoniy tarbiya", "Musiqa", "Chizmachilik"];

export const trend30 = (seed) => Array.from({ length: 30 }, (_, i) => +(90 + rng(i * 3 + seed) * 7).toFixed(1));
export const classDist = (total, seed) => { const base = Array.from({ length: 11 }, (_, i) => 0.7 + rng(i + seed) * 0.6); const sum = base.reduce((a, b) => a + b, 0); return base.map((b) => Math.round((b / sum) * total)); };

export const INST = [
  { id: "davlat", title: "Bizdagi maktab", sub: "Davlat maktablari", kind: "school", schools: ["12-maktab (2-smena)", "47-maktab (1-smena)"], count: 2, students: 2220, attendance: 94.6, boys: 1154, girls: 1066, chronic: 21, accent: "#2DD4BF", trend: trend30(2), dist: classDist(2220, 5) },
  { id: "xususiy", title: "Xususiy maktab", sub: "Bilim xususiy maktabi", kind: "school", schools: ["Bilim xususiy maktabi"], count: 1, students: 320, attendance: 96.4, boys: 166, girls: 154, chronic: 3, accent: "#E0A93B", trend: trend30(7), dist: classDist(320, 9) },
  { id: "bogcha", title: "Bog'cha", sub: "Maktabgacha ta'lim · Sarnovul 14-DMTT", kind: "kg", schools: ["Sarnovul 14-DMTT"], count: 1, students: 180, attendance: 92.1, boys: 94, girls: 86, chronic: 5, accent: "#2FBF87", trend: trend30(4), groups: [["3–4 yosh", 54], ["4–5 yosh", 62], ["5–6 yosh", 64]] },
];

const LAST = ["Azizov", "Karimov", "Rasulov", "Tursunov", "Yusupov", "Aliyev", "Saidov", "Qodirov", "Ergashev", "Olimov", "Nazarov", "Sobirov", "Hasanov", "Umarov", "Jo'rayev", "Mirzayev", "To'xtasinov", "Islomov"];
const FIRST_M = ["Jasur", "Aziz", "Bekzod", "Sardor", "Otabek", "Akmal", "Bobur", "Sanjar", "Rustam", "Islom", "Diyor", "Davron", "Eldor", "Shoxruh", "Jahongir"];
const FIRST_F = ["Madina", "Nilufar", "Dilnoza", "Malika", "Zarina", "Kamola", "Nodira", "Sevara", "Gulnoza", "Shahzoda", "Maftuna", "Dildora", "Ozoda", "Mohira", "Feruza"];

export const STUDENTS = Array.from({ length: 76 }, (_, i) => {
  const female = rng(i * 1.7 + 1) < 0.48;
  const last = LAST[Math.floor(rng(i * 2.3) * LAST.length)];
  const first = female ? FIRST_F[Math.floor(rng(i * 3.1 + 2) * FIRST_F.length)] : FIRST_M[Math.floor(rng(i * 3.1 + 2) * FIRST_M.length)];
  const grade = 1 + Math.floor(rng(i * 4.7 + 3) * 11);
  const att = +(82 + rng(i * 5.9 + 4) * 17).toFixed(1);
  const inst = SCHOOLS3[rng(i * 6.3 + 5) < 0.86 ? Math.floor(rng(i * 7.1) * 2) : 2];
  const letter = ["A", "B", "V"][Math.floor(rng(i * 8.2) * 3)];
  const photo = studentFace;
  return { id: `s${i}`, name: `${last}${female ? "a" : ""} ${first}`, gender: female ? "qiz" : "o'g'il", grade, letter, age: grade + 6, att, status: att < 90 ? "qoldiruvchi" : "doimiy", inst, photo };
});
export const getStudent = (id) => STUDENTS.find((s) => s.id === id) || null;

const CT = ["Karimova Dilfuza", "Aliyeva Nodira", "Rasulova Sevara", "Olimova Kamola", "Umarova Ozoda", "Nazarova Feruza", "Hasanova Mohira", "Sobirova Dildora", "Yusupova Gulnoza", "Saidova Malika", "Ergasheva Zarina"];
export const classTeacher = (grade) => CT[(grade - 1) % CT.length];

// Kunlik davomat jurnali — kelgan/ketgan vaqt, kech, dars vaqti, Face-ID rasm
export const studentLog = (st, days = 20) => Array.from({ length: days }, (_, i) => {
  const back = days - 1 - i; const r = rng((st.grade + i) * 3.3 + st.age + 1);
  const absent = r < 0.06; const late = !absent && r < 0.22;
  const inMin = absent ? null : (late ? 495 + Math.floor(rng(i * 5 + 1) * 35) : 460 + Math.floor(rng(i * 5 + 1) * 14)); // 7:40.. / 8:15..
  const outMin = absent ? null : 13 * 60 + Math.floor(rng(i * 9 + 2) * 60);
  return {
    date: dayLabel(back), dow: ["Du", "Se", "Ch", "Pa", "Ju", "Sh", "Ya"][(new Date(2026, 5, 24 - back).getDay() + 6) % 7],
    status: absent ? "kelmagan" : late ? "kech" : "kelgan",
    in: absent ? "—" : `${pad(Math.floor(inMin / 60))}:${pad(inMin % 60)}`,
    out: absent ? "—" : `${pad(Math.floor(outMin / 60))}:${pad(outMin % 60)}`,
    lateMin: late ? inMin - 480 : 0,
    hours: absent ? 0 : +((outMin - inMin) / 60).toFixed(1),
    face: st.photo, faceTime: absent ? null : `${pad(Math.floor((inMin) / 60))}:${pad(inMin % 60)}:${pad(Math.floor(rng(i * 11) * 59))}`,
  };
});

export const STAFF = [
  { id: "h1", name: "Yusupov Bahodir", role: "Direktor", subject: "—", exp: 22, inst: "12-maktab" },
  { id: "h2", name: "Karimova Dilfuza", role: "O'rinbosar", subject: "Ta'lim ishlari", exp: 17, inst: "12-maktab" },
  { id: "h3", name: "Sobirov Akmal", role: "O'rinbosar", subject: "Ma'naviyat", exp: 14, inst: "47-maktab" },
  ...SUBJECTS.map((s, i) => ({ id: `t${i}`, name: `${LAST[(i + 2) % LAST.length]}${i % 2 ? "a" : ""} ${(i % 2 ? FIRST_F : FIRST_M)[(i + 3) % 15]}`, role: "O'qituvchi", subject: s, exp: 3 + Math.floor(rng(i * 9 + 1) * 28), inst: SCHOOLS3[Math.floor(rng(i * 4 + 2) * 3)] })),
  { id: "p1", name: "Aliyeva Nodira", role: "Boshqa", subject: "Psixolog", exp: 8, inst: "12-maktab" },
  { id: "p2", name: "Rasulova Sevara", role: "Boshqa", subject: "Kutubxonachi", exp: 11, inst: "47-maktab" },
  { id: "p3", name: "Olimova Kamola", role: "Boshqa", subject: "Hamshira", exp: 6, inst: "12-maktab" },
  { id: "p4", name: "Nazarov Eldor", role: "Boshqa", subject: "Qorovul", exp: 9, inst: "12-maktab" },
  { id: "p5", name: "Hasanov Diyor", role: "Boshqa", subject: "Qorovul", exp: 4, inst: "47-maktab" },
  { id: "p6", name: "Umarova Ozoda", role: "Boshqa", subject: "Oshpaz", exp: 13, inst: "12-maktab" },
];
