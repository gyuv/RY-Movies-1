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
  id: string;
  provider: ProviderType;
  season?: number;
  episode?: number;
  className?: string;
}

const getEmbedUrl = (props: VideoEmbedProps): string => {
  const { type, id, provider, season, episode } = props;
  const isMovie = type === "movie";
  
  // Default to S1 E1 for TV shows if not specified
  const s = season || 1;
  const e = episode || 1;

  switch (provider) {
    case "vidsrc_sbs":
      if (isMovie) return `https://vidsrc.sbs/embed/movie/${id}`;
      return `https://vidsrc.sbs/embed/tv/${id}/${s}/${e}`;

    case "vidsrc_to":
      if (isMovie) return `https://vidsrc.to/embed/movie?tmdb=${id}`;
      return `https://vidsrc.to/embed/tv?tmdb=${id}&season=${s}&episode=${e}`;

    case "smashy":
      if (isMovie) return `https://player.smashy.stream/movie/${id}`;
      return `https://player.smashy.stream/tv/${id}/${s}/${e}`;

    case "vidify":
      if (isMovie) return `https://vidify.top/embed/movie/${id}`;
      return `https://vidify.top/embed/tv/${id}/${s}/${e}`;

    case "vidsrc_cc":
      if (isMovie) return `https://vidsrc.cc/v2/embed/movie/${id}`;
      return `https://vidsrc.cc/v2/embed/tv/${id}/${s}/${e}`;

    case "superembed":
      return `https://getsuperembed.link/?video_id=${id}`;

    case "2embed":
      if (isMovie) return `https://www.2embed.cc/embedtmdb/movie?id=${id}`;
      return `https://www.2embed.cc/embedtmdb/tv?id=${id}&s=${s}&e=${e}`;

    case "autoembed":
      if (isMovie) return `https://player.autoembed.cc/embed/movie/${id}`;
      return `https://player.autoembed.cc/embed/tv/${id}/${s}/${e}`;

    case "vidlink":
      if (isMovie) return `https://vidlink.pro/movie/${id}`;
      return `https://vidlink.pro/tv/${id}/${s}/${e}`;

    case "vidsrc_vip":
      if (isMovie) return `https://vidsrc.vip/embed/movie/${id}`;
      return `https://vidsrc.vip/embed/tv/${id}/${s}/${e}`;

    default:
      return "";
  }
};

export const VideoEmbed: React.FC<VideoEmbedProps> = ({ 
  type, 
  id, 
  provider, 
  className = "aspect-video w-full" 
}) => {
  const url = getEmbedUrl({ type, id, provider });

  if (!url) return null;

  return (
    <div className={className}>
      <iframe
        src={url}
        title="Video Player"
        className="w-full h-full border-0 bg-black"
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        loading="lazy"
      />
    </div>
  );
};
