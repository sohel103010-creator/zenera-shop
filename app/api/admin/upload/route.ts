import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { checkAdminPin, unauthorized } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    if (!(await checkAdminPin(req))) return unauthorized();
    const form = await req.formData();
    const slug = String(form.get("slug") || "misc")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    const files = form.getAll("images") as File[];
    if (!files.length) {
      return NextResponse.json({ error: "কোনো ছবি পাওয়া যায়নি" }, { status: 400 });
    }
    const dir = path.join(process.cwd(), "public", "products", slug);
    fs.mkdirSync(dir, { recursive: true });
    const urls: string[] = [];
    let n = 1;
    // continue numbering after existing files
    const existing = fs.readdirSync(dir).length;
    n = existing + 1;
    for (const f of files.slice(0, 10)) {
      const ext = (f.name.split(".").pop() || "webp").toLowerCase().replace(/[^a-z0-9]/g, "") || "webp";
      const fname = `${n}.${ext === "jpeg" ? "jpg" : ext}`;
      const buf = Buffer.from(await f.arrayBuffer());
      fs.writeFileSync(path.join(dir, fname), buf);
      urls.push(`/products/${slug}/${fname}`);
      n++;
    }
    return NextResponse.json({ ok: true, urls });
  } catch (e) {
    console.error("POST /api/admin/upload", e);
    return NextResponse.json({ error: "আপলোড করা যায়নি" }, { status: 500 });
  }
}
