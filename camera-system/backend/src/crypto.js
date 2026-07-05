// Kamera parollarini shifrlash — AES-256-GCM.
// Kalit .env dagi CAMERA_ENC_KEY (32 bayt = 64 hex belgidan) dan olinadi.
import crypto from "crypto";

const KEY = Buffer.from(process.env.CAMERA_ENC_KEY || "", "hex");
if (KEY.length !== 32) {
  console.warn("[crypto] OGOHLANTIRISH: CAMERA_ENC_KEY 32 bayt (64 hex) bo'lishi shart!");
}

// Natija: "iv:tag:cipher" (hammasi hex)
export function encrypt(plain) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", KEY, iv);
  const enc = Buffer.concat([cipher.update(String(plain), "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("hex"), tag.toString("hex"), enc.toString("hex")].join(":");
}

export function decrypt(payload) {
  const [ivHex, tagHex, dataHex] = String(payload).split(":");
  const decipher = crypto.createDecipheriv("aes-256-gcm", KEY, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(dataHex, "hex")), decipher.final()]).toString("utf8");
}
