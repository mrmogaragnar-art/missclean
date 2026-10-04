import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { JsonLd } from "@/components/JsonLd";
import { I18nProvider } from "@/i18n/I18nProvider";
import { siteConfig } from "@/config/site";
import "./globals.css";

const fredoka = Fredoka({
  subsets: ["latin", "latin-ext"],
  variable: "--font-fredoka",
  weight: ["500", "600", "700"],
});

const nunito = Nunito({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-nunito",
  weight: ["400", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.siteUrl),
  title: {
    default: "Miss Clean Valencia | Limpieza y химчистка a domicilio",
    template: "%s | Miss Clean Valencia",
  },
  description:
    "Limpieza por horas (18 €/h) y limpieza de tapicería en Valencia. Pedido mínimo химчистки 40 €. Sofás, colchones, alfombras a domicilio. Уборка и химчистка мебели в Валенсии. Reserva online o WhatsApp.",
  keywords: [
    "limpieza Valencia",
    "limpieza por horas Valencia",
    "limpieza de sofás Valencia",
    "limpieza de tapicería Valencia",
    "химчистка Валенсия",
    "уборка Валенсия",
    "клининг Валенсия",
    "sofa cleaning Valencia",
    "upholstery cleaning Valencia",
    "Miss Clean Valencia",
  ],
  authors: [{ name: "Miss Clean" }],
  creator: "Miss Clean",
  publisher: "Miss Clean",
  alternates: {
    canonical: siteConfig.siteUrl,
  },
  openGraph: {
    type: "website",
    locale: "es_ES",
    alternateLocale: ["en_US", "ru_RU", "uk_UA"],
    url: siteConfig.siteUrl,
    siteName: "Miss Clean Valencia",
    title: "Miss Clean | Limpieza y химчистка en Valencia",
    description:
      "Limpieza por horas 18 €/h y tapicería a domicilio en Valencia. Mínimo химчистки 40 €. Уборка и химчистка в Валенсии.",
    images: [
      {
        url: "/logo.png",
        width: 512,
        height: 512,
        alt: "Miss Clean Valencia",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Miss Clean Valencia | Limpieza a domicilio",
    description:
      "Limpieza por horas y химчистка sofás/colchones en Valencia. Reserva online.",
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png" }],
  },
  category: "home services",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable} h-full`}>
      <body className="min-h-full antialiased">
        <JsonLd />
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
