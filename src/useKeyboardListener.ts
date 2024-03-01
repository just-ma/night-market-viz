import { useEffect, useMemo, useRef, useState } from "react";

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

export default function useKeyboardListener() {
  const rotX = useRef(0);
  const rotY = useRef(0);
  const clear = useRef(false);
  const lumaThreshold = useRef(0);

  const [text, setText] = useState("type, why \ndon't \nya?");
  const [fontIndex, setFontIndex] = useState(0);

  const incrementFontIndex = () => {
    setFontIndex(
      (prev) => (prev + Math.ceil(Math.random() * 5)) % FONTS.length
    );
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    switch (e.key) {
      case "Enter": {
        setText((prev) => prev + "\n");
        break;
      }
      default: {
        setText((prev) => prev + e.key);
        incrementFontIndex();
        break;
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    switch (e.key) {
      case " ": {
        clear.current = true;
        break;
      }
      case "Backspace": {
        setText((prev) => prev.slice(0, prev.length - 1));
        incrementFontIndex();
        break;
      }
      case "+": {
        lumaThreshold.current = Math.min(lumaThreshold.current + 0.03, 0.5);
        break;
      }
      case "-": {
        lumaThreshold.current = Math.max(lumaThreshold.current - 0.03, -0.5);
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
      case " ": {
        clear.current = false;
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

  return useMemo(
    () => ({
      text,
      font: FONTS[fontIndex],
      rotX,
      rotY,
      clear,
      lumaThreshold,
    }),
    [text, fontIndex]
  );
}
