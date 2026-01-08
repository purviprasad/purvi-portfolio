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
                            {/* Timeline dot */}
                            <span className="absolute left-4 top-6 h-3 w-3 rounded-full bg-[var(--brand)] md:left-1/2 md:-translate-x-1/2" />

                            {/* Card */}
                            <div
                                className={`p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]
                  ${isLeft ? "md:col-start-1 md:text-right md:ml-auto" : "md:col-start-2"}
                `}
                            >
                                <div className="text-sm text-gray-500 dark:text-gray-400">
                                    {item.period}
                                </div>

                                <h3 className="mt-1 text-lg font-semibold">
                                    {item.role}
                                </h3>

                                <div className="text-sm text-gray-600 dark:text-gray-400">
                                    {item.company}
                                    {item.location && ` • ${item.location}`}
                                </div>

                                <ul className="mt-3 space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    {item.description.map((point, i) => (
                                        <li key={i} className="leading-relaxed">
                                            • {point}
                                        </li>
                                    ))}
                                </ul>

                                {item.tech && (
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {item.tech.map(t => (
                                            <span
                                                key={t}
                                                className="text-xs px-2 py-1 rounded-md border border-[var(--border)]"
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
