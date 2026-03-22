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

const App: React.FC = () => {
  const [isSnowEnabled, setIsSnowEnabled] = useState(true);

  return (
    <ThemeProvider>
      <PortfolioProvider>
        <Router>
          <div className="min-h-screen scroll-smooth relative overflow-x-hidden">
            <AuroraBackground />
            <MouseGlow />
            <ClickRipple />
            <AIAssistant />
            <StyleCustomizer />
            <SnowEffect enabled={isSnowEnabled} />

            <Routes>
              <Route path="/" element={<PortfolioPage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
              <Route path="/resume" element={<ResumePage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
            </Routes>
          </div>
        </Router>
      </PortfolioProvider>
    </ThemeProvider>
  );
};

export default App;
