import React, { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "../components/shared/Header";
import { SectionHeading } from "../components/shared/SectionHeading";
import { ProjectsGrid } from "../components/ProjectsGrid";
import { SkillsList } from "../components/SkillsList";
import { ContactForm } from "../components/ContactForm";
import { Footer } from "../components/shared/Footer";
import { PORTFOLIO_INFO } from "../config/portfolioData";
import { About } from "../components/About";
import type { Project } from "../types/portfolio";
import { ProjectModal } from "../components/ProjectModal";
import { ScrollProgressBar } from "../components/shared/ScrollProgressBar";
import { ScrollToTop } from "../components/shared/ScrollToTop";
import CLIResume from "../components/CLIResume";
import { ExperienceTimeline } from "../components/ExperienceTimeline";
import { EXPERIENCE } from "../config/experienceData";
import { AwardsList } from "../components/AwardsList";
import { BentoSkills } from "../components/BentoSkills";


interface PortfolioPageProps {
  isSnowEnabled?: boolean;
  onToggleSnow?: () => void;
}

import { RoleExplorer } from "../components/shared/RoleExplorer";
import { usePortfolio } from "../context/PortfolioContext";

const PortfolioPage: React.FC<PortfolioPageProps> = ({ isSnowEnabled, onToggleSnow }) => {
  const { userRole, unlockAchievement, isRetro } = usePortfolio();
  const [selected, setSelected] = useState<Project | null>(null);
  const [showCLI, setShowCLI] = useState(false);

  return (
    <>
      <ScrollProgressBar />
      <Header
        links={[
          { href: "#about", label: "About" },
          { href: "#experience", label: "Experience" },
          { href: "#projects", label: "Projects" },
          { href: "#skills", label: "Skills" },
          { href: "#awards", label: "Awards" },
          { href: "#contact", label: "Contact" },
        ]}
        onTryCLI={() => {
          setShowCLI(true);
          unlockAchievement("terminal-engaged", "Bash Enthusiast");
        }}
        isSnowEnabled={isSnowEnabled}
        onToggleSnow={onToggleSnow}
      />
      {/* CLI panel (docked / overlay) */}
      <CLIResume open={showCLI} onClose={() => setShowCLI(false)} />

      <main className="max-w-6xl 2xl:max-w-9xl mx-auto px-6 py-10 relative">
        <section
          id="about"
          className="pt-20 pb-2"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center"
          >
            <RoleExplorer />
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <About personal={PORTFOLIO_INFO.personal} />
          </div>
        </section>

        <section id="experience" className={`py-12 transition-all duration-700 mt-4 ${userRole === "recruiter" ? "ring-2 ring-[var(--brand)] ring-offset-8 rounded-[2.5rem] p-8 md:pr-12 lg:pr-14 bg-[var(--surface)] shadow-2xl relative" : ""}`}>
          {userRole === 'recruiter' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="absolute -top-4 -right-4 bg-emerald-500 text-white px-4 py-2 rounded-xl shadow-lg text-xs font-bold z-10"
            >
              Recruiter Insight Activated
            </motion.div>
          )}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
            <SectionHeading
              title="Experience"
              subtitle="My professional journey & impact"
              glitch={isRetro}
            />
            {userRole === 'recruiter' && (
              <a
                href="/PURVI_SEHGAL_RESUME.pdf"
                className="flex shrink-0 items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[var(--brand)] text-white text-sm font-bold shadow-lg hover:scale-105 transition-transform w-full sm:w-auto"
                download
              >
                Quick Download Resume
              </a>
            )}
          </div>

          <ExperienceTimeline items={EXPERIENCE} />
        </section>

        <section id="projects" className={`py-12 transition-all duration-700 ${userRole === "developer" ? "ring-2 ring-[var(--brand)] ring-offset-8 ring-offset-[var(--bg)] rounded-[2.5rem] p-8" : ""}`}>
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end mb-8">
            <SectionHeading
              title="Projects"
              subtitle="Where design meets performance"
              glitch={isRetro}
            />
            {userRole === 'developer' && (
              <div className="hidden md:flex flex-col items-end gap-1 self-end pb-1">
                <span className="text-[10px] uppercase font-black text-[var(--accent)] tracking-tighter bg-[color-mix(in_srgb,var(--accent)_12%,transparent)] px-2 py-0.5 rounded">Architect View</span>
                <span className="text-[9px] text-[var(--muted)]">Focusing on scalability & clean code</span>
              </div>
            )}
          </div>
          <ProjectsGrid projects={PORTFOLIO_INFO.projects} onOpen={setSelected} />
        </section>

        <section id="skills" className="py-12">
          <SectionHeading
            title="Core Stack & Capabilities"
            subtitle="How I ship full-stack work—React and Node in production, data stores, and the tooling around reliable releases"
            glitch={isRetro}
          />
          <BentoSkills />
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[var(--border)]"></span>
              Full Inventory
            </h3>
            <SkillsList skills={PORTFOLIO_INFO.skills} isBar={true} />
          </div>
        </section>

        <section id="awards" className="py-12">
          <SectionHeading
            title="Honors & Awards"
            subtitle="Recognition for excellence and dedication"
            glitch={isRetro}
          />
          <AwardsList awards={PORTFOLIO_INFO.awards} />
        </section>

        <section id="contact" className="py-12">
          <SectionHeading
            title="Contact"
            subtitle="Tell me about your project, or just say hi"
            glitch={isRetro}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-[var(--border)] dark:border-white/10">
              <ContactForm />
            </div>

            <div className="p-6 rounded-2xl bg-white/40 dark:bg-white/5 backdrop-blur-md border border-[var(--border)] dark:border-white/10 flex flex-col gap-4">
              <div>
                <div className="font-semibold">Let's collaborate</div>
                <div className="text-sm text-[var(--muted)]">
                  I'm available for freelance and contract work. My inbox is
                  open.
                </div>
              </div>
              <div className="mt-2">
                <div className="font-semibold">Quick contact</div>
                <div className="mt-2 text-sm text-[var(--muted)]">
                  Email: purvisehgal5@gmail.com
                </div>
                <div className="text-sm text-[var(--muted)]">
                  Location: Remote
                </div>
              </div>
              <div className="mt-auto">
                <div className="text-sm font-medium">Resume</div>
                <a
                  href="/PURVI_SEHGAL_RESUME.pdf"
                  className="block mt-2 px-4 py-3 rounded-xl border border-[var(--border)] bg-[var(--input-bg)] backdrop-blur-md text-[var(--text)] font-medium hover:bg-[var(--input-focus)] hover:border-[var(--brand)] hover:shadow-[0_4px_20px_color-mix(in_srgb,var(--brand)_20%,transparent)] transition-all duration-300 text-center flex justify-center items-center gap-2 hover:-translate-y-0.5 shadow-sm"
                  download
                >
                  Download PDF
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>
      <ScrollToTop />
      <Footer />

      <ProjectModal
        project={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
      />
    </>
  );
};

export default PortfolioPage;
