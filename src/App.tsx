import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";

import PortfolioPage from "./pages/PortfolioPage";
import ResumePage from "./pages/ResumePage";
import SnowEffect from "./components/SnowEffect";
import ThemeProvider from "./components/ThemeProvider";

const App: React.FC = () => {
  const [isSnowEnabled, setIsSnowEnabled] = useState(true);

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen scroll-smooth">
          <SnowEffect enabled={isSnowEnabled} />

          <Routes>
            <Route path="/" element={<PortfolioPage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
            <Route path="/resume" element={<ResumePage isSnowEnabled={isSnowEnabled} onToggleSnow={() => setIsSnowEnabled(!isSnowEnabled)} />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
};

export default App;
