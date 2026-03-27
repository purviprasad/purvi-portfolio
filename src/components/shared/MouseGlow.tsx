import React, { useEffect, useRef } from "react";

export const MouseGlow: React.FC = () => {
  const glowRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0, active: false });
  const frameRef = useRef<number | null>(null);

  useEffect(() => {
    const renderGlow = () => {
      frameRef.current = null;
      const node = glowRef.current;
      if (!node) return;
      node.style.left = `${pointerRef.current.x}px`;
      node.style.top = `${pointerRef.current.y}px`;
      node.style.opacity = pointerRef.current.active ? "1" : "0";
    };

    const scheduleRender = () => {
      if (frameRef.current !== null) return;
      frameRef.current = window.requestAnimationFrame(renderGlow);
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
      scheduleRender();
    };

    const handleMouseLeave = () => {
      pointerRef.current.active = false;
      scheduleRender();
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return <div id="mouse-glow" ref={glowRef} className="hidden md:block" />;
};
