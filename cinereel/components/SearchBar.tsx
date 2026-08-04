"use client";

import { useState } from "react";

export default function SearchBar({
  initialValue,
  onSearch,
}: {
  initialValue: string;
  onSearch: (query: string) => void;
}) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSearch(value.trim());
      }}
      className="relative"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search a title, actor, actress, or director…"
        aria-label="Search movies and series"
        className="w-full bg-ink-raised border border-ink-line rounded-none px-6 py-5
                   font-display italic text-2xl sm:text-3xl text-paper placeholder:text-paper-dim/60
                   focus:border-marquee transition-colors"
      />
      <button
        type="submit"
        className="absolute right-3 top-1/2 -translate-y-1/2 stub-label px-4 py-2
                   border border-ink-line hover:border-marquee hover:text-marquee transition-colors"
      >
        Search
      </button>
    </form>
  );
}
