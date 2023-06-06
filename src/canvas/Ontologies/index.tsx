// Imports libraries
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Float, Text3D, Html, Line } from "@react-three/drei";
import { useQuery } from "react-query";
import axios from "axios";
import { useSnapshot } from "valtio";
import { Vector3 } from "three";

// Imports styles
import { OntologyBar, OntologyLabel, SwitchButton } from "./styled";

// Imports assets
import font from "../../assets/os_semibold.json";

// Imports utils
import { state } from "../../utils/store";

type OntologyProps = {
  label: string;
  superClass?: string;
  handlePointerIn: (param: string) => void;
  handlePointerOut: () => void;
  position: Vector3;
};
export const Ontology = ({
  label,
  position,
  handlePointerIn,
  handlePointerOut,
  superClass,
}: OntologyProps) => {
  const navigate = useNavigate();
  const { nodes, showedText, showedRelations } = useSnapshot(state);

  const superClassPos = nodes.find((node) => node.label === superClass);

  return (
    <>
      <Float
        position={position}
        speed={5}
        onPointerEnter={() => handlePointerIn(label)}
        onPointerOut={handlePointerOut}
        rotationIntensity={1}
        floatIntensity={0.5}
        scale={0.5}
        onClick={() => navigate(`/${label}`)}
        onDoubleClick={(e) => console.log(e)}
      >
        <ambientLight intensity={0.2} />
        <directionalLight position={[0.3, 0, 0.5]} />
        <mesh castShadow receiveShadow>
          <icosahedronGeometry args={[1, 4]} />
          {showedText && (
            <Text3D
              // @ts-ignore
              font={font}
              size={0.4}
              castShadow
              receiveShadow
              frustumCulled
              position={[-1, -1, 0.5]}
            >
              {label}
              <meshBasicMaterial color={"lightblue"} />
            </Text3D>
          )}
          <meshBasicMaterial color={"#bf8040"} />
        </mesh>
      </Float>
      {showedRelations && superClassPos?.position && (
        <Line
          points={[position, ...superClassPos.position]}
          color={"lightgray"}
        />
      )}
    </>
  );
};

export const Ontologies = () => {
  const { nodes, showedText, showedRelations } = useSnapshot(state);
  const [label, setLabel] = useState("Вітаємо на платформі!");

  const handlePointerIn = (newLabel: string) => {
    setLabel(newLabel);
  };

  const handlePointerOut = () => {
    setLabel("Нічого не вибрано!");
  };

  const { isLoading } = useQuery({
    queryKey: ["fetching all records"],
    refetchOnWindowFocus: false,
    queryFn: async () => {
      const res = await axios.get<Records>(
        "http://localhost:3040/api/v1/records"
      );

      if (res.data instanceof Array) {
        const transformedArray = res.data.map((item, index) => {
          const positionX =
            Math.random() > 0.5 ? Math.random() : -Math.random();
          const positionY = Math.random() * 10;
          const positionZ = Math.random() * 10 - 5;

          return {
            label: item.label,
            position: [
              positionX * index,
              index % 2 === 0 ? positionY : -positionY,
              positionZ,
            ],
            superclass: item.superclass,
          };
        });

        state.nodes = transformedArray;
      }
    },
  });

  if (isLoading) return null;

  return (
    <group>
      <Html>
        <OntologyBar>
          <OntologyLabel>{label}</OntologyLabel>
          <div>
            <SwitchButton
              isShowed={showedRelations}
              onClick={() => (state.showedRelations = !showedRelations)}
            >
              <label htmlFor="show-relations">Показати зв'язки</label>
              <input id="show-relations" type="checkbox" />
            </SwitchButton>
            <SwitchButton
              isShowed={showedText}
              onClick={() => (state.showedText = !showedText)}
            >
              <label htmlFor="show-text">Показати назви</label>
              <input id="show-text" type="checkbox" />
            </SwitchButton>
          </div>
        </OntologyBar>
      </Html>
      {nodes?.length &&
        nodes.map((ont, index) => (
          <Ontology
            handlePointerIn={handlePointerIn}
            handlePointerOut={handlePointerOut}
            key={index}
            position={
              new Vector3(ont.position[0], ont.position[1], ont.position[2])
            }
            superClass={ont.superclass}
            label={ont.label}
          />
        ))}
    </group>
  );
};
