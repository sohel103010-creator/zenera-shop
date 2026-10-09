import { SHOP } from "@/lib/shop";

export default function Footer() {
  return (
    <footer>
      {/* Facebook promo */}
      <section className="bg-gradient-to-br from-brand-700 via-brand-600 to-brand-800 px-4 py-10">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl">
            🎁 আরো চমক অপেক্ষা করছে!
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-sm font-medium text-emerald-50 sm:text-base">
            নতুন প্রোডাক্ট, স্পেশাল অফার আর গিফট — সবার আগে পেতে ফলো করুন
            আমাদের ফেসবুক পেইজ
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <a
              href={SHOP.fbGadgets}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-white/10 p-5 text-left backdrop-blur transition hover:bg-white/20"
            >
              <div className="text-3xl">🛒</div>
              <div className="mt-2 text-lg font-bold text-white">
                Zenera Gadgets
              </div>
              <p className="text-sm text-emerald-50">
                গ্যাজেট ও ইলেকট্রনিক্সের সব আপডেট
              </p>
              <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand-700">
                পেইজ ভিজিট করুন →
              </span>
            </a>
            <a
              href={SHOP.fbFashion}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-2xl bg-white/10 p-5 text-left backdrop-blur transition hover:bg-white/20"
            >
              <div className="text-3xl">👗</div>
              <div className="mt-2 text-lg font-bold text-white">
                Online Shopping
              </div>
              <p className="text-sm text-emerald-50">
                পোশাক ও ফ্যাশন কালেকশন
              </p>
              <span className="mt-3 inline-block rounded-full bg-white px-4 py-1.5 text-sm font-bold text-brand-700">
                পেইজ ভিজিট করুন →
              </span>
            </a>
          </div>
        </div>
      </section>

      {/* Contact footer */}
      <div className="bg-stone-900 px-4 py-8 text-stone-300">
        <div className="mx-auto grid max-w-6xl gap-6 sm:grid-cols-3">
          <div>
            <div className="flex items-center gap-2">
              <img
                src="/logo.webp"
                alt="Zenera"
                className="h-9 w-9 rounded-full bg-white object-cover"
              />
              <span className="text-lg font-extrabold text-white">Zenera</span>
            </div>
            <p className="mt-2 text-sm">
              সারা বাংলাদেশে ফ্রি ডেলিভারি • ক্যাশ অন ডেলিভারি
            </p>
          </div>
          <div>
            <div className="font-bold text-white">যোগাযোগ</div>
            <p className="mt-1 text-sm">📞 {SHOP.phone}</p>
            <p className="mt-1 text-sm">
              💬 WhatsApp: {SHOP.whatsapp}
            </p>
            <p className="mt-1 text-sm">📍 {SHOP.address}</p>
          </div>
          <div>
            <div className="font-bold text-white">ফেসবুক পেইজ</div>
            <a
              href={SHOP.fbGadgets}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-emerald-300 hover:underline"
            >
              Zenera Gadgets
            </a>
            <a
              href={SHOP.fbFashion}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 block text-sm text-emerald-300 hover:underline"
            >
              Online Shopping (Fashion)
            </a>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-6xl border-t border-stone-700 pt-4 text-center text-xs text-stone-500">
          © {new Date().getFullYear()} Zenera. সর্বস্বত্ব সংরক্ষিত।
        </p>
      </div>
    </footer>
  );
}
