import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Award } from "../types/portfolio";
import { FaTrophy, FaMedal, FaAward, FaArrowUpRightFromSquare, FaXmark } from "react-icons/fa6";

export const AwardsList: React.FC<{ awards?: Award[] }> = ({ awards = [] }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

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
        <>
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
                        className="glass-card group relative flex flex-col p-6 rounded-2xl transition-all duration-300 hover:shadow-xl overflow-hidden hover:shadow-[0_20px_25px_-5px_color-mix(in_srgb,var(--brand)_12%,transparent)]"
                    >
                        {/* Hover Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[color-mix(in_srgb,var(--brand)_6%,transparent)] via-[color-mix(in_srgb,var(--accent)_6%,transparent)] to-[color-mix(in_srgb,var(--brand)_6%,transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10 flex flex-col flex-1">
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
                                Issued by {award.issuer}
                            </div>

                            {award.associatedWith && (
                                <div className="text-xs text-[var(--muted)] flex items-center gap-1 mb-3">
                                    <span className="opacity-60">Associated with</span>
                                    <span className="font-semibold text-[var(--brand)]/80">{award.associatedWith}</span>
                                </div>
                            )}

                            {award.description && (
                                <p className="mt-2 text-sm text-[var(--text)] opacity-80 leading-relaxed transition-opacity">
                                    {award.description}
                                </p>
                            )}
                            
                            <div className="flex-1" />

                            {award.url && (
                                <button
                                    onClick={() => setSelectedImage(award.url || null)}
                                    className="mt-5 flex w-full text-left items-center gap-3 p-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] hover:bg-gray-50 dark:hover:bg-white/5 transition-all group/link cursor-pointer"
                                >
                                    <div className="flex-shrink-0 p-2 rounded-lg bg-[var(--brand)]/10 text-[var(--brand)] group-hover/link:bg-[var(--brand)] group-hover/link:text-white transition-colors">
                                        <FaArrowUpRightFromSquare className="w-4 h-4" />
                                    </div>
                                    <span className="text-xs font-medium text-[var(--text)] opacity-80 group-hover/link:opacity-100 line-clamp-2">
                                        {award.url.includes('github') ? `${award.url.split('/').slice(-1)[0]} at main · purviprasad/Certifications` : 'View Certificate'}
                                    </span>
                                </button>
                            )}
                        </div>

                        {/* Decorative Corner Gradient */}
                        <div className="absolute -bottom-10 -right-10 w-24 h-24 rounded-full blur-2xl transition-all duration-500 bg-gradient-to-br from-[color-mix(in_srgb,var(--brand)_14%,transparent)] to-transparent group-hover:from-[color-mix(in_srgb,var(--brand)_22%,transparent)]" />
                    </motion.div>
                ))}
            </motion.div>

            <AnimatePresence>
                {selectedImage && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedImage(null)}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-12 bg-black/60 backdrop-blur-sm cursor-zoom-out"
                        style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ type: "spring", damping: 25, stiffness: 300 }}
                            className="relative max-w-5xl w-full max-h-full flex items-center justify-center rounded-2xl overflow-hidden shadow-2xl bg-black/50 ring-1 ring-white/10"
                            onClick={(e) => e.stopPropagation()}
                            style={{ cursor: 'default' }}
                        >
                            <button
                                onClick={() => setSelectedImage(null)}
                                className="absolute top-4 right-4 z-[60] p-2 rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors backdrop-blur-md border border-white/10 cursor-pointer"
                                aria-label="Close modal"
                            >
                                <FaXmark className="w-5 h-5" />
                            </button>
                            <img 
                                src={selectedImage} 
                                alt="Certificate" 
                                className="w-full h-auto max-h-[85vh] object-contain block"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
