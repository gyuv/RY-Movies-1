import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const display = Fraunces({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-display",
});

const body = Inter({ subsets: ["latin"], variable: "--font-body" });

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "Cinereel — find where to actually watch it",
  description:
    "Search any film or series by title, actor, or director and see every legal place to watch it — subscription, free-with-ads, rent, or buy.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <SiteHeader />
        {children}
        <footer className="border-t border-ink-line mt-24">
          <div className="max-w-6xl mx-auto px-6 py-10 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="stub-label">Cinereel · Reel No. 001</p>
            <p className="text-xs text-paper-dim">
              Availability data licensed via TMDb / JustWatch. No unauthorized streams indexed.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
