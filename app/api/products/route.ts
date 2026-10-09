import { NextResponse } from "next/server";
import { query } from "@/lib/db";
import { ensureSchemaAndSeed } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    await ensureSchemaAndSeed();
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const rows = slug
      ? await query("SELECT * FROM products WHERE slug = $1", [slug])
      : await query("SELECT * FROM products ORDER BY id ASC");
    return NextResponse.json({ products: rows });
  } catch (e) {
    console.error("GET /api/products", e);
    return NextResponse.json(
      { error: "প্রোডাক্ট লোড করা যায়নি" },
      { status: 500 }
    );
  }
}
