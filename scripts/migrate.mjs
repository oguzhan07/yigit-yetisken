// Supabase Postgres'e doğrudan bağlanıp supabase/migrations/*.sql dosyalarını çalıştırır.
// Kullanım:  node --env-file=.env.local scripts/migrate.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("HATA: DATABASE_URL tanımlı değil (.env.local içine ekle).");
  process.exit(1);
}

const dir = join(dirname(fileURLToPath(import.meta.url)), "..", "supabase", "migrations");
const files = readdirSync(dir).filter((f) => f.endsWith(".sql")).sort();

const client = new pg.Client({
  connectionString: url,
  ssl: { rejectUnauthorized: false },
});

try {
  await client.connect();
  for (const f of files) {
    process.stdout.write(`-> ${f} ... `);
    const sql = readFileSync(join(dir, f), "utf8");
    await client.query(sql);
    console.log("OK");
  }
  console.log("Tüm migration'lar tamamlandı.");
} catch (e) {
  console.error("Migration hatası:", e.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
