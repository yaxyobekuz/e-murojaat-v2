// JWT autentifikatsiya — token yaratish va tekshirish.
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "12h" });
}

// Himoyalangan endpointlar uchun middleware: "Authorization: Bearer <token>".
export function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ error: "Token yo'q" });
  try {
    req.user = jwt.verify(token, SECRET);
    next();
  } catch {
    return res.status(401).json({ error: "Token noto'g'ri yoki muddati o'tgan" });
  }
}
