"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; 
  className?: string;
}

export default function VideoEmbed({ type, id, provider, className }: VideoEmbedProps) {
  let src = '';

  // 1. PROMULTI: Your previous working code using vidsrc.sbs
  if (provider === 'promulti') {
    src = `https://vidsrc.sbs/embed/${type}/${id}?provider=free`;
  } 
  // 2. OTHER STREAMERS: Direct embeds from popular sites
  else if (provider === 'cinevid') {
    src = `https://cinevid.xyz/embed/${type}/${id}`;
  } 
  else if (provider === '2embed') {
    src = `https://2embed.cc/embed/${type}/${id}`;
  } 
  else if (provider === 'voe') {
    src = `https://voe.su/embed/${type}/${id}`;
  } 
  else if (provider === 'vidsrc') {
    src = `https://vidsrc.io/embed/${type}/${id}`;
  } 
  else if (provider === '4k') {
    src = `https://4k-movie.net/embed/${type}/${id}`;
  } 
  else if (provider === 'embedsu') {
    src = `https://embedsu.com/embed/${type}/${id}`;
  } 
  else {
    // Fallback to Promulti
    src = `https://vidsrc.sbs/embed/${type}/${id}?provider=free`;
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
