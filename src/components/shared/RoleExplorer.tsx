import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Briefcase, Code, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RoleExplorer: React.FC = () => {
  const { userRole, setUserRole, unlockAchievement, isRetro } = usePortfolio();

  const roles = [
    { id: "guest", label: "Guest", icon: User, color: "text-blue-500", desc: "Balanced Overview" },
    { id: "recruiter", label: "Recruiter", icon: Briefcase, color: "text-emerald-500", desc: "Experience & Metrics" },
    { id: "developer", label: "Developer", icon: Code, color: "text-[var(--accent)]", desc: "Source Code & Stack" },
  ] as const;

  const handleRoleChange = (role: typeof roles[number]["id"]) => {
    setUserRole(role);
    if (role === 'recruiter') unlockAchievement('recruiter-mode', 'Professional Focus');
    if (role === 'developer') unlockAchievement('dev-mode', 'Deep Dive Mode');
  };

  return (
    <div className="flex flex-col items-center gap-3 mb-8 w-full max-w-2xl min-w-0 px-4 sm:px-6">
      <div className="w-full max-w-xl flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
        <div className="flex items-center justify-center sm:justify-start gap-2 shrink-0">
          <h3 className="text-[9px] font-black uppercase tracking-[0.18em] text-[var(--brand)]/80 leading-none">
            Personalize
          </h3>
          <span className="hidden sm:inline h-px w-6 bg-[var(--brand)]/40 rounded-full" aria-hidden />
        </div>

        <div
          className={`min-w-0 flex-1 p-1 grid grid-cols-3 gap-0.5 sm:gap-1 transition-all duration-500 shadow-lg overflow-hidden ${isRetro
            ? "bg-[var(--bg)] border-2 border-[var(--brand)] rounded-none shadow-[0_0_16px_var(--brand)]"
            : "bg-[var(--surface)] border border-[var(--border)] rounded-full ring-1 ring-black/5 dark:ring-white/5"
            }`}
        >
          {roles.map((r) => {
            const Icon = r.icon;
            const active = userRole === r.id;
            return (
              <button
                key={r.id}
                onClick={() => handleRoleChange(r.id)}
                className={`relative group flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1.5 py-2 sm:px-3 sm:py-2.5 transition-all duration-500 overflow-hidden ${isRetro ? "rounded-none" : "rounded-full"
                  } ${active
                    ? `${isRetro ? 'bg-[var(--brand)] text-[var(--bg)] scale-105 shadow-[0_0_16px_var(--brand)] z-10' : 'bg-[var(--bg)] text-[var(--brand)] shadow-md scale-[1.02] ring-1 ring-black/5 dark:ring-white/10 z-10'}`
                    : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
              >
                <div className={`transition-all duration-300 ${active ? 'scale-110' : 'opacity-40 grayscale group-hover:grayscale-0 group-hover:opacity-80 group-hover:scale-110'}`}>
                  <Icon size={18} className={active ? r.color : ""} />
                </div>
                <span className={`text-[10px] sm:text-xs font-black transition-all text-center leading-tight ${active ? 'opacity-100' : 'opacity-60'}`}>
                  {r.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={userRole}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98 }}
          className="text-center"
        >
          <p
            className={`text-xs sm:text-sm font-bold uppercase tracking-wide text-[var(--muted)] transition-colors ${isRetro ? 'glitch-text text-[var(--text)]' : ''}`}
            data-text={roles.find((r) => r.id === userRole)?.desc}
          >
            {roles.find((r) => r.id === userRole)?.desc}
          </p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
