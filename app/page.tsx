"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

// Using a vibrant red to match your reference image's energy
const RED_ACCENT = "bg-[#e50914]"; 

export default function HomeLayout() {
  // Map to your specific categories
  const [activeCategory, setActiveCategory] = useState("Movies");
  const categories = ["Movies", "Series", "Anime", "Manga"];
  
  const genres = ["Romance", "Action", "Adventure", "Animation", "Sci-Fi", "Documentary", "Crime", "Comedy", "Thriller"];
  const activeGenres = ["Action", "Sci-Fi", "Crime"]; // Mock active state from image

  return (
    <main className="min-h-screen bg-[#1c1d21] text-gray-200 font-sans selection:bg-red-500/30">
      
      {/* 1. HERO SECTION (Light/Silver blending into Dark) */}
      <section className="relative h-[85vh] w-full flex flex-col justify-end">
        {/* Absolute Background Image - You would map your TMDb backdrop here */}
        <div className="absolute inset-0 z-0">
          <Image 
            src="/venom-mock-backdrop.jpg" // Replace with your actual hero image
            alt="Hero Background" 
            fill 
            className="object-cover object-top"
          />
          {/* Gradients to recreate the image's lighting effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-[#1c1d21] opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-r from-white/60 via-transparent to-transparent" />
        </div>

        {/* Hero Content anchored to bottom left */}
        <div className="relative z-10 w-full px-6 md:px-12 pb-12 flex items-end justify-between">
          <div className="max-w-2xl">
            {/* Red Pill Play Button */}
            <button className={`${RED_ACCENT} hover:bg-red-600 text-white font-bold py-2.5 px-6 rounded-full flex items-center gap-2 shadow-lg shadow-red-500/30 mb-6 transition-transform hover:scale-105`}>
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              Watch
            </button>
            
            {/* Massive Editorial Title (Dark text on light background from the gradient) */}
            <h1 className="text-6xl md:text-8xl font-black text-gray-900 tracking-tighter mb-4 drop-shadow-md">
              Venom
            </h1>
            
            {/* Metadata Row */}
            <div className="flex items-center gap-4 text-gray-800 font-medium text-sm mb-4">
              <span className="flex items-center text-yellow-500 drop-shadow">★ 6.8</span>
              <span>2018</span>
              <span>1h 52m</span>
              <span className="text-gray-600">Action | Thriller | Sci-Fi</span>
            </div>
          </div>

          {/* Right-aligned Synopsis Box (as seen in the image) */}
          <div className="hidden lg:block max-w-sm bg-white/60 backdrop-blur-md text-gray-900 p-4 rounded-lg shadow-xl text-sm font-medium leading-relaxed border border-white/40">
            A failed reporter is bonded to an alien entity, one of many symbiotes who have invaded Earth. But the being takes a liking to Earth and decides to protect it.
          </div>
        </div>
      </section>

      {/* 2. FULL-WIDTH CATEGORY TABS (Replacing "Trends Now/Popular") */}
      <div className="relative z-20 w-full bg-[#24252a] border-y border-gray-700 shadow-md">
        <div className="max-w-[1600px] mx-auto flex justify-center divide-x divide-gray-700">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`flex-1 py-3 text-center font-bold text-sm sm:text-base uppercase tracking-wider transition-colors ${
                activeCategory === cat ? 'text-gray-100 bg-[#2d2f36]' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              {activeCategory === cat && <span className="mr-2">★</span>}
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* 3. HORIZONTAL GENRE PILLS */}
      <div className="w-full overflow-x-auto scrollbar-hide py-5 px-6 md:px-12 flex gap-3 items-center bg-[#1c1d21]">
        {genres.map((genre) => (
          <button 
            key={genre}
            className={`whitespace-nowrap px-5 py-1.5 rounded-full text-sm font-medium transition-colors shadow-sm ${
              activeGenres.includes(genre) 
                ? `${RED_ACCENT} text-white` 
                : 'bg-[#2a2b31] text-gray-300 hover:bg-[#363840]'
            }`}
          >
            {genre}
          </button>
        ))}
      </div>

      <div className="px-6 md:px-12 py-6 max-w-[1600px] mx-auto space-y-12">
        
        {/* 4. CAROUSEL SECTION (The "Red Sparrow" style pop-out cards) */}
        <section>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-8 pt-4 items-end">
            {/* Mocking the cards to show the specific design from the image */}
            {[1, 2, 3, 4, 5, 6].map((item, idx) => (
              <div 
                key={item} 
                className={`relative shrink-0 transition-all duration-300 rounded-xl overflow-hidden cursor-pointer group ${
                  idx === 1 ? 'w-[220px] scale-105 z-10 shadow-2xl shadow-red-500/20' : 'w-[160px] opacity-70 hover:opacity-100'
                }`}
              >
                <div className={`aspect-[2/3] relative ${idx === 1 ? 'rounded-t-xl' : 'rounded-xl'} overflow-hidden`}>
                  <img src={`/poster-${item}.jpg`} alt="Poster" className="w-full h-full object-cover" />
                </div>
                
                {/* The Signature White Info Box (Only shows heavily on active/hover) */}
                <div className={`bg-white text-black p-3 ${idx === 1 ? 'block rounded-b-xl' : 'hidden group-hover:block absolute bottom-0 w-full'}`}>
                  <h3 className="font-bold text-sm truncate">Movie Title</h3>
                  <div className="flex justify-between items-center mt-1 text-xs text-gray-500 font-medium">
                    <span>2019</span>
                    <span className="text-yellow-500 font-bold">★ 6.6</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. FEATURED INLINE TRAILER (Like the Red Sparrow video block) */}
        <section className="w-full space-y-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {["#Watching", "#RedSparrow", "#Action", "#JenniferLawrence", "#HD"].map((tag, i) => (
              <span key={tag} className={`px-3 py-1 rounded-full text-xs font-bold ${i === 0 ? 'border border-gray-500 text-gray-300' : `${RED_ACCENT} text-white`}`}>
                {tag}
              </span>
            ))}
          </div>
          
          <div className="relative w-full aspect-video rounded-xl overflow-hidden group cursor-pointer border border-gray-800 shadow-2xl">
             <img src="/trailer-thumb.jpg" alt="Trailer" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
             <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full border-4 border-white/50 flex items-center justify-center bg-black/30 backdrop-blur-sm group-hover:border-white transition-all group-hover:scale-110">
                  <svg className="w-8 h-8 text-white ml-2" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                </div>
             </div>
             
             {/* Bottom Info Bar inside video */}
             <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 to-transparent p-6 flex justify-between items-end">
                <div>
                  <h2 className="text-3xl font-bold text-white mb-2">Red Sparrow</h2>
                  <div className="flex items-center gap-3 text-sm text-gray-300">
                    <span>2018</span>
                    <span className="text-red-500 font-bold flex items-center gap-1">👁 1M</span>
                    <span className="text-yellow-500 font-bold">★ 6.6</span>
                  </div>
                </div>
                <div className="hidden md:block max-w-md text-sm text-gray-300 font-medium">
                  Ballerina Dominika Egorova is recruited to 'Sparrow School,' a Russian intelligence service where she is forced to use her body as a weapon.
                </div>
             </div>
          </div>
        </section>

        {/* 6. GRID SECTIONS WITH PILL DROPDOWNS */}
        <section>
          <div className="flex items-center gap-4 mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-2xl">⊞</span> {activeCategory}
            </h2>
            <div className="flex gap-2 ml-4">
              <select className={`appearance-none ${RED_ACCENT} text-white text-sm font-bold px-4 py-1.5 rounded-full outline-none cursor-pointer`}>
                <option>Latest</option>
              </select>
              <select className="appearance-none bg-[#363840] text-gray-300 text-sm font-bold px-4 py-1.5 rounded-full outline-none cursor-pointer hover:bg-gray-600 transition-colors">
                <option>A-Z</option>
              </select>
              <select className="appearance-none bg-[#363840] text-gray-300 text-sm font-bold px-4 py-1.5 rounded-full outline-none cursor-pointer hover:bg-gray-600 transition-colors">
                <option>Year</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {/* Map your grid items here */}
          </div>
        </section>

      </div>
    </main>
  );
}
