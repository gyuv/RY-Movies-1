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
      // The ORIGINAL ProMulti aggregator (promulti.net)
      // This is the one that bundles multiple servers inside one player
      src = `https://promulti.net/embed/${type}/${id}`;
      break;
    case 'multicine':
      // MultiCine - Another aggregator
      src = `https://multicine.me/embed/${type}/${id}`;
      break;
    case '2embed':
      // 2embed - Excellent for Asian (Tamil, Korean, Japanese) movies
      src = `https://2embed.cc/embed/${type}/${id}`;
      break;
    case 'vidsrc':
      // VidSrc.io - Good general coverage
      src = `https://vidsrc.io/embed/${type}/${id}`;
      break;
    case 'cinevid':
      // CineVid - Best for English/Hollywood
      src = `https://cinevid.xyz/embed/${type}/${id}`;
      break;
    default:
      // Default to the original ProMulti
      src = `https://promulti.net/embed/${type}/${id}`;
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
