"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; 
  className?: string;
}

export default function VideoEmbed({ type, id, provider, className }: VideoEmbedProps) {
  let src = '';

  if (provider === 'promulti') {
    // Your preferred ProMulti aggregator
    src = `https://vidsrc.sbs/embed/${type}/${id}?provider=free`;
  } 
  else if (provider === 'tamilian') {
    // Tamilian doesn't have a simple /embed/id URL.
    // We use a known aggregator that mirrors Tamilian's content: VidSrc.cc or 2Embed
    // VidSrc.cc often has the same servers as Tamilian
    src = `https://vidsrc.cc/embed/${type}/${id}`;
  } 
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
