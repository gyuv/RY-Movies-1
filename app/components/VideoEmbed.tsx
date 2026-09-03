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
    // ProMulti (vidsrc.sbs aggregator)
    src = `https://vidsrc.sbs/embed/${type}/${id}?provider=free`;
  } 
  else if (provider === '2embed') {
    // 2Embed (Great for Tamil/Asian)
    src = `https://2embed.cc/embed/${type}/${id}`;
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
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        /* Universal ad/redirect guard: permit the player to run but block the
           pop-ups, pop-unders and parent-page redirects these embeds inject as
           ads. Stream URLs + routing are unchanged. */
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-orientation-lock"
        referrerPolicy="no-referrer"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}
