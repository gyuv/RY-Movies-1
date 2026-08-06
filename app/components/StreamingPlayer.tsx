"use client";

import { useState, useEffect } from 'react';
import VideoEmbed from './VideoEmbed';

interface StreamingPlayerProps {
  movieId: number;
  type: 'movie' | 'tv';
  language?: string; // Pass the original language (e.g., 'en', 'ta', 'ko')
}

// Providers
const PROVIDERS = [
  { id: 'cinevid', name: 'CineVid (Best for English)' },
  { id: 'vidsrc', name: 'VidSrc (Best for Asian/Other)' },
  { id: '4k', name: '4K Movie' },
  { id: 'vidsrclang', name: 'VidSrc Lang' },
];

export default function StreamingPlayer({ movieId, type, language = 'en' }: StreamingPlayerProps) {
  // 1. Auto-select provider based on language
  const getBestProvider = (lang: string) => {
    const lowerLang = lang.toLowerCase();
    // Tamil, Telugu, Hindi, Korean, Japanese, Chinese -> Use VidSrc (better coverage)
    if (['ta', 'te', 'hi', 'ko', 'ja', 'zh', 'fr', 'de', 'es', 'it', 'pt'].includes(lowerLang)) {
      return 'vidsrc';
    }
    // Default to CineVid for English
    return 'cinevid';
  };

  const [provider, setProvider] = useState<string>(getBestProvider(language));

  // Reset provider if language changes (e.g. from page prop)
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
          If the video doesn't load, try switching to <strong>VidSrc</strong> for non-English movies.
        </p>
      </div>
    </div>
  );
}
