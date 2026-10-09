import { query, queryOne } from "@/lib/db";
import { ensureSchemaAndSeed } from "@/lib/seed";

export async function checkAdminPin(req: Request): Promise<boolean> {
  const pin = req.headers.get("x-admin-pin");
  if (!pin) return false;
  await ensureSchemaAndSeed();
  const row = await queryOne<{ value: string }>(
    "SELECT value FROM settings WHERE key = 'admin_pin'"
  );
  return row?.value === pin;
}

export function unauthorized() {
  return new Response(JSON.stringify({ error: "অননুমোদিত" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}
