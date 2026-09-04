"use client";

/**
 * RayMovies — Cinematic Brand Intro ("The RayMovies Welcome")
 * ------------------------------------------------------------------
 * A staged, 60fps brand reveal blending three iconic vibes:
 *   1. THE CONVERGENCE  — golden/blue particles + light streaks sweep in
 *                          from the edges and swirl into a focal core
 *                          (Hotstar aurora / Prime horizon).
 *   2. THE IMPACT       — the core snaps and detonates into a crimson+gold
 *                          dimensional "RayMovies" wordmark (Netflix flash).
 *   3. THE VIBE         — the quote types/​shimmers in beneath the logo.
 *   4. THE TRANSITION   — the whole scene scales up and dissolves into the
 *                          dashboard with spring physics, zero layout shift.
 *
 * Pure <canvas> + Framer Motion — no image/video assets, instant load.
 * "Skip Intro" (top-right) persists to localStorage for returning users.
 * Honours prefers-reduced-motion (still, quick fade).
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const SEEN_KEY = "apex_intro_seen_v1";
const QUOTE = "Chill Beer with a good movie...what else?";

type Phase = "converge" | "impact" | "quote";

export default function ApexIntro() {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [returning, setReturning] = useState(false);
  const [phase, setPhase] = useState<Phase>("converge");
  const [typed, setTyped] = useState("");

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const phaseRef = useRef<Phase>("converge");
  const impactAtRef = useRef<number>(0);

  const dismiss = useCallback(() => {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch {
      /* storage blocked — non-fatal */
    }
    setVisible(false);
  }, []);

  const setPhaseBoth = useCallback((p: Phase) => {
    phaseRef.current = p;
    if (p === "impact") impactAtRef.current = performance.now();
    setPhase(p);
  }, []);

  // Decide whether to show (client-only → no hydration flash) + timeline.
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

    const reduce =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce) {
      setPhaseBoth("impact");
      setTyped(QUOTE);
      const t = setTimeout(dismiss, 900);
      return () => clearTimeout(t);
    }

    // Returning users get a snappier cut of the same sequence.
    const scale = seen ? 0.55 : 1;
    const T = {
      impact: 1500 * scale,
      quote: 2250 * scale,
      end: 4600 * scale,
    };

    const timers = [
      setTimeout(() => setPhaseBoth("impact"), T.impact),
      setTimeout(() => setPhaseBoth("quote"), T.quote),
      setTimeout(dismiss, T.end),
    ];
    return () => timers.forEach(clearTimeout);
  }, [dismiss, setPhaseBoth]);

  // Typewriter for the quote (starts when the quote phase begins).
  useEffect(() => {
    if (phase !== "quote") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setTyped(QUOTE);
      return;
    }
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(QUOTE.slice(0, i));
      if (i >= QUOTE.length) clearInterval(id);
    }, 42);
    return () => clearInterval(id);
  }, [phase]);

  // Particle field: convergence → impact burst.
  useEffect(() => {
    if (!visible) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let w = window.innerWidth;
    let h = window.innerHeight;
    const resize = () => {
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const cx = () => w / 2;
    const cy = () => h / 2;
    const GOLD = "232,184,75";
    const BLUE = "58,160,255";
    const CRIMSON = "229,9,20";

    const COUNT = reduce ? 70 : Math.min(260, Math.floor((w * h) / 7600));
    const parts = Array.from({ length: COUNT }, () => {
      const edge = Math.floor(Math.random() * 4);
      const along = Math.random();
      let x = 0;
      let y = 0;
      if (edge === 0) { x = along * w; y = -20; }
      else if (edge === 1) { x = w + 20; y = along * h; }
      else if (edge === 2) { x = along * w; y = h + 20; }
      else { x = -20; y = along * h; }
      return {
        x,
        y,
        vx: 0,
        vy: 0,
        s: Math.random() * 1.8 + 0.5,
        hue: Math.random() > 0.5 ? GOLD : BLUE,
        swirl: (Math.random() - 0.5) * 0.6,
        seed: Math.random() * Math.PI * 2,
        burst: Math.random() * 6 + 2,
      };
    });

    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      const inImpact = phaseRef.current !== "converge";
      const sinceImpact = inImpact ? (performance.now() - impactAtRef.current) / 1000 : 0;

      // Core / horizon glow
      const coreR = inImpact ? 320 + Math.sin(sinceImpact * 2) * 20 : 180;
      const g = ctx.createRadialGradient(cx(), cy(), 0, cx(), cy(), coreR);
      if (inImpact) {
        const flash = Math.max(0, 1 - sinceImpact * 1.6); // crimson flash decays
        g.addColorStop(0, `rgba(${CRIMSON},${0.28 + flash * 0.5})`);
        g.addColorStop(0.35, `rgba(${GOLD},${0.14})`);
        g.addColorStop(1, "rgba(0,0,0,0)");
      } else {
        g.addColorStop(0, `rgba(${GOLD},0.22)`);
        g.addColorStop(0.45, `rgba(${BLUE},0.10)`);
        g.addColorStop(1, "rgba(0,0,0,0)");
      }
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      // sweeping horizon band (Prime vibe) during convergence
      if (!inImpact && !reduce) {
        ctx.save();
        ctx.globalCompositeOperation = "screen";
        const band = ctx.createLinearGradient(0, cy() - 60, w, cy() + 60);
        band.addColorStop(0, "rgba(0,0,0,0)");
        band.addColorStop(0.5, `rgba(${BLUE},0.10)`);
        band.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = band;
        ctx.fillRect(0, cy() - 70, w, 140);
        ctx.restore();
      }

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      for (const p of parts) {
        const dx = cx() - p.x;
        const dy = cy() - p.y;
        const dist = Math.hypot(dx, dy) || 1;

        if (!inImpact) {
          // gravitate inward with a tangential swirl
          const pull = reduce ? 0.6 : 34 / dist;
          const tx = -dy / dist;
          const ty = dx / dist;
          p.vx += (dx / dist) * pull + tx * p.swirl;
          p.vy += (dy / dist) * pull + ty * p.swirl;
          p.vx *= 0.9;
          p.vy *= 0.9;
        } else {
          // detonation: push outward briefly, then drift
          const push = Math.max(0, 1 - sinceImpact * 1.4) * p.burst;
          p.vx += (-dx / dist) * push * 0.4;
          p.vy += (-dy / dist) * push * 0.4;
          p.vx *= 0.92;
          p.vy *= 0.92;
        }
        p.x += p.vx;
        p.y += p.vy;

        const hue = inImpact && sinceImpact < 0.5 ? CRIMSON : p.hue;
        const alpha = inImpact
          ? Math.max(0, 0.9 - sinceImpact * 0.5)
          : Math.min(1, 60 / dist);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${hue},${alpha})`;
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      rafRef.current = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [visible]);

  if (!mounted) return null;

  const showLogo = phase !== "converge";

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="raymovies-intro"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.12, filter: "blur(16px)" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[100] overflow-hidden bg-black"
          role="dialog"
          aria-label="RayMovies intro"
        >
          <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />

          {/* crimson impact flash overlay */}
          <AnimatePresence>
            {showLogo && (
              <motion.div
                key="flash"
                initial={{ opacity: 0.85 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 0.7, ease: "easeOut" }}
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "radial-gradient(circle at center, rgba(229,9,20,0.55), rgba(232,184,75,0.15) 40%, transparent 70%)",
                }}
              />
            )}
          </AnimatePresence>

          {/* Centre stage */}
          <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
            <AnimatePresence>
              {showLogo && (
                <motion.div
                  key="wordmark"
                  initial={{ scale: 1.6, opacity: 0, filter: "blur(14px)" }}
                  animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
                  transition={{ type: "spring", stiffness: 260, damping: 18, mass: 0.7 }}
                  className="relative"
                >
                  <span className="pointer-events-none absolute -inset-x-16 -inset-y-10 rounded-full bg-[radial-gradient(circle,rgba(229,9,20,0.35),rgba(232,184,75,0.18)_45%,transparent_72%)] blur-2xl" />
                  <h1 className="relative select-none font-heading text-6xl font-extrabold tracking-tight sm:text-8xl md:text-9xl">
                    <span className="ray-brand">Ray</span>
                    <span className="ray-brand-alt">Movies</span>
                  </h1>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Quote — typewriter + glass shimmer */}
            <div className="mt-6 h-8 sm:h-9">
              {phase === "quote" && (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6 }}
                  className="ray-quote font-display italic text-base sm:text-xl md:text-2xl"
                >
                  {typed}
                  <span className="ray-caret" aria-hidden>
                    |
                  </span>
                </motion.p>
              )}
            </div>
          </div>

          {/* Skip / Enter control */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: returning ? 0.2 : 1.2 }}
            onClick={dismiss}
            className="apex-glass apex-focusable absolute right-5 top-5 z-10 rounded-full px-5 py-2.5 text-xs font-semibold uppercase tracking-widest text-white/90 transition-all hover:text-white hover:shadow-apex-glow sm:right-8 sm:top-8"
            data-apex-nav
          >
            {returning ? "Enter →" : "Skip Intro"}
          </motion.button>

          {/* scoped brand styles */}
          <style>{`
            .ray-brand {
              background: linear-gradient(180deg, #ff5a5f 0%, #e50914 55%, #b0060d 100%);
              -webkit-background-clip: text; background-clip: text; color: transparent;
              text-shadow: 0 0 42px rgba(229,9,20,0.55);
            }
            .ray-brand-alt {
              background: linear-gradient(180deg, #ffe7a8 0%, #e8b84b 55%, #c8912a 100%);
              -webkit-background-clip: text; background-clip: text; color: transparent;
              text-shadow: 0 0 42px rgba(232,184,75,0.5);
            }
            .ray-quote {
              background: linear-gradient(100deg, rgba(255,255,255,0.55) 20%, #ffffff 45%, rgba(255,255,255,0.55) 70%);
              background-size: 200% auto;
              -webkit-background-clip: text; background-clip: text; color: transparent;
              animation: apex-sheen 3.5s linear infinite;
            }
            .ray-caret {
              color: #e8b84b; margin-left: 2px;
              animation: rayBlink 1s steps(1) infinite;
            }
            @keyframes rayBlink { 50% { opacity: 0; } }
            @media (prefers-reduced-motion: reduce) {
              .ray-quote { animation: none; }
              .ray-caret { animation: none; }
            }
          `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
