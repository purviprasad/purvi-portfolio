import type { ExperienceItem } from "../config/experienceData";

type Props = {
    items: ExperienceItem[];
};

export const ExperienceTimeline: React.FC<Props> = ({ items }) => {
    return (
        <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-px bg-[var(--border)] md:left-1/2 md:-translate-x-1/2" />

            <div className="space-y-10">
                {items.map((item, index) => {
                    const isLeft = index % 2 === 0;

                    return (
                        <div
                            key={index}
                            className={`relative grid grid-cols-1 md:grid-cols-2 gap-8`}
                        >
                            {/* Timeline dot with glowing effect */}
                            <span className="absolute left-4 top-6 h-4 w-4 rounded-full bg-[var(--brand)] shadow-[0_0_15px_var(--brand)] -translate-x-1/2 md:left-1/2 z-10" />

                            {/* Card - Adaptive Glass/Solid */}
                            <div
                                className={`ml-12 p-6 rounded-2xl bg-white border !border-[var(--border)] dark:bg-white/5 dark:backdrop-blur-md dark:border-white/10 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 group
                  ${isLeft ? "md:col-start-1 md:text-right md:ml-auto" : "md:col-start-2 md:ml-0"}
                `}
                            >
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

                                <ul className={`mt-4 space-y-2 text-sm text-[var(--text)]/80 leading-relaxed ${isLeft ? "md:ml-auto" : ""}`}>
                                    {item.description.map((point, i) => (
                                        <li key={i} className="flex gap-2">
                                            <span className="opacity-50">•</span> {point}
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
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
