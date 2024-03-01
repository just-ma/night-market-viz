import { useMemo, useState } from "react";
import { Text } from "@react-three/drei";
import { Euler, useFrame } from "@react-three/fiber";

type ComponentProps = {
  text: string;
  font: string;
  rotY: React.MutableRefObject<number>;
  rotX: React.MutableRefObject<number>;
  color: string;
};

export default function VisualizerText({
  text,
  font,
  rotX,
  rotY,
  color,
}: ComponentProps) {
  const [rot, setRot] = useState([0.1, 0.1, 0]);

  const formattedText = useMemo(() => {
    const arr = text.split("\n");
    const index = Math.round(2 * Math.pow(text.length, 0.6));
    let ret = "";
    for (const seg of arr) {
      let segment = seg;
      while (segment.length) {
        ret += segment.slice(0, index) + "\n";
        segment = segment.slice(index);
      }
    }
    return ret;
  }, [text]);

  useFrame(() => {
    if (rotX.current !== 0 || rotY.current !== 0) {
      setRot((prev) => [
        prev[0] - rotY.current * 0.01,
        prev[1] + rotX.current * 0.01,
        0,
      ]);
    }
  });

  return (
    <Text
      position={[0, 0, 1000]}
      scale={(0.8 * window.innerWidth) / Math.pow(text.length, 0.6)}
      color={color}
      textAlign="center"
      font={font}
      lineHeight={1}
      rotation={rot as Euler}
    >
      {formattedText}
    </Text>
  );
}
