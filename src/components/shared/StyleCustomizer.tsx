import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Palette, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const StyleCustomizer: React.FC = () => {
  const { isRetro } = usePortfolio();
  const [isOpen, setIsOpen] = React.useState(false);
  
  const colors = [
    { name: "Indigo", value: "#6366f1" },
    { name: "Pink", value: "#ec4899" },
    { name: "Emerald", value: "#10b981" },
    { name: "Orange", value: "#f59e0b" },
    { name: "Sky", value: "#0ea5e9" },
    { name: "Rose", value: "#f43f5e" },
  ];

  const updateBrandColor = (color: string) => {
    document.documentElement.style.setProperty("--brand", color);
  };

  const resetStyles = () => {
    document.documentElement.style.removeProperty("--brand");
  };

  return (
    <>
      <button 
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open UI customizer"
        className={`fixed bottom-[10.5rem] right-6 z-50 w-14 h-14 border transition-all flex items-center justify-center opacity-80 hover:opacity-100 ${
          isRetro 
            ? "rounded-none border-2 border-[var(--brand)] bg-[var(--bg)] text-[var(--brand)] shadow-[0_0_15px_var(--brand)]" 
            : "rounded-2xl bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] shadow-xl hover:text-[var(--brand)] hover:shadow-[0_8px_32px_var(--brand)]"
        }`}
      >
        <Palette size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className={`fixed top-20 right-6 z-50 w-64 p-6 bg-[var(--surface)]/95 border shadow-2xl backdrop-blur-md ${
              isRetro ? "rounded-none border-2 border-[var(--brand)] shadow-[0_0_30px_var(--brand)]" : "rounded-2xl border-[var(--border)]"
            }`}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-[var(--text)]">UI Customizer</h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/40 transition-colors"
                aria-label="Close customizer"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-[var(--muted)] block mb-3 uppercase tracking-wider">Accent Color</label>
                <div className="grid grid-cols-3 gap-3">
                  {colors.map(c => (
                    <button
                      type="button"
                      key={c.name}
                      onClick={() => updateBrandColor(c.value)}
                      className={`w-full h-10 border transition-transform hover:scale-110 active:scale-95 shadow-sm ${
                        isRetro ? "rounded-none" : "rounded-lg border-[var(--border)]"
                      }`}
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

               <button
                type="button"
                onClick={resetStyles}
                className={`w-full flex items-center justify-center gap-2 py-2 border text-sm font-medium transition-colors ${
                  isRetro 
                    ? "rounded-none border-[var(--brand)] bg-[var(--bg)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--bg)]" 
                    : "rounded-xl bg-[var(--bg)] border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)]"
                }`}
              >
                <RefreshCw size={14} /> Reset to Default
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-[var(--border)]">
              <p className="text-[10px] text-[var(--muted)] text-center">
                These changes are local to your browser session.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
