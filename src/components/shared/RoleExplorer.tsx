import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Briefcase, Code, User, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const RoleExplorer: React.FC = () => {
  const { userRole, setUserRole, unlockAchievement } = usePortfolio();

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
    <div className="flex flex-col items-center gap-6 mb-16 relative">
      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-[var(--brand)]/10 text-[var(--brand)] text-[10px] uppercase font-black tracking-widest px-3 py-1 rounded-full border border-[var(--brand)]/20 shadow-sm transition-all duration-300">
        Personalize Portfolio
      </div>
      
      <div className="flex p-2 bg-[var(--surface)]/40 border border-[var(--border)] rounded-2xl shadow-xl backdrop-blur-xl transition-all duration-500 hover:shadow-2xl hover:border-[var(--brand)]/30 group">
        {roles.map((r) => {
          const Icon = r.icon;
          const active = userRole === r.id;
          return (
            <button
              key={r.id}
              onClick={() => handleRoleChange(r.id)}
              className={`relative flex flex-col items-center gap-1.5 px-6 py-3 rounded-xl transition-all duration-500 overflow-hidden ${
                active 
                  ? "bg-white dark:bg-zinc-800 text-[var(--brand)] shadow-lg -translate-y-1 ring-1 ring-[var(--brand)]/20" 
                  : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--bg)]/50"
              }`}
            >
              <motion.div
                animate={active ? { scale: 1.2, rotate: [0, -10, 10, 0] } : { scale: 1, rotate: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Icon size={20} className={active ? r.color : ""} />
              </motion.div>
              <span className="text-sm font-bold tracking-tight">{r.label}</span>
              
              {active && (
                <motion.div 
                  layoutId="active-shadow"
                  className="absolute inset-0 bg-gradient-to-t from-[var(--brand)]/5 to-transparent pointer-events-none" 
                />
              )}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={userRole}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          className="text-center"
        >
          <p className="text-xs font-medium text-[var(--text)] opacity-90 transition-colors">
            {roles.find(r => r.id === userRole)?.desc}
          </p>
          <motion.div 
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 48, opacity: 1 }}
            transition={{ duration: 0.8, ease: "circOut" }}
            className="mt-2 h-0.5 bg-gradient-to-r from-transparent via-[var(--brand)] to-transparent mx-auto relative overflow-visible"
          >
            <motion.div 
              animate={{ opacity: [0.4, 0.8, 0.4], scaleX: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              className="absolute inset-0 bg-[var(--brand)] blur-[4px]"
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
