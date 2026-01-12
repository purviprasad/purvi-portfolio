export type ExperienceItem = {
    role: string;
    company: string;
    period: string;
    location?: string;
    description: string[];
    tech?: string[];
};

export const EXPERIENCE: ExperienceItem[] = [
    {
        role: "Specialist Programmer L2 - Apple Inc.",
        company: "Infosys Ltd.",
        period: "Apr 2023 — Present",
        location: "Remote",
        description: [
            "Led end-to-end delivery of a project from inception to production within a 4-member team.",
            "Optimized a high-memory data generation pipeline by re-architecting a Go-based solution to Node.js with delta filtering, reducing memory usage by 80%+ (12 GB → 6 GB).",
            "Owned backend & frontend architecture, database design, and client collaboration; consistently recognized for efficient planning, optimized code, and strong stakeholder feedback.",
        ],
        tech: [
            "React",
            "Redux",
            "REST APIs",
            "Node",
            "Express",
            "Microservices",
            "TypeScript",
            "PostgreSQL",
            "AWS",
            "Ag-grid",
            "Cron",
            "Go Lang",
            "Jenkins",
            "Splunk",
            "Miro",
            "Postman",
            "GitHub",
            "VS Code",
        ],
    },
    {
        role: "Specialist Programmer L1 - Verizon Communications",
        company: "Infosys Ltd.",
        period: "Dec 2021 — Apr 2023",
        location: "Remote",
        description: [
            "Independently built and delivered 2 POCs for Verizon Communications.",
            "Migrated a legacy codebase to Micro Frontend architecture using Module Federation, improving modularity and scalability.",
            "Developed and maintained high-quality MERN stack applications for Verizon, resulting in a 20% increase in user engagement.",
        ],
        tech: ["React", "Redux", "RTK", "Node", "Express", "Microservices", "Cron", "MySQL", "PostgreSQL", "Jenkins", "Splunk", "Postman", "GitHub", "VS Code"],
    },
    {
        role: "Digital Specialist Engineer - Verizon Communications",
        company: "Infosys Ltd.",
        period: "Sep 2020 — Dec 2021",
        location: "Remote",
        description: [
            "Collaborated with cross-functional teams to gather requirements, provide technical expertise, and implement robust solutions.",
            "Played a key role in the successful and seamless delivery of the project in the Telecommunication domain.",
        ],
        tech: ["React", "Redux", "RTK", "Node", "Express", "Microservices", "Cron", "MySQL", "PostgreSQL", "Jenkins", "Splunk", "Postman", "GitHub", "VS Code", "REST APIs",],
    },
];
