import React from "react";
import { motion } from "framer-motion";
import type { Award } from "../types/portfolio";
import { FaTrophy, FaMedal, FaAward } from "react-icons/fa6";

export const AwardsList: React.FC<{ awards?: Award[] }> = ({ awards = [] }) => {
    if (awards.length === 0) return null;

    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 },
    };

    const getIcon = (name: string) => {
        if (name.includes("Glory")) return <FaTrophy className="w-6 h-6" />;
        if (name.includes("Insta")) return <FaMedal className="w-6 h-6" />;
        return <FaAward className="w-6 h-6" />;
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
            {awards.map((award, index) => (
                <motion.div
                    key={index}
                    variants={item}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className="group relative p-6 rounded-2xl bg-white border border-[var(--border)] dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 overflow-hidden"
                >
                    {/* Hover Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                        <div className="flex items-start justify-between mb-4">
                            <div className="p-3 rounded-xl bg-[var(--surface)] text-[var(--brand)] group-hover:bg-[var(--brand)] group-hover:text-white transition-all duration-300 shadow-sm">
                                {getIcon(award.name)}
                            </div>
                            <span className="text-xs font-bold uppercase tracking-wider text-[var(--muted)] opacity-60">
                                {award.date}
                            </span>
                        </div>

                        <h3 className="text-lg font-bold text-[var(--text)] group-hover:text-[var(--brand)] transition-colors mb-1">
                            {award.name}
                        </h3>

                        <div className="text-sm font-medium text-[var(--text)] opacity-80 mb-1">
                            {award.issuer}
                        </div>

                        {award.associatedWith && (
                            <div className="text-xs text-[var(--muted)] flex items-center gap-1">
                                <span className="opacity-60">Associated with</span>
                                <span className="font-semibold text-[var(--brand)]/80">{award.associatedWith}</span>
                            </div>
                        )}
                    </div>

                    {/* Decorative Corner Gradient */}
                    <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-full blur-2xl group-hover:from-indigo-500/20 transition-all duration-500" />
                </motion.div>
            ))}
        </motion.div>
    );
};
