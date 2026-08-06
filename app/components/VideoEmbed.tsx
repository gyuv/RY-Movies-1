"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; // 'netflix', 'prime', 'hulu', 'disney', 'apple', 'hbomax', 'paramount', 'peacock', 'free'
  className?: string;
}

export default function VideoEmbed({ type, id, provider, className }: VideoEmbedProps) {
  // vidsrc.sbs is the most reliable aggregator for TMDB IDs
  // Note: For 'free', vidsrc.sbs aggregates from multiple sources (Voe, Fmovies, etc.)
  const src = `https://vidsrc.sbs/embed/${type}/${id}?provider=${provider}`;

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
        onError={() => console.log("Video iframe error")} // Optional: Handle JS errors
      ></iframe>
    </div>
  );
}
