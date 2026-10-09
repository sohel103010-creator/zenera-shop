import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureSchemaAndSeed } from "@/lib/seed";
import { checkAdminPin, unauthorized } from "@/lib/admin-auth";

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    await ensureSchemaAndSeed();
    const body = await req.json();
    const fields: string[] = [];
    const values: unknown[] = [];
    let i = 1;
    const set = (col: string, val: unknown, json = false) => {
      fields.push(`${col} = $${i}${json ? "::jsonb" : ""}`);
      values.push(val);
      i++;
    };
    if (body.name !== undefined) set("name", String(body.name));
    if (body.price !== undefined) set("price", parseInt(body.price, 10));
    if (body.category !== undefined) set("category", String(body.category));
    if (body.description !== undefined) set("description", String(body.description));
    if (body.features !== undefined) set("features", String(body.features));
    if (body.images !== undefined)
      set("images", JSON.stringify(body.images || []), true);
    if (body.colors !== undefined)
      set(
        "colors",
        body.colors && body.colors.length ? JSON.stringify(body.colors) : null,
        true
      );
    if (body.in_stock !== undefined) set("in_stock", !!body.in_stock);
    if (!fields.length) {
      return NextResponse.json({ error: "কিছু বদলানো হয়নি" }, { status: 400 });
    }
    values.push(params.id);
    const rows = await query(
      `UPDATE products SET ${fields.join(", ")} WHERE id = $${i} RETURNING *`,
      values
    );
    if (!rows.length) {
      return NextResponse.json({ error: "প্রোডাক্ট পাওয়া যায়নি" }, { status: 404 });
    }
    return NextResponse.json({ ok: true, product: rows[0] });
  } catch (e) {
    console.error("PUT /api/admin/products/[id]", e);
    return NextResponse.json({ error: "আপডেট করা যায়নি" }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    await ensureSchemaAndSeed();
    await query("DELETE FROM products WHERE id = $1", [params.id]);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error("DELETE /api/admin/products/[id]", e);
    return NextResponse.json({ error: "মোছা যায়নি" }, { status: 500 });
  }
}
