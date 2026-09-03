import type { Metadata } from "next";
import { Fraunces, Inter, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { ApexIntro, SpatialDock } from "@/components/apex";

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
  manifest: "/manifest.json", // <-- Added manifest pointer here
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="bg-[#141414] text-white flex flex-col min-h-screen">

        {/* Project Apex — cinematic entry (self-dismisses; remembers via localStorage) */}
        <ApexIntro />

        {/* Floating spatial navigation dock (spring physics + D-pad) — sole nav */}
        <SpatialDock />
        
        {/* Main Content Wrapper */}
        <div className="flex-1 w-full max-w-[1600px] mx-auto pb-28 md:pb-0 md:pl-20 lg:pl-0">
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

        {/* Service Worker Registration Script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(
                    function(registration) {
                      console.log('ServiceWorker registration successful with scope: ', registration.scope);
                    },
                    function(err) {
                      console.log('ServiceWorker registration failed: ', err);
                    }
                  );
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
