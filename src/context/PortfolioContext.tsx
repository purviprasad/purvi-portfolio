import React, { createContext, useContext, useState, useEffect } from "react";

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

  const unlockAchievement = (id: string, label: string) => {
    if (!achievements.includes(id)) {
      setAchievements((prev) => [...prev, id]);
      // In a real app, we'd use a toast library here. For now, we'll just console log or use a custom alert.
      console.log(`Achievement Unlocked: ${label}`);
    }
  };

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
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) throw new Error("usePortfolio must be used within PortfolioProvider");
  return context;
};
