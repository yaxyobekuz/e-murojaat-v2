// Animated 3D cadaster terrain — displaced wireframe plane, auto-rotating.
// Loaded lazily (separate chunk) so `three` stays out of the initial bundle.
import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const SIZE = 9;
const SEG = 56;

const TerrainMesh = ({ isDark }) => {
  const meshRef = useRef();

  // Plane geometry + cached flat base positions (computed once, no ref write)
  const { geometry, base } = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEG, SEG);
    const flat = Float32Array.from(geo.attributes.position.array);
    return { geometry: geo, base: flat };
  }, []);

  useFrame(({ clock }) => {
    const geo = meshRef.current?.geometry;
    if (!geo) return;
    const pos = geo.attributes.position;
    const time = clock.getElapsedTime() * 0.6;
    for (let i = 0; i < pos.count; i++) {
      const x = base[i * 3];
      const y = base[i * 3 + 1];
      const z =
        Math.sin(x * 0.8 + time) * 0.35 +
        Math.cos(y * 0.7 - time * 0.8) * 0.35 +
        Math.sin((x + y) * 0.5 + time * 0.5) * 0.25;
      pos.setZ(i, z);
    }
    pos.needsUpdate = true;
    geo.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef} geometry={geometry} rotation={[-Math.PI / 2.4, 0, 0]}>
      <meshStandardMaterial
        color={isDark ? "#1a1530" : "#ede9fe"}
        emissive="#8b5cf6"
        emissiveIntensity={isDark ? 0.55 : 0.25}
        wireframe
        transparent
        opacity={0.92}
      />
    </mesh>
  );
};

const TerrainCanvas = ({ isDark = true }) => (
  <Canvas
    camera={{ position: [0, 4.2, 6], fov: 45 }}
    dpr={[1, 1.5]}
    gl={{ antialias: true, alpha: true }}
  >
    <ambientLight intensity={isDark ? 0.5 : 0.8} />
    <directionalLight position={[5, 8, 5]} intensity={isDark ? 1.1 : 0.9} color="#b794f6" />
    <pointLight position={[-4, 2, -3]} intensity={0.6} color="#22d3ee" />
    <TerrainMesh isDark={isDark} />
    <OrbitControls enablePan={false} enableZoom={false} autoRotate autoRotateSpeed={0.6} />
  </Canvas>
);

export default TerrainCanvas;
