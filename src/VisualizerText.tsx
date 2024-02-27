import { useEffect, useMemo, useRef, useState } from "react";
import { Text } from "@react-three/drei";
import { Euler, useFrame } from "@react-three/fiber";

interface KeyboardEvent {
  key: string;
}

const FONTS = [
  "/night-market-viz/fonts/OpenSans-Italic-VariableFont_wdth_wght.woff",
  "/night-market-viz/fonts/Banquise-Regular.woff",
  "/night-market-viz/fonts/RubikBrokenFax-Regular.woff",
  "/night-market-viz/fonts/BluuNext-Bold.woff",
  "/night-market-viz/fonts/Credible-Regular.woff",
  "/night-market-viz/fonts/FT88-Gothique.woff",
  "/night-market-viz/fonts/Garamondt-Regular.woff",
  "/night-market-viz/fonts/kaerukaeru-Regular.woff",
  "/night-market-viz/fonts/Louise-Regular.woff",
  "/night-market-viz/fonts/Sligoil-Micro.woff",
  "/night-market-viz/fonts/SyneMono-Regular.woff",
  "/night-market-viz/fonts/terminal-grotesque_open.woff",
  "/night-market-viz/fonts/JacquardaBastarda9-Regular.woff",
  "/night-market-viz/fonts/Micro5-Regular.woff",
  "/night-market-viz/fonts/Zeyada-Regular.woff",
  "/night-market-viz/fonts/OpenSans-VariableFont_wdth_wght.woff",
  "/night-market-viz/fonts/BebasNeue-Regular.woff",
  "/night-market-viz/fonts/Sligoil-Micro.woff",
];

export default function VisualizerText() {
  const rotX = useRef(0);
  const rotY = useRef(0);

  const [text, setText] = useState("type, why \ndon't \nya?");
  const [fontIndex, setFontIndex] = useState(0);
  const [rot, setRot] = useState([0.1, 0.1, 0]);

  const incrementFontIndex = () => {
    setFontIndex(
      (prev) => (prev + Math.ceil(Math.random() * 5)) % FONTS.length
    );
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === "Enter") {
      setText((prev) => prev + "\n");
    } else {
      setText((prev) => prev + e.key);
    }
    incrementFontIndex();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Backspace": {
        setText((prev) => prev.slice(0, prev.length - 1));
        incrementFontIndex();
        break;
      }
      case "ArrowLeft": {
        rotX.current = -1;
        break;
      }
      case "ArrowRight": {
        rotX.current = 1;
        break;
      }
      case "ArrowUp": {
        rotY.current = 1;
        break;
      }
      case "ArrowDown": {
        rotY.current = -1;
        break;
      }
      default: {
        break;
      }
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    switch (e.key) {
      case "ArrowLeft":
      case "ArrowRight": {
        rotX.current = 0;
        break;
      }
      case "ArrowUp":
      case "ArrowDown": {
        rotY.current = 0;
        break;
      }
      default: {
        break;
      }
    }
  };

  useEffect(() => {
    document.addEventListener("keypress", handleKeyPress);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      document.removeEventListener("keypress", handleKeyPress);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

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
      color="blue"
      textAlign="center"
      font={FONTS[fontIndex]}
      lineHeight={1}
      rotation={rot as Euler}
    >
      {formattedText}
    </Text>
  );
}
