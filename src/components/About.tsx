import { animate, motion } from "framer-motion";
import type { Personal } from "../types/portfolio";
import * as SiIcons from "react-icons/si";
import * as VscIcons from "react-icons/vsc";
import * as Fa6Icons from "react-icons/fa6";
import { Link } from "react-router-dom";

export const About: React.FC<{ personal: Personal }> = ({ personal }) => {
  const text = personal.name.split("");

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

    const headerEl = document.querySelector("header");
    const headerH = headerEl?.offsetHeight ?? 0;
    const y = target.getBoundingClientRect().top + window.scrollY - headerH;
    springScrollTo(y);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="lg:col-span-2 order-2 lg:order-1"
      // p-8 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-[var(--border)] dark:border-white/10 shadow-sm"
      >
        <motion.h1 className="text-4xl md:text-5xl font-bold leading-tight text-[var(--brand)]">
          {text.map((char, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.5 }}
            >
              {char}
            </motion.span>
          ))}
        </motion.h1>
        <p className="mt-4 text-lg max-w-prose">{personal.headline}</p>

        <div className="mt-6 text-md dark:prose-invert max-w-none text-[var(--muted)]">
          <p>
            With a solid understanding of front-end and back-end development, I am skilled in creating responsive UIs, developing efficient APIs, and optimizing database performance. I excel in collaborating with cross-functional teams and thrive in fast-paced environments. Constantly up-to-date with emerging technologies, I am passionate about delivering high-quality code and exceeding project expectations.
          </p>
          <p>
            I enjoy shipping scalable and meaningful features and improving UX.
          </p>
        </div>

        <div className="mt-6 flex flex-wrap gap-3 max-lg:justify-center">
          <a
            href="#skills"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-white font-semibold shadow-lg transition-all duration-300 hover:scale-105 shadow-[0_10px_20px_-6px_color-mix(in_srgb,var(--brand)_35%,transparent)] hover:shadow-[0_14px_28px_-8px_color-mix(in_srgb,var(--brand)_50%,transparent)]"
            onClick={(e) => onNavClick(e, "#skills")}
          >
            Checkout Skills
          </a>
          <Link
            to="/resume"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border !border-[var(--border)] dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20 hover:-translate-y-0.5"
          >
            See Resume
          </Link>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white border !border-[var(--border)] dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 font-medium transition-all duration-300 hover:bg-gray-50 dark:hover:bg-white/10 hover:border-gray-400 dark:hover:border-white/20 hover:-translate-y-0.5"
            onClick={(e) => onNavClick(e, "#contact")}
          >
            Get in touch
          </a>
        </div>
      </motion.div>

      <motion.aside
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15 }}
        className="p-8 rounded-3xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-[var(--border)] dark:border-white/10 shadow-sm order-1 lg:order-2 max-lg:mx-auto max-lg:max-w-md w-full"
      >
        <div className="flex flex-col items-center text-center gap-4">
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 rounded-full p-1 bg-gradient-to-br from-[var(--brand)] via-[var(--accent)] to-[var(--brand)] shadow-2xl shadow-[0_12px_40px_-12px_color-mix(in_srgb,var(--brand)_25%,transparent)]">
              <div className="w-full h-full rounded-full bg-[var(--surface)] p-1 overflow-hidden flex items-center justify-center">
                {personal.avatar ? (
                  <img
                    className="w-full h-full object-cover rounded-full"
                    src={personal.avatar}
                    alt="profile"
                  />
                ) : (
                  <span className="text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]">
                    {personal.name?.split(" ")[0]?.[0]}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
          <div className="font-semibold">{personal.name}</div>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {personal.title}
          </div>
          <div className="mt-3 flex gap-5 text-[var(--muted)]">
            {personal?.contact?.socials?.map((social, index) => {
              type BrandIcon = React.ComponentType<{
                className?: string;
                size?: number;
              }>;
              const Icon =
                (SiIcons[social.icon as keyof typeof SiIcons] as BrandIcon) ||
                (VscIcons[social.icon as keyof typeof VscIcons] as BrandIcon) ||
                (Fa6Icons[social.icon as keyof typeof Fa6Icons] as BrandIcon);
              return (
                <a
                  key={social.label + index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                >
                  {Icon ? (
                    <Icon
                      className="hover:text-[var(--brand)]"
                      size={social?.size ?? 16}
                    />
                  ) : (
                    <span>{social.label}</span>
                  )}
                </a>
              );
            })}
          </div>
        </div>
      </motion.aside>
    </>
  );
};
