import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import type { SkillGroup } from "../types/portfolio";
import * as SiIcons from "react-icons/si";
import * as VscIcons from "react-icons/vsc";
import { SkillCircle } from "./SkillCircle";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";

export const SkillsList: React.FC<{
  skills?: SkillGroup[];
  isBar?: boolean;
}> = ({ skills = [], isBar = true }) => {
  const groupTitles = useMemo(
    () => skills.map((g) => g.title ?? "Other"),
    [skills]
  );

  const [selectedTitles, setSelectedTitles] = useState<(string)[]>([
    "all",
  ]);
  const [expanded, setExpanded] = useState(false);

  const contentRef = useRef<HTMLDivElement | null>(null);

  const toggleTitle = (title: string) => {
    if (title === "all") {
      setSelectedTitles(["all"]);
      return;
    }
    setSelectedTitles((prev) => {
      const withoutAll = prev.filter((t) => t !== "all");
      if (withoutAll.includes(title)) {
        const next = withoutAll.filter((t) => t !== title);
        return next.length === 0 ? ["all"] : next;
      }
      return [...withoutAll, title];
    });
  };

  const filteredGroups = useMemo(() => {
    if (selectedTitles.includes("all")) return skills;
    return skills.filter((g) => selectedTitles.includes(g.title ?? "Other"));
  }, [skills, selectedTitles]);

  const getCount = (title: string) => {
    if (title === "all") return skills.flatMap((g) => g.skills ?? []).length;
    const found = skills.find((g) => g.title === title);
    return found ? (found.skills ?? []).length : 0;
  };

  // collapse sizing
  const rowHeight = 140;
  const maxRowsCollapsed = 2.7;
  const collapsedPx = rowHeight * maxRowsCollapsed;
  const maxHeight = `${collapsedPx}px`;
  const totalSkillCount = skills.flatMap((g) => g.skills ?? []).length;

  const [hasOverflow, setHasOverflow] = useState(false);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) {
      setHasOverflow(false);
      return;
    }
    const check = () => {
      setHasOverflow(el.scrollHeight > collapsedPx);
    };
    check();
    const ro = new ResizeObserver(() => check());
    ro.observe(el);
    const onResize = () => check();
    window.addEventListener("resize", onResize);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", onResize);
    };
  }, [filteredGroups, collapsedPx, selectedTitles, totalSkillCount, expanded]);

  useEffect(() => setExpanded(false), [selectedTitles]);

  // If no overflow, collapsedHeightTarget is "auto" (so no empty space).
  const collapsedHeightTarget = hasOverflow ? maxHeight : "auto";

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => toggleTitle("all")}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              toggleTitle("all");
            }
          }}
          aria-pressed={selectedTitles.includes("all")}
          className={`px-3 py-1 rounded-full text-sm border transition select-none ${selectedTitles.includes("all")
            ? "bg-[var(--brand)] text-white border-[var(--brand)]"
            : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--border)]/30"
            }`}
        >
          All ({getCount("all")})
        </button>

        {groupTitles.map((t) => {
          const active = selectedTitles.includes(t);
          return (
            <button
              key={t}
              onClick={() => toggleTitle(t)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  toggleTitle(t);
                }
              }}
              aria-pressed={active}
              className={`px-3 py-1 rounded-full text-sm border transition select-none ${active
                ? "bg-[var(--brand)] text-white border-[var(--brand)]"
                : "bg-[var(--surface)] text-[var(--text)] border-[var(--border)] hover:bg-[var(--border)]/30"
                }`}
            >
              {t} ({getCount(t)})
            </button>
          );
        })}
      </div>

      {/* key change: only force the collapsed maxHeight when hasOverflow === true.
          Otherwise use "auto" to avoid empty space. */}
      <motion.div
        animate={{ height: expanded ? "auto" : collapsedHeightTarget }}
        transition={{ duration: 0.45 }}
        className="overflow-hidden"
      >
        <motion.div
          key={selectedTitles.join("-")}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
          className="space-y-6"
          ref={contentRef}
        >
          {filteredGroups.map((group) => {
            const groupTitle = group.title ?? "Other";
            const groupSkills = group.skills ?? [];
            return (
              <section
                key={groupTitle}
                aria-labelledby={`skills-${groupTitle}`}
                className=""
              >
                <h3
                  id={`skills-${groupTitle}`}
                  className="text-sm font-bold uppercase tracking-wider text-[var(--brand)] mb-4 ml-1 opacity-80"
                >
                  {groupTitle}
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
                  {groupSkills.map((s) => {
                    const Icon =
                      (SiIcons[s.icon as keyof typeof SiIcons] as React.ElementType) ||
                      (VscIcons[s.icon as keyof typeof VscIcons] as React.ElementType);
                    return (
                      <motion.div
                        key={s.name}
                        whileHover={{ y: -8, scale: 1.02 }}
                        className="group relative p-5 rounded-2xl bg-white border !border-[var(--border)] dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
                      >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex flex-col">
                              <div className="font-semibold text-[var(--text)] text-base group-hover:text-[var(--brand)] transition-colors">
                                {s.name}
                              </div>
                              <div className="text-xs text-[var(--muted)] mt-1 font-medium">
                                {s.years
                                  ? `${s.years} yr${s.years > 1 ? "s" : ""}`
                                  : null}
                              </div>
                            </div>

                            {Icon && (
                              <div className="p-2 rounded-lg bg-[var(--surface)] text-[var(--muted)] group-hover:text-[var(--brand)] group-hover:bg-white transition-colors shadow-sm flex-shrink-0">
                                <Icon className="w-6 h-6" />
                              </div>
                            )}
                          </div>

                          {s.note && (
                            <div className="text-xs text-[var(--muted)]/80 italic line-clamp-2">
                              {s.note}
                            </div>
                          )}

                          {s.level != null && isBar && (
                            <div className="w-full bg-[var(--border)]/30 h-1.5 rounded-full overflow-hidden mt-auto">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${s.level}%` }}
                                transition={{ duration: 1.2, ease: "easeOut" }}
                                className="h-full rounded-full relative"
                                style={{
                                  background:
                                    "linear-gradient(90deg, var(--brand), var(--accent))",
                                }}
                              >
                                {/* Shimmer effect */}
                                <div className="absolute inset-0 bg-white/30 w-full translate-x-[-100%] animate-[shimmer_2s_infinite]" />
                              </motion.div>
                            </div>
                          )}

                          {s.level != null && !isBar && (
                            <div className="mx-auto w-24 h-24 sm:w-28 sm:h-28 mt-2">
                              <SkillCircle level={s.level} />
                            </div>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </motion.div>
      </motion.div>

      {/* show expand control only when content actually overflows or when expanded */}
      {(hasOverflow || expanded) && (
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setExpanded((prev) => !prev)}
            className="flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer border border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--border)]/30 text-[var(--text)] transition"
            aria-expanded={expanded}
          >
            {expanded ? <FaChevronUp size={16} /> : <FaChevronDown size={16} />}
            <span className="text-sm">
              {expanded ? "Show less" : "Show more"}
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default SkillsList;
