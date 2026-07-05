// Ta'lim — namunaviy (sintetik) ma'lumotlar. Faqat bitta mahalla ichki tizimi.
import boyFace1 from "./assets/student-faceid.png";
import boyFace2 from "./assets/student-boy2.png";
import girlFace from "./assets/student-girl.png";
const BOY_FACES = [boyFace1, boyFace2];
// Face-ID jonli skaner uchun 3 ta rasm (jins bilan)
export const FACES = [{ photo: boyFace1, female: false }, { photo: boyFace2, female: false }, { photo: girlFace, female: true }];

export const fmt = (n) => Math.round(n).toLocaleString("uz-UZ").replace(/,/g, " ");
export const rng = (s) => { const x = Math.sin(s * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };
export const dayLabel = (b) => { const d = new Date(2026, 5, 24); d.setDate(d.getDate() - b); return `${String(d.getDate()).padStart(2, "0")}.${String(d.getMonth() + 1).padStart(2, "0")}`; };
const pad = (n) => String(n).padStart(2, "0");

export const M = { name: "Sarnovul MFY", area: "Baliqchi tumani, Andijon", children6_18: 1141, inSchool: 1124, outOfSchool: 17, preschool: 312, chronic: 7, present: 1063, excused: 40, absent: 21 };
export const SCHOOLS3 = ["66-son maktab", "67-son maktab", "Sarnovul 1-DMTT"];
export const SUBJECTS = ["Matematika", "Ona tili", "Ingliz tili", "Fizika", "Tarix", "Kimyo", "Biologiya", "Geografiya", "Informatika", "Jismoniy tarbiya", "Musiqa", "Chizmachilik"];

export const trend30 = (seed) => Array.from({ length: 30 }, (_, i) => +(90 + rng(i * 3 + seed) * 7).toFixed(1));
export const classDist = (total, seed) => { const base = Array.from({ length: 11 }, (_, i) => 0.7 + rng(i + seed) * 0.6); const sum = base.reduce((a, b) => a + b, 0); return base.map((b) => Math.round((b / sum) * total)); };

export const INST = [
  { id: "maktab66", title: "66-son maktab", sub: "Davlat umumta'lim maktabi", kind: "school", schools: ["1-smena (1–5-sinf)", "2-smena (6–11-sinf)"], count: 1, students: 668, attendance: 94.2, boys: 338, girls: 330, chronic: 4, accent: "#2DD4BF", trend: trend30(2), dist: classDist(668, 5) },
  { id: "maktab67", title: "67-son maktab", sub: "Davlat umumta'lim maktabi", kind: "school", schools: ["1-smena (1–11-sinf)"], count: 1, students: 456, attendance: 95.1, boys: 234, girls: 222, chronic: 3, accent: "#E0A93B", trend: trend30(7), dist: classDist(456, 9) },
  { id: "bogcha", title: "Bog'chalar", sub: "Maktabgacha ta'lim · 6 ta muassasa", kind: "kg", schools: ["1 davlat · 2 xususiy · 3 oilaviy"], count: 6, students: 312, attendance: 91.4, boys: 162, girls: 150, chronic: 5, accent: "#2FBF87", trend: trend30(4), groups: [["Davlat (1 ta)", 142], ["Xususiy (2 ta)", 98], ["Oilaviy (3 ta)", 72]] },
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
  const inst = SCHOOLS3[rng(i * 6.3 + 5) < 0.59 ? Math.floor(rng(i * 7.1) * 1) : 1];
  const letter = ["A", "B", "V"][Math.floor(rng(i * 8.2) * 3)];
  // Jinsga mos Face-ID rasm (o'g'il / qiz)
  const photo = female ? girlFace : BOY_FACES[i % BOY_FACES.length];
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
  { id: "h1", name: "Yusupov Bahodir", role: "Direktor", subject: "—", exp: 22, inst: "66-son maktab" },
  { id: "h2", name: "Karimova Dilfuza", role: "O'rinbosar", subject: "Ta'lim ishlari", exp: 17, inst: "66-son maktab" },
  { id: "h3", name: "Sobirov Akmal", role: "O'rinbosar", subject: "Ma'naviyat", exp: 14, inst: "67-son maktab" },
  ...SUBJECTS.map((s, i) => ({ id: `t${i}`, name: `${LAST[(i + 2) % LAST.length]}${i % 2 ? "a" : ""} ${(i % 2 ? FIRST_F : FIRST_M)[(i + 3) % 15]}`, role: "O'qituvchi", subject: s, exp: 3 + Math.floor(rng(i * 9 + 1) * 28), inst: SCHOOLS3[Math.floor(rng(i * 4 + 2) * 2)] })),
  { id: "p1", name: "Aliyeva Nodira", role: "Boshqa", subject: "Psixolog", exp: 8, inst: "66-son maktab" },
  { id: "p2", name: "Rasulova Sevara", role: "Boshqa", subject: "Kutubxonachi", exp: 11, inst: "67-son maktab" },
  { id: "p3", name: "Olimova Kamola", role: "Boshqa", subject: "Hamshira", exp: 6, inst: "66-son maktab" },
  { id: "p4", name: "Nazarov Eldor", role: "Boshqa", subject: "Qorovul", exp: 9, inst: "66-son maktab" },
  { id: "p5", name: "Hasanov Diyor", role: "Boshqa", subject: "Qorovul", exp: 4, inst: "67-son maktab" },
  { id: "p6", name: "Umarova Ozoda", role: "Boshqa", subject: "Oshpaz", exp: 13, inst: "Sarnovul 1-DMTT" },
];
