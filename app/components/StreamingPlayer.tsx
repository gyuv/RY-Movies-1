"use client";

import { useState } from 'react';
import VideoEmbed from './VideoEmbed';

interface StreamingPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
  language?: string;
}

// Only two servers now
const SERVERS = [
  { id: 'promulti', name: 'ProMulti (Aggregator)' },
  { id: '2embed', name: '2Embed (Tamil/Asian)' },
];

export default function StreamingPlayer({ movieId, type, language = 'en' }: StreamingPlayerProps) {
  const [provider, setProvider] = useState<string>('promulti');

  return (
    <div className="bg-[#14151a] p-4 rounded-lg">
      <div className="flex flex-wrap gap-2 mb-4">
        {SERVERS.map((s) => (
          <button
            key={s.id}
            onClick={() => setProvider(s.id)}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              provider === s.id
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {s.name}
          </button>
        ))}
      </div>

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
          💡 <strong>ProMulti</strong> aggregates multiple sources. If it fails, try <strong>2Embed</strong>.
        </p>
      </div>
    </div>
  );
}
