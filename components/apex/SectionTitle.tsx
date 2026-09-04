"use client";

/**
 * Project Apex — SectionTitle
 * A premium, animated row/section heading. Modern geometric face, a
 * kicker eyebrow, a glowing accent bar that draws in on scroll, and a
 * subtle gradient sheen on the title. Reveals once when it enters view.
 */
import { motion, useReducedMotion } from "framer-motion";

interface Props {
  title: string;
  kicker?: string;
  as?: "h1" | "h2" | "h3";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "text-lg sm:text-xl",
  md: "text-xl sm:text-2xl",
  lg: "text-3xl sm:text-4xl lg:text-5xl",
};

export default function SectionTitle({
  title,
  kicker,
  as = "h2",
  size = "md",
  className = "",
}: Props) {
  const reduce = useReducedMotion();
  const Tag = motion[as];

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {kicker && (
        <motion.span
          initial={reduce ? false : { opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-[10px] font-medium uppercase tracking-[0.34em] text-apex-cyan/80"
        >
          {kicker}
        </motion.span>
      )}
      <div className="flex items-center gap-3">
        {/* glowing accent bar */}
        <motion.span
          aria-hidden
          initial={reduce ? false : { scaleY: 0, opacity: 0 }}
          whileInView={{ scaleY: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="h-6 w-1.5 origin-bottom rounded-full bg-gradient-to-b from-apex-cyan to-apex-violet shadow-[0_0_14px_rgba(34,230,216,0.75)]"
        />
        <Tag
          initial={reduce ? false : { opacity: 0, y: 14, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className={`apex-title leading-tight ${sizes[size]}`}
        >
          {title}
        </Tag>
      </div>
    </div>
  );
}
