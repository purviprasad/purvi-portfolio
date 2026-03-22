import React, { createContext, useCallback, useContext, useState } from "react";
import { AchievementToast } from "../components/shared/AchievementToast";

type UserRole = "guest" | "recruiter" | "developer";

interface PortfolioContextType {
  isRetro: boolean;
  setIsRetro: (v: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  achievements: string[];
  unlockAchievement: (id: string, label: string) => void;
}

const PortfolioContext = createContext<PortfolioContextType | undefined>(undefined);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isRetro, setIsRetro] = useState(false);
  const [userRole, setUserRole] = useState<UserRole>("guest");
  const [achievements, setAchievements] = useState<string[]>([]);
  const [achievementToast, setAchievementToast] = useState<string | null>(null);

  const dismissAchievementToast = useCallback(() => setAchievementToast(null), []);

  const unlockAchievement = useCallback((id: string, label: string) => {
    let newlyUnlocked = false;
    setAchievements((prev) => {
      if (prev.includes(id)) return prev;
      newlyUnlocked = true;
      return [...prev, id];
    });
    if (newlyUnlocked) {
      setAchievementToast(label);
    }
  }, []);

  return (
    <PortfolioContext.Provider value={{ isRetro, setIsRetro, userRole, setUserRole, achievements, unlockAchievement }}>
      <div className={isRetro ? "retro-crt" : ""}>
        {isRetro && (
          <>
            <div className="crt-overlay" />
            <div className="scanline-effect" />
          </>
        )}
        {children}
      </div>
      <AchievementToast message={achievementToast} onDismiss={dismissAchievementToast} />
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used within PortfolioProvider");
  return context;
};
