"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import { CATEGORIES } from "@/lib/products-data";
import { formatPrice, type Product, type Order } from "@/lib/shop";

type Tab = "products" | "orders" | "delivery";

export default function AdminPage() {
  const [pin, setPin] = useState("");
  const [authed, setAuthed] = useState(false);
  const [pinError, setPinError] = useState("");
  const [tab, setTab] = useState<Tab>("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // product form
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [fName, setFName] = useState("");
  const [fPrice, setFPrice] = useState("");
  const [fCategory, setFCategory] = useState<string>(CATEGORIES[0]);
  const [fDesc, setFDesc] = useState("");
  const [fFeatures, setFFeatures] = useState("");
  const [fColors, setFColors] = useState("");
  const [fImages, setFImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [formError, setFormError] = useState("");
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

  const headers = () => ({
    "Content-Type": "application/json",
    "x-admin-pin": sessionStorage.getItem("zenera_admin_pin") || "",
  });

  const loadAll = async () => {
    setLoading(true);
    try {
      const [pr, or, st] = await Promise.all([
        fetch("/api/admin/products", { headers: headers() }),
        fetch("/api/orders", { headers: headers() }),
        fetch("/api/admin/settings", { headers: headers() }),
      ]);
      if (pr.status === 401 || or.status === 401) {
        setAuthed(false);
        sessionStorage.removeItem("zenera_admin_pin");
        return;
      }
      const pd = await pr.json();
      const od = await or.json();
      const sd = await st.json();
      setProducts(pd.products ?? []);
      setOrders(od.orders ?? []);
      setSettings(sd.settings ?? {});
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const saved = sessionStorage.getItem("zenera_admin_pin");
    if (saved) {
      setPin(saved);
      setAuthed(true);
    }
  }, []);

  useEffect(() => {
    if (authed) loadAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authed ]);

  const login = async () => {
    setPinError("");
    sessionStorage.setItem("zenera_admin_pin", pin);
    const res = await fetch("/api/admin/products", {
      headers: { "x-admin-pin": pin },
    });
    if (res.status === 401) {
      setPinError("ভুল PIN! আবার চেষ্টা করুন।");
      sessionStorage.removeItem("zenera_admin_pin");
    } else {
      setAuthed(true);
    }
  };

  const logout = () => {
    sessionStorage.removeItem("zenera_admin_pin");
    setAuthed(false);
    setPin("");
  };

  // ---- product actions ----
  const toggleStock = async (p: Product) => {
    await fetch(`/api/admin/products/${p.id}`, {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({ in_stock: !p.in_stock }),
    });
    loadAll();
  };

  const deleteProduct = async (p: Product) => {
    if (!confirm(`"${p.name}" মুছে ফেলবেন?`)) return;
    await fetch(`/api/admin/products/${p.id}`, {
      method: "DELETE",
      headers: headers(),
    });
    loadAll();
  };

  const openNew = () => {
    setEditing(null);
    setFName("");
    setFPrice("");
    setFCategory(CATEGORIES[0]);
    setFDesc("");
    setFFeatures("");
    setFColors("");
    setFImages([]);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    setFName(p.name);
    setFPrice(String(p.price));
    setFCategory(p.category);
    setFDesc(p.description);
    setFFeatures(p.features);
    setFColors((p.colors || []).join(", "));
    setFImages(p.images || []);
    setFormError("");
    setShowForm(true);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files || !files.length) return;
    setUploading(true);
    try {
      const fd = new FormData();
      const slugBase =
        editing?.slug ||
        fName
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") ||
        "product";
      fd.append("slug", slugBase);
      Array.from(files).forEach((f) => fd.append("images", f));
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: { "x-admin-pin": sessionStorage.getItem("zenera_admin_pin") || "" },
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "আপলোড ব্যর্থ");
      setFImages((prev) => [...prev, ...data.urls]);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : "আপলোড ব্যর্থ");
    } finally {
      setUploading(false);
    }
  };

  const saveProduct = async () => {
    setFormError("");
    if (!fName.trim() || !fPrice.trim()) {
      setFormError("নাম ও দাম আবশ্যক");
      return;
    }
    const payload = {
      slug: editing
        ? editing.slug
        : fName.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
      name: fName.trim(),
      price: parseInt(fPrice, 10),
      category: fCategory,
      description: fDesc,
      features: fFeatures,
      images: fImages,
      colors: fColors
        .split(",")
        .map((c) => c.trim())
        .filter(Boolean),
    };
    const url = editing
      ? `/api/admin/products/${editing.id}`
      : "/api/admin/products";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: headers(),
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      setFormError(data.error || "সেভ করা যায়নি");
      return;
    }
    setShowForm(false);
    loadAll();
  };

  // ---- order actions ----
  const setOrderStatus = async (id: number, status: string) => {
    await fetch(`/api/orders/${id}`, {
      method: "PATCH",
      headers: headers(),
      body: JSON.stringify({ status }),
    });
    loadAll();
  };

  // ---- settings ----
  const saveSettings = async () => {
    await fetch("/api/admin/settings", {
      method: "PUT",
      headers: headers(),
      body: JSON.stringify({
        delivery_free: settings.delivery_free === "false" ? "true" : settings.delivery_free || "true",
        delivery_charge_inside: settings.delivery_charge_inside || "60",
        delivery_charge_outside: settings.delivery_charge_outside || "120",
      }),
    });
    alert("সেভ হয়েছে ✓");
  };

  if (!authed) {
    return (
      <div className="flex min-h-screen flex-col bg-cream">
        <Header />
        <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-4">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h1 className="text-center text-xl font-extrabold">🔐 অ্যাডমিন লগইন</h1>
            <p className="mt-1 text-center text-xs text-stone-500">
              শুধুমাত্র দোকান মালিকের জন্য
            </p>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && login()}
              placeholder="PIN দিন"
              className="mt-4 w-full rounded-xl border border-stone-300 px-4 py-2.5 text-center text-lg font-bold tracking-widest outline-none focus:border-brand-600"
            />
            {pinError && (
              <p className="mt-2 text-center text-xs font-bold text-red-600">
                {pinError}
              </p>
            )}
            <button
              onClick={login}
              className="mt-3 w-full rounded-xl bg-brand-700 py-2.5 font-extrabold text-white hover:bg-brand-800"
            >
              প্রবেশ করুন
            </button>
            <Link
              href="/"
              className="mt-3 block text-center text-xs font-bold text-stone-500 hover:underline"
            >
              ← দোকানে ফিরুন
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-extrabold">🛠️ অ্যাডমিন ড্যাশবোর্ড</h1>
          <button
            onClick={logout}
            className="rounded-full bg-stone-200 px-4 py-1.5 text-xs font-bold text-stone-700 hover:bg-stone-300"
          >
            লগআউট
          </button>
        </div>

        <div className="mt-3 flex gap-2">
          {(
            [
              ["products", `📦 প্রোডাক্টস (${products.length})`],
              ["orders", `📋 অর্ডারসমূহ (${orders.length})`],
              ["delivery", "🚚 ডেলিভারি সেটিং"],
            ] as [Tab, string][]
          ).map(([t, label]) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                tab === t
                  ? "bg-brand-700 text-white shadow"
                  : "bg-white text-stone-700 ring-1 ring-stone-300"
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {loading && <p className="mt-4 text-sm text-stone-500">লোড হচ্ছে…</p>}

        {/* PRODUCTS */}
        {tab === "products" && !loading && (
          <div className="mt-4">
            <button
              onClick={openNew}
              className="rounded-xl bg-cta px-5 py-2.5 text-sm font-extrabold text-white hover:bg-cta-dark"
            >
              ＋ নতুন প্রোডাক্ট
            </button>
            <div className="mt-3 flex flex-col gap-2">
              {products.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200/70"
                >
                  <img
                    src={p.images[0] || "/logo.webp"}
                    alt=""
                    className="h-14 w-14 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-bold text-stone-900">
                      {p.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      {formatPrice(p.price)} • {p.category} •
                      <span
                        className={p.in_stock ? "text-emerald-700 font-bold" : "text-red-600 font-bold"}
                      >
                        {p.in_stock ? " স্টকে আছে" : " স্টক আউট"}
                      </span>
                    </div>
                  </div>
                  <div className="flex shrink-0 flex-col gap-1 sm:flex-row">
                    <button
                      onClick={() => toggleStock(p)}
                      className={`rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                        p.in_stock
                          ? "bg-amber-100 text-amber-800"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {p.in_stock ? "স্টক আউট করুন" : "স্টকে আনুন"}
                    </button>
                    <button
                      onClick={() => openEdit(p)}
                      className="rounded-lg bg-brand-100 px-2.5 py-1.5 text-xs font-bold text-brand-800"
                    >
                      এডিট
                    </button>
                    <button
                      onClick={() => deleteProduct(p)}
                      className="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-bold text-red-700"
                    >
                      মুছুন
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ORDERS */}
        {tab === "orders" && !loading && (
          <div className="mt-4 flex flex-col gap-3">
            {orders.length === 0 && (
              <p className="py-8 text-center text-sm text-stone-500">
                এখনো কোনো অর্ডার আসেনি
              </p>
            )}
            {orders.map((o) => (
              <div
                key={o.id}
                className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/70"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="font-extrabold text-brand-700">
                      {o.order_number}
                    </span>
                    <span
                      className={`ml-2 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        o.status === "completed"
                          ? "bg-emerald-100 text-emerald-800"
                          : "bg-amber-100 text-amber-800"
                      }`}
                    >
                      {o.status === "completed" ? "Completed ✓" : "Pending"}
                    </span>
                  </div>
                  <div className="text-xs text-stone-500">
                    {new Date(o.created_at).toLocaleString("bn-BD")}
                  </div>
                </div>
                <div className="mt-2 text-sm text-stone-700">
                  <div>
                    <b>{o.customer_name}</b> • {o.mobile}
                  </div>
                  <div className="text-xs text-stone-500">{o.address}</div>
                </div>
                <button
                  onClick={() =>
                    setExpandedOrder(expandedOrder === o.id ? null : o.id)
                  }
                  className="mt-2 text-xs font-bold text-brand-700 hover:underline"
                >
                  {expandedOrder === o.id ? "লুকান ▲" : "বিস্তারিত দেখুন ▼"}
                </button>
                {expandedOrder === o.id && (
                  <div className="mt-2 rounded-xl bg-stone-50 p-3 text-sm">
                    {o.items.map((it, i) => (
                      <div key={i} className="flex justify-between py-0.5">
                        <span>
                          {it.name} × {it.qty}
                          {it.color ? ` (${it.color})` : ""}
                        </span>
                        <span className="font-bold">
                          {formatPrice(it.price * it.qty)}
                        </span>
                      </div>
                    ))}
                    <div className="mt-1 flex justify-between border-t border-stone-200 pt-1 text-xs text-stone-600">
                      <span>ডেলিভারি চার্জ</span>
                      <span>
                        {o.delivery_charge === 0
                          ? "ফ্রি"
                          : formatPrice(o.delivery_charge)}
                      </span>
                    </div>
                    <div className="flex justify-between font-extrabold">
                      <span>মোট</span>
                      <span>{formatPrice(o.total)}</span>
                    </div>
                  </div>
                )}
                {o.status !== "completed" && (
                  <button
                    onClick={() => setOrderStatus(o.id, "completed")}
                    className="mt-2 rounded-xl bg-emerald-600 px-4 py-1.5 text-xs font-extrabold text-white hover:bg-emerald-700"
                  >
                    ✓ Completed করুন
                  </button>
                )}
              </div>
            ))}
          </div>
        )}

        {/* DELIVERY SETTINGS */}
        {tab === "delivery" && !loading && (
          <div className="mt-4 max-w-lg rounded-2xl bg-white p-5 shadow-sm ring-1 ring-stone-200/70">
            <h2 className="font-extrabold">🚚 ডেলিভারি সেটিং</h2>
            <p className="mt-1 text-xs text-stone-500">
              এই সেটিং শুধু আপনি দেখতে পাবেন — কাস্টমাররা দেখবে না।
            </p>
            <label className="mt-4 flex items-center justify-between rounded-xl bg-stone-50 p-3 ring-1 ring-stone-200">
              <span className="text-sm font-bold">
                🎉 ফ্রি ডেলিভারি অফার চালু
              </span>
              <button
                onClick={() =>
                  setSettings((s) => ({
                    ...s,
                    delivery_free:
                      s.delivery_free === "false" ? "true" : "false",
                  }))
                }
                className={`relative h-7 w-12 rounded-full transition ${
                  settings.delivery_free !== "false"
                    ? "bg-emerald-600"
                    : "bg-stone-300"
                }`}
              >
                <span
                  className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-all ${
                    settings.delivery_free !== "false" ? "left-6" : "left-1"
                  }`}
                />
              </button>
            </label>
            {settings.delivery_free === "false" && (
              <div className="mt-3 space-y-2">
                <div>
                  <label className="text-xs font-bold text-stone-700">
                    ঢাকার ভিতরে চার্জ (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.delivery_charge_inside || "60"}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        delivery_charge_inside: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold outline-none focus:border-brand-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-stone-700">
                    ঢাকার বাইরে চার্জ (৳)
                  </label>
                  <input
                    type="number"
                    value={settings.delivery_charge_outside || "120"}
                    onChange={(e) =>
                      setSettings((s) => ({
                        ...s,
                        delivery_charge_outside: e.target.value,
                      }))
                    }
                    className="mt-1 w-full rounded-xl border border-stone-300 px-3 py-2 text-sm font-bold outline-none focus:border-brand-600"
                  />
                </div>
              </div>
            )}
            <button
              onClick={saveSettings}
              className="mt-4 w-full rounded-xl bg-brand-700 py-2.5 text-sm font-extrabold text-white hover:bg-brand-800"
            >
              সেভ করুন
            </button>
          </div>
        )}
      </main>

      {/* Product form modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 sm:items-center">
          <div className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl">
            <h2 className="text-lg font-extrabold">
              {editing ? "✏️ প্রোডাক্ট এডিট" : "＋ নতুন প্রোডাক্ট"}
            </h2>
            <div className="mt-3 space-y-2.5">
              <input
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                placeholder="প্রোডাক্টের নাম *"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-medium outline-none focus:border-brand-600"
              />
              <div className="flex gap-2">
                <input
                  value={fPrice}
                  onChange={(e) => setFPrice(e.target.value)}
                  placeholder="দাম (৳) *"
                  type="number"
                  className="flex-1 rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-medium outline-none focus:border-brand-600"
                />
                <select
                  value={fCategory}
                  onChange={(e) => setFCategory(e.target.value)}
                  className="flex-1 rounded-xl border border-stone-300 px-3 py-2.5 text-sm font-medium outline-none focus:border-brand-600"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
              <textarea
                value={fDesc}
                onChange={(e) => setFDesc(e.target.value)}
                placeholder="বিবরণ (বাংলায়)"
                rows={3}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-600"
              />
              <textarea
                value={fFeatures}
                onChange={(e) => setFFeatures(e.target.value)}
                placeholder="বৈশিষ্ট্য (প্রতি লাইনে একটি)"
                rows={3}
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-600"
              />
              <input
                value={fColors}
                onChange={(e) => setFColors(e.target.value)}
                placeholder="কালার (কমা দিয়ে আলাদা, না থাকলে খালি)"
                className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm outline-none focus:border-brand-600"
              />
              <div>
                <label className="text-xs font-bold text-stone-700">
                  ছবি ({fImages.length}টি)
                </label>
                <div className="mt-1 flex flex-wrap gap-2">
                  {fImages.map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt=""
                        className="h-16 w-16 rounded-lg object-cover ring-1 ring-stone-300"
                      />
                      <button
                        onClick={() =>
                          setFImages(fImages.filter((_, j) => j !== i))
                        }
                        className="absolute -right-1.5 -top-1.5 rounded-full bg-red-600 px-1.5 text-xs font-bold text-white"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <label className="mt-2 inline-block cursor-pointer rounded-xl bg-stone-100 px-4 py-2 text-xs font-bold text-stone-700 ring-1 ring-stone-300 hover:bg-stone-200">
                  {uploading ? "আপলোড হচ্ছে…" : "📷 ছবি যোগ করুন"}
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    disabled={uploading}
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                </label>
              </div>
              {formError && (
                <p className="text-xs font-bold text-red-600">{formError}</p>
              )}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={saveProduct}
                  className="flex-1 rounded-xl bg-cta py-2.5 text-sm font-extrabold text-white hover:bg-cta-dark"
                >
                  সেভ করুন
                </button>
                <button
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-xl bg-stone-200 py-2.5 text-sm font-bold text-stone-700"
                >
                  বাতিল
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
