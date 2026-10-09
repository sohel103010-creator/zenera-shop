import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureSchemaAndSeed } from "@/lib/seed";
import { checkAdminPin, unauthorized } from "@/lib/admin-auth";

const ALLOWED = [
  "delivery_free",
  "delivery_charge_inside",
  "delivery_charge_outside",
];

export async function GET(req: Request) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    const rows = await query<{ key: string; value: string }>(
      "SELECT key, value FROM settings"
    );
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return NextResponse.json({ settings: map });
  } catch (e) {
    console.error("GET /api/admin/settings", e);
    return NextResponse.json({ error: "লোড করা যায়নি" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    await ensureSchemaAndSeed();
    const body = await req.json();
    for (const key of ALLOWED) {
      if (body[key] !== undefined) {
        await query(
          `INSERT INTO settings (key, value) VALUES ($1,$2)
           ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value`,
          [key, String(body[key])]
        );
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("PUT /api/admin/settings", e);
    return NextResponse.json({ error: "সেভ করা যায়নি" }, { status: 500 });
  }
}
