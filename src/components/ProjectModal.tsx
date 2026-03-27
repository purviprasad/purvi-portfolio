import React, { useEffect, useState } from "react";
import { FaLink } from "react-icons/fa";
import { VscCopy } from "react-icons/vsc";
import remarkGfm from "remark-gfm";
import type { Project } from "../types/portfolio";
import { tagColors } from "../config/portfolioData";
import { useTheme } from "../context/ThemeContext";
import { motion, AnimatePresence, useScroll } from "framer-motion";
import { Spinner } from "./shared/Spinner";
import { getIconByName } from "../utils/iconRegistry";

const ReactMarkdown = React.lazy(() => import("react-markdown"));

import "github-markdown-css/github-markdown-light.css";

/** Mount only when the modal is open so `useScroll({ container })` always has a hydrated ref. */
const ModalScrollArea: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto min-h-0 max-h-[min(420px,52dvh)] sm:max-h-[500px] pr-1 custom-scroll relative"
    >
      <motion.div
        className="sticky top-0 left-0 right-0 h-1 bg-[var(--border)]/50 z-10"
        style={{ transformOrigin: "left", scaleX: scrollYProgress }}
      />
      {children}
    </div>
  );
};

export const ProjectModal: React.FC<{
  project: Project | null;
  open: boolean;
  onClose: () => void;
}> = ({ project, open, onClose }) => {
  const { dark } = useTheme();
  const [readme, setReadme] = useState<string | null>(null);
  const [iframeAllowed, setIframeAllowed] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "playground">(
    "details"
  );
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeReady, setIframeReady] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (open) {
      setActiveTab("details");
      setIframeLoaded(false);
      setIframeReady(false);
    }
  }, [open]);

  // Check if href can be embedded in iframe
  useEffect(() => {
    if (!project?.href) {
      setIframeAllowed(false);
      return;
    }
    if (
      project.href.includes("github.io") ||
      project.href.includes("vercel.app") ||
      project.href.includes("netlify.app")
    ) {
      setIframeAllowed(true);
    } else {
      setIframeAllowed(false);
    }
  }, [project]);

  // Fetch GitHub README
  useEffect(() => {
    async function fetchReadme() {
      if (!project) return;
      const githubLink = project.links?.find((l) => l.label.toLowerCase() === "github");
      if (!githubLink) {
        setReadme(null);
        return;
      }

      try {
        const regex = /github\.com\/([^/]+)\/([^/]+)/;
        const match = regex.exec(githubLink.url);
        if (!match) return;

        const [, owner, repo] = match;
        const res = await fetch(
          `https://raw.githubusercontent.com/${owner}/${repo}/main/README.md`
        );

        if (res.ok) {
          setReadme(await res.text());
        } else {
          setReadme(null);
        }
      } catch {
        setReadme(null);
      }
    }
    if (open) fetchReadme();
  }, [open, project]);

  return (
    <AnimatePresence>
      {open && project && (
        <motion.div
          key={`modal-${project.title}`}
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            onClick={onClose}
            role="presentation"
            className="absolute inset-0 bg-[var(--bg)]/65 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.dialog
            open={open}
            aria-modal="true"
            className="relative z-10 w-full max-w-4xl max-h-[92dvh] min-h-0 p-4 sm:p-6 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-lg flex flex-col"
            initial={{ y: 50, opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 cursor-pointer text-[var(--muted)] hover:text-[var(--text)] z-20"
              aria-label="Close project details"
            >
              ✕
            </button>

              {/* Title */}
              <h3 className="text-lg sm:text-xl font-bold text-[var(--brand)] mb-2 pr-10">
                {project.title}
              </h3>

              {/* Tabs (only if iframe allowed) */}
              {iframeAllowed && (
                <div className="flex border-b border-[var(--border)] mb-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab("details")}
                    className={`px-4 py-2 text-sm font-medium cursor-pointer ${activeTab === "details"
                      ? "text-[var(--brand)] border-b-2 border-[var(--brand)]"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("playground");
                      setIframeLoaded(true);
                      setIframeReady(false);
                    }}
                    className={`px-4 py-2 text-sm font-medium cursor-pointer ${activeTab === "playground"
                      ? "text-[var(--brand)] border-b-2 border-[var(--brand)]"
                      : "text-[var(--muted)] hover:text-[var(--text)]"
                      }`}
                  >
                    Playground
                  </button>
                </div>
              )}

              <ModalScrollArea>
                <AnimatePresence mode="wait">
                  {activeTab === "details" && (
                    <motion.div
                      key="details"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {/* Project image */}
                      {project.image && (
                        <img
                          src={project.image}
                          alt={project.title}
                          className="rounded-lg border border-[var(--border)] mb-4 w-full h-auto object-cover max-h-60"
                        />
                      )}
                      {/* Metadata */}
                      {(project.domain ||
                        project.createdFor ||
                        project.fullForm ||
                        project.packageName ||
                        project.darkModeSupport !== undefined) && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4 text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
                          {project.domain && (
                            <div className="flex flex-col gap-0.5">
                              <span className="opacity-50 text-[10px]">Domain</span>
                              <span>{project.domain}</span>
                            </div>
                          )}
                          {project.createdFor && (
                            <div className="flex flex-col gap-0.5">
                              <span className="opacity-50 text-[10px]">Created For</span>
                              <span>{project.createdFor}</span>
                            </div>
                          )}
                          {project.fullForm && (
                            <div className="flex flex-col gap-0.5">
                              <span className="opacity-50 text-[10px]">Full Form</span>
                              <span>{project.fullForm}</span>
                            </div>
                          )}
                          {project.packageName && (
                            <div className="flex flex-col gap-0.5">
                              <span className="opacity-50 text-[10px]">Package</span>
                              <span className="normal-case">{project.packageName}</span>
                            </div>
                          )}
                          {project.darkModeSupport !== undefined && (
                            <div className="flex flex-col gap-0.5">
                              <span className="opacity-50 text-[10px]">Dark Mode</span>
                              <span>{project.darkModeSupport ? "Supported" : "Not Supported"}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {project.tagline && (
                        <p className="text-base font-semibold text-[var(--brand)] mb-3">
                          {project.tagline}
                        </p>
                      )}

                      {/* Description */}
                      <p className="text-sm text-[var(--text)] mb-4 leading-relaxed">
                        {project.description}
                      </p>


                      {/* Links */}
                      {project.links && project.links.length > 0 && (
                        <div className="flex gap-3 flex-wrap mb-4">
                          {project.href && (
                            <a
                              href={project.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:underline"
                            >
                              {FaLink && <FaLink className="w-4 h-4" />} Demo
                            </a>
                          )}
                          {project.links.map((link) => {
                            const Icon = getIconByName(link.icon);
                            return (
                              <a
                                key={link.label}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-3 py-1 text-sm font-medium rounded-md border border-[var(--border)] bg-[var(--surface)] text-[var(--text)] hover:underline"
                              >
                                {Icon && <Icon className="w-4 h-4" />}
                                {link.label}
                              </a>
                            );
                          })}
                        </div>
                      )}

                      {/* Tags */}
                      <div className="mt-3 flex gap-2 flex-wrap">
                        {project.tags?.map((t) => (
                          <span
                            key={t}
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${tagColors[t] || "bg-[var(--bg)] text-[var(--text)] border border-[var(--border)]"
                              }`}
                          >
                            {t}
                          </span>
                        ))}
                      </div>

                      {project.features && project.features.length > 0 && (
                        <div className="mt-6 rounded-xl border border-[var(--border)] bg-black/5 dark:bg-white/5 p-4">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brand)] mb-3">
                            Features
                          </h4>
                          <ul className="space-y-2 text-sm text-[var(--text)]">
                            {project.features.map((feature) => (
                              <li key={feature} className="flex gap-2">
                                <span className="text-[var(--brand)]">•</span>
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}


                      {/* Credentials */}
                      {project.credentials && (
                        <div className="mb-6 mt-6 p-4 rounded-xl bg-black/5 dark:bg-white/5 border border-[var(--border)] shadow-sm">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--brand)] mb-3 flex items-center gap-2">
                            Demo Credentials
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {project.credentials.username && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Username</span>
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-white dark:bg-white/10 text-sm font-mono border border-[var(--border)] text-[var(--text)] group/cred relative">
                                  <code className="flex-1 truncate">
                                    {project.credentials.username}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(project.credentials?.username || "");
                                    }}
                                    className="p-1 hover:bg-[var(--brand)]/10 rounded transition-colors text-[var(--muted)] hover:text-[var(--brand)]"
                                    title="Copy Username"
                                  >
                                    <VscCopy size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                            {project.credentials.password && (
                              <div className="flex flex-col gap-1">
                                <span className="text-[10px] uppercase font-bold text-[var(--muted)]">Password</span>
                                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-white dark:bg-white/10 text-sm font-mono border border-[var(--border)] text-[var(--text)] group/cred relative">
                                  <code className="flex-1 truncate">
                                    {project.credentials.password}
                                  </code>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      navigator.clipboard.writeText(project.credentials?.password || "");
                                    }}
                                    className="p-1 hover:bg-[var(--brand)]/10 rounded transition-colors text-[var(--muted)] hover:text-[var(--brand)]"
                                    title="Copy Password"
                                  >
                                    <VscCopy size={14} />
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* README */}
                      {readme && (
                        <div className="h-full overflow-auto rounded-md border border-[var(--border)] bg-[var(--surface)] mt-6">
                          <div
                            className="p-4 markdown-body"
                            style={{
                              backgroundColor: dark ? "#0d1117" : "white",
                              color: dark ? "white" : "black",
                            }}
                          >
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {readme}
                            </ReactMarkdown>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === "playground" &&
                    iframeAllowed &&
                    iframeLoaded && (
                      <motion.div
                        key="playground"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="relative"
                      >
                        <AnimatePresence>
                          {!iframeReady && (
                            <motion.div
                              key="spinner"
                              className="absolute inset-0 flex items-center justify-center bg-[var(--surface)]/60 rounded-lg"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.4 }}
                            >
                              <Spinner size={40} color="var(--brand)" />
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <div className="text-right">
                          <a
                            href={project.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[var(--brand)] hover:underline"
                          >
                            Open Fullscreen ↗
                          </a>
                        </div>

                        <iframe
                          src={project.href}
                          title={project.title}
                          className="w-full min-h-[220px] h-[min(45vh,400px)] rounded-lg border border-[var(--border)]"
                          loading="lazy"
                          onLoad={() => setIframeReady(true)}
                        />
                      </motion.div>
                    )}
                </AnimatePresence>
              </ModalScrollArea>
            </motion.dialog>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
