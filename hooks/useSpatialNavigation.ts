"use client";

/**
 * Project Apex — useSpatialNavigation
 * ------------------------------------------------------------------
 * D-pad / remote-control friendly focus traversal for Smart-TV runtimes
 * (Tizen / webOS) and keyboard users. Any element with the attribute
 * [data-apex-nav] inside the provided root becomes reachable via arrow
 * keys; Enter activates, Escape/Backspace fires the onBack handler.
 *
 * It is purely additive — it never hijacks typing inside inputs and
 * respects native tab order as a fallback.
 */
import { useEffect } from "react";

interface Options {
  onBack?: () => void;
  enabled?: boolean;
}

function isTypingTarget(el: EventTarget | null): boolean {
  const node = el as HTMLElement | null;
  if (!node) return false;
  const tag = node.tagName;
  return tag === "INPUT" || tag === "TEXTAREA" || node.isContentEditable;
}

export function useSpatialNavigation({ onBack, enabled = true }: Options = {}) {
  useEffect(() => {
    if (!enabled || typeof document === "undefined") return;

    const focusables = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("[data-apex-nav]")
      ).filter((el) => el.offsetParent !== null);

    const handler = (e: KeyboardEvent) => {
      if (isTypingTarget(e.target)) return;

      if (e.key === "Escape" || e.key === "Backspace") {
        if (onBack) {
          e.preventDefault();
          onBack();
        }
        return;
      }

      if (!["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key))
        return;

      const items = focusables();
      if (items.length === 0) return;
      const active = document.activeElement as HTMLElement | null;
      const currentRect = active?.getBoundingClientRect();

      // No current focus → focus the first reachable element.
      if (!active || !items.includes(active) || !currentRect) {
        e.preventDefault();
        items[0].focus();
        return;
      }

      const cx = currentRect.left + currentRect.width / 2;
      const cy = currentRect.top + currentRect.height / 2;

      let best: { el: HTMLElement; score: number } | null = null;
      for (const el of items) {
        if (el === active) continue;
        const r = el.getBoundingClientRect();
        const ex = r.left + r.width / 2;
        const ey = r.top + r.height / 2;
        const dx = ex - cx;
        const dy = ey - cy;

        const inDir =
          (e.key === "ArrowRight" && dx > 8) ||
          (e.key === "ArrowLeft" && dx < -8) ||
          (e.key === "ArrowDown" && dy > 8) ||
          (e.key === "ArrowUp" && dy < -8);
        if (!inDir) continue;

        // Prefer aligned + nearby elements (Manhattan-ish score).
        const primary = Math.abs(
          e.key === "ArrowLeft" || e.key === "ArrowRight" ? dx : dy
        );
        const cross = Math.abs(
          e.key === "ArrowLeft" || e.key === "ArrowRight" ? dy : dx
        );
        const score = primary + cross * 2;
        if (!best || score < best.score) best = { el, score };
      }

      if (best) {
        e.preventDefault();
        best.el.focus();
        best.el.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onBack, enabled]);
}
