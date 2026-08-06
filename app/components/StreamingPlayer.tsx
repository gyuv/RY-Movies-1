"use client";

import { useState } from 'react';
import VideoEmbed from './VideoEmbed';

interface StreamingPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
  language?: string;
}

// List of servers: Promulti first, then others
const SERVERS = [
  { id: 'promulti', name: 'ProMulti (Aggregator)' }, // Your preferred server
  { id: 'cinevid', name: 'CineVid' },
  { id: '2embed', name: '2Embed' },
  { id: 'voe', name: 'Voe' },
  { id: 'vidsrc', name: 'VidSrc' },
  { id: '4k', name: '4K Movie' },
  { id: 'embedsu', name: 'EmbedSu' },
];

export default function StreamingPlayer({ movieId, type, language = 'en' }: StreamingPlayerProps) {
  // Default to Promulti
  const [provider, setProvider] = useState<string>('promulti');

  return (
    <div className="bg-[#14151a] p-4 rounded-lg">
      {/* Server Selection Buttons */}
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
          💡 <strong>ProMulti</strong> aggregates multiple sources. If it fails, try <strong>CineVid</strong> or <strong>2Embed</strong>.
        </p>
      </div>
    </div>
  );
}
