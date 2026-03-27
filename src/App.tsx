import React, { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import SnowEffect from "./components/SnowEffect";
import ThemeProvider from "./components/ThemeProvider";
import { PortfolioProvider } from "./context/PortfolioContext";
import { AuroraBackground } from "./components/shared/AuroraBackground";
import { MouseGlow } from "./components/shared/MouseGlow";
import { ClickRipple } from "./components/shared/ClickRipple";
import type { Background3DMode } from "./components/shared/Premium3DBackground";

const STORAGE_3D_MODE = "portfolio-ui-3d-mode";

const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const AIAssistant = lazy(() => import("./components/AIAssistant").then((m) => ({ default: m.AIAssistant })));
const StyleCustomizer = lazy(() => import("./components/shared/StyleCustomizer").then((m) => ({ default: m.StyleCustomizer })));
const Premium3DBackground = lazy(() =>
  import("./components/shared/Premium3DBackground").then((m) => ({ default: m.Premium3DBackground }))
);

function getAuto3DMode(): "off" | Background3DMode {
  if (typeof window === "undefined") return "subtle";
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const navigatorWithDeviceMemory = navigator as Navigator & { deviceMemory?: number };
  const lowMemoryDevice = typeof navigatorWithDeviceMemory.deviceMemory === "number" && navigatorWithDeviceMemory.deviceMemory <= 4;
  const lowCpuDevice = typeof navigator.hardwareConcurrency === "number" && navigator.hardwareConcurrency <= 4;
  const touchOnlyDevice = navigator.maxTouchPoints > 0;

  if (prefersReducedMotion || lowMemoryDevice || lowCpuDevice) return "off";
  if (touchOnlyDevice) return "subtle";
  return "full";
}

function read3DMode(): "off" | Background3DMode {
  if (typeof window === "undefined") return "subtle";
  try {
    const value = localStorage.getItem(STORAGE_3D_MODE);
    if (value === "off" || value === "subtle" || value === "full") return value;
  } catch {
    // ignore localStorage errors
  }
  return getAuto3DMode();
}

const App: React.FC = () => {
  const [isSnowEnabled, setIsSnowEnabled] = useState(false);
  const [background3DMode, setBackground3DMode] = useState<"off" | Background3DMode>(() => read3DMode());
  const [showEnhancements, setShowEnhancements] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const reveal = () => setShowEnhancements(true);
    const runWhenIdle = () => {
      const idleWindow = window as Window & {
        requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
        cancelIdleCallback?: (id: number) => void;
      };

      if (typeof idleWindow.requestIdleCallback === "function" && typeof idleWindow.cancelIdleCallback === "function") {
        const idleId = idleWindow.requestIdleCallback(reveal, { timeout: 1500 });
        return () => idleWindow.cancelIdleCallback?.(idleId);
      }
      const timeoutId = window.setTimeout(reveal, 600);
      return () => window.clearTimeout(timeoutId);
    };

    if (document.readyState === "complete") {
      return runWhenIdle();
    }

    let cleanup = () => {};
    const onLoad = () => {
      cleanup = runWhenIdle();
    };
    window.addEventListener("load", onLoad, { once: true });
    return () => {
      window.removeEventListener("load", onLoad);
      cleanup();
    };
  }, []);

  const handle3DModeChange = (mode: "off" | Background3DMode) => {
    setBackground3DMode(mode);
    try {
      localStorage.setItem(STORAGE_3D_MODE, mode);
    } catch {
      // ignore localStorage errors
    }
  };

  return (
    <ThemeProvider>
      <PortfolioProvider>
        <Router>
          <div className="min-h-screen scroll-smooth relative overflow-x-hidden isolate">
            <Suspense fallback={null}>
              {showEnhancements && background3DMode !== "off" && <Premium3DBackground mode={background3DMode} />}
            </Suspense>
            <AuroraBackground />
            <MouseGlow />
            <ClickRipple />
            <Suspense fallback={null}>
              {showEnhancements && <AIAssistant />}
              <StyleCustomizer background3DMode={background3DMode} onBackground3DModeChange={handle3DModeChange} />
            </Suspense>
            <SnowEffect enabled={isSnowEnabled} />

            <div className="relative z-10">
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<PortfolioPage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
                  <Route path="/resume" element={<ResumePage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
                </Routes>
              </Suspense>
            </div>
          </div>
        </Router>
      </PortfolioProvider>
    </ThemeProvider>
  );
};

export default App;
