import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
// Assuming you have or will create standard SVG icons for these
import { Home, Search, Tv, Film, User, MonitorPlay } from 'lucide-react'; 

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  title: "Pantyflix Clone",
  description: "Exact layout replication",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-[#09090b] text-white font-body flex min-h-screen overflow-x-hidden">
        
        {/* The Fixed Left Sidebar */}
        <aside className="fixed left-0 top-0 h-screen w-16 bg-[#09090b] border-r border-white/5 flex flex-col items-center py-6 gap-8 z-50">
          {/* Logo Placeholder */}
          <div className="w-8 h-8 bg-blue-500 rounded text-black font-bold flex items-center justify-center text-xl mb-4">
            P
          </div>
          
          {/* Nav Icons */}
          <nav className="flex flex-col gap-8 text-gray-400">
            <Home className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Search className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <div className="w-5 h-5 opacity-50">🍿</div> {/* Popcorn icon */}
            <Tv className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <Film className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </nav>
          
          {/* Bottom Icons */}
          <div className="mt-auto flex flex-col gap-8 text-gray-400">
            <User className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
            <MonitorPlay className="w-5 h-5 hover:text-white cursor-pointer transition-colors" />
          </div>
        </aside>

        {/* Main Content Area (pushed right to avoid sidebar) */}
        <div className="ml-16 flex-1 flex flex-col">
          {children}
        </div>
        
      </body>
    </html>
  );
}
