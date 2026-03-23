import React, { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Grid } from "@react-three/drei";
import * as THREE from "three";

const DEFAULT_BRAND = "#6366f1";
const DEFAULT_ACCENT = "#ec4899";
export type Background3DMode = "subtle" | "full";

function parseCssColor(value: string, fallback: string): string {
  const input = value.trim();
  if (!input) return fallback;
  if (input.startsWith("#")) return input;
  if (input.startsWith("rgb")) return input;
  return fallback;
}

const Particles: React.FC<{ brandColor: string; accentColor: string; reducedMotion: boolean; mode: Background3DMode }> = ({
  brandColor,
  accentColor,
  reducedMotion,
  mode,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const groupRef = useRef<THREE.Group>(null);
  const pointer = useRef({ x: 0, y: 0 });

  const { positions, colors } = useMemo(() => {
    const count = mode === "full" ? 1200 : 600;
    const positionData = new Float32Array(count * 3);
    const colorData = new Float32Array(count * 3);
    const brand = new THREE.Color(brandColor);
    const accent = new THREE.Color(accentColor);

    for (let i = 0; i < count; i += 1) {
      const i3 = i * 3;
      positionData[i3] = (Math.random() - 0.5) * 32;
      positionData[i3 + 1] = Math.random() * 10 - 1;
      positionData[i3 + 2] = (Math.random() - 0.5) * 26 - 6;

      const mix = Math.random();
      const mixedColor = brand.clone().lerp(accent, mix);
      colorData[i3] = mixedColor.r;
      colorData[i3 + 1] = mixedColor.g;
      colorData[i3 + 2] = mixedColor.b;
    }

    return { positions: positionData, colors: colorData };
  }, [brandColor, accentColor, mode]);

  useEffect(() => {
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (pointsRef.current && !reducedMotion) {
      const drift = mode === "full" ? 1 : 0.55;
      pointsRef.current.rotation.y = t * 0.012 * drift;
      pointsRef.current.position.y = Math.sin(t * 0.16) * 0.08;
    }

    if (groupRef.current) {
      const parallax = mode === "full" ? 1 : 0.6;
      const targetX = pointer.current.x * 0.4 * parallax;
      const targetY = pointer.current.y * 0.16 * parallax;
      groupRef.current.position.x += (targetX - groupRef.current.position.x) * 0.035;
      groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.035;
    }
  });

  return (
    <group ref={groupRef}>
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={positions} count={positions.length / 3} itemSize={3} />
          <bufferAttribute attach="attributes-color" array={colors} count={colors.length / 3} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          size={mode === "full" ? 0.08 : 0.06}
          vertexColors
          transparent
          opacity={mode === "full" ? 0.55 : 0.35}
          sizeAttenuation
          depthWrite={false}
        />
      </points>
    </group>
  );
};

export const Premium3DBackgroundWithMode: React.FC<{ mode: Background3DMode }> = ({ mode }) => {
  const [brandColor, setBrandColor] = useState(DEFAULT_BRAND);
  const [accentColor, setAccentColor] = useState(DEFAULT_ACCENT);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setReducedMotion(query.matches);
    updateMotion();
    query.addEventListener("change", updateMotion);

    return () => query.removeEventListener("change", updateMotion);
  }, []);

  useEffect(() => {
    const readThemeColors = () => {
      const styles = getComputedStyle(document.documentElement);
      setBrandColor(parseCssColor(styles.getPropertyValue("--brand"), DEFAULT_BRAND));
      setAccentColor(parseCssColor(styles.getPropertyValue("--accent"), DEFAULT_ACCENT));
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
    >
      <Canvas camera={{ position: [0, 2.2, 9], fov: 52 }} dpr={[1, 1.6]} gl={{ alpha: true, antialias: true }}>
        <fog attach="fog" args={[isDark ? "#070d1f" : "#f2f6ff", 8, 34]} />
        <ambientLight intensity={isDark ? 0.32 : 0.5} />
        <directionalLight position={[4, 5, 3]} intensity={isDark ? 0.7 : 0.45} />
        <pointLight position={[-4, 3, 0]} intensity={isDark ? 0.85 : 0.52} color={brandColor} />
        <pointLight position={[4, 2, 1]} intensity={isDark ? 0.7 : 0.44} color={accentColor} />

        <Grid
          position={[0, -2.35, -2]}
          args={[80, 80]}
          sectionSize={3}
          sectionThickness={1.2}
          sectionColor={brandColor}
          cellSize={0.9}
          cellThickness={0.55}
          cellColor={accentColor}
          fadeDistance={70}
          fadeStrength={1}
          infiniteGrid
        />

        <Grid
          position={[0, -2.34, -2]}
          args={[80, 80]}
          sectionSize={6}
          sectionThickness={0.8}
          sectionColor={accentColor}
          cellSize={1.8}
          cellThickness={0.3}
          cellColor={brandColor}
          fadeDistance={45}
          fadeStrength={1}
          infiniteGrid
        />

        <Particles brandColor={brandColor} accentColor={accentColor} reducedMotion={reducedMotion} mode={mode} />
      </Canvas>
    </div>
  );
};

export const Premium3DBackground: React.FC<{ mode?: Background3DMode }> = ({ mode = "full" }) => {
  return <Premium3DBackgroundWithMode mode={mode} />;
};
