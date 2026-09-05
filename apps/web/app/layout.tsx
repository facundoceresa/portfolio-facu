import type { Metadata } from "next";
import { DM_Sans, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  display: "swap",
});

const body = DM_Sans({
  variable: "--font-body",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.APP_ORIGIN ?? "http://localhost:3000"),
  title: {
    default: "Facundo Ceresa - Portfolio full-stack",
    template: "%s - Facundo Ceresa",
  },
  description: "Portfolio técnico full-stack de Facundo Ceresa en Montevideo, Uruguay.",
  alternates: {
    canonical: "/",
    languages: {
      es: "/",
      en: "/en",
    },
  },
  openGraph: {
    title: "Facundo Ceresa - Portfolio full-stack",
    description: "Casos reales de software, integraciones ERP, automatización e IA aplicada con criterio técnico.",
    url: "/",
    siteName: "Facundo Ceresa",
    locale: "es_UY",
    type: "website",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "Facundo Ceresa - Portfolio full-stack" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Facundo Ceresa - Portfolio full-stack",
    description: "Portfolio técnico con casos reales, capturas locales y repositorios públicos.",
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="es"
      className={`${display.variable} ${body.variable} ${mono.variable} h-full antialiased`}
    >
      <body className="min-h-full">{children}</body>
    </html>
  );
}
