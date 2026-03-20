import React from "react";

export const AuroraBackground: React.FC = () => {
  return (
    <div className="aurora-container pointer-events-none">
      <div 
        className="aurora-blob animate-aurora top-[-10%] left-[-10%]" 
        style={{ backgroundColor: "var(--brand)" }}
      />
      <div 
        className="aurora-blob animate-aurora bottom-[-10%] right-[-10%]" 
        style={{ backgroundColor: "var(--accent)", animationDelay: "-5s" }}
      />
      <div 
        className="aurora-blob animate-aurora top-[20%] right-[10%]" 
        style={{ backgroundColor: "var(--brand)", animationDelay: "-10s", opacity: 0.15 }}
      />
    </div>
  );
};
