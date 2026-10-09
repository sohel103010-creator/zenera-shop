import fs from "fs";
import path from "path";
import { query, queryOne } from "./db";
import { ALL_PRODUCTS } from "./products-data-2";

let seeded = false;

export async function ensureSchemaAndSeed(): Promise<void> {
  if (seeded) return;
  const schemaPath = path.join(process.cwd(), "lib", "schema.sql");
  const schema = fs.readFileSync(schemaPath, "utf8");
  const statements = schema
    .split(/;\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);
  for (const stmt of statements) {
    await query(stmt);
  }

  // Migrate default PIN 1234 -> Sohel@103010 (one-time)
  await query(
    "UPDATE settings SET value = 'Sohel@103010' WHERE key = 'admin_pin' AND value = '1234'"
  );

  const existing = await queryOne<{ count: string }>(
    "SELECT COUNT(*)::text AS count FROM products"
  );
  if (existing && parseInt(existing.count, 10) === 0) {
    for (const p of ALL_PRODUCTS) {
      await query(
        `INSERT INTO products (slug, name, price, category, description, features, images, colors, in_stock)
         VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,true)
         ON CONFLICT (slug) DO NOTHING`,
        [
          p.slug,
          p.name,
          p.price,
          p.category,
          p.description,
          p.features,
          JSON.stringify(p.images),
          p.colors ? JSON.stringify(p.colors) : null,
        ]
      );
    }
    console.log(`Seeded ${ALL_PRODUCTS.length} products`);
  }
  seeded = true;
}
