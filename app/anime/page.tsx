// components/AnimeRow.tsx
import AnimeCard from './AnimeCard';

interface AnimeRowProps {
  title: string;
  animeList: any[];
}

export default function AnimeRow({ title, animeList }: AnimeRowProps) {
  return (
    <section className="py-8 px-4 md:px-8">
      <div className="flex items-center justify-between mb-6 max-w-[1600px] mx-auto">
        <h2 className="text-xl md:text-2xl font-bold text-white border-l-4 border-yellow-500 pl-3">
          {title}
        </h2>
        <a href="/anime" className="text-sm text-yellow-500 hover:text-yellow-400 font-medium">
          View All
        </a>
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4">
        {animeList.map((item) => (
          <AnimeCard key={item.mal_id} {...item} />
        ))}
      </div>
    </section>
  );
}
