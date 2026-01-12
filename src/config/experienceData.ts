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
            "Led frontend architecture for large React applications",
            "Built reusable component systems with Tailwind and TypeScript",
            "Worked closely with backend teams on API design and performance",
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
            "Developed dashboards and admin tools",
            "Integrated backend APIs and handled auth flows",
            "Improved performance and accessibility",
        ],
        tech: ["React", "Redux", "RTK", "Node", "Express", "Microservices", "Cron", "MySQL", "PostgreSQL", "Jenkins", "Splunk", "Postman", "GitHub", "VS Code"],
    },
    {
        role: "Digital Specialist Engineer - Verizon Communications",
        company: "Infosys Ltd.",
        period: "Sep 2020 — Dec 2021",
        location: "Remote",
        description: [
            "Developed front-end UIs using Angular and React and integrated with Unisys Design System.",
            "Built REST APIs using Java (Vert.x) and integrated with NoSQL stores (MongoDB, Couchbase).",
            "Implemented role-based access with Keycloak and developed data visualization tools.",
            "Contributed to NDC stabilization, import/export features and product maintenance.",
        ],
        tech: ["React", "Redux", "RTK", "Node", "Express", "Microservices", "Cron", "MySQL", "PostgreSQL", "Jenkins", "Splunk", "Postman", "GitHub", "VS Code", "REST APIs",],
    },
];
