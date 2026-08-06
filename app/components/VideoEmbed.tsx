"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; // 'vidsrc', 'vidsrccc', 'embedsu'
  className?: string;
}

export default function VideoEmbed({ type, id, provider, className }: VideoEmbedProps) {
  // Stable, verified embed URLs
  let src = '';

  switch (provider) {
    case 'vidsrc':
      // VidSrc.io - Most stable, supports almost all TMDB IDs
      src = `https://vidsrc.io/embed/${type}/${id}`;
      break;
    case 'vidsrccc':
      // VidSrc.cc - Great backup, good for Asian movies
      src = `https://vidsrc.cc/embed/${type}/${id}`;
      break;
    case 'embedsu':
      // EmbedSu - Good for 1080p, but sometimes slower
      src = `https://embedsu.com/embed/${type}/${id}`;
      break;
    default:
      // Default to VidSrc.io
      src = `https://vidsrc.io/embed/${type}/${id}`;
      break;
  }

  return (
    <div className={className}>
      <iframe
        src={src}
        title="Video Player"
        className="w-full h-full rounded-lg bg-black"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}
