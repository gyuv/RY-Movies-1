"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; // e.g., 'netflix', 'prime', 'hulu'
  className?: string;
}

export default function VideoEmbed({ type, id, provider }: VideoEmbedProps) {
  // vidsrc.sbs uses the TMDB ID and a provider hint
  // If provider is 'netflix', it tries to find it on Netflix
  const src = `https://vidsrc.sbs/embed/${type}/${id}?provider=${provider}`;

  return (
    <div className="w-full h-full">
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
