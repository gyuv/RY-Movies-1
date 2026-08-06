"use client";

import { useState, useEffect } from 'react';
import VideoEmbed from './VideoEmbed';

interface StreamingPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
  language?: string;
}

const PROVIDERS = [
  { id: '2embed', name: '2Embed (Best for Tamil/Asian)' },
  { id: 'voe', name: 'Voe (Backup)' },
  { id: 'vidsrc', name: 'VidSrc (General)' },
  { id: 'cinevid', name: 'CineVid (Best for English)' },
];

export default function StreamingPlayer({ movieId, type, language = 'en' }: StreamingPlayerProps) {
  // Auto-select best provider based on language
  const getBestProvider = (lang: string) => {
    const lowerLang = lang.toLowerCase();
    // Tamil (ta), Telugu (te), Hindi (hi), Korean (ko), Japanese (ja)
    if (['ta', 'te', 'hi', 'ko', 'ja', 'zh', 'fr', 'de', 'es'].includes(lowerLang)) {
      return '2embed'; // 2embed has better Tamil/Asian coverage
    }
    return 'cinevid'; // Default to CineVid for English
  };

  const [provider, setProvider] = useState<string>(getBestProvider(language));

  // Update provider if language changes
  useEffect(() => {
    setProvider(getBestProvider(language));
  }, [language]);

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
          💡 <strong>Auto-Selected:</strong> {PROVIDERS.find(p => p.id === provider)?.name}. 
          If the video doesn't load, try switching to <strong>Voe</strong> or <strong>VidSrc</strong>.
        </p>
      </div>
    </div>
  );
}
