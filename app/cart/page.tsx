"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  formatPrice,
  getCart,
  saveCart,
  type CartItem,
} from "@/lib/shop";

function CartInner() {
  const searchParams = useSearchParams();
  const isDirect = searchParams.get("mode") === "direct";
  const [items, setItems] = useState<CartItem[]>([]);
  const [deliveryFree, setDeliveryFree] = useState(true);
  const [chargeInside, setChargeInside] = useState(60);
  const [chargeOutside, setChargeOutside] = useState(120);
  const [area, setArea] = useState<"inside" | "outside">("inside");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [mobile, setMobile] = useState("");
  const [placing, setPlacing] = useState(false);
  const [done, setDone] = useState<string | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isDirect) {
      try {
        const d = sessionStorage.getItem("zenera_direct");
        if (d) setItems([JSON.parse(d)]);
      } catch {
        setItems([]);
      }
    } else {
      setItems(getCart());
    }
    fetch("/api/settings/public")
      .then((r) => r.json())
      .then((d) => {
        setDeliveryFree(d.delivery_free !== false);
        setChargeInside(d.delivery_charge_inside ?? 60);
        setChargeOutside(d.delivery_charge_outside ?? 120);
      })
      .catch(() => {});
  }, [isDirect]);

  const updateQty = (idx: number, qty: number) => {
    if (qty < 1) return;
    const next = [...items];
    next[idx].qty = qty;
    setItems(next);
    if (!isDirect) saveCart(next);
  };

  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    setItems(next);
    if (!isDirect) saveCart(next);
  };

  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const deliveryCharge = deliveryFree
    ? 0
    : area === "inside"
      ? chargeInside
      : chargeOutside;
  const total = subtotal + deliveryCharge;

  const placeOrder = async () => {
    setError("");
    if (!name.trim() || !address.trim() || !mobile.trim()) {
      setError("অনুগ্রহ করে নাম, ঠিকানা ও মোবাইল নম্বর দিন।");
      return;
    }
    if (!/^01\d{9}$/.test(mobile.trim())) {
      setError("সঠিক ১১ সংখ্যার মোবাইল নম্বর দিন (01 দিয়ে শুরু)।");
      return;
    }
    if (items.length === 0) {
      setError("কার্ট খালি আছে।");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name.trim(),
          address: address.trim(),
          mobile: mobile.trim(),
          area,
          items: items.map((i) => ({
            slug: i.slug,
            name: i.name,
            price: i.price,
            qty: i.qty,
            color: i.color ?? null,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "অর্ডার করা যায়নি");
      setDone(data.order_number);
      if (isDirect) sessionStorage.removeItem("zenera_direct");
      else saveCart([]);
      setItems([]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "অর্ডার করা যায়নি");
    } finally {
      setPlacing(false);
    }
  };

  if (done) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <main className="mx-auto flex w-full max-w-lg flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div className="text-6xl">✅</div>
          <h1 className="mt-4 text-2xl font-extrabold text-stone-900">
            ধন্যবাদ! আপনার অর্ডার পেয়েছি।
          </h1>
          <p className="mt-2 text-sm text-stone-600">
            আমাদের প্রতিনিধি শীঘ্রই কল করে কনফার্ম করবে।
          </p>
          <div className="mt-4 rounded-2xl bg-white px-6 py-4 shadow-sm ring-1 ring-stone-200">
            <div className="text-xs font-bold text-stone-500">অর্ডার নম্বর</div>
            <div className="text-2xl font-extrabold text-brand-700">{done}</div>
          </div>
          <Link
            href="/"
            className="mt-6 rounded-full bg-brand-700 px-8 py-2.5 text-sm font-bold text-white"
          >
            আরও কেনাকাটা করুন
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-3 py-4 sm:px-4">
        <h1 className="text-xl font-extrabold text-stone-900">
          {isDirect ? "অর্ডার করুন" : "🛒 আমার কার্ট"}
        </h1>

        {items.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl">🛒</div>
            <p className="mt-3 font-bold text-stone-700">কার্ট খালি আছে</p>
            <Link
              href="/"
              className="mt-4 inline-block rounded-full bg-brand-700 px-6 py-2 text-sm font-bold text-white"
            >
              কেনাকাটা শুরু করুন
            </Link>
          </div>
        ) : (
          <div className="mt-4 grid gap-4 lg:grid-cols-5">
            <div className="flex flex-col gap-3 lg:col-span-3">
              {items.map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-stone-200/70"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col">
                    <div className="text-sm font-bold text-stone-900">
                      {item.name}
                    </div>
                    {item.color && (
                      <div className="text-xs text-stone-500">
                        কালার: {item.color}
                      </div>
                    )}
                    <div className="text-sm font-extrabold text-stone-900">
                      {formatPrice(item.price)}
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-1">
                      <div className="flex items-center rounded-full ring-1 ring-stone-300">
                        <button
                          onClick={() => updateQty(idx, item.qty - 1)}
                          className="px-3 py-1 font-bold text-stone-700"
                        >
                          −
                        </button>
                        <span className="min-w-6 text-center text-sm font-extrabold">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(idx, item.qty + 1)}
                          className="px-3 py-1 font-bold text-stone-700"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(idx)}
                        className="text-xs font-bold text-red-600 hover:underline"
                      >
                        মুছুন 🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-2">
              <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/70">
                <h2 className="font-extrabold text-stone-900">অর্ডার সামারি</h2>
                <div className="mt-2 space-y-1 text-sm">
                  <div className="flex justify-between text-stone-700">
                    <span>সাবটোটাল</span>
                    <span className="font-bold">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-stone-700">
                    <span>ডেলিভারি চার্জ</span>
                    <span className="font-bold text-emerald-700">
                      {deliveryFree
                        ? "ফ্রি 🎉"
                        : formatPrice(deliveryCharge)}
                    </span>
                  </div>
                  <div className="flex justify-between border-t border-stone-200 pt-2 text-base font-extrabold text-stone-900">
                    <span>সর্বমোট</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>

                {!deliveryFree && (
                  <div className="mt-3">
                    <div className="text-xs font-bold text-stone-700">
                      ডেলিভারি এলাকা:
                    </div>
                    <div className="mt-1 flex gap-2">
                      {(["inside", "outside"] as const).map((a) => (
                        <button
                          key={a}
                          onClick={() => setArea(a)}
                          className={`flex-1 rounded-full px-3 py-1.5 text-xs font-bold ${
                            area === a
                              ? "bg-brand-700 text-white"
                              : "bg-stone-100 text-stone-700 ring-1 ring-stone-300"
                          }`}
                        >
                          {a === "inside"
                            ? `ঢাকার ভিতরে (${formatPrice(chargeInside)})`
                            : `ঢাকার বাইরে (${formatPrice(chargeOutside)})`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-4 space-y-2.5">
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="আপনার নাম *"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-medium text-stone-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="সম্পূর্ণ ঠিকানা *"
                    rows={2}
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-medium text-stone-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                  <input
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    placeholder="মোবাইল নম্বর * (01XXXXXXXXX)"
                    inputMode="numeric"
                    className="w-full rounded-xl border border-stone-300 px-3.5 py-2.5 text-sm font-medium text-stone-900 outline-none focus:border-brand-600 focus:ring-2 focus:ring-brand-100"
                  />
                </div>

                {error && (
                  <p className="mt-2 text-xs font-bold text-red-600">{error}</p>
                )}

                <button
                  onClick={placeOrder}
                  disabled={placing}
                  className="mt-4 w-full rounded-xl bg-cta py-3 text-base font-extrabold text-white transition hover:bg-cta-dark disabled:opacity-60"
                >
                  {placing ? "অর্ডার হচ্ছে…" : `✅ অর্ডার কনফার্ম করুন (${formatPrice(total)})`}
                </button>
                <p className="mt-2 text-center text-xs text-stone-500">
                  💵 ক্যাশ অন ডেলিভারি — পণ্য হাতে পেয়ে টাকা দিবেন
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen flex-col">
          <Header />
          <div className="flex flex-1 items-center justify-center">
            লোড হচ্ছে…
          </div>
          <Footer />
        </div>
      }
    >
      <CartInner />
    </Suspense>
  );
}
