"use client";

interface VideoEmbedProps {
  type: string; // 'movie' or 'tv'
  id: number;
  provider: string; 
  className?: string;
}

export default function VideoEmbed({ type, id, provider, className }: VideoEmbedProps) {
  let src = '';
  const is2Embed = provider === '2embed';

  if (provider === 'promulti') {
    // ProMulti (vidsrc.sbs aggregator)
    src = `https://vidsrc.sbs/embed/${type}/${id}?provider=free`;
  }
  else if (is2Embed) {
    // 2Embed (Great for Tamil/Asian)
    src = `https://2embed.cc/embed/${type}/${id}`;
  }
  else {
    // Fallback to Promulti
    src = `https://vidsrc.sbs/embed/${type}/${id}?provider=free`;
  }

  /**
   * Ad/redirect guard.
   *   - ProMulti works fine sandboxed, so we keep the sandbox: it blocks the
   *     pop-ups, pop-unders and parent-page redirects these embeds inject.
   *   - 2Embed refuses to play under a sandbox ("sandbox not allowed"), so we
   *     drop it there and rely on the browser's own popup blocker instead.
   * Stream URLs + routing are unchanged either way.
   */
  const sandbox = is2Embed
    ? undefined
    : 'allow-scripts allow-same-origin allow-forms allow-presentation allow-orientation-lock';

  return (
    <div className={className}>
      <iframe
        src={src}
        title="Video Player"
        className="w-full h-full rounded-lg bg-black"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
        {...(sandbox ? { sandbox } : {})}
        referrerPolicy="no-referrer"
        frameBorder="0"
        scrolling="no"
      ></iframe>
    </div>
  );
}
