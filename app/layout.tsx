import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Zenera — অনলাইন শপ",
  description:
    "Zenera অনলাইন শপ — কিচেন গ্যাজেট, বেবি কেয়ার, বিউটি কেয়ার ও আরও অনেক কিছু। সারা বাংলাদেশে ফ্রি ডেলিভারি, ক্যাশ অন ডেলিভারি।",
  icons: { icon: "/logo.webp" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-cream text-stone-900 antialiased">
        {children}
      </body>
    </html>
  );
}
