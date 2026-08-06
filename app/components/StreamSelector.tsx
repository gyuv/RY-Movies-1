"use client";

import { useState } from 'react';
import VideoEmbed from './VideoEmbed';

interface StreamSelectorProps {
  movieId: number;
  type: 'movie' | 'tv';
}

export default function StreamSelector({ movieId, type }: StreamSelectorProps) {
  const [provider, setProvider] = useState<string>('netflix');

  const providers = [
    { id: 'netflix', name: 'Netflix' },
    { id: 'prime', name: 'Amazon Prime' },
    { id: 'hulu', name: 'Hulu' },
    { id: 'disney', name: 'Disney+' },
    { id: 'apple', name: 'Apple TV' },
    { id: 'paramount', name: 'Paramount+' },
    { id: 'hbomax', name: 'HBO Max' },
    { id: 'peacock', name: 'Peacock' },
  ];

  return (
    <div className="bg-[#14151a] p-4 rounded-lg">
      {/* Server Selection Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        {providers.map((p) => (
          <button
            key={p.id}
            onClick={() => setProvider(p.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              provider === p.id
                ? 'bg-blue-600 text-white'
                : 'bg-white/10 text-white/70 hover:bg-white/20'
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
        <VideoEmbed type={type} id={movieId} provider={provider} />
        
        {/* Loading State Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-white/50 text-sm">
            Loading stream from {providers.find(p => p.id === provider)?.name}...
          </div>
        </div>
      </div>

      <p className="text-xs text-white/40 mt-2">
        * If the video doesn't load, try switching to another server above.
      </p>
    </div>
  );
}
