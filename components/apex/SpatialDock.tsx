"use client";

/**
 * Project Apex — SpatialDock
 * ------------------------------------------------------------------
 * A floating, translucent spatial navigation dock. Collapses to a rail
 * and expands with spring physics on hover / focus. Vertical on desktop
 * (left edge), horizontal on mobile (bottom, thumb-reachable). Fully
 * D-pad navigable for Smart-TV via [data-apex-nav].
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";
import { useSpatialNavigation } from "@/hooks/useSpatialNavigation";

interface DockItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const items: DockItem[] = [
  {
    href: "/",
    label: "Browse",
    icon: (
      <path d="M4 6h16M4 12h16M4 18h10" strokeLinecap="round" strokeWidth={2} />
    ),
  },
  {
    href: "/movies",
    label: "Movies",
    icon: (
      <path
        d="M3 5h18v14H3zM7 5v14M17 5v14M3 9h4m10 0h4M3 15h4m10 0h4"
        strokeWidth={1.6}
        strokeLinejoin="round"
      />
    ),
  },
  {
    href: "/series",
    label: "Series",
    icon: (
      <path
        d="M4 7h16v11H4zM9 3l3 4 3-4"
        strokeWidth={1.6}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    ),
  },
  // Anime + Manga are temporarily disabled — reserved for a future release.
  // {
  //   href: "/anime",
  //   label: "Anime",
  //   icon: (
  //     <path
  //       d="M12 3c5 3 7 6 7 10a7 7 0 11-14 0c0-2 1-3 2-4"
  //       strokeWidth={1.6}
  //       strokeLinecap="round"
  //       strokeLinejoin="round"
  //     />
  //   ),
  // },
  // {
  //   href: "/manga",
  //   label: "Manga",
  //   icon: (
  //     <path
  //       d="M4 5l8 2 8-2v13l-8 2-8-2zM12 7v13"
  //       strokeWidth={1.6}
  //       strokeLinejoin="round"
  //       strokeLinecap="round"
  //     />
  //   ),
  // },
];

export default function SpatialDock() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(false);
  useSpatialNavigation();

  const spring = { type: "spring" as const, stiffness: 380, damping: 30 };

  return (
    <motion.nav
      aria-label="Primary"
      onHoverStart={() => setExpanded(true)}
      onHoverEnd={() => setExpanded(false)}
      onFocusCapture={() => setExpanded(true)}
      onBlurCapture={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) setExpanded(false);
      }}
      className="apex-glass fixed z-[60] flex gap-1 rounded-2xl p-2
                 bottom-4 left-1/2 -translate-x-1/2 flex-row
                 md:bottom-auto md:left-4 md:top-1/2 md:-translate-x-0 md:-translate-y-1/2 md:flex-col"
    >
      {items.map((item) => {
        const active =
          item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            data-apex-nav
            aria-label={item.label}
            aria-current={active ? "page" : undefined}
            className={`apex-focusable group relative flex items-center gap-3 rounded-xl px-3 py-2.5 outline-none transition-colors ${
              active ? "text-apex-cyan" : "text-white/60 hover:text-white"
            }`}
          >
            <span
              className={`relative flex h-6 w-6 shrink-0 items-center justify-center ${
                active ? "drop-shadow-[0_0_8px_rgba(34,230,216,0.8)]" : ""
              }`}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="h-6 w-6">
                {item.icon}
              </svg>
              {active && (
                <motion.span
                  layoutId="apex-dock-active"
                  transition={spring}
                  className="absolute -inset-1.5 -z-10 rounded-lg bg-apex-cyan/10 ring-1 ring-apex-cyan/40"
                />
              )}
            </span>
            <motion.span
              initial={false}
              animate={{
                width: expanded ? "auto" : 0,
                opacity: expanded ? 1 : 0,
              }}
              transition={spring}
              className="overflow-hidden whitespace-nowrap text-sm font-medium tracking-wide"
            >
              {item.label}
            </motion.span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
