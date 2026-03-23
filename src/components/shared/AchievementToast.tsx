import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trophy, X } from "lucide-react";

type Props = {
  message: string | null;
  onDismiss: () => void;
};

export const AchievementToast: React.FC<Props> = ({ message, onDismiss }) => {
  useEffect(() => {
    if (!message) return;
    const t = window.setTimeout(onDismiss, 4200);
    return () => window.clearTimeout(t);
  }, [message, onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[200] flex justify-center px-4 sm:px-6">
      <AnimatePresence>
        {message && (
          <motion.div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="pointer-events-auto flex max-w-md items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)]/95 px-4 py-3 text-sm text-[var(--text)] shadow-2xl backdrop-blur-md ring-1 ring-[var(--border)]/40"
          >
            <div
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[var(--brand)]/15 text-[var(--brand)]"
              aria-hidden
            >
              <Trophy size={18} strokeWidth={2.25} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Achievement unlocked
              </p>
              <p className="font-semibold leading-snug">{message}</p>
            </div>
            <button
              type="button"
              onClick={onDismiss}
              className="shrink-0 rounded-lg p-1.5 text-[var(--muted)] transition-colors hover:bg-[var(--border)]/40 hover:text-[var(--text)]"
              aria-label="Dismiss notification"
            >
              <X size={18} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
