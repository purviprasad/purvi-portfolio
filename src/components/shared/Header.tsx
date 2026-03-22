import React, { useEffect, useRef, useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  animate,
  useMotionTemplate,
} from "framer-motion";
import { PiSunDuotone, PiMoonDuotone, PiSnowflakeDuotone, PiCloudDuotone } from "react-icons/pi";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useTheme } from "../../context/ThemeContext";
import { usePortfolio } from "../../context/PortfolioContext";
import { PORTFOLIO_INFO } from "../../config/portfolioData";

type NavLink = { href: string; label: string };

export const Header: React.FC<{
  links?: NavLink[];
  onTryCLI?: () => void;
  isSnowEnabled?: boolean;
  onToggleSnow?: () => void;
}> = ({ links = [], onTryCLI, isSnowEnabled, onToggleSnow }) => {
  const { dark, toggle } = useTheme();
  const { isRetro } = usePortfolio();
  const headerRef = useRef<HTMLElement | null>(null);

  const PERSONAL = PORTFOLIO_INFO.personal;

  const [active, setActive] = useState<string>(links[0]?.href ?? "#about");
  useEffect(() => {
    const sections = links
      .map((l) =>
        l.href.startsWith("#") ? document.querySelector(l.href) : null
      )
      .filter(Boolean) as HTMLElement[];

    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) setActive(`#${visible.target.id}`);
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((s) => obs.observe(s));
    return () => obs.disconnect();
  }, [links]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => setMobileNavOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const springScrollTo = (y: number) => {
    const controls = animate(window.scrollY, y, {
      type: "spring",
      stiffness: 200,
      damping: 30,
      onUpdate: (latest) => window.scrollTo(0, latest),
    });
    return () => controls.stop();
  };

  const onNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    // normal navigation for external links
    if (!href.startsWith("#")) return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (!target) return;

    const headerEl = headerRef.current ?? document.querySelector("header");
    const headerH = headerEl?.offsetHeight ?? 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH;
    springScrollTo(y);
  };

  const { scrollY } = useScroll();
  const blurPx = useTransform(scrollY, [0, 200], [8, 16]);
  const overlayOpacity = useTransform(scrollY, [0, 200], [0.08, 0.14]);
  const backdrop = useMotionTemplate`blur(${blurPx}px)`;

  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <motion.header
      ref={headerRef}
      className="fixed top-0 left-0 z-50 w-full border-b border-theme bg-[var(--surface)]/80 backdrop-blur-sm"
      style={{ backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
    >
      {/* animated overlay to add subtle tint regardless of theme */}
      <motion.div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundColor: `rgba(0,0,0,1)`,
          opacity: overlayOpacity,
        }}
      />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2">
        {/* Left: brand/home */}
        <Link
          to="/"
          className="flex items-center gap-2 sm:gap-3 text-lg font-semibold text-[var(--text)] min-w-0"
          onClick={() => setMobileNavOpen(false)}
        >
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--brand)] to-[var(--accent)] flex items-center justify-center text-2xl font-bold text-white overflow-hidden">
            {PERSONAL.avatar ? (
              <img
                className="w-full h-full object-cover rounded-2xl"
                src={PERSONAL.avatar}
                alt="profile"
              />
            ) : (
              PERSONAL.name?.split(" ")?.[0]?.[0]
            )}
          </div>
          <span className="sr-only">Home</span>
          <div className="hidden sm:block leading-tight min-w-0 text-left">
            <div className={`font-bold text-[var(--brand)] truncate ${isRetro ? 'glitch-text' : ''}`} data-text={PERSONAL.name}>{PERSONAL.name}</div>
            <div className="text-xs text-[var(--muted)] truncate max-w-[12rem] md:max-w-none">{PERSONAL.title}</div>
          </div>
        </Link>

        {/* Right: nav + theme + Try CLI */}
        <nav aria-label="Primary" className="relative flex items-center gap-1.5 sm:gap-3 flex-shrink-0">
          <div className="relative hidden lg:flex gap-3 xl:gap-4">
            {links.map((l) => {
              const isActive = active === l.href;
              return (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={(e) => {
                    onNavClick(e, l.href);
                  }}
                  className="relative px-1 py-0.5 text-sm text-[var(--text)] whitespace-nowrap"
                >
                  {l.label}
                  <AnimatePresence initial={false}>
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute left-0 right-0 -bottom-1 h-[2px] rounded-full bg-[var(--brand)]"
                        transition={{
                          type: "spring",
                          stiffness: 500,
                          damping: 40,
                        }}
                      />
                    )}
                  </AnimatePresence>
                </a>
              );
            })}
          </div>

          {links.length > 0 && (
            <button
              type="button"
              className="lg:hidden p-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:bg-[var(--border)]/30 transition cursor-pointer"
              aria-expanded={mobileNavOpen}
              aria-controls="mobile-nav"
              aria-label={mobileNavOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileNavOpen((o) => !o)}
            >
              {mobileNavOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          )}

          <button
            type="button"
            onClick={onTryCLI}
            className="btn-light-flare inline-flex items-center gap-1.5 px-2 sm:px-3 py-1.5 rounded text-xs sm:text-sm border border-[var(--border)] hover:bg-[var(--border)]/30 transition cursor-pointer max-sm:min-w-0"
            aria-label="Try CLI"
          >
            <span className="hidden min-[380px]:inline">Try CLI</span>
            <span className="min-[380px]:hidden font-mono">CLI</span>
          </button>

          {onToggleSnow && (
          <button
            type="button"
            onClick={onToggleSnow}
            className="p-2 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)]/30 transition cursor-pointer text-[var(--brand)]"
              aria-label="Toggle snow effect"
              title={isSnowEnabled ? "Turn off snow" : "Turn on snow"}
            >
              {isSnowEnabled ? (
                <PiSnowflakeDuotone size={22} />
              ) : (
                <PiCloudDuotone size={22} className="opacity-50" />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={toggle}
            aria-label="Toggle color theme"
            className="p-2 rounded-full border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)]/30 transition cursor-pointer"
          >
            {dark ? <PiSunDuotone size={22} /> : <PiMoonDuotone size={22} />}
          </button>
        </nav>
      </div>

      <AnimatePresence initial={false}>
        {mobileNavOpen && links.length > 0 && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="lg:hidden overflow-hidden border-t border-[var(--border)] bg-[var(--surface)]/95 backdrop-blur-md"
          >
            <div className="px-4 py-3 flex flex-col gap-0.5 max-w-6xl mx-auto">
              {links.map((l) => {
                const isActive = active === l.href;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    onClick={(e) => {
                      onNavClick(e, l.href);
                      setMobileNavOpen(false);
                    }}
                    className={`py-2.5 px-3 rounded-xl text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-[var(--brand)]/15 text-[var(--brand)]"
                        : "text-[var(--text)] hover:bg-[var(--border)]/40"
                    }`}
                  >
                    {l.label}
                  </a>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
