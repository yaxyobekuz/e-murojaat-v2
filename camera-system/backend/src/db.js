// PostgreSQL ulanishi + jadvalni yaratish.
import pg from "pg";

const { Pool } = pg;

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

// Kameralar jadvali. Parol shifrlangan holda (password_enc) saqlanadi — hech qachon ochiq emas.
export async function initDb() {
  await pool.query(`CREATE EXTENSION IF NOT EXISTS pgcrypto`); // gen_random_uuid() uchun
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cameras (
      id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      name          TEXT NOT NULL,
      ip            TEXT NOT NULL,
      port          INTEGER NOT NULL DEFAULT 554,
      username      TEXT NOT NULL,
      password_enc  TEXT NOT NULL,            -- AES-256-GCM shifrlangan parol
      channel       TEXT NOT NULL DEFAULT '102',  -- 101 asosiy, 102 sub oqim
      location      TEXT NOT NULL DEFAULT 'Umumiy', -- FVV / IIB / Maktab / Ko'cha ...
      created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `);
}
