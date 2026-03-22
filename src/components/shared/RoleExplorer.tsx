import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Briefcase, Code, User, ChevronRight, Binary } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RoleExplorer: React.FC = () => {
  const { userRole, setUserRole, unlockAchievement, isRetro } = usePortfolio();

  const roles = [
    { id: "guest", label: "Guest", icon: User, color: "text-blue-500", desc: "Balanced Overview" },
    { id: "recruiter", label: "Recruiter", icon: Briefcase, color: "text-emerald-500", desc: "Experience & Metrics" },
    { id: "developer", label: "Developer", icon: Code, color: "text-purple-500", desc: "Source Code & Stack" },
  ] as const;

  const handleRoleChange = (role: typeof roles[number]["id"]) => {
    setUserRole(role);
    if (role === 'recruiter') unlockAchievement('recruiter-mode', 'Professional Focus');
    if (role === 'developer') unlockAchievement('dev-mode', 'Deep Dive Mode');
  };

  return (
    <div className="flex flex-col items-center gap-8 mb-16 w-full max-w-2xl px-4">
      <div className="flex flex-col items-center gap-2">
        <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--brand)] opacity-80">
          Personalize Experience
        </h3>
        <div className="h-0.5 w-6 bg-[var(--brand)] rounded-full mb-4" />
      </div>

      <div className={`w-full p-2 grid grid-cols-3 gap-2 transition-all duration-500 shadow-2xl overflow-hidden ${isRetro
        ? "bg-[var(--bg)] border-2 border-[var(--brand)] rounded-none shadow-[0_0_20px_var(--brand)]"
        : "bg-[var(--surface)] border-[var(--border)] rounded-full ring-1 ring-black/5 dark:ring-white/5"
        }`}>
        {roles.map((r) => {
          const Icon = r.icon;
          const active = userRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              className={`relative group flex items-center justify-center gap-3 px-4 py-4 transition-all duration-500 overflow-hidden ${isRetro ? "rounded-none" : "rounded-full"
                } ${active
                  ? `${isRetro ? 'bg-[var(--brand)] text-[var(--bg)] scale-105 shadow-[0_0_20px_var(--brand)] z-10' : 'bg-[var(--bg)] text-[var(--brand)] shadow-lg scale-[1.02] ring-1 ring-black/5 dark:ring-white/10 z-10'}`
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5"
                }`}
            >
              <div className={`transition-all duration-300 ${active ? 'scale-110' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-110'}`}>
                <Icon size={20} className={active ? r.color : ""} />
              </div>
              <span className={`text-sm font-black transition-all ${active ? 'opacity-100' : 'opacity-60'}`}>
                {r.label}
              </span>
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={userRole}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="text-center mt-2"
        >
          <p className={`text-sm md:text-lg font-black uppercase tracking-widest text-[var(--text)] transition-colors ${isRetro ? 'glitch-text' : ''}`} data-text={roles.find(r => r.id === userRole)?.desc}>
            {roles.find(r => r.id === userRole)?.desc}
          </p>
          <div className="mt-3 h-1.5 w-24 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent mx-auto rounded-full opacity-60" />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
