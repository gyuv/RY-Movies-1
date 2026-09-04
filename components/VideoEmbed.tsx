"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; // 'netflix', 'prime', 'hulu', 'disney', 'apple', 'hbomax', 'paramount', 'peacock', 'free'
  className?: string;
}

export default function VideoEmbed({ type, id, provider, className }: VideoEmbedProps) {
  // vidsrc.sbs is the aggregator you liked (ProMulti experience)
  // 'free' is the best option as it aggregates multiple sources
  const src = `https://vidsrc.sbs/embed/${type}/${id}?provider=${provider}`;

  return (
    <div className={className}>
      <iframe
        src={src}
        title="Video Player"
        className="w-full h-full rounded-lg bg-black"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        /* Universal ad/redirect guard: block pop-ups, pop-unders and parent
           redirects from third-party embeds. Stream URLs + routing unchanged. */
        sandbox="allow-scripts allow-same-origin allow-forms allow-presentation allow-orientation-lock"
        referrerPolicy="no-referrer"
        frameBorder="0"
        scrolling="no"
        onError={() => console.log("Video iframe error")}
      ></iframe>
    </div>
  );
}
