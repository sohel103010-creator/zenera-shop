"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  formatPrice,
  getCart,
  saveCart,
  type Product,
} from "@/lib/shop";

export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const router = useRouter();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [imgIdx, setImgIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [color, setColor] = useState<string | null>(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    fetch(`/api/products?slug=${encodeURIComponent(params.slug)}`)
      .then((r) => r.json())
      .then((d) => {
        const p = (d.products ?? [])[0] ?? null;
        setProduct(p);
        if (p?.colors?.length) setColor(p.colors[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-8">
          <div className="aspect-square animate-pulse rounded-2xl bg-stone-200" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col">
        <Header />
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
          <div className="text-5xl">😕</div>
          <p className="mt-3 text-lg font-bold">প্রোডাক্ট পাওয়া যায়নি</p>
          <Link
            href="/"
            className="mt-4 rounded-full bg-brand-700 px-6 py-2 text-sm font-bold text-white"
          >
            হোমে ফিরুন
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const out = !product.in_stock;
  const images = product.images.length ? product.images : ["/logo.webp"];

  const makeItem = () => ({
    slug: product.slug,
    name: product.name,
    price: product.price,
    qty,
    color,
    image: images[0],
  });

  const addToCart = () => {
    if (out) return;
    const cart = getCart();
    const item = makeItem();
    const existing = cart.find(
      (i) => i.slug === item.slug && (i.color ?? null) === (item.color ?? null)
    );
    if (existing) existing.qty += item.qty;
    else cart.push(item);
    saveCart(cart);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const orderNow = () => {
    if (out) return;
    sessionStorage.setItem("zenera_direct", JSON.stringify(makeItem()));
    router.push("/cart?mode=direct");
  };

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="mx-auto w-full max-w-4xl flex-1 px-3 py-4 sm:px-4">
        <Link
          href="/"
          className="mb-3 inline-block text-sm font-bold text-brand-700 hover:underline"
        >
          ← সব প্রোডাক্ট
        </Link>

        {/* Slider — no cropping, height adjusts per image */}
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/70">
          <div className="relative bg-stone-100">
            {out && (
              <span className="absolute left-3 top-3 z-10 rounded-full bg-stone-800 px-3 py-1 text-xs font-bold text-white">
                স্টক আউট
              </span>
            )}
            <img
              src={images[imgIdx]}
              alt={product.name}
              className="mx-auto max-h-[70vh] w-auto max-w-full object-contain"
            />
            {images.length > 1 && (
              <>
                <button
                  onClick={() =>
                    setImgIdx((imgIdx - 1 + images.length) % images.length)
                  }
                  className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-lg font-bold text-white"
                  aria-label="আগের ছবি"
                >
                  ‹
                </button>
                <button
                  onClick={() => setImgIdx((imgIdx + 1) % images.length)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 px-3 py-2 text-lg font-bold text-white"
                  aria-label="পরের ছবি"
                >
                  ›
                </button>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto p-3">
              {images.map((src, i) => (
                <button
                  key={i}
                  onClick={() => setImgIdx(i)}
                  className={`h-16 w-16 shrink-0 overflow-hidden rounded-lg ring-2 ${
                    i === imgIdx ? "ring-cta" : "ring-transparent"
                  }`}
                >
                  <img
                    src={src}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/70 sm:p-6">
          <div className="text-xs font-bold uppercase tracking-wide text-brand-700">
            {product.category}
          </div>
          <h1 className="mt-1 text-xl font-extrabold text-stone-900 sm:text-2xl">
            {product.name}
          </h1>
          <div className="mt-2 text-3xl font-extrabold text-stone-900">
            {formatPrice(product.price)}
          </div>
          <div className="mt-1 text-sm font-medium text-emerald-700">
            🚚 ফ্রি ডেলিভারি • 💵 ক্যাশ অন ডেলিভারি
          </div>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <div className="text-sm font-bold text-stone-800">
                কালার পছন্দ করুন:
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    onClick={() => setColor(c)}
                    className={`rounded-full px-4 py-2 text-sm font-bold transition ${
                      color === c
                        ? "bg-brand-700 text-white shadow"
                        : "bg-stone-100 text-stone-700 ring-1 ring-stone-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm font-bold text-stone-800">পরিমাণ:</span>
            <div className="flex items-center rounded-full ring-1 ring-stone-300">
              <button
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="px-4 py-1.5 text-lg font-bold text-stone-700"
              >
                −
              </button>
              <span className="min-w-8 text-center font-extrabold">{qty}</span>
              <button
                onClick={() => setQty(qty + 1)}
                className="px-4 py-1.5 text-lg font-bold text-stone-700"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <button
              onClick={orderNow}
              disabled={out}
              className="flex-1 rounded-xl bg-cta py-3 text-base font-extrabold text-white transition hover:bg-cta-dark disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
            >
              {out ? "স্টক আউট" : "অর্ডার করুন"}
            </button>
            <button
              onClick={addToCart}
              disabled={out}
              className="flex-1 rounded-xl border-2 border-brand-600 py-3 text-base font-bold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-400"
            >
              {added ? "✓ কার্টে যোগ হয়েছে!" : "কার্টে যোগ করুন"}
            </button>
          </div>
        </div>

        {/* Description */}
        <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-stone-200/70 sm:p-6">
          <h2 className="text-lg font-extrabold text-stone-900">
            পণ্যের বিবরণ
          </h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-700 sm:text-base">
            {product.description}
          </p>
          {product.features && (
            <>
              <h2 className="mt-4 text-lg font-extrabold text-stone-900">
                বৈশিষ্ট্য
              </h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-stone-700 sm:text-base">
                {product.features}
              </p>
            </>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
