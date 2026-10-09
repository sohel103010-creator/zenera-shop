import { NextResponse } from "next/server";
import { query, queryOne } from "@/lib/db";
import { ensureSchemaAndSeed } from "@/lib/seed";
import { checkAdminPin, unauthorized } from "@/lib/admin-auth";

function makeOrderNumber(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `ZN-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${Math.floor(
    1000 + Math.random() * 9000
  )}`;
}

export async function POST(req: Request) {
  try {
    await ensureSchemaAndSeed();
    const body = await req.json();
    const { customer_name, address, mobile, area, items } = body;

    if (!customer_name || !address || !mobile || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "নাম, ঠিকানা, মোবাইল ও পণ্য আবশ্যক" },
        { status: 400 }
      );
    }
    if (!/^01\d{9}$/.test(String(mobile).trim())) {
      return NextResponse.json(
        { error: "সঠিক মোবাইল নম্বর দিন" },
        { status: 400 }
      );
    }

    // Server-side price calculation from DB
    let subtotal = 0;
    const cleanItems = [];
    for (const it of items) {
      const p = await queryOne<{ name: string; price: number; in_stock: boolean }>(
        "SELECT name, price, in_stock FROM products WHERE slug = $1",
        [it.slug]
      );
      if (!p || !p.in_stock) {
        return NextResponse.json(
          { error: `দুঃখিত, "${it.name || it.slug}" এখন স্টকে নেই` },
          { status: 400 }
        );
      }
      const qty = Math.max(1, Math.min(99, parseInt(it.qty, 10) || 1));
      subtotal += p.price * qty;
      cleanItems.push({
        slug: it.slug,
        name: p.name,
        price: p.price,
        qty,
        color: it.color ?? null,
      });
    }

    const sRows = await query<{ key: string; value: string }>(
      "SELECT key, value FROM settings WHERE key IN ('delivery_free','delivery_charge_inside','delivery_charge_outside')"
    );
    const sm: Record<string, string> = {};
    for (const r of sRows) sm[r.key] = r.value;
    const free = sm.delivery_free !== "false";
    const charge = free
      ? 0
      : area === "outside"
        ? parseInt(sm.delivery_charge_outside || "120", 10)
        : parseInt(sm.delivery_charge_inside || "60", 10);
    const total = subtotal + charge;

    const order_number = makeOrderNumber();
    await query(
      `INSERT INTO orders (order_number, customer_name, address, mobile, items, subtotal, delivery_charge, total, status)
       VALUES ($1,$2,$3,$4,$5::jsonb,$6,$7,$8,'pending')`,
      [
        order_number,
        String(customer_name).trim(),
        String(address).trim(),
        String(mobile).trim(),
        JSON.stringify(cleanItems),
        subtotal,
        charge,
        total,
      ]
    );

    return NextResponse.json({ ok: true, order_number, total });
  } catch (e) {
    console.error("POST /api/orders", e);
    return NextResponse.json({ error: "অর্ডার করা যায়নি" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    const rows = await query("SELECT * FROM orders ORDER BY id DESC");
    return NextResponse.json({ orders: rows });
  } catch (e) {
    console.error("GET /api/orders", e);
    return NextResponse.json({ error: "লোড করা যায়নি" }, { status: 500 });
  }
}
