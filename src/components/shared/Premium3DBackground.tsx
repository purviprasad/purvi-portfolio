import React, { useEffect, useState } from "react";

export type Background3DMode = "subtle" | "full";

export const Premium3DBackgroundWithMode: React.FC<{ mode: Background3DMode }> = ({ mode }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const readThemeColors = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    readThemeColors();
    const observer = new MutationObserver(readThemeColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "style"],
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div
      className="premium-3d-layer pointer-events-none fixed inset-0 z-0"
      style={{ opacity: mode === "full" ? (isDark ? 1 : 0.62) : isDark ? 0.78 : 0.46 }}
      aria-hidden
    />
  );
};

export const Premium3DBackground: React.FC<{ mode?: Background3DMode }> = ({ mode = "full" }) => {
  return <Premium3DBackgroundWithMode mode={mode} />;
};
