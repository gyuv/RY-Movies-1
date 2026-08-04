'use client';

import React, { useState, useEffect } from 'react';

// Define the shape of video clips if passed from TMDb
interface VideoClip {
  key: string;
  name: string;
  site: string;
  type: string;
}

interface VideoPlayerProps {
  mediaId?: string | number;
  mediaType?: 'movie' | 'tv';
  customTitle?: string;
  title?: string;
  videos?: VideoClip[];
}

export default function VideoPlayer({ mediaId, mediaType = 'movie', customTitle, title, videos }: VideoPlayerProps) {
  const [activeServer, setActiveServer] = useState('server1');
  const [currentEmbedUrl, setCurrentEmbedUrl] = useState('');
  const [loading, setLoading] = useState(true);

  // Fallback to extract an ID or use props
  const resolvedTitle = customTitle || title || 'Selected Media';

  useEffect(() => {
    async function resolveServerUrl() {
      setLoading(true);
      try {
        if (!mediaId && videos && videos.length > 0) {
          // If we only have YouTube trailer keys passed down
          setCurrentEmbedUrl(`https://www.youtube.com/embed/${videos[0].key}`);
          setLoading(false);
          return;
        }

        const targetId = mediaId || '12345'; // fallback ID
        if (activeServer === 'server1') {
          setCurrentEmbedUrl(`https://vidsrc.to/embed/${mediaType}/${targetId}`);
        } else if (activeServer === 'server2') {
          setCurrentEmbedUrl(`https://embed.su/embed/${mediaType}/${targetId}`);
        } else if (activeServer === 'server3') {
          const res = await fetch(`/api/stream?id=${targetId}&type=${mediaType}&source=mkvking`);
          const data = await res.json();
          setCurrentEmbedUrl(data.embedUrl || `https://vidsrc.xyz/embed/${mediaType}/${targetId}`);
        } else if (activeServer === 'server4') {
          setCurrentEmbedUrl(`https://vidsrc.xyz/embed/${mediaType}/${targetId}`);
        }
      } catch (err) {
        console.error("Stream resolution error, utilizing fallback.", err);
        setCurrentEmbedUrl(`https://vidsrc.to/embed/${mediaType}/12345`);
      } finally {
        setLoading(false);
      }
    }

    resolveServerUrl();
  }, [activeServer, mediaId, mediaType, videos]);

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
        {loading ? (
          <div className="text-indigo-400 font-medium animate-pulse">Loading secure stream server...</div>
        ) : (
          <iframe
            src={currentEmbedUrl}
            className="absolute top-0 left-0 w-full h-full border-0"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            title="Multi-Server Streaming Player"
          />
        )}
      </div>

      {/* Multi-Server Selection Toolbar */}
      <div className="p-4 bg-gray-900 border-t border-gray-800 flex flex-wrap items-center justify-between gap-3">
        <div className="text-sm text-gray-400 font-medium">
          Switch Server if current stream fails:
        </div>
        
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'server1', label: 'SonixHub Server (Primary)' },
            { id: 'server2', label: 'MoviesDK Node' },
            { id: 'server3', label: 'MKVKing Scraper Node' },
            { id: 'server4', label: 'Backup Free Stream' },
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
