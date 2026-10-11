import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://zenera.top";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Zenera — অনলাইন শপ",
  description:
    "Zenera (জেনেরা) অনলাইন শপ — কিচেন গ্যাজেট, বেবি কেয়ার, বিউটি কেয়ার ও আরও অনেক কিছু। সারা বাংলাদেশে ফ্রি ডেলিভারি, ক্যাশ অন ডেলিভারি।",
  keywords: [
    "Zenera",
    "জেনেরা",
    "Zenera online shop",
    "Zenera shop",
    "অনলাইন শপ",
    "কিচেন গ্যাজেট",
    "বেবি কেয়ার",
    "বিউটি কেয়ার",
    "online shopping Bangladesh",
  ],
  icons: { icon: "/logo.webp" },
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    locale: "bn_BD",
    url: SITE_URL,
    siteName: "Zenera",
    title: "Zenera — অনলাইন শপ",
    description:
      "Zenera (জেনেরা) অনলাইন শপ — কিচেন গ্যাজেট, বেবি কেয়ার, বিউটি কেয়ার ও আরও অনেক কিছু। সারা বাংলাদেশে ফ্রি ডেলিভারি, ক্যাশ অন ডেলিভারি।",
    images: [{ url: "/logo.webp", alt: "Zenera logo" }],
  },
  twitter: {
    card: "summary",
    title: "Zenera — অনলাইন শপ",
    description:
      "Zenera (জেনেরা) অনলাইন শপ — কিচেন গ্যাজেট, বেবি কেয়ার, বিউটি কেয়ার। সারা বাংলাদেশে ফ্রি ডেলিভারি, ক্যাশ অন ডেলিভারি।",
    images: ["/logo.webp"],
  },
  robots: { index: true, follow: true },
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Zenera",
  alternateName: "জেনেরা",
  url: SITE_URL,
  logo: `${SITE_URL}/logo.webp`,
  description:
    "Zenera অনলাইন শপ — কিচেন গ্যাজেট, বেবি কেয়ার, বিউটি কেয়ার। সারা বাংলাদেশে ফ্রি ডেলিভারি, ক্যাশ অন ডেলিভারি।",
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Zenera",
  alternateName: "জেনেরা",
  url: SITE_URL,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="bn">
      <body className="min-h-screen bg-cream text-stone-900 antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {children}
      </body>
    </html>
  );
}
