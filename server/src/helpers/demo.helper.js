// Reusable demo-data generators (no faker installed — handcrafted).
// Shared by every module's seed so demo data feels consistent.

export const REGIONS = [
  { name: "Toshkent shahri", code: "10", districts: ["Chilonzor", "Yunusobod", "Mirzo Ulug'bek", "Shayxontohur", "Yashnobod"] },
  { name: "Toshkent viloyati", code: "11", districts: ["Zangiota", "Bekobod", "Chirchiq", "Ohangaron", "Yangiyo'l"] },
  { name: "Andijon", code: "03", districts: ["Andijon shahri", "Asaka", "Xonobod", "Shahrixon", "Marhamat"] },
  { name: "Farg'ona", code: "30", districts: ["Farg'ona shahri", "Marg'ilon", "Qo'qon", "Quva", "Rishton"] },
  { name: "Namangan", code: "14", districts: ["Namangan shahri", "Chust", "Pop", "Uchqo'rg'on", "To'raqo'rg'on"] },
  { name: "Samarqand", code: "18", districts: ["Samarqand shahri", "Urgut", "Kattaqo'rg'on", "Bulung'ur", "Ishtixon"] },
  { name: "Buxoro", code: "17", districts: ["Buxoro shahri", "G'ijduvon", "Kogon", "Vobkent", "Romitan"] },
  { name: "Qashqadaryo", code: "23", districts: ["Qarshi", "Shahrisabz", "Kitob", "G'uzor", "Koson"] },
  { name: "Surxondaryo", code: "22", districts: ["Termiz", "Denov", "Sherobod", "Sho'rchi", "Boysun"] },
  { name: "Xorazm", code: "33", districts: ["Urganch", "Xiva", "Hazorasp", "Shovot", "Gurlan"] },
  { name: "Navoiy", code: "20", districts: ["Navoiy shahri", "Zarafshon", "Nurota", "Konimex", "Karmana"] },
  { name: "Jizzax", code: "08", districts: ["Jizzax shahri", "G'allaorol", "Zomin", "Forish", "Paxtakor"] },
  { name: "Sirdaryo", code: "24", districts: ["Guliston", "Yangiyer", "Sirdaryo", "Boyovut", "Sayxunobod"] },
];

const FIRST_NAMES_M = ["Akmal", "Bekzod", "Davron", "Eldor", "Farrux", "G'ayrat", "Husan", "Islom", "Jasur", "Kamol", "Lutfulla", "Mansur", "Nodir", "Otabek", "Pirim", "Rustam", "Sardor", "Temur", "Ulug'bek", "Shavkat", "Zafar"];
const FIRST_NAMES_F = ["Aziza", "Barno", "Dilnoza", "Feruza", "Gulnora", "Hilola", "Iroda", "Kamola", "Laylo", "Madina", "Nigora", "Oysha", "Ra'no", "Sevara", "Umida", "Charos", "Zarina", "Malika", "Nodira", "Shahnoza"];
const LAST_NAMES = ["Aliyev", "Karimov", "Yusupov", "Rashidov", "Ergashev", "Tursunov", "Abdullayev", "Sobirov", "Ismoilov", "Qodirov", "Mahmudov", "Nazarov", "Sultonov", "Xolmatov", "G'aniyev", "Jo'rayev", "Toshmatov", "Umarov", "Vohidov", "Yo'ldoshev"];

export const randInt = (min, max) => min + Math.floor(Math.random() * (max - min + 1));
export const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
export const pickRegion = () => pick(REGIONS);

export const randomFullName = () => {
  const male = Math.random() < 0.5;
  const first = pick(male ? FIRST_NAMES_M : FIRST_NAMES_F);
  return `${pick(LAST_NAMES)} ${first}`;
};

// 14-digit JSHSHIR (PINFL) — demo only, not a valid real one
export const randomJshshir = () => {
  let s = String(randInt(1, 6)); // gender/century digit
  for (let i = 0; i < 13; i++) s += randInt(0, 9);
  return s;
};

export const randomPhone = () =>
  `+998${pick(["90", "91", "93", "94", "97", "99", "88", "33"])}${randInt(1000000, 9999999)}`;

// A random date within the last `months` months
export const randomPastDate = (months = 12) => {
  const now = Date.now();
  const span = months * 30 * 86400000;
  return new Date(now - Math.floor(Math.random() * span));
};
