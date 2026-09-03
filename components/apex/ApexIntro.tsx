"use client";

/**
 * Project Apex — Cinematic Entry / Splash ("The Apex Welcome")
 * ------------------------------------------------------------------
 * A dark, atmospheric spatial particle field whose points are pulled by
 * gravity toward a central glowing portal, resolving into the Apex
 * wordmark before fading — without layout shift — into the dashboard.
 *
 * - "Skip Intro" for returning users (state persisted via localStorage).
 * - Honours prefers-reduced-motion (renders a still, quick fade).
 * - Pure <canvas> (no asset downloads); safe for PWA / TV runtimes.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEEN_KEY = "apex_intro_seen_v1";

export default function ApexIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [returning, setReturning] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage may be blocked — non-fatal */
    }
    setVisible(false);
  }, []);

  // Decide whether to show, only on the client (avoids hydration flash).
  useEffect(() => {
    setMounted(true);
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      /* ignore */
    }
    setReturning(seen);
    setVisible(true);
    // Auto-advance the cinematic beat, then reveal the dashboard.
    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dur = reduce ? 600 : seen ? 2200 : 4200;
    const t = setTimeout(dismiss, dur);
    return () => clearTimeout(t);
  }, [dismiss]);

  // Particle field animation.
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);
    const cx = () => w / 2;
    const cy = () => h / 2;

    const COUNT = reduce ? 60 : Math.min(220, Math.floor((w * h) / 9000));
    const parts = Array.from({ length: COUNT }, () => {
      const a = Math.random() * Math.PI * 2;
      const r = Math.max(w, h) * (0.35 + Math.random() * 0.5);
      return {
        x: cx() + Math.cos(a) * r,
        y: cy() + Math.sin(a) * r,
        vx: 0,
        vy: 0,
        s: Math.random() * 1.6 + 0.4,
        hue: Math.random() > 0.5 ? "34,230,216" : "139,92,246",
      };
    });

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      // portal core glow
      const g = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), 260);
      g.addColorStop(0, "rgba(139,92,246,0.35)");
      g.addColorStop(0.4, "rgba(34,230,216,0.10)");
      g.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(cx(), cy(), 260, 0, Math.PI * 2);
      ctx.fill();

      for (const p of parts) {
        const dx = cx() - p.x;
        const dy = cy() - p.y;
        const dist = Math.hypot(dx, dy) || 1;
        const pull = reduce ? 0 : 26 / dist;
        p.vx += (dx / dist) * pull;
        p.vy += (dy / dist) * pull;
        p.vx *= 0.94;
        p.vy *= 0.94;
        p.x += p.vx;
        p.y += p.vy;
        // respawn once swallowed by the portal
        if (dist < 24) {
          const a = Math.random() * Math.PI * 2;
          const r = Math.max(w, h) * (0.4 + Math.random() * 0.4);
          p.x = cx() + Math.cos(a) * r;
          p.y = cy() + Math.sin(a) * r;
          p.vx = p.vy = 0;
        }
        ctx.beginPath();
        ctx.fillStyle = `rgba(${p.hue},${Math.min(1, 40 / dist)})`;
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", onResize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="apex-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: "blur(12px)" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] bg-black overflow-hidden"
          role="dialog"
          aria-label="Project Apex intro"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          {/* central wordmark reveal */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <span className="pointer-events-none absolute -inset-10 rounded-full bg-apex-portal blur-2xl animate-apex-pulse" />
              <h1 className="relative apex-wordmark font-display italic text-5xl sm:text-7xl md:text-8xl font-bold tracking-tight">
                RaY&nbsp;Movies
              </h1>
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1, duration: 0.8 }}
                className="mt-4 font-mono text-[11px] sm:text-xs uppercase tracking-[0.5em] text-apex-cyan/80"
              >
                Project&nbsp;Apex
              </motion.p>
            </motion.div>
          </div>

          {/* Skip control */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: returning ? 0.2 : 1.6 }}
            onClick={dismiss}
            className="apex-glass apex-focusable absolute bottom-8 right-6 sm:bottom-10 sm:right-10 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/90 hover:text-white hover:shadow-apex-glow transition-all"
            data-apex-nav
          >
            {returning ? "Enter →" : "Skip Intro"}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
