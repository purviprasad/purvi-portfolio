import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { ExperienceItem } from "../config/experienceData";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

type Props = {
    items: ExperienceItem[];
};

const ExperienceCard: React.FC<{ item: ExperienceItem; isLeft: boolean }> = ({ item, isLeft }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className={`relative grid grid-cols-1 md:grid-cols-2 gap-8`}>
            {/* Timeline dot with glowing effect */}
            <span className="absolute left-4 top-6 h-4 w-4 rounded-full bg-[var(--brand)] shadow-[0_0_15px_var(--brand)] -translate-x-1/2 md:left-1/2 z-10" />

            {/* Card - Adaptive Glass/Solid */}
            <div
                onClick={() => setIsExpanded(!isExpanded)}
                className={`ml-12 mr-4 md:mx-0 p-6 rounded-2xl bg-white border !border-[var(--border)] dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 group cursor-pointer relative overflow-hidden w-auto md:w-full
          ${isLeft ? "md:col-start-1 md:text-right md:mr-8" : "md:col-start-2 md:ml-8"}
        `}
            >
                {/* Expand Indicator */}
                <div className={`absolute top-4 ${isLeft ? "left-4" : "right-4"} text-[var(--muted)] opacity-40 group-hover:opacity-100 transition-opacity`}>
                    {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                <div className="text-sm font-medium text-[var(--brand)] uppercase tracking-wide mb-2 opacity-80">
                    {item.period}
                </div>

                <h3 className="text-xl font-bold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors">
                    {item.role}
                </h3>

                <div className="text-sm font-medium text-[var(--muted)] mt-1">
                    {item.company}
                    {item.location && <span className="opacity-75"> • {item.location}</span>}
                </div>

                <AnimatePresence>
                    {isExpanded && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            className="overflow-hidden"
                        >
                            <ul className={`mt-4 space-y-2 text-sm text-[var(--text)]/80 leading-relaxed ${isLeft ? "md:ml-auto text-right" : "text-left"}`}>
                                {item.description.map((point, i) => (
                                    <li key={i} className={`flex gap-2 ${isLeft ? "flex-row-reverse" : "flex-row"}`}>
                                        <span className="opacity-50 flex-shrink-0">•</span>
                                        <span>{point}</span>
                                    </li>
                                ))}
                            </ul>

                            {item.tech && (
                                <div className={`mt-5 flex flex-wrap gap-2 ${isLeft ? "md:justify-end" : ""}`}>
                                    {item.tech.map(t => (
                                        <span
                                            key={t}
                                            className="text-xs font-medium px-2.5 py-1 rounded-md bg-[var(--brand)]/10 text-[var(--brand)] border border-[var(--brand)]/20"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {!isExpanded && (
                    <div className={`mt-2 text-xs font-semibold text-[var(--brand)] opacity-60 flex items-center gap-1 ${isLeft ? "justify-end" : "justify-start"}`}>
                        Click to see more
                    </div>
                )}
            </div>
        </div>
    );
};

export const ExperienceTimeline: React.FC<Props> = ({ items }) => {
    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)] md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-10">
                {items.map((item, index) => (
                    <ExperienceCard key={index} item={item} isLeft={index % 2 === 0} />
                ))}
            </div>
        </div>
    );
};
