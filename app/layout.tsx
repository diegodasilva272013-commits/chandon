import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { meta } from "@/content/chandon";
import SmoothScroll from "@/components/ui/SmoothScroll";
import Nav from "@/components/ui/Nav";
import Footer from "@/components/ui/Footer";
import AgeGate from "@/components/ui/AgeGate";
import GlobalFx from "@/components/ui/GlobalFx";

// FGrotesk: tipografia de chandon.com (ver BRAND.md sobre licencia).
const fg = localFont({
  variable: "--font-fg",
  display: "swap",
  src: [
    { path: "../public/brand/fonts/FGroteskThin-Regular-CiCmNK1y.woff2", weight: "300", style: "normal" },
    { path: "../public/brand/fonts/FGrotesk-Regular-BIDfmhV8.woff2", weight: "400", style: "normal" },
    { path: "../public/brand/fonts/FGrotesk-Italic-Cl7T8xz7.woff2", weight: "400", style: "italic" },
    { path: "../public/brand/fonts/FGroteskDemi-Regular-C_7khieM.woff2", weight: "600", style: "normal" },
    { path: "../public/brand/fonts/FGroteskBold-Regular-pXCoWLav.woff2", weight: "700", style: "normal" },
  ],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://chandon-nine.vercel.app"),
  title: meta.title,
  description: meta.description,
  openGraph: { title: meta.title, description: meta.description, siteName: meta.siteName, url: "/", locale: "es_AR", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Chandon" }] },
  twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: ["/og.png"] },
};

export const viewport: Viewport = { themeColor: "#0b0b0b", colorScheme: "dark" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es-AR" className={`${fg.variable} h-full`}>
      <body className="flex min-h-full flex-col">
        <AgeGate />
        <SmoothScroll />
        <GlobalFx />
        <Nav />
        <main id="contenido" className="relative z-10 flex-1 bg-ink">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
