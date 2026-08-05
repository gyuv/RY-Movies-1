"use client";

import React from "react";

type ProviderType = 
  | "vidsrc_sbs" 
  | "vidsrc_to" 
  | "smashy" 
  | "vidify" 
  | "vidsrc_cc" 
  | "superembed" 
  | "2embed" 
  | "autoembed" 
  | "vidlink" 
  | "vidsrc_vip";

interface VideoEmbedProps {
  type: "movie" | "tv";
  id: string; // TMDB ID or IMDb ID depending on provider
  provider: ProviderType;
  season?: number;
  episode?: number;
  className?: string;
}

const getEmbedUrl = (props: VideoEmbedProps): string => {
  const { type, id, provider, season, episode } = props;
  const isMovie = type === "movie";
  
  // Helper to clean ID (remove 'tt' for some providers if needed, though most accept raw)
  const cleanId = id.replace(/^tt/, ""); 

  switch (provider) {
    case "vidsrc_sbs":
      // Note: vidsrc.sbs often redirects or uses specific paths
      if (isMovie) return `https://vidsrc.sbs/embed/movie/${id}`;
      return `https://vidsrc.sbs/embed/tv/${id}/${season}/${episode}`;

    case "vidsrc_to":
      if (isMovie) return `https://vidsrc.to/embed/movie?tmdb=${id}`;
      return `https://vidsrc.to/embed/tv?tmdb=${id}&season=${season}&episode=${episode}`;

    case "smashy":
      // Smashy accepts TMDB or IMDb (with 'tt')
      if (isMovie) return `https://player.smashy.stream/movie/${id}`;
      return `https://player.smashy.stream/tv/${id}/${season}/${episode}`;

    case "vidify":
      if (isMovie) return `https://vidify.top/embed/movie/${id}`;
      return `https://vidify.top/embed/tv/${id}/${season}/${episode}`;

    case "vidsrc_cc":
      // Requires IMDb ID preferably, but try TMDB if IMDb missing
      if (isMovie) return `https://vidsrc.cc/v2/embed/movie/${id}`;
      return `https://vidsrc.cc/v2/embed/tv/${id}/${season}/${episode}`;

    case "superembed":
      return `https://getsuperembed.link/?video_id=${id}`;

    case "2embed":
      if (isMovie) return `https://www.2embed.cc/embedtmdb/movie?id=${id}`;
      return `https://www.2embed.cc/embedtmdb/tv?id=${id}&s=${season}&e=${episode}`;

    case "autoembed":
      if (isMovie) return `https://player.autoembed.cc/embed/movie/${id}`;
      return `https://player.autoembed.cc/embed/tv/${id}/${season}/${episode}`;

    case "vidlink":
      if (isMovie) return `https://vidlink.pro/movie/${id}`;
      return `https://vidlink.pro/tv/${id}/${season}/${episode}`;

    case "vidsrc_vip":
      if (isMovie) return `https://vidsrc.vip/embed/movie/${id}`;
      return `https://vidsrc.vip/embed/tv/${id}/${season}/${episode}`;

    default:
      return "";
  }
};

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ 
  type, 
  id, 
  provider, 
  season, 
  episode, 
  className = "aspect-video w-full" 
}) => {
  const url = getEmbedUrl({ type, id, provider, season, episode });

  if (!url) return null;

  return (
    <div className={className}>
      <iframe
        src={url}
        title="Video Player"
        className="w-full h-full border-0"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
};
