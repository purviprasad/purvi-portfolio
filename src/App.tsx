import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import PortfolioPage from "./pages/PortfolioPage";
import ResumePage from "./pages/ResumePage";
import SnowEffect from "./components/SnowEffect";
import ThemeProvider from "./components/ThemeProvider";
import { PortfolioProvider } from "./context/PortfolioContext";
import { AuroraBackground } from "./components/shared/AuroraBackground";
import { MouseGlow } from "./components/shared/MouseGlow";
import { ClickRipple } from "./components/shared/ClickRipple";
import { AIAssistant } from "./components/AIAssistant";
import { StyleCustomizer } from "./components/shared/StyleCustomizer";
import { Premium3DBackground, type Background3DMode } from "./components/shared/Premium3DBackground";

const STORAGE_3D_MODE = "portfolio-ui-3d-mode";

function read3DMode(): "off" | Background3DMode {
  if (typeof window === "undefined") return "full";
  try {
    const value = localStorage.getItem(STORAGE_3D_MODE);
    if (value === "off" || value === "subtle" || value === "full") return value;
  } catch {
    // ignore localStorage errors
  }
  return "full";
}

const App: React.FC = () => {
  const [isSnowEnabled, setIsSnowEnabled] = useState(false);
  const [background3DMode, setBackground3DMode] = useState<"off" | Background3DMode>(() => read3DMode());

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
            {background3DMode !== "off" && <Premium3DBackground mode={background3DMode} />}
            <AuroraBackground />
            <MouseGlow />
            <ClickRipple />
            <AIAssistant />
            <StyleCustomizer background3DMode={background3DMode} onBackground3DModeChange={handle3DModeChange} />
            <SnowEffect enabled={isSnowEnabled} />

            <div className="relative z-10">
              <Routes>
                <Route path="/" element={<PortfolioPage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
                <Route path="/resume" element={<ResumePage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
              </Routes>
            </div>
          </div>
        </Router>
      </PortfolioProvider>
    </ThemeProvider>
  );
};

export default App;
