'use client';

import React, { useState } from 'react';

interface VideoPlayerProps {
  mediaId?: string | number;
  mediaType?: 'movie' | 'tv';
  customTitle?: string;
  title?: string;
}

export default function VideoPlayer({ mediaId, mediaType = 'movie', customTitle, title }: VideoPlayerProps) {
  const [activeServer, setActiveServer] = useState('server1');
  const resolvedTitle = customTitle || title || 'Selected Media';
  const targetId = mediaId || '12345';

  // Open embed providers that reliably render inside iframes without blocking
  const getEmbedUrl = (serverKey: string) => {
    switch (serverKey) {
      case 'server1':
        return `https://vidsrc.xyz/embed/${mediaType}/${targetId}`;
      case 'server2':
        return `https://embed.su/embed/${mediaType}/${targetId}`;
      case 'server3':
        return `https://vidsrc.to/embed/${mediaType}/${targetId}`;
      case 'server4':
        return `https://player.vidsrc.nl/embed/${mediaType}/${targetId}`;
      default:
        return `https://vidsrc.xyz/embed/${mediaType}/${targetId}`;
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-gray-950 rounded-2xl overflow-hidden shadow-2xl border border-gray-800 my-4">
      {/* Header Info */}
      <div className="px-6 py-4 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
        <h2 className="text-white font-semibold text-lg">
          Streaming: <span className="text-indigo-400">{resolvedTitle}</span>
        </h2>
        <span className="text-xs px-3 py-1 bg-green-500/10 text-green-400 rounded-full font-medium border border-green-500/20">
          ● Live Stream
        </span>
      </div>

      {/* Main Video Display Window */}
      <div className="relative w-full aspect-video bg-black flex items-center justify-center">
        <iframe
          src={getEmbedUrl(activeServer)}
          className="absolute top-0 left-0 w-full h-full border-0"
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
          /* Universal ad/redirect guard — blocks pop-ups + parent redirects. */
          sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-orientation-lock"
          referrerPolicy="no-referrer"
          title="Multi-Server Streaming Player"
        />
      </div>

      {/* Multi-Server Selection Toolbar */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-400 font-medium">
          Switch Server if current stream fails:
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'server1', label: 'Server 1 (VidSrc XYZ)' },
            { id: 'server2', label: 'Server 2 (Embed.su)' },
            { id: 'server3', label: 'Server 3 (VidSrc TO)' },
            { id: 'server4', label: 'Server 4 (VidSrc NL)' },
          ].map((server) => (
            <button
              key={server.id}
              onClick={() => setActiveServer(server.id)}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all duration-200 ${
                activeServer === server.id
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 ring-2 ring-indigo-400/50'
                  : 'bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-white'
              }`}
            >
              {server.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
