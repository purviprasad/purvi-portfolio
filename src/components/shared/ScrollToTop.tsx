import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FaArrowUp } from "react-icons/fa6";
import type { Variants } from "framer-motion";

const SHOW_AFTER = 300;
const FLY_MS = 900;

const containerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.7, y: 12 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 22 },
  },
  flying: (distance: number) => ({
    opacity: 0,
    y: -distance,
    rotate: -6,
    scale: 0.7,
    transition: { duration: FLY_MS / 1000, ease: "easeIn" },
  }),
};

export const ScrollToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [flying, setFlying] = useState(false);
  const [distance, setDistance] = useState(0);
  const reduceMotion = useReducedMotion();

  let animationState: "flying" | "visible" | "hidden";
  if (flying) {
    animationState = "flying";
  } else if (visible) {
    animationState = "visible";
  } else {
    animationState = "hidden";
  }

  useEffect(() => {
    const onScroll = () => {
      // Only show button if not currently flying
      if (!flying) {
        setVisible(window.scrollY > SHOW_AFTER);
      }
    };

    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [flying]);

  const onActivate = () => {
    if (reduceMotion) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    const d = window.innerHeight + 220;
    setDistance(d);
    setFlying(true);

    window.scrollTo({ top: 0, behavior: "smooth" });

    // after flight, hide button completely until user scrolls again
    setTimeout(() => {
      setFlying(false);
      setVisible(false); // keep hidden until scroll
    }, FLY_MS + 150);
  };

  return (
    <motion.button
      aria-label="Scroll to top"
      type="button"
      className="no-click-pop fixed bottom-32 right-6 z-50 focus:outline-none cursor-pointer group"
      style={{ display: "grid", placeItems: "center" }}
      onClick={onActivate}
      initial="hidden"
      animate={animationState}
      variants={containerVariants}
      custom={distance}
      whileHover={reduceMotion ? undefined : { scale: 1.1 }}
      whileTap={
        reduceMotion
          ? undefined
          : {
              scale: 0.86,
              transition: { type: "spring", stiffness: 550, damping: 22 },
            }
      }
    >
      <div
        className="relative flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] border border-white/20 transition-[box-shadow,transform] duration-300 overflow-hidden shadow-[0_10px_20px_-6px_color-mix(in_srgb,var(--brand)_35%,transparent)] [@media(hover:none)]:shadow-[0_13px_32px_-8px_color-mix(in_srgb,var(--brand)_48%,transparent)] hover:shadow-[0_14px_28px_-8px_color-mix(in_srgb,var(--brand)_52%,transparent)] active:shadow-[0_14px_28px_-8px_color-mix(in_srgb,var(--brand)_52%,transparent)]"
      >
        {/* Shiny overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-white/10 pointer-events-none" />

        <FaArrowUp className="w-5 h-5 text-white drop-shadow-md group-hover:-translate-y-0.5 group-active:-translate-y-0.5 transition-transform duration-300" />
      </div>
    </motion.button>
  );
};

export default ScrollToTop;
