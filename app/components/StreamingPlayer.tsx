"use client";

import { useState, useEffect } from 'react';
import VideoEmbed from './VideoEmbed';

interface StreamingPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
  language?: string;
}

// Providers with ProMulti as the star
const PROVIDERS = [
  { id: 'promulti', name: 'ProMulti (Best Aggregator)' },
  { id: 'multicine', name: 'MultiCine (Backup)' },
  { id: '2embed', name: '2Embed (Tamil/Asian)' },
  { id: 'vidsrc', name: 'VidSrc (General)' },
  { id: 'cinevid', name: 'CineVid (English)' },
];

export default function StreamingPlayer({ movieId, type, language = 'en' }: StreamingPlayerProps) {
  // Default to ProMulti because it aggregates multiple servers internally
  const [provider, setProvider] = useState<string>('promulti');

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
          💡 <strong>ProMulti</strong> aggregates multiple servers. If one fails, it often auto-switches or lets you pick another inside the player.
        </p>
      </div>
    </div>
  );
}
