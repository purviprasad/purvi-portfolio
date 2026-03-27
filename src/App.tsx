import React, { Suspense, lazy, useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import SnowEffect from "./components/SnowEffect";
import ThemeProvider from "./components/ThemeProvider";
import { PortfolioProvider } from "./context/PortfolioContext";
import { AuroraBackground } from "./components/shared/AuroraBackground";
import { MouseGlow } from "./components/shared/MouseGlow";
import { ClickRipple } from "./components/shared/ClickRipple";
import VisitorAnalyticsTracker from "./components/VisitorAnalyticsTracker";

const PortfolioPage = lazy(() => import("./pages/PortfolioPage"));
const ResumePage = lazy(() => import("./pages/ResumePage"));
const AIAssistant = lazy(() => import("./components/AIAssistant").then((m) => ({ default: m.AIAssistant })));
const StyleCustomizer = lazy(() => import("./components/shared/StyleCustomizer").then((m) => ({ default: m.StyleCustomizer })));
const VisitorLogsPage = lazy(() => import("./pages/VisitorLogsPage"));

const App: React.FC = () => {
  const [isSnowEnabled, setIsSnowEnabled] = useState(false);
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

  return (
    <ThemeProvider>
      <PortfolioProvider>
        <Router>
          <div className="min-h-screen scroll-smooth relative overflow-x-hidden isolate">
            <VisitorAnalyticsTracker />
            <AuroraBackground />
            <MouseGlow />
            <ClickRipple />
            <Suspense fallback={null}>
              {showEnhancements && <AIAssistant />}
              <StyleCustomizer />
            </Suspense>
            <SnowEffect enabled={isSnowEnabled} />

            <div className="relative z-10">
              <Suspense fallback={null}>
                <Routes>
                  <Route path="/" element={<PortfolioPage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
                  <Route path="/resume" element={<ResumePage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
                  <Route path="/__visitor-logs" element={<VisitorLogsPage />} />
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
