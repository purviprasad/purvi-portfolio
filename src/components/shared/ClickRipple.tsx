import React, { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type Ripple = { id: number; x: number; y: number };

export const ClickRipple: React.FC = () => {
  const reduceMotion = useReducedMotion();
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const idRef = useRef(0);

  const remove = useCallback((id: number) => {
    setRipples((prev) => prev.filter((r) => r.id !== id));
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const onPointerDown = (e: PointerEvent) => {
      const id = ++idRef.current;
      setRipples((prev) => [...prev, { id, x: e.clientX, y: e.clientY }]);
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    return () =>
      window.removeEventListener("pointerdown", onPointerDown, { capture: true });
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <>
      {ripples.map((r) => (
        <div
          key={r.id}
          className="click-ripple-ring"
          style={
            {
              "--rx": `${r.x}px`,
              "--ry": `${r.y}px`,
            } as React.CSSProperties
          }
          onAnimationEnd={() => remove(r.id)}
        />
      ))}
    </>
  );
};

export default ClickRipple;
