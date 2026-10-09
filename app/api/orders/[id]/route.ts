import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureSchemaAndSeed } from "@/lib/seed";
import { checkAdminPin, unauthorized } from "@/lib/admin-auth";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    await ensureSchemaAndSeed();
    const body = await req.json();
    const status = body.status === "completed" ? "completed" : "pending";
    const rows = await query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, params.id]
    );
    if (!rows.length) {
      return NextResponse.json({ error: "অর্ডার পাওয়া যায়নি" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, order: rows[0] });
  } catch (e) {
    console.error("PATCH /api/orders/[id]", e);
    return NextResponse.json({ error: "আপডেট করা যায়নি" }, { status: 500 });
  }
}
