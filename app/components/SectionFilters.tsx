import SectionFilters from '@/components/SectionFilters';

// Define your static options arrays
const genreOptions = [
  { label: 'Action', value: '28' },
  { label: 'Adventure', value: '12' },
  { label: 'Animation', value: '16' },
  { label: 'Comedy', value: '35' },
  { label: 'Crime', value: '80' },
  { label: 'Documentary', value: '99' },
  { label: 'Drama', value: '18' },
  { label: 'Family', value: '10751' },
  { label: 'Fantasy', value: '14' },
  { label: 'History', value: '36' },
  { label: 'Horror', value: '27' },
  { label: 'Music', value: '10402' },
  { label: 'Mystery', value: '9648' },
  { label: 'Romance', value: '10749' },
  { label: 'Science Fiction', value: '878' },
  { label: 'Thriller', value: '53' },
  { label: 'War', value: '10752' },
  { label: 'Western', value: '37' },
];

const yearOptions = Array.from({ length: 30 }, (_, i) => {
  const year = new Date().getFullYear() - i;
  return { label: year.toString(), value: year.toString() };
});

const languageOptions = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'Japanese', value: 'ja' },
  { label: 'Korean', value: 'ko' },
  { label: 'Hindi', value: 'hi' },
  { label: 'Chinese', value: 'zh' },
];

const regionOptions = [
  { label: 'United States', value: 'US' },
  { label: 'United Kingdom', value: 'GB' },
  { label: 'India', value: 'IN' },
  { label: 'Japan', value: 'JP' },
  { label: 'South Korea', value: 'KR' },
];

export default async function MoviesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const sort = (searchParams?.sort as string) || 'popularity.desc';
  const genre = (searchParams?.genre as string) || '';
  const year = (searchParams?.year as string) || '';
  const language = (searchParams?.language as string) || '';
  const region = (searchParams?.region as string) || '';
  const page = (searchParams?.page as string) || '1';

  // Build TMDB Discover query parameters dynamically
  const apiKey = process.env.TMDB_API_KEY;
  let url = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&sort_by=${sort}&page=${page}`;
  
  if (genre) url += `&with_genres=${genre}`;
  if (year) url += `&primary_release_year=${year}`;
  if (language) url += `&with_original_language=${language}`;
  if (region) url += `&region=${region}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  const data = await res.json();
  const movies = data.results || [];

  return (
    <main className="min-h-screen bg-[#0f0f0f] text-white">
      <div className="max-w-[1600px] mx-auto py-8">
        <h1 className="text-3xl font-bold px-4 sm:px-6 lg:px-8 mb-6">Explore Movies</h1>

        {/* Filters Bar */}
        <SectionFilters
          sortOptions={[
            { label: 'Popularity Descending', value: 'popularity.desc' },
            { label: 'Rating Descending', value: 'vote_average.desc' },
            { label: 'Release Date Descending', value: 'primary_release_date.desc' },
          ]}
          extraOptions={[
            { name: 'genre', label: 'Genre', options: genreOptions },
            { name: 'year', label: 'Year', options: yearOptions },
            { name: 'language', label: 'Language', options: languageOptions },
            { name: 'region', label: 'Region', options: regionOptions },
          ]}
        />

        {/* Movie Grid Render Logic Here */}
      </div>
    </main>
  );
}
