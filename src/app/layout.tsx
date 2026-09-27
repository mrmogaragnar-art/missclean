import type { Metadata } from "next";
import { Fredoka, Nunito } from "next/font/google";
import { I18nProvider } from "@/i18n/I18nProvider";
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
  metadataBase: new URL("https://miss-clean.vercel.app"),
  title: "Miss Clean | Limpieza en Valencia",
  description:
    "Servicio de limpieza por horas y limpieza en seco de sofás, colchones y alfombras en Valencia.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    apple: [{ url: "/logo.png" }],
  },
  openGraph: {
    title: "Miss Clean | Limpieza en Valencia",
    description:
      "Limpieza con cariño en Valencia. 18 €/hora y limpieza en seco a domicilio.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${fredoka.variable} ${nunito.variable} h-full`}>
      <body className="min-h-full antialiased">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  );
}
