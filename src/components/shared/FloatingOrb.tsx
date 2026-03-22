import React, { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolio } from "../../context/PortfolioContext";

function cssColorToHex(input: string, fallback: string): string {
  const s = input.trim();
  if (s.startsWith("#") && /^#[0-9a-f]{6}$/i.test(s.slice(0, 7))) return s.slice(0, 7).toLowerCase();
  const rgb = s.match(/^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)/i);
  if (rgb) {
    const r = Math.min(255, parseInt(rgb[1], 10));
    const g = Math.min(255, parseInt(rgb[2], 10));
    const b = Math.min(255, parseInt(rgb[3], 10));
    return `#${[r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("")}`;
  }
  return fallback;
}

const Orb: React.FC<{ brandHex: string; accentHex: string }> = ({ brandHex, accentHex }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (meshRef.current) {
      meshRef.current.rotation.x = time * 0.2;
      meshRef.current.rotation.y = time * 0.3;
    }
    if (shellRef.current) {
      shellRef.current.rotation.x = -time * 0.1;
      shellRef.current.rotation.y = -time * 0.2;
    }
  });

  return (
    <Float speed={4} rotationIntensity={1} floatIntensity={2}>
      <group>
        <Sphere ref={meshRef} args={[1, 100, 100]} scale={2}>
          <MeshDistortMaterial
            color={brandHex}
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </Sphere>

        <Sphere ref={shellRef} args={[1.1, 32, 32]} scale={2}>
          <meshPhongMaterial color={accentHex} wireframe transparent opacity={0.2} />
        </Sphere>
      </group>
    </Float>
  );
};

export const FloatingOrb: React.FC = () => {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { isRetro } = usePortfolio();
  const [brandHex, setBrandHex] = useState("#6366f1");
  const [accentHex, setAccentHex] = useState("#ec4899");

  useEffect(() => {
    const read = () => {
      const el = wrapRef.current;
      if (!el) return;
      const cs = getComputedStyle(el);
      setBrandHex(cssColorToHex(cs.getPropertyValue("--brand"), "#6366f1"));
      setAccentHex(cssColorToHex(cs.getPropertyValue("--accent"), "#ec4899"));
    };

    read();
    const obs = new MutationObserver(read);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["style", "class"] });
    return () => obs.disconnect();
  }, [isRetro]);

  return (
    <div
      ref={wrapRef}
      className="w-full h-[400px] md:h-[600px] absolute top-0 left-0 pointer-events-none z-[-1] opacity-50"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Orb brandHex={brandHex} accentHex={accentHex} />
      </Canvas>
    </div>
  );
};
