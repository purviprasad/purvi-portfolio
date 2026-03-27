import React, { useMemo } from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { motion } from "framer-motion";
import { PORTFOLIO_INFO } from "../config/portfolioData";
import { SiNodedotjs, SiReact, SiTypescript } from "react-icons/si";
import { Sparkles, Database, Layout, Terminal } from "lucide-react";
import type { Skill } from "../types/portfolio";
import { getIconByName } from "../utils/iconRegistry";

function SkillGlyph({
  icon,
  size = 12,
  className,
}: {
  icon?: string;
  size?: number;
  className?: string;
}) {
  const Cmp = getIconByName(icon);
  if (!Cmp) return null;
  return <Cmp size={size} className={className} />;
}

export const BentoSkills: React.FC = () => {
  const { userRole } = usePortfolio();
  const allSkills = PORTFOLIO_INFO.skills?.flatMap((g) => g.skills) || [];

  const { toolkitPreview, toolkitMoreCount, pgSkill, tsSkill } = useMemo(() => {
    const featuredNames =
      userRole === "developer"
        ? ["TypeScript", "Node.js", "React", "PostgreSQL"]
        : ["React", "Redux", "Node.js", "PostgreSQL"];
    const featuredSet = new Set(featuredNames);
    const toolkit = allSkills.filter((s) => !featuredSet.has(s.name));
    const preview = toolkit.slice(0, 15);
    const more = Math.max(0, toolkit.length - preview.length);
    const byName = (n: string) => allSkills.find((s) => s.name === n);
    return {
      toolkitPreview: preview,
      toolkitMoreCount: more,
      pgSkill: byName("PostgreSQL"),
      tsSkill: byName("TypeScript"),
    };
  }, [allSkills, userRole]);

  return (
    <div className="bento-grid">
      {/* Dynamic Main Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 row-span-1 md:col-span-2 md:row-span-2 bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_12%,transparent)] to-transparent flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-2xl bg-[color-mix(in_srgb,var(--accent)_18%,transparent)] text-[var(--accent)]">
            <SiReact size={32} />
          </div>
          <Sparkles className="text-[var(--accent)] animate-pulse" size={20} />
        </div>
        <div>
          <h3 className="text-xl font-bold mt-4 text-[var(--text)]">
            {userRole === 'recruiter' ? 'Enterprise Engineering' : 'Full-Stack Architecture'}
          </h3>
          <p className="text-sm leading-relaxed text-[var(--text)]/82 mt-2">
            {userRole === "recruiter"
              ? "Production-grade web apps for Apple and Verizon: React frontends, Node/Express services, PostgreSQL, and clear ownership from design through release."
              : "End-to-end TypeScript-aware React apps, Node.js and Express APIs, PostgreSQL-backed services, and patterns that stay maintainable as teams grow."}
          </p>
        </div>
      </motion.div>

      {/* Role-Specific Secondary Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 md:col-span-2 bg-gradient-to-br from-[color-mix(in_srgb,var(--brand)_12%,transparent)] to-transparent"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-[color-mix(in_srgb,var(--brand)_18%,transparent)] text-[var(--brand)]">
            {userRole === 'recruiter' ? <SiNodedotjs size={24} /> : <Database size={24} />}
          </div>
          <h3 className="text-xl font-bold text-[var(--text)]">
            {userRole === 'recruiter' ? 'Production Impact' : 'Data Modeling'}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-[var(--text)]/82 mt-2">
          {userRole === "recruiter"
            ? "Re-architected data-generation pipelines (including Go → Node with delta filtering) for leaner memory use and more reliable runs—plus schema and query work in PostgreSQL."
            : "PostgreSQL for relational modeling, indexing, and performance tuning alongside Node services and migrations across MySQL and MongoDB where projects need them."}
        </p>
      </motion.div>

      {/* Database card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 border-dashed"
      >
        <Database className="text-[var(--brand)] mb-2" size={20} />
        <span className="text-base font-bold block text-[var(--text)]">PostgreSQL</span>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
          <div
            className="bg-[var(--brand)] h-full transition-[width] duration-700"
            style={{ width: `${pgSkill?.level ?? 90}%` }}
          />
        </div>
        {pgSkill?.note && (
          <p className="text-sm leading-relaxed text-[var(--text)]/78 mt-2">{pgSkill.note}</p>
        )}
      </motion.div>

      {/* TypeScript card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1"
      >
        <SiTypescript className="text-[var(--accent)] mb-2" size={20} />
        <span className="text-base font-bold block text-[var(--text)]">TypeScript</span>
        <p className="text-sm leading-relaxed text-[var(--text)]/78 mt-1">
          {tsSkill?.note ?? "Typed React and Node surfaces in production."}
        </p>
        {tsSkill?.level != null && (
          <div className="mt-2 w-full bg-gray-200 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
            <div
              className="bg-[var(--accent)] h-full transition-[width] duration-700"
              style={{ width: `${tsSkill.level}%` }}
            />
          </div>
        )}
      </motion.div>

      {/* Tech Stack Horizontal Scroll/Marquee feel */}
      <div className="bento-item col-span-1 md:col-span-4 py-4">
        <h4 className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text)]/72 mb-2">
          Also in the toolkit
        </h4>
        <p className="text-sm leading-relaxed text-[var(--text)]/80 mb-3 max-w-3xl">
          Express APIs, Redux / RTK, micro frontends (Module Federation), observability (Splunk), and CI with
          Jenkins—aligned with what ships in client engagements and personal products.
        </p>
        <div className="flex flex-wrap gap-2">
          {toolkitPreview.map((s: Skill) => (
            <span
              key={s.name}
              className="px-2 py-1 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-xs font-medium text-[var(--text)]/88 flex items-center gap-1"
            >
              <SkillGlyph icon={s.icon} size={12} className="text-[var(--accent)]" />
              {s.name}
            </span>
          ))}
          {toolkitMoreCount > 0 && (
            <span className="text-xs text-[var(--brand)] font-semibold self-center">
              +{toolkitMoreCount} more
            </span>
          )}
        </div>
      </div>

      {/* UI/UX card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 md:col-span-2 bg-gradient-to-tr from-[color-mix(in_srgb,var(--accent)_12%,transparent)] to-transparent"
      >
        <Layout className="text-[var(--accent)] mb-2" size={24} />
        <h3 className="text-xl font-bold text-[var(--text)]">Modern UI/UX</h3>
        <p className="text-sm leading-relaxed text-[var(--text)]/82 mt-1">
          Ant Design and Material UI in enterprise UIs; Tailwind and Framer Motion for fast, polished product
          surfaces—plus Redux Toolkit where global client state matters.
        </p>
      </motion.div>

      {/* Terminal card */}
      <motion.div
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 md:col-span-2 bg-gradient-to-br from-[color-mix(in_srgb,var(--accent)_12%,transparent)] to-transparent"
      >
        <Terminal className="text-[var(--accent)] mb-2" size={20} />
        <h3 className="text-xl font-bold tracking-tight text-[var(--text)]">Delivery &amp; quality</h3>
        <p className="text-sm mt-1 leading-relaxed text-[var(--text)]/82">
          Git/GitHub, Postman for APIs, Jenkins pipelines, Splunk for ops visibility—comfortable on the terminal
          day to day.
        </p>
      </motion.div>
    </div>
  );
};
