"use client";

import { useState } from 'react';

interface MultiServerPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
  imdbId?: string;
}

// Common free embed sources that work like TamilBlasters servers
const SERVERS = [
  {
    name: 'Server 1 (Fembed)',
    url: (id: number, type: string, imdb: string) => 
      `https://fembed-hd.com/v/${id}?imdb=${imdb}`,
    note: 'Fast, HD Quality'
  },
  {
    name: 'Server 2 (StreamTape)',
    url: (id: number, type: string, imdb: string) => 
      `https://streamtape.com/e/${id}`, // Note: Streamtape often needs a specific hash, this is a placeholder
    note: 'Backup Server'
  },
  {
    name: 'Server 3 (Doodstream)',
    url: (id: number, type: string, imdb: string) => 
      `https://doodstream.com/e/${id}`,
    note: 'Lightweight'
  },
  {
    name: 'Server 4 (VidSrc.cc)',
    url: (id: number, type: string, imdb: string) => 
      `https://vidsrc.cc/v2/embed/${type}/${id}`,
    note: 'Reliable Alternative'
  },
  {
    name: 'Server 5 (MegaCloud)',
    url: (id: number, type: string, imdb: string) => 
      `https://megacloud.press/embed-${type}/${id}`,
    note: 'High Quality'
  }
];

export default function MultiServerPlayer({ movieId, type, imdbId }: MultiServerPlayerProps) {
  const [activeServer, setActiveServer] = useState(0);
  const currentServer = SERVERS[activeServer];
  
  // Generate the embed URL
  const embedUrl = currentServer.url(movieId, type, imdbId || '');

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

      {/* Video Player */}
      <div className="aspect-video bg-black rounded-lg overflow-hidden shadow-lg relative">
        <iframe
          src={embedUrl}
          title="Movie Stream"
          className="w-full h-full"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          frameBorder="0"
          scrolling="no"
        />
        
        {/* Loading Overlay */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none bg-black/50">
          <div className="text-white/70 text-sm font-medium">
            Loading {currentServer.name}...
          </div>
        </div>
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
