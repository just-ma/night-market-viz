import { Canvas } from "@react-three/fiber";
import Visualizer from "./Visualizer";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Video = styled.video`
  display: none;
`;

const CanvasWrapper = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
`;

export default function App() {
  const [init, setInit] = useState(false);
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  useEffect(() => {
    const getVideoStream = async () => {
      const videoElement = videoRef.current;
      if (!videoElement) return;

      const localStream = await navigator.mediaDevices.getUserMedia({
        video: {
          ...windowSize,
        },
      });
      videoElement.srcObject = localStream;

      setInit(true);
    };

    getVideoStream();
  }, []);

  return (
    <>
      <Video ref={videoRef} muted autoPlay preload="none" playsInline />
      {init && (
        <CanvasWrapper>
          <Canvas>
            <Visualizer video={videoRef.current!.srcObject as MediaStream} />
          </Canvas>
        </CanvasWrapper>
      )}
    </>
  );
}
