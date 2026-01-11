// ResumePage.tsx
import type React from "react";
// import ThemeProvider from "../components/ThemeProvider"; // Lifted to App
import { ScrollProgressBar } from "../components/shared/ScrollProgressBar";
import { Header } from "../components/shared/Header";
import { Resume } from "../components/resume/Resume";
import { Footer } from "../components/shared/Footer";

const ResumePage: React.FC<{
  isSnowEnabled?: boolean;
  onToggleSnow?: () => void;
}> = ({ isSnowEnabled, onToggleSnow }) => {
  return (
    <>
      <ScrollProgressBar />
      <Header links={[]} isSnowEnabled={isSnowEnabled} onToggleSnow={onToggleSnow} />
      <main className="max-w-4xl mx-auto px-6 py-10 pt-25">
        <Resume />
      </main>
      <Footer />
    </>
  );
};

export default ResumePage;
