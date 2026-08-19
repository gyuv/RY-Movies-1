import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Movies & Shows",
  description: "Search any film or series by title, actor, or director.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#141414] text-white font-body overflow-x-hidden">
        <SiteHeader />
        {children}
        <footer className="mt-24 pb-10">
          <div className="w-full px-4 sm:px-10 lg:px-14">
            <p className="text-sm text-gray-500">
              © 2024 Streaming Platform. Availability data licensed via TMDb.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
