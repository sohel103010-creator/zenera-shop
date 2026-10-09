"use client";

import { useEffect, useMemo, useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { CATEGORIES } from "@/lib/products-data";
import type { Product } from "@/lib/shop";

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string>("সব");

  useEffect(() => {
    fetch("/api/products")
      .then((r) => r.json())
      .then((d) => {
        setProducts(d.products ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => {
      const okCat = category === "সব" || p.category === category;
      const okQ =
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q);
      return okCat && okQ;
    });
  }, [products, search, category]);

  return (
    <div className="flex min-h-screen flex-col">
      <Header onSearch={setSearch} searchValue={search} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-4 py-8 text-center sm:py-12">
        <h1 className="text-2xl font-extrabold text-white sm:text-4xl">
          Zenera অনলাইন শপ 🛍️
        </h1>
        <p className="mx-auto mt-2 max-w-lg text-sm font-medium text-emerald-50 sm:text-base">
          মানসম্মত গ্যাজেট ও নিত্যপ্রয়োজনীয় পণ্য — ঘরে বসেই অর্ডার করুন
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur sm:text-sm">
            🚚 সারা বাংলাদেশে ফ্রি ডেলিভারি
          </span>
          <span className="rounded-full bg-white/20 px-4 py-1.5 text-xs font-bold text-white backdrop-blur sm:text-sm">
            💵 ক্যাশ অন ডেলিভারি
          </span>
        </div>
      </section>

      {/* Category pills */}
      <div className="sticky top-[60px] z-30 bg-cream/95 py-2 backdrop-blur">
        <div className="no-scrollbar mx-auto flex max-w-6xl gap-2 overflow-x-auto px-3 sm:px-4">
          {["সব", ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-bold transition ${
                category === c
                  ? "bg-brand-700 text-white shadow"
                  : "bg-white text-stone-700 ring-1 ring-stone-300 hover:ring-brand-600"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <main className="mx-auto w-full max-w-6xl flex-1 px-3 py-4 sm:px-4">
        {loading ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-[3/4] animate-pulse rounded-2xl bg-stone-200"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-16 text-center">
            <div className="text-5xl">🔍</div>
            <p className="mt-3 text-lg font-bold text-stone-800">
              কোনো প্রোডাক্ট পাওয়া যায়নি
            </p>
            <p className="mt-1 text-sm text-stone-500">
              অন্য নামে খুঁজে দেখুন
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
            {filtered.map((p) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
