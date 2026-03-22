import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePortfolio } from "../../context/PortfolioContext";
import { useTheme } from "../../context/ThemeContext";
import { Palette, X, RefreshCw, Sun, Moon, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_BRAND = "portfolio-ui-brand";
const STORAGE_ACCENT = "portfolio-ui-accent";

const BRAND_PRESETS = [
  { name: "Indigo", value: "#6366f1" },
  { name: "Pink", value: "#ec4899" },
  { name: "Emerald", value: "#10b981" },
  { name: "Orange", value: "#f59e0b" },
  { name: "Sky", value: "#0ea5e9" },
  { name: "Rose", value: "#f43f5e" },
] as const;

const ACCENT_PRESETS = [
  { name: "Pink", value: "#ec4899" },
  { name: "Fuchsia", value: "#d946ef" },
  { name: "Violet", value: "#8b5cf6" },
  { name: "Amber", value: "#f59e0b" },
  { name: "Cyan", value: "#06b6d4" },
  { name: "Lime", value: "#84cc16" },
] as const;

function readStorageHex(key: string): string | null {
  try {
    const v = localStorage.getItem(key);
    return v && /^#[0-9a-f]{6}$/i.test(v) ? v.toLowerCase() : null;
  } catch {
    return null;
  }
}

function parseCssColorToHex(input: string): string | null {
  const s = input.trim();
  if (!s) return null;
  if (s.startsWith("#")) {
    const h = s.slice(0, 7);
    return /^#[0-9a-f]{6}$/i.test(h) ? h.toLowerCase() : null;
  }
  const rgb = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) {
    const r = Math.min(255, parseInt(rgb[1], 10));
    const g = Math.min(255, parseInt(rgb[2], 10));
    const b = Math.min(255, parseInt(rgb[3], 10));
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  }
  return null;
}

function normHex(h: string): string {
  return h.trim().toLowerCase().slice(0, 7);
}

export const StyleCustomizer: React.FC = () => {
  const { isRetro } = usePortfolio();
  const { dark, toggle: toggleTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const fabRef = useRef<HTMLButtonElement>(null);

  const [brandCustom, setBrandCustom] = useState<string | null>(() =>
    typeof window !== "undefined" ? readStorageHex(STORAGE_BRAND) : null
  );
  const [accentCustom, setAccentCustom] = useState<string | null>(() =>
    typeof window !== "undefined" ? readStorageHex(STORAGE_ACCENT) : null
  );

  const [liveBrand, setLiveBrand] = useState("#6366f1");
  const [liveAccent, setLiveAccent] = useState("#ec4899");

  const readEffectiveFromUI = useCallback(() => {
    const node = fabRef.current ?? document.documentElement;
    const b = parseCssColorToHex(getComputedStyle(node).getPropertyValue("--brand"));
    const a = parseCssColorToHex(getComputedStyle(node).getPropertyValue("--accent"));
    setLiveBrand(b ?? "#6366f1");
    setLiveAccent(a ?? "#ec4899");
  }, []);

  useLayoutEffect(() => {
    if (brandCustom) document.documentElement.style.setProperty("--brand", brandCustom);
    else document.documentElement.style.removeProperty("--brand");
  }, [brandCustom]);

  useLayoutEffect(() => {
    if (accentCustom) document.documentElement.style.setProperty("--accent", accentCustom);
    else document.documentElement.style.removeProperty("--accent");
  }, [accentCustom]);

  useEffect(() => {
    readEffectiveFromUI();
  }, [readEffectiveFromUI, dark, isRetro, brandCustom, accentCustom, isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  const persistBrand = (hex: string | null) => {
    try {
      if (hex) localStorage.setItem(STORAGE_BRAND, hex);
      else localStorage.removeItem(STORAGE_BRAND);
    } catch {
      /* ignore quota / private mode */
    }
    setBrandCustom(hex);
  };

  const persistAccent = (hex: string | null) => {
    try {
      if (hex) localStorage.setItem(STORAGE_ACCENT, hex);
      else localStorage.removeItem(STORAGE_ACCENT);
    } catch {
      /* ignore */
    }
    setAccentCustom(hex);
  };

  const resetStyles = () => {
    persistBrand(null);
    persistAccent(null);
  };

  const displayBrand = brandCustom ?? liveBrand;
  const displayAccent = accentCustom ?? liveAccent;

  const presetRing = (active: boolean) =>
    active
      ? isRetro
        ? "ring-2 ring-offset-2 ring-offset-[var(--surface)] ring-[var(--text)] scale-105"
        : "ring-2 ring-offset-2 ring-offset-[var(--surface)] ring-[var(--brand)] scale-105"
      : "ring-0";

  return (
    <>
      <button
        ref={fabRef}
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open UI customizer"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        className={`fixed bottom-[17rem] right-6 z-50 w-14 h-14 border transition-all flex items-center justify-center opacity-80 hover:opacity-100 ${
          isRetro
            ? "rounded-none border-2 border-[var(--brand)] bg-[var(--bg)] text-[var(--brand)] shadow-[0_0_15px_var(--brand)]"
            : "rounded-2xl bg-[var(--surface)] border-[var(--border)] text-[var(--muted)] shadow-xl hover:text-[var(--brand)] hover:shadow-[0_8px_32px_var(--brand)]"
        }`}
      >
        <Palette size={24} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-[90] bg-black/30 backdrop-blur-[2px]"
              aria-label="Close UI customizer"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="ui-customizer-title"
              initial={{ x: 320, opacity: 0.9 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 320, opacity: 0.9 }}
              transition={{ type: "spring", stiffness: 380, damping: 32 }}
              className={`fixed top-20 right-6 z-[91] w-[min(100vw-2rem,20rem)] p-6 bg-[var(--surface)]/95 border shadow-2xl backdrop-blur-md ${
                isRetro ? "rounded-none border-2 border-[var(--brand)] shadow-[0_0_30px_var(--brand)]" : "rounded-2xl border-[var(--border)]"
              }`}
            >
              <div className="flex justify-between items-center mb-5">
                <h3 id="ui-customizer-title" className="font-bold text-[var(--text)] flex items-center gap-2">
                  <Sparkles size={18} className="text-[var(--brand)] shrink-0" aria-hidden />
                  UI Customizer
                </h3>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--border)]/40 transition-colors"
                  aria-label="Close customizer"
                >
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-medium text-[var(--muted)] block mb-2 uppercase tracking-wider">Theme</label>
                  <button
                    type="button"
                    onClick={() => toggleTheme()}
                    className={`w-full flex items-center justify-center gap-2 py-2.5 border text-sm font-medium transition-colors ${
                      isRetro
                        ? "rounded-none border-[var(--brand)] bg-[var(--bg)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--bg)]"
                        : "rounded-xl bg-[var(--bg)] border-[var(--border)] text-[var(--text)] hover:bg-[var(--surface)]"
                    }`}
                  >
                    {dark ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
                    {dark ? "Switch to light mode" : "Switch to dark mode"}
                  </button>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--muted)] block mb-2 uppercase tracking-wider">Primary accent</label>
                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    {BRAND_PRESETS.map((c) => {
                      const active = normHex(displayBrand) === normHex(c.value);
                      return (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() => persistBrand(c.value)}
                          className={`w-full h-10 border transition-transform hover:scale-105 active:scale-95 shadow-sm ${presetRing(active)} ${
                            isRetro ? "rounded-none" : "rounded-lg border-[var(--border)]"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                          aria-label={`Primary accent ${c.name}`}
                          aria-pressed={active}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={displayBrand}
                      onChange={(e) => persistBrand(e.target.value.toLowerCase())}
                      className={`h-10 w-14 cursor-pointer border bg-transparent p-0.5 shrink-0 ${
                        isRetro ? "rounded-none border-[var(--border)]" : "rounded-lg border-[var(--border)]"
                      }`}
                      aria-label="Custom primary accent color"
                    />
                    <span className="text-xs font-mono text-[var(--muted)] truncate">{displayBrand}</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium text-[var(--muted)] block mb-2 uppercase tracking-wider">Secondary accent</label>
                  <p className="text-[10px] text-[var(--muted)] mb-2 leading-relaxed">Gradients and highlights (e.g. aurora, headings).</p>
                  <div className="grid grid-cols-3 gap-2.5 mb-3">
                    {ACCENT_PRESETS.map((c) => {
                      const active = normHex(displayAccent) === normHex(c.value);
                      return (
                        <button
                          type="button"
                          key={c.name}
                          onClick={() => persistAccent(c.value)}
                          className={`w-full h-10 border transition-transform hover:scale-105 active:scale-95 shadow-sm ${presetRing(active)} ${
                            isRetro ? "rounded-none" : "rounded-lg border-[var(--border)]"
                          }`}
                          style={{ backgroundColor: c.value }}
                          title={c.name}
                          aria-label={`Secondary accent ${c.name}`}
                          aria-pressed={active}
                        />
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={displayAccent}
                      onChange={(e) => persistAccent(e.target.value.toLowerCase())}
                      className={`h-10 w-14 cursor-pointer border bg-transparent p-0.5 shrink-0 ${
                        isRetro ? "rounded-none border-[var(--border)]" : "rounded-lg border-[var(--border)]"
                      }`}
                      aria-label="Custom secondary accent color"
                    />
                    <span className="text-xs font-mono text-[var(--muted)] truncate">{displayAccent}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={resetStyles}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 border text-sm font-medium transition-colors ${
                    isRetro
                      ? "rounded-none border-[var(--brand)] bg-[var(--bg)] text-[var(--brand)] hover:bg-[var(--brand)] hover:text-[var(--bg)]"
                      : "rounded-xl bg-[var(--bg)] border-[var(--border)] text-[var(--muted)] hover:bg-[var(--surface)]"
                  }`}
                >
                  <RefreshCw size={14} aria-hidden />
                  Reset to defaults
                </button>
              </div>

              <div className="mt-5 pt-5 border-t border-[var(--border)]">
                <p className="text-[10px] text-[var(--muted)] text-center leading-relaxed">
                  Accent colors are saved in this browser. Theme (light/dark) uses the same storage as the header toggle.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
