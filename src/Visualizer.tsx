import { useMemo, useRef } from "react";
import type { ShaderMaterial } from "three";
import { useFrame } from "@react-three/fiber";
import { OrthographicCamera, useFBO, useVideoTexture } from "@react-three/drei";
import { fragmentShader, vertexShader } from "./shaders";
import VisualizerText from "./VisualizerText";

type ComponentProps = {
  video: MediaStream;
};

const Visualizer = ({ video }: ComponentProps) => {
  const materialRef = useRef<ShaderMaterial>(null);
  const isRenderTargetA = useRef(true);

  const texture = useVideoTexture(video);
  const renderTargetA = useFBO();
  const renderTargetB = useFBO();

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
    };
  }, []);

  useFrame((state) => {
    if (!materialRef.current) {
      return;
    }

    materialRef.current.uniforms.uTexture.value = texture;
    materialRef.current.uniforms.uT.value = performance.now() / 1000;

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
      {window.innerWidth > 800 && <VisualizerText />}
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
