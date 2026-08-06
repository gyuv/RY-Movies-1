"use client";

import { useState } from 'react';
import VideoEmbed from './VideoEmbed';

interface StreamingPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
}

// These are the providers supported by vidsrc.sbs
const PROVIDERS = [
  { id: 'netflix', name: 'Netflix' },
  { id: 'prime', name: 'Amazon Prime' },
  { id: 'hulu', name: 'Hulu' },
  { id: 'disney', name: 'Disney+' },
  { id: 'apple', name: 'Apple TV' },
  { id: 'free', name: 'Free (Aggregated)' },
];

export default function StreamingPlayer({ movieId, type }: StreamingPlayerProps) {
  const [provider, setProvider] = useState<string>('netflix');

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
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/40">
          💡 If the video is black, try switching to "Free" or another provider above.
        </p>
      </div>
    </div>
    );
}
