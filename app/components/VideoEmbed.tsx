"use client";

interface VideoEmbedProps {
  src?: string; // Custom URL
  type?: string; // 'movie' or 'tv' (for vidsrc fallback)
  id?: number; // TMDB ID (for vidsrc fallback)
  provider?: string; // Provider (for vidsrc fallback)
  className?: string;
}

export default function VideoEmbed({ 
  src, 
  type, 
  id, 
  provider, 
  className 
}: VideoEmbedProps) {
  // If a custom src is passed, use it. Otherwise, generate vidsrc URL
  const finalSrc = src || (type && id ? `https://vidsrc.sbs/embed/${type}/${id}?provider=${provider || 'netflix'}` : '');

  if (!finalSrc) {
    return <div className="bg-black h-96 flex items-center justify-center text-white/50">No Source Found</div>;
  }

  return (
    <div className={className}>
      <iframe
        src={finalSrc}
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
