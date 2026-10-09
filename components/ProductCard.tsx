"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice, getCart, saveCart, type Product } from "@/lib/shop";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();
  const out = !product.in_stock;

  const addToCart = () => {
    if (out) return;
    const cart = getCart();
    const existing = cart.find(
      (i) => i.slug === product.slug && !i.color
    );
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({
        slug: product.slug,
        name: product.name,
        price: product.price,
        qty: 1,
        image: product.images[0] ?? "/logo.webp",
      });
    }
    saveCart(cart);
  };

  const orderNow = () => {
    if (out) return;
    router.push(`/product/${product.slug}?buy=1`);
  };

  return (
    <div className="relative flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-stone-200/70 transition hover:shadow-md">
      {out && (
        <span className="absolute left-2 top-2 z-10 rounded-full bg-stone-800 px-2.5 py-1 text-[11px] font-bold text-white">
          স্টক আউট
        </span>
      )}
      <Link
        href={`/product/${product.slug}`}
        className="block aspect-square w-full overflow-hidden bg-stone-100"
      >
        <img
          src={product.images[0] ?? "/logo.webp"}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1.5 p-3">
        <Link href={`/product/${product.slug}`}>
          <h3 className="line-clamp-2 min-h-10 text-sm font-bold leading-snug text-stone-900 hover:text-brand-700">
            {product.name}
          </h3>
        </Link>
        <div className="text-lg font-extrabold text-stone-900">
          {formatPrice(product.price)}
        </div>
        <div className="mt-auto flex flex-col gap-1.5 pt-1">
          <button
            onClick={orderNow}
            disabled={out}
            className="w-full rounded-xl bg-cta py-2 text-sm font-extrabold text-white transition hover:bg-cta-dark disabled:cursor-not-allowed disabled:bg-stone-300 disabled:text-stone-500"
          >
            অর্ডার করুন
          </button>
          <button
            onClick={addToCart}
            disabled={out}
            className="w-full rounded-xl border-2 border-brand-600 py-1.5 text-sm font-bold text-brand-700 transition hover:bg-brand-50 disabled:cursor-not-allowed disabled:border-stone-300 disabled:text-stone-400"
          >
            কার্টে যোগ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
