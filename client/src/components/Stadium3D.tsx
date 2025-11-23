import { useEffect, useRef, useState } from "react";
import { ThreeScene } from "./ThreeScene";
import * as THREE from "three";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Stadium3DProps {
  sportType: "basketball" | "football" | "cricket";
  className?: string;
}

export function Stadium3D({ sportType, className = "" }: Stadium3DProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const sceneObjects = useRef<{ court?: THREE.Group; ball?: THREE.Mesh }>({});

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    setMousePos({ x, y });
  };

  const createCourt = (scene: THREE.Scene, type: string) => {
    const courtGroup = new THREE.Group();

    // Court floor
    const floorGeometry = new THREE.PlaneGeometry(10, 6);
    let floorMaterial: THREE.MeshStandardMaterial;

    if (type === "basketball") {
      floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd4a574,
        roughness: 0.8,
        metalness: 0.1
      });
    } else if (type === "football") {
      floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x2d5016,
        roughness: 0.9
      });
    } else {
      floorMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x88aa66,
        roughness: 0.85
      });
    }

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    courtGroup.add(floor);

    // Court lines
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });

    // Center circle
    const circleGeometry = new THREE.BufferGeometry();
    const circlePoints = [];
    for (let i = 0; i <= 64; i++) {
      const angle = (i / 64) * Math.PI * 2;
      circlePoints.push(new THREE.Vector3(
        Math.cos(angle) * 1.5,
        0.01,
        Math.sin(angle) * 1.5
      ));
    }
    circleGeometry.setFromPoints(circlePoints);
    const centerCircle = new THREE.Line(circleGeometry, lineMaterial);
    courtGroup.add(centerCircle);

    // Boundary lines
    const boundaryGeometry = new THREE.BufferGeometry();
    const boundaryPoints = [
      new THREE.Vector3(-5, 0.01, -3),
      new THREE.Vector3(5, 0.01, -3),
      new THREE.Vector3(5, 0.01, 3),
      new THREE.Vector3(-5, 0.01, 3),
      new THREE.Vector3(-5, 0.01, -3),
    ];
    boundaryGeometry.setFromPoints(boundaryPoints);
    const boundary = new THREE.Line(boundaryGeometry, lineMaterial);
    courtGroup.add(boundary);

    scene.add(courtGroup);
    return courtGroup;
  };

  const createBall = (scene: THREE.Scene, type: string) => {
    const ballGeometry = new THREE.SphereGeometry(0.3, 32, 32);
    let ballMaterial: THREE.MeshStandardMaterial;

    if (type === "basketball") {
      ballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xff6b35,
        roughness: 0.6,
        metalness: 0.2
      });
    } else if (type === "football") {
      ballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff,
        roughness: 0.5,
        metalness: 0.1
      });
    } else {
      ballMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xcc2233,
        roughness: 0.4,
        metalness: 0.3
      });
    }

    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ball.position.set(0, 1.5, 0);
    ball.castShadow = true;
    scene.add(ball);
    return ball;
  };

  const onSceneReady = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    camera.position.set(0, 8, 12);
    camera.lookAt(0, 0, 0);

    const court = createCourt(scene, sportType);
    const ball = createBall(scene, sportType);

    sceneObjects.current = { court, ball };

    // Add spotlights
    const spotlight1 = new THREE.SpotLight(0xffffff, 1.5);
    spotlight1.position.set(5, 10, 5);
    spotlight1.angle = Math.PI / 6;
    spotlight1.penumbra = 0.3;
    scene.add(spotlight1);

    const spotlight2 = new THREE.SpotLight(0xffffff, 1.5);
    spotlight2.position.set(-5, 10, -5);
    spotlight2.angle = Math.PI / 6;
    spotlight2.penumbra = 0.3;
    scene.add(spotlight2);
  };

  const animate = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, time: number) => {
    // Rotate ball
    if (sceneObjects.current.ball) {
      sceneObjects.current.ball.rotation.y = time * 0.5;
      sceneObjects.current.ball.position.y = 1.5 + Math.sin(time * 2) * 0.3;
    }

    // Camera parallax effect based on mouse
    camera.position.x = mousePos.x * 2;
    camera.position.y = 8 - mousePos.y * 2;
    camera.lookAt(0, 0, 0);
  };

  return (
    <div className={`relative ${className}`} onMouseMove={handleMouseMove}>
      <ThreeScene 
        className="w-full h-full rounded-lg overflow-hidden" 
        onSceneReady={onSceneReady}
        animate={animate}
      />
      <div className="absolute bottom-4 right-4 flex gap-2">
        <Badge variant="secondary" className="backdrop-blur-md bg-black/30 text-white border-white/20">
          {sportType.toUpperCase()}
        </Badge>
        <Badge variant="secondary" className="backdrop-blur-md bg-black/30 text-white border-white/20">
          Drag to explore
        </Badge>
      </div>
    </div>
  );
}
