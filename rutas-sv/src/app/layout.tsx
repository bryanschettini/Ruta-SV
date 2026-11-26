import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const NOMBRE = process.env.NEXT_PUBLIC_SITE_NAME || "Rutas SV";

export const metadata: Metadata = {
  title: {
    default: `${NOMBRE} — Planifica tu viaje por El Salvador`,
    template: `%s · ${NOMBRE}`,
  },
  description:
    "Explora playas, volcanes, pueblos y sitios arqueológicos de El Salvador, consulta el clima en tiempo real y arma tu itinerario.",
};

export const viewport: Viewport = {
  themeColor: "#0b766e",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col font-sans">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
