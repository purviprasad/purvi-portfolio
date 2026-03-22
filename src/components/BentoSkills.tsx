import React from "react";
import { usePortfolio } from "../context/PortfolioContext";
import { motion } from "framer-motion";
import { PORTFOLIO_INFO } from "../config/portfolioData";
import * as SiIcons from "react-icons/si";
import { Sparkles, Code2, Database, Layout, Terminal } from "lucide-react";

export const BentoSkills: React.FC = () => {
  const { userRole } = usePortfolio();
  const allSkills = PORTFOLIO_INFO.skills?.flatMap(g => g.skills) || [];
  
  // Highlight different skills based on role
  const featured = userRole === 'developer' 
    ? ["TypeScript", "Node.js", "React", "PostgreSQL"]
    : ["React", "Experience", "Production", "Node.js"];

  return (
    <div className="bento-grid">
      {/* Dynamic Main Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 row-span-1 md:col-span-2 md:row-span-2 bg-gradient-to-br from-blue-500/10 to-transparent flex flex-col justify-between"
      >
        <div className="flex justify-between items-start">
          <div className="p-3 rounded-2xl bg-blue-500/20 text-blue-500">
            <SiIcons.SiReact size={32} />
          </div>
          <Sparkles className="text-blue-400 animate-pulse" size={20} />
        </div>
        <div>
          <h3 className="text-lg sm:text-xl font-bold mt-4 text-[var(--text)]">
            {userRole === 'recruiter' ? 'Enterprise Engineering' : 'Full-Stack Architecture'}
          </h3>
          <p className="text-sm text-[var(--muted)] mt-2">
            {userRole === 'recruiter' 
              ? 'Proven track record of delivering production-ready applications for clients like Apple and Verizon.' 
              : 'Specializing in type-safe React patterns and scalable Node.js microservices.'}
          </p>
        </div>
      </motion.div>

      {/* Role-Specific Secondary Card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 md:col-span-2 bg-gradient-to-br from-green-500/10 to-transparent"
      >
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-green-500/20 text-green-500">
            {userRole === 'recruiter' ? <SiIcons.SiNodedotjs size={24} /> : <Database size={24} />}
          </div>
          <h3 className="font-bold text-[var(--text)]">
            {userRole === 'recruiter' ? 'Production Impact' : 'Data Modeling'}
          </h3>
        </div>
        <p className="text-xs text-[var(--muted)] mt-2">
          {userRole === 'recruiter'
            ? 'Optimized data pipelines reducing memory usage by 80% and improving reliability.'
            : 'Expertise in PostgreSQL optimization and designing complex schema architectures.'}
        </p>
      </motion.div>

      {/* Database card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 bg-[var(--surface)] border-dashed"
      >
        <Database className="text-[var(--brand)] mb-2" size={20} />
        <span className="text-xs font-bold block">PostgreSQL</span>
        <div className="mt-2 w-full bg-gray-200 dark:bg-gray-800 h-1 rounded-full overflow-hidden">
          <div className="bg-[var(--brand)] h-full w-[90%]" />
        </div>
      </motion.div>

      {/* TypeScript card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 bg-[var(--surface)]"
      >
        <SiIcons.SiTypescript className="text-blue-600 mb-2" size={20} />
        <span className="text-xs font-bold block">TypeScript</span>
        <p className="text-[10px] text-[var(--muted)] mt-1">Type-safe development expert.</p>
      </motion.div>

      {/* Tech Stack Horizontal Scroll/Marquee feel */}
      <div className="bento-item col-span-1 md:col-span-4 py-4">
        <h4 className="text-[10px] uppercase tracking-widest text-[var(--muted)] mb-3">The Rest of my Toolkit</h4>
        <div className="flex flex-wrap gap-2">
          {allSkills.filter(s => !featured.includes(s.name)).slice(0, 15).map((s, i) => (
            <span key={i} className="px-2 py-1 rounded-lg bg-[var(--bg)] border border-[var(--border)] text-[10px] flex items-center gap-1">
              {(SiIcons as any)[s.icon] && React.createElement((SiIcons as any)[s.icon], { size: 12 })}
              {s.name}
            </span>
          ))}
          <span className="text-[10px] text-[var(--brand)] font-bold">+ {allSkills.length - 19} more</span>
        </div>
      </div>

      {/* UI/UX card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 md:col-span-2 bg-gradient-to-tr from-[color-mix(in_srgb,var(--accent)_12%,transparent)] to-transparent"
      >
        <Layout className="text-[var(--accent)] mb-2" size={24} />
        <h3 className="font-bold text-[var(--text)]">Modern UI/UX</h3>
        <p className="text-xs text-[var(--muted)] mt-1">Tailwind CSS, Framer Motion, and Ant Design for premium user experiences.</p>
      </motion.div>

      {/* Terminal card */}
      <motion.div 
        whileHover={{ y: -5 }}
        className="bento-item col-span-1 md:col-span-2 bg-zinc-900 border-zinc-800 text-zinc-100 dark:border-zinc-700"
      >
        <Terminal className="text-emerald-500 mb-2" size={20} />
        <h3 className="text-sm font-mono tracking-tight">CLI Driven</h3>
        <p className="text-[10px] opacity-60 font-mono mt-1">$ npm install --premium-portfolio</p>
      </motion.div>
    </div>
  );
};
