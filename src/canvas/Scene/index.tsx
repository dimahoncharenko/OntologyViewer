// Imports libraries
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

// Imports components
import { Ontologies } from "../Ontologies";

export const Scene = () => {
  return (
    <Canvas
      style={{
        width: "100vw",
        height: "100vh",
        position: "relative",
      }}
      gl={{ preserveDrawingBuffer: true }}
    >
      <Ontologies />
      <OrbitControls
        maxZoom={2}
        maxDistance={20}
        maxPolarAngle={Math.PI / 1.5}
      />
    </Canvas>
  );
};
