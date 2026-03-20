import React, { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, MeshDistortMaterial, Float } from "@react-three/drei";
import * as THREE from "three";
import { usePortfolio } from "../../context/PortfolioContext";

const Orb: React.FC = () => {
  const meshRef = useRef<THREE.Mesh>(null);
  const shellRef = useRef<THREE.Mesh>(null);
  const { isRetro } = usePortfolio();

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
        {/* Core */}
        <Sphere ref={meshRef} args={[1, 100, 100]} scale={2}>
          <MeshDistortMaterial
            color={isRetro ? "#00ff41" : "#6366f1"}
            attach="material"
            distort={0.4}
            speed={2}
            roughness={0.1}
            metalness={0.8}
          />
        </Sphere>
        
        {/* Techno Shell */}
        <Sphere ref={shellRef} args={[1.1, 32, 32]} scale={2}>
          <meshPhongMaterial
            color={isRetro ? "#00ff41" : "#ec4899"}
            wireframe
            transparent
            opacity={0.2}
          />
        </Sphere>
      </group>
    </Float>
  );
};

export const FloatingOrb: React.FC = () => {
  return (
    <div className="w-full h-[400px] md:h-[600px] absolute top-0 left-0 pointer-events-none z-[-1] opacity-50">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <pointLight position={[-10, -10, -10]} />
        <Orb />
      </Canvas>
    </div>
  );
};
