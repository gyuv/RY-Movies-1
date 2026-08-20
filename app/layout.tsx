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
  title: "RaY-Movies — Your Streaming Hub",
  description: "Find and watch your favorite movies and series.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      {/* 
        CRITICAL UPDATE: 
        - md:pl-72 pushes the entire app to the right on desktop to make room for the sidebar.
        - pt-16 md:pt-0 pushes content down on mobile to make room for the top mobile menu.
      */}
      <body className="bg-[#141414] text-white flex flex-col min-h-screen">
        
        <SiteHeader />
        
        {/* Main Content Wrapper */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto">
          {children}
        </div>
        
        {/* Footer */}
        <footer className="bg-[#1a1a1a] border-t border-gray-800 mt-16 py-4 w-full">
          <div className="max-w-[1600px] mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-sm text-gray-400 font-medium">
            <p>Email: Milad.barzegar71@gmail.com</p>
            
            {/* Social Icons Placeholder */}
            <div className="flex items-center gap-4 my-4 md:my-0">
              <span className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">
                IG
              </span>
              <span className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">
                G+
              </span>
              <span className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">
                FB
              </span>
              <span className="w-8 h-8 rounded-full border border-gray-500 flex items-center justify-center hover:bg-gray-700 hover:text-white cursor-pointer transition-colors">
                TW
              </span>
            </div>

            <p>Phone: +98-93982-775-83</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
