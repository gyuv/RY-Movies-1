"use client";

import { useState } from "react";

export default function SearchBar({
  initialValue,
  onSearch,
  variant = "hero",
}: {
  initialValue: string;
  onSearch: (query: string) => void;
  variant?: "hero" | "compact";
}) {
  const [value, setValue] = useState(initialValue);

  const isCompact = variant === "compact";

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim());
      }}
      className="relative w-full"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={isCompact ? "Search titles, actors…" : "Search a title, actor, actress, or director…"}
        aria-label="Search movies and series"
        className={
          isCompact
            ? "w-full bg-ink-raised border border-ink-line rounded-md pl-4 pr-20 py-2 " +
              "font-body text-sm text-paper placeholder:text-paper-dim/60 " +
              "focus:outline-none focus:border-marquee transition-colors"
            : "w-full bg-ink-raised border border-ink-line rounded-none px-6 pr-28 sm:pr-32 py-5 " +
              "font-display italic text-2xl sm:text-3xl text-paper placeholder:text-paper-dim/60 " +
              "focus:border-marquee transition-colors"
        }
      />
      <button
        type="submit"
        className={
          isCompact
            ? "absolute right-1.5 top-1/2 -translate-y-1/2 text-xs uppercase tracking-wide px-3 py-1.5 " +
              "border border-ink-line rounded hover:border-marquee hover:text-marquee transition-colors"
            : "absolute right-3 top-1/2 -translate-y-1/2 stub-label px-4 py-2 " +
              "border border-ink-line hover:border-marquee hover:text-marquee transition-colors"
        }
      >
        Search
      </button>
    </form>
  );
}
