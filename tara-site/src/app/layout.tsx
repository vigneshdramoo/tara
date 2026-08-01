import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Manrope } from "next/font/google";

import "./globals.css";

import {
  GoogleAnalytics,
  GoogleAnalyticsHead,
} from "@/components/analytics/GoogleAnalytics";
import {
  GoogleTagManagerHead,
  GoogleTagManagerNoScript,
} from "@/components/analytics/GoogleTagManager";
import { MetricoolTrackerHead } from "@/components/analytics/MetricoolTracker";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { FloatingWhatsAppButton } from "@/components/sections/FloatingWhatsAppButton";
import { brand } from "@/content/brand";
import { absoluteUrl, siteUrl } from "@/lib/utils";

const sans = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "500", "600", "700"],
});

const defaultSocialImage = {
  url: absoluteUrl("/og/tara-home.jpg"),
  width: 1200,
  height: 630,
  alt: "TARA fragrance bottles with editorial styling for the full scent family.",
};

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${brand.name} - Luxury Perfume`,
    template: `%s | ${brand.name}`,
  },
  description: brand.description,
  keywords: [
    "luxury perfume",
    "luxury fragrance",
    "minimal perfume",
    "editorial fragrance brand",
    "dark floral perfume",
    "sensual luxury scents",
    "perfume Malaysia",
    "fragrance Malaysia",
    "perfume for humid climate",
    "scent layering",
    "perfume gift Malaysia",
    "halal-conscious fragrance",
    "Aureya perfume",
    "Zephyr perfume",
    "Maris perfume",
    "Eliora perfume",
    "Ashoka perfume",
    "Ardor perfume",
    "THEON perfume",
    "tea perfume",
    "TARA",
  ],
  openGraph: {
    title: `${brand.name} - Luxury Perfume`,
    description: brand.description,
    url: absoluteUrl("/"),
    siteName: brand.name,
    images: [defaultSocialImage],
    locale: "en_MY",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${brand.name} - Luxury Perfume`,
    description: brand.description,
    images: [defaultSocialImage],
  },
  icons: {
    icon: "/logos/tara-emblem.png",
    apple: "/logos/tara-emblem.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F3EB",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <GoogleTagManagerHead />
        <GoogleAnalyticsHead />
        <MetricoolTrackerHead />
      </head>
      <body className={`${sans.variable} ${serif.variable} antialiased`}>
        <GoogleTagManagerNoScript />
        <GoogleAnalytics />
        <div className="relative min-h-screen overflow-x-clip">
          <Header />
          <main>{children}</main>
          <Footer />
          <FloatingWhatsAppButton />
        </div>
      </body>
    </html>
  );
}
