import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureSchemaAndSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureSchemaAndSeed();
    const rows = await query<{ key: string; value: string }>(
      "SELECT key, value FROM settings WHERE key IN ('delivery_free','delivery_charge_inside','delivery_charge_outside')"
    );
    const map: Record<string, string> = {};
    for (const r of rows) map[r.key] = r.value;
    return NextResponse.json({
      delivery_free: map.delivery_free !== "false",
      delivery_charge_inside: parseInt(map.delivery_charge_inside || "60", 10),
      delivery_charge_outside: parseInt(
        map.delivery_charge_outside || "120",
        10
      ),
    });
  } catch (e) {
    console.error("GET /api/settings/public", e);
    return NextResponse.json({
      delivery_free: true,
      delivery_charge_inside: 60,
      delivery_charge_outside: 120,
    });
  }
}
