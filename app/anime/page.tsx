// app/anime/page.tsx
import HeroSlider from '../components/HeroSlider';
import AnimeRow from '../components/AnimeRow';
import { getAnimeList, getTrendingAnime, getTopAnime } from '../../lib/jikan';
import Link from 'next/link';

export default async function AnimePage() {
  // Fetch multiple data sets in parallel
  const [trending, topAllTime, mainList] = await Promise.all([
    getTrendingAnime(),
    getTopAnime(),
    getAnimeList(1, 'airing.desc') // Latest Airing
  ]);

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white font-sans">
      {/* 1. Hero Slider */}
      <HeroSlider animeList={trending.slice(0, 5)} />

      {/* 2. Trending Row */}
      <AnimeRow title="Trending This Season" animeList={trending} />

      {/* 3. Top Rated Row */}
      <AnimeRow title="Top Rated Anime" animeList={topAllTime} />

      {/* 4. Latest Airing Grid */}
      <section className="py-8 px-4 md:px-8 bg-[#0a0a0a]">
        <div className="max-w-[1600px] mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-yellow-500 pl-3">
              Latest Updates
            </h2>
            <Link href="/anime?sort=airing.desc" className="text-sm text-yellow-500 hover:text-yellow-400 font-medium">
              See More
            </Link>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
            {mainList.results.map((item) => {
              // Transform to match AnimeCard interface if needed
              return <AnimeCard key={item.mal_id} {...item} />;
            })}
          </div>
        </div>
      </section>

      {/* 5. Mobile Bottom Navigation (Mimicking Anime Salt's Mobile UI) */}
      <nav className="fixed bottom-0 left-0 right-0 bg-[#020209] border-t border-white/10 md:hidden z-50 pb-safe">
        <div className="flex justify-around items-center h-16">
          <Link href="/anime" className="flex flex-col items-center justify-center w-full h-full text-yellow-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
            <span className="text-[10px] uppercase font-medium">Home</span>
          </Link>
          <Link href="/anime?sort=popularity.desc" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M3 20h18" /></svg>
            <span className="text-[10px] uppercase font-medium">Catalog</span>
          </Link>
          <Link href="/schedule" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <span className="text-[10px] uppercase font-medium">Schedule</span>
          </Link>
          <Link href="/search" className="flex flex-col items-center justify-center w-full h-full text-gray-400 hover:text-yellow-500">
            <svg className="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <span className="text-[10px] uppercase font-medium">Search</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
