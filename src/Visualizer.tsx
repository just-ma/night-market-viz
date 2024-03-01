import { useMemo, useRef } from "react";
import type { ShaderMaterial } from "three";
import { Vector3, useFrame } from "@react-three/fiber";
import { OrthographicCamera, useFBO, useVideoTexture } from "@react-three/drei";
import { fragmentShader, vertexShader } from "./shaders";
import VisualizerText from "./VisualizerText";
import useKeyboardListener from "./useKeyboardListener";

type ComponentProps = {
  video: MediaStream;
};

const COLOR_MAP: Record<string, Vector3> = {
  white: [1, 1, 1],
  blue: [0, 0, 1],
  red: [1, 0, 0],
  green: [0, 1, 0],
  purple: [1, 0, 1],
  yellow: [1, 1, 0],
};

const Visualizer = ({ video }: ComponentProps) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const isRenderTargetA = useRef(true);

  const texture = useVideoTexture(video);
  const renderTargetA = useFBO();
  const renderTargetB = useFBO();

  const { text, font, rotX, rotY, clear, lumaThreshold, color, textColor } =
    useKeyboardListener();

  const uniforms = useMemo(() => {
    return {
      uTexture: {
        value: texture,
      },
      uTexture2: {
        value: null,
      },
      uT: {
        value: performance.now() / 1000,
      },
      uClear: {
        value: clear.current,
      },
      uLumaThreshold: {
        value: lumaThreshold.current,
      },
      uColor: {
        value: COLOR_MAP[color],
      },
    };
  }, []);

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTexture.value = texture;
    materialRef.current.uniforms.uT.value = performance.now() / 1000;
    materialRef.current.uniforms.uClear.value = clear.current;
    materialRef.current.uniforms.uLumaThreshold.value = lumaThreshold.current;
    materialRef.current.uniforms.uColor.value = COLOR_MAP[color];

    const { gl, scene, camera } = state;
    const currRenderTarget = isRenderTargetA.current
      ? renderTargetA
      : renderTargetB;
    isRenderTargetA.current = !isRenderTargetA.current;

    gl.autoClearColor = false;
    gl.setRenderTarget(currRenderTarget);
    gl.render(scene, camera);
    gl.setRenderTarget(null);

    materialRef.current.uniforms.uTexture2.value = currRenderTarget.texture;
  });

  return (
    <>
      <OrthographicCamera makeDefault position={[0, 0, 2000]} />
      {window.innerWidth > 800 && (
        <VisualizerText
          text={text}
          font={font}
          rotX={rotX}
          rotY={rotY}
          color={textColor}
        />
      )}
      <mesh>
        <planeGeometry args={[window.innerWidth, window.innerHeight, 1, 1]} />
        <shaderMaterial
          ref={materialRef}
          uniforms={uniforms}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  );
};

export default Visualizer;
