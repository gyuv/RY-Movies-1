"use client";

import { useState } from 'react';
import VideoEmbed from './VideoEmbed';

interface MultiServerPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
  imdbId?: string;
}

// Common free embed sources
const SERVERS = [
  {
    name: 'Server 1 (VidSrc.cc)',
    url: (id: number, type: string) => `https://vidsrc.cc/v2/embed/${type}/${id}`,
    note: 'Reliable Alternative'
  },
  {
    name: 'Server 2 (MegaCloud)',
    url: (id: number, type: string) => `https://megacloud.press/embed-${type}/${id}`,
    note: 'High Quality'
  },
  {
    name: 'Server 3 (VidSrc.pro)',
    url: (id: number, type: string) => `https://vidsrc.pro/embed/${type}/${id}`,
    note: 'Backup Server'
  },
  {
    name: 'Server 4 (4K Movie)',
    url: (id: number, type: string) => `https://4kmovies.net/embed/${id}`,
    note: 'Fast Loading'
  },
  {
    name: 'Server 5 (FlixHQ)',
    url: (id: number, type: string) => `https://flixhq.to/embed/movie/${id}`,
    note: 'Popular Choice'
  }
];

export default function MultiServerPlayer({ movieId, type }: MultiServerPlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const currentServer = SERVERS[activeServer];
  
  // Generate the embed URL for the selected server
  const embedUrl = currentServer.url(movieId, type);

  return (
    <div className="bg-[#14151a] p-4 rounded-lg">
      {/* Server Selection Tabs */}
      <div className="flex flex-wrap gap-2 mb-4">
        {SERVERS.map((server, index) => (
          <button
            key={index}
            onClick={() => setActiveServer(index)}
            className={`px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium transition-all ${
              activeServer === index
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                : 'bg-white/5 text-white/60 hover:bg-white/10 hover:text-white'
            }`}
          >
            {server.name}
          </button>
        ))}
      </div>

      {/* Video Player using VideoEmbed */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
        <VideoEmbed 
          src={embedUrl} 
          className="h-full w-full" 
        />
      </div>

      <div className="mt-3 flex items-center justify-between">
        <p className="text-xs text-white/40">
          💡 {currentServer.note}
        </p>
        <p className="text-xs text-white/30">
          If blank, try another server above.
        </p>
      </div>
    </div>
  );
}
