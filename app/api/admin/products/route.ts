import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureSchemaAndSeed } from "@/lib/seed";
import { checkAdminPin, unauthorized } from "@/lib/admin-auth";

export async function GET(req: Request) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    const rows = await query("SELECT * FROM products ORDER BY id ASC");
    return NextResponse.json({ products: rows });
  } catch (e) {
    console.error("GET /api/admin/products", e);
    return NextResponse.json({ error: "লোড করা যায়নি" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    await ensureSchemaAndSeed();
    const body = await req.json();
    const { slug, name, price, category, description, features, images, colors } = body;
    if (!slug || !name || price == null || !category) {
      return NextResponse.json(
        { error: "slug, নাম, দাম ও ক্যাটাগরি আবশ্যক" },
        { status: 400 }
      );
    }
    // 200 product cap
    const c = await query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM products"
    );
    if (parseInt(c[0]?.count || "0", 10) >= 200) {
      return NextResponse.json(
        { error: "সর্বোচ্চ ২০০টি প্রোডাক্ট রাখা যাবে" },
        { status: 400 }
      );
    }
    const cleanSlug = String(slug)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const rows = await query(
      `INSERT INTO products (slug, name, price, category, description, features, images, colors, in_stock)
       VALUES ($1,$2,$3,$4,$5,$6,$7::jsonb,$8::jsonb,true) RETURNING *`,
      [
        cleanSlug,
        String(name),
        parseInt(price, 10),
        String(category),
        String(description || ""),
        String(features || ""),
        JSON.stringify(Array.isArray(images) ? images : []),
        colors && colors.length ? JSON.stringify(colors) : null,
      ]
    );
    return NextResponse.json({ ok: true, product: rows[0] });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes("duplicate") || msg.includes("unique")) {
      return NextResponse.json(
        { error: "এই slug-এর প্রোডাক্ট আগেই আছে" },
        { status: 400 }
      );
    }
    console.error("POST /api/admin/products", e);
    return NextResponse.json({ error: "যোগ করা যায়নি" }, { status: 500 });
  }
}
