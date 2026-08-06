"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; // 'cinevid', 'vidsrc', '4k', etc.
  className?: string;
}

export default function VideoEmbed({ type, id, provider, className }: VideoEmbedProps) {
  // Map provider to actual embed URL
  let src = '';

  switch (provider) {
    case 'cinevid':
      // CineVid is great for English movies
      src = `https://cinevid.xyz/embed/${type}/${id}`;
      break;
    case 'vidsrc':
      // VidSrc has better support for Asian languages (Tamil, Korean, etc.)
      src = `https://vidsrc.xyz/embed/${type}/${id}`;
      break;
    case '4k':
      src = `https://4k-movie.net/embed/${type}/${id}`;
      break;
    case 'vidsrclang':
      // Alternative VidSrc
      src = `https://vidsrc.cc/embed/${type}/${id}`;
      break;
    default:
      // Fallback to CineVid
      src = `https://cinevid.xyz/embed/${type}/${id}`;
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
