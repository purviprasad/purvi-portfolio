import React, { useState } from "react";
import { motion } from "framer-motion";

const SectionHeading: React.FC<{ title: string; subtitle: string; highlight?: string; glitch?: boolean }> = ({ title, subtitle, highlight, glitch }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      className="mb-12 group"
    >
      <h2 className={`text-4xl md:text-6xl font-black tracking-tighter text-[var(--text)] mb-3 flex items-baseline gap-3 transition-colors ${glitch ? 'glitch-text' : ''}`} data-text={title}>
        {title}
        {highlight && <span className="text-[var(--brand)] inline-block group-hover:rotate-3 transition-transform">{highlight}</span>}
      </h2>
      <div className="flex items-center gap-4">
        <div className="h-[2px] w-12 bg-[var(--brand)]/30 group-hover:w-24 transition-all duration-500 rounded-full" />
        <p className="text-sm font-medium text-[var(--muted)]/80 uppercase tracking-widest">{subtitle}</p>
      </div>
    </motion.div>
  );
};
// import { ThemeProvider } from "../components/ThemeProvider"; // Removed (lifted to App)
import { Header } from "../components/shared/Header";
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
import { FloatingOrb } from "../components/shared/FloatingOrb";


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
        <FloatingOrb />
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

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
            <About personal={PORTFOLIO_INFO.personal} />
          </div>
        </section>

        <section id="experience" className={`py-12 transition-all duration-700 ${userRole === 'recruiter' ? 'ring-2 ring-[var(--brand)] ring-offset-8 rounded-[2.5rem] p-8 bg-[var(--surface)] shadow-2xl relative' : 'py-8'}`}>
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

        <section id="projects" className={`py-8 transition-all duration-700 ${userRole === 'developer' ? 'ring-2 ring-purple-500 ring-offset-8 rounded-[2.5rem] p-8' : ''}`}>
          <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-end mb-10">
            <SectionHeading
              title="Projects"
              subtitle="Where design meets performance"
              glitch={isRetro}
            />
            {userRole === 'developer' && (
              <div className="hidden md:flex flex-col items-end gap-1 mb-12">
                <span className="text-[10px] uppercase font-black text-purple-500 tracking-tighter bg-purple-500/10 px-2 py-0.5 rounded">Architect View</span>
                <span className="text-[9px] text-[var(--muted)]">Focusing on scalability & clean code</span>
              </div>
            )}
          </div>
          <ProjectsGrid projects={PORTFOLIO_INFO.projects} onOpen={setSelected} />
        </section>

        <section id="skills" className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]">
              Core Stack & Capabilities
            </h2>
            <p className="text-sm text-[var(--muted)] mt-2">
              A breakdown of the tools I use to build production systems.
            </p>
          </motion.div>
          <BentoSkills />
          <div className="mt-12">
            <h3 className="text-lg font-semibold mb-6 flex items-center gap-2">
              <span className="w-8 h-[1px] bg-[var(--border)]"></span>
              Full Inventory
            </h3>
            <SkillsList skills={PORTFOLIO_INFO.skills} isBar={true} />
          </div>
        </section>

        <section id="awards" className="py-8">
          <h2 className="text-2xl font-semibold text-[var(--brand)]">
            Honors & Awards
          </h2>
          <p className="mb-6 text-sm text-[var(--muted)] mt-1">
            Recognition for excellence and dedication.
          </p>
          <AwardsList awards={PORTFOLIO_INFO.awards} />
        </section>

        <section id="contact" className="py-8">
          <h2 className="text-2xl font-semibold text-[var(--brand)]">
            Contact
          </h2>
          <p className="text-sm text-[var(--muted)] mt-1">
            Tell me about your project, or just say hi.
          </p>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)]">
              <ContactForm />
            </div>

            <div className="p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex flex-col gap-4">
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
                  className="block mt-2 px-4 py-2 rounded-lg border border-[var(--border)] bg-[var(--bg)] text-[var(--text)] hover:border-[var(--brand)]/50 transition-colors text-center sm:text-left"
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
