// ResumePage.tsx
import React, { useState } from "react";
// import ThemeProvider from "../components/ThemeProvider"; // Lifted to App
import { ScrollProgressBar } from "../components/shared/ScrollProgressBar";
import { Header } from "../components/shared/Header";
import { Resume } from "../components/resume/Resume";
import { Footer } from "../components/shared/Footer";
import CLIResume from "../components/CLIResume";
import { usePortfolio } from "../context/PortfolioContext";

const ResumePage: React.FC<{
  isSnowEnabled?: boolean;
  onToggleSnow?: () => void;
}> = ({ isSnowEnabled, onToggleSnow }) => {
  const [showCLI, setShowCLI] = useState(false);
  const { unlockAchievement } = usePortfolio();

  return (
    <>
      <ScrollProgressBar />
      <Header 
        links={[]} 
        isSnowEnabled={isSnowEnabled} 
        onToggleSnow={onToggleSnow} 
        onTryCLI={() => {
          setShowCLI(true);
          unlockAchievement("terminal-engaged", "Bash Enthusiast");
        }}
      />
      <CLIResume open={showCLI} onClose={() => setShowCLI(false)} />
      <main className="max-w-4xl mx-auto px-6 py-10 pt-25">
        <Resume />
      </main>
      <Footer />
    </>
  );
};

export default ResumePage;
