import { useEffect, useRef } from "react";
import * as THREE from "three";

interface ThreeSceneProps {
  onSceneReady?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, renderer: THREE.WebGLRenderer) => void;
  className?: string;
  animate?: (scene: THREE.Scene, camera: THREE.PerspectiveCamera, time: number) => void;
}

export function ThreeScene({ onSceneReady, className = "", animate }: ThreeSceneProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameIdRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0e1a);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5;
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    // Call onSceneReady callback
    if (onSceneReady) {
      onSceneReady(scene, camera, renderer);
    }

    // Animation loop
    let startTime = Date.now();
    const animateScene = () => {
      const currentTime = (Date.now() - startTime) / 1000;
      
      if (animate && sceneRef.current && cameraRef.current) {
        animate(sceneRef.current, cameraRef.current, currentTime);
      }

      if (rendererRef.current && sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current);
      }

      frameIdRef.current = requestAnimationFrame(animateScene);
    };
    animateScene();

    // Handle resize
    const handleResize = () => {
      if (!container || !cameraRef.current || !rendererRef.current) return;
      
      const newWidth = container.clientWidth;
      const newHeight = container.clientHeight;
      
      cameraRef.current.aspect = newWidth / newHeight;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(newWidth, newHeight);
    };

    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (rendererRef.current) {
        container.removeChild(rendererRef.current.domElement);
        rendererRef.current.dispose();
      }
    };
  }, [onSceneReady, animate]);

  return <div ref={containerRef} className={className} />;
}
