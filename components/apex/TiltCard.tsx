"use client";

/**
 * Project Apex — TiltCard
 * A reusable 3D pointer-tilt wrapper with a glow sheen. Physics via
 * Framer Motion springs. Degrades gracefully on touch / TV (no pointer
 * → no tilt, focus ring still applies). Wraps ANY children, so it stays
 * decoupled from card content.
 */
import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  /** max tilt in degrees */
  max?: number;
}

export default function TiltCard({ children, className = "", max = 12 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);

  const spring = { stiffness: 220, damping: 18, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), spring);
  const glowX = useTransform(px, [0, 1], ["0%", "100%"]);
  const glowY = useTransform(py, [0, 1], ["0%", "100%"]);

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "touch") return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <motion.div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", transformPerspective: 900 }}
      whileHover={{ scale: 1.04, z: 30 }}
      transition={spring}
      className={`relative ${className}`}
    >
      {children}
      {/* moving specular glow */}
      <motion.span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 mix-blend-screen transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background: useTransform(
            [glowX, glowY],
            ([x, y]) =>
              `radial-gradient(240px circle at ${x} ${y}, rgba(34,230,216,0.25), transparent 60%)`
          ),
        }}
      />
    </motion.div>
  );
}
