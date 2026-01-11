import React, { useEffect, useRef } from "react";
import { useTheme } from "../context/ThemeContext";

interface SnowEffectProps {
  enabled: boolean;
}

interface Snowflake {
  x: number;
  y: number;
  radius: number;
  speed: number;
  drift: number;
}

const SnowEffect: React.FC<SnowEffectProps> = ({ enabled }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { dark } = useTheme();

  useEffect(() => {
    if (!enabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let snowflakes: Snowflake[] = [];

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createSnowflakes = () => {
      const count = 100; // Number of snowflakes
      snowflakes = [];
      for (let i = 0; i < count; i++) {
        snowflakes.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 0.5, // Size between 0.5 and 2.5
          speed: Math.random() * 1 + 0.5, // Speed between 0.5 and 1.5
          drift: Math.random() * 0.5 - 0.25, // Slight horizontal drift
        });
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Adaptive color based on theme
      // Dark mode: White
      // Light mode: Soft Indigo/Slate for visibility against light background
      ctx.fillStyle = dark ? "rgba(255, 255, 255, 0.8)" : "rgba(99, 102, 241, 0.4)";

      ctx.beginPath();

      snowflakes.forEach((flake) => {
        ctx.moveTo(flake.x, flake.y);
        ctx.arc(flake.x, flake.y, flake.radius, 0, Math.PI * 2);
      });

      ctx.fill();
      moveSnowflakes();
      animationFrameId = requestAnimationFrame(draw);
    };

    const moveSnowflakes = () => {
      snowflakes.forEach((flake) => {
        flake.y += flake.speed;
        flake.x += flake.drift;

        // Wrap around screen
        if (flake.y > canvas.height) {
          flake.y = -flake.radius;
          flake.x = Math.random() * canvas.width;
        }
        if (flake.x > canvas.width) {
          flake.x = 0;
        } else if (flake.x < 0) {
          flake.x = canvas.width;
        }
      });
    };

    // Initial setup
    resizeCanvas();
    createSnowflakes();
    draw();

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [enabled, dark]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ opacity: 0.6 }}
    />
  );
};

export default SnowEffect;
