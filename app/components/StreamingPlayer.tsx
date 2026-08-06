"use client";

import { useState, useEffect } from 'react';
import VideoEmbed from './VideoEmbed';

interface StreamingPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
}

// These are the providers supported by vidsrc.sbs
const PROVIDERS = [
  { id: 'free', name: 'Free (Aggregated)' }, // Moved to top as it has the widest coverage
  { id: 'netflix', name: 'Netflix' },
  { id: 'prime', name: 'Amazon Prime' },
  { id: 'hulu', name: 'Hulu' },
  { id: 'disney', name: 'Disney+' },
  { id: 'apple', name: 'Apple TV' },
];

export default function StreamingPlayer({ movieId, type }: StreamingPlayerProps) {
  // Default to 'free' because it's more likely to have older/regional movies like Budget Padmanabhan
  const [provider, setProvider] = useState<string>('free');
  const [isError, setIsError] = useState(false);

  // Reset error when provider changes
  useEffect(() => {
    setIsError(false);
  }, [provider]);

  return (
    <div className="bg-[#14151a] p-4 rounded-lg">
      {/* Provider Selection */}
      <div className="flex flex-wrap gap-2 mb-4">
        {PROVIDERS.map((p) => (
          <button
            key={p.id}
            onClick={() => setProvider(p.id)}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              provider === p.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
        <VideoEmbed 
          type={type} 
          id={movieId} 
          provider={provider}
          className="h-full w-full" 
        />
        
        {/* Fallback Message if video doesn't load (optional enhancement) */}
        {isError && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/80 text-white">
            <div className="text-center">
              <p className="text-lg font-bold">Video Not Found</p>
              <p className="text-sm text-white/60">Try switching to another provider above.</p>
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/40">
          💡 <strong>Budget Padmanabhan</strong> is an older Tamil movie. The <strong>"Free"</strong> provider usually has the best coverage for non-Netflix/Prime movies.
        </p>
      </div>
    </div>
  );
}
