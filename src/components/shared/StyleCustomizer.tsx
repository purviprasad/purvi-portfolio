import React from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { Palette, X, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const StyleCustomizer: React.FC = () => {
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
        onClick={() => setIsOpen(true)}
        className="fixed bottom-[10.5rem] right-6 z-50 w-14 h-14 rounded-2xl bg-[var(--surface)] border border-[var(--border)] text-[var(--muted)] shadow-xl hover:text-[var(--brand)] hover:shadow-[0_8px_32px_var(--brand)] transition-all flex items-center justify-center opacity-80 hover:opacity-100"
      >
        <Palette size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: 300 }}
            animate={{ x: 0 }}
            exit={{ x: 300 }}
            className="fixed top-20 right-6 z-50 w-64 p-6 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl backdrop-blur-md"
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold">UI Customizer</h3>
              <button onClick={() => setIsOpen(false)}><X size={18} /></button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-[var(--muted)] block mb-3 uppercase tracking-wider">Accent Color</label>
                <div className="grid grid-cols-3 gap-3">
                  {colors.map(c => (
                    <button
                      key={c.name}
                      onClick={() => updateBrandColor(c.value)}
                      className="w-full h-10 rounded-lg border border-[var(--border)] transition-transform hover:scale-110 active:scale-95 shadow-sm"
                      style={{ backgroundColor: c.value }}
                      title={c.name}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={resetStyles}
                className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-[var(--bg)] border border-[var(--border)] text-sm font-medium hover:bg-[var(--surface)] transition-colors"
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
