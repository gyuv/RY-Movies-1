"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; 
  className?: string;
}

export default function VideoEmbed({ type, id, provider, className }: VideoEmbedProps) {
  let src = '';

  switch (provider) {
    case 'promulti':
      // VidSrc.io with 'auto' provider acts like ProMulti (aggregates multiple servers)
      // This is the most stable "all-in-one" option
      src = `https://vidsrc.io/embed/${type}/${id}?autoplay=1&primary_color=%230088cc`;
      break;
    case 'multicine':
      // MultiCine - Another aggregator
      src = `https://multicine.me/embed/${type}/${id}`;
      break;
    case '2embed':
      // 2embed - Has a multi-server UI
      src = `https://2embed.cc/embed/${type}/${id}`;
      break;
    case 'vidsrc':
      // Standard VidSrc
      src = `https://vidsrc.io/embed/${type}/${id}`;
      break;
    case 'cinevid':
      // CineVid
      src = `https://cinevid.xyz/embed/${type}/${id}`;
      break;
    default:
      src = `https://vidsrc.io/embed/${type}/${id}?autoplay=1&primary_color=%230088cc`;
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
