import MediaCard from './MediaCard';

interface MoviesSectionProps {
  movies: any[];
  languageCode?: string;
}

export default function MoviesSection({ movies, languageCode = 'en' }: MoviesSectionProps) {
  // Upgraded Empty State with a cinematic icon and clear messaging
  if (!movies || movies.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center py-24 px-4 text-center animate-fade-in-up">
        <div className="w-16 h-16 mb-4 text-ink-line">
          <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
          </svg>
        </div>
        <h3 className="text-xl font-display font-semibold text-paper mb-2">
          No matching titles
        </h3>
        <p className="text-paper-dim text-sm max-w-md">
          We couldn't find any movies matching your current filters. Try adjusting your genre, year, or region to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-4 sm:gap-5 lg:gap-6 px-4 sm:px-6 lg:px-8 py-6">
      {movies.map((movie, index) => (
        // Added staggered animation delay for a cascading load effect
        <div 
          key={movie.id} 
          className="animate-fade-in-up flex" 
          style={{ animationDelay: `${index * 40}ms` }}
        >
          <div className="w-full flex-grow">
            <MediaCard
              id={movie.id}
              title={movie.title}
              poster_path={movie.poster_path}
              vote_average={movie.vote_average}
              release_date={movie.release_date}
              media_type="movie"
            />
          </div>
        </div>
      ))}
    </div>
  );
}
