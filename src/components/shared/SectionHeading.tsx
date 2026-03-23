import React from "react";
import { motion } from "framer-motion";

export type SectionHeadingProps = {
  title: string;
  subtitle: string;
  highlight?: string;
  /** When true, applies retro glitch styling to the title (match cyber / CRT mode). */
  glitch?: boolean;
  /** Center title block (e.g. for a narrow column). Default aligns with Experience / Projects. */
  centered?: boolean;
  className?: string;
};

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  highlight,
  glitch,
  centered,
  className = "",
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      className={`mb-12 group ${centered ? "text-center" : ""} ${className}`.trim()}
    >
      <h2
        className={`text-4xl md:text-6xl font-black tracking-tighter text-[var(--text)] mb-3 flex flex-wrap items-baseline gap-3 transition-colors ${
          centered ? "justify-center" : ""
        } ${glitch ? "glitch-text" : ""}`}
        data-text={title}
      >
        {title}
        {highlight ? (
          <span className="text-[var(--brand)] inline-block group-hover:rotate-3 transition-transform">{highlight}</span>
        ) : null}
      </h2>
      <div className={`flex items-center gap-4 ${centered ? "justify-center" : ""}`}>
        <div className="h-[2px] w-12 bg-[var(--brand)]/30 group-hover:w-24 transition-all duration-500 rounded-full shrink-0" />
        <p className="text-sm font-medium text-[var(--muted)]/80 uppercase tracking-widest">{subtitle}</p>
      </div>
    </motion.div>
  );
};
