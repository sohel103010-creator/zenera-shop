"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount } from "@/lib/shop";

export default function Header({
  onSearch,
  searchValue,
}: {
  onSearch?: (q: string) => void;
  searchValue?: string;
}) {
  const [count, setCount] = useState(0);
  const [q, setQ] = useState(searchValue ?? "");

  useEffect(() => {
    const update = () => setCount(cartCount());
    update();
    window.addEventListener("zenera-cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("zenera-cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  useEffect(() => {
    setQ(searchValue ?? "");
  }, [searchValue]);

  return (
    <header className="sticky top-0 z-40 bg-brand-700 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-3 py-2.5 sm:gap-4 sm:px-4">
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <img
            src="/logo.webp"
            alt="Zenera"
            className="h-10 w-10 rounded-full bg-white object-cover ring-2 ring-white/70"
          />
          <span className="text-xl font-extrabold tracking-tight text-white">
            Zenera
          </span>
        </Link>
        {onSearch && (
          <div className="relative flex-1">
            <input
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                onSearch(e.target.value);
              }}
              placeholder="প্রোডাক্ট খুঁজুন…"
              className="w-full rounded-full bg-white/95 py-2 pl-10 pr-4 text-sm font-medium text-stone-900 placeholder-stone-500 outline-none focus:ring-2 focus:ring-cta"
            />
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500">
              🔍
            </span>
          </div>
        )}
        <Link
          href="/cart"
          className="relative flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-2 text-sm font-bold text-white transition hover:bg-white/25"
        >
          <span className="text-lg">🛒</span>
          <span className="hidden sm:inline">কার্ট</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-cta px-1 text-[11px] font-extrabold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
