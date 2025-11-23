import { useEffect, useRef } from "react";
import { ThreeScene } from "./ThreeScene";
import * as THREE from "three";
import type { Team } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Trophy, Medal } from "lucide-react";

interface Podium3DProps {
  topTeams: Team[];
  className?: string;
}

export function Podium3D({ topTeams, className = "" }: Podium3DProps) {
  const podiumsRef = useRef<THREE.Mesh[]>([]);

  const createPodium = (scene: THREE.Scene, height: number, color: number, position: number) => {
    const geometry = new THREE.BoxGeometry(1.5, height, 1.5);
    const material = new THREE.MeshStandardMaterial({ 
      color,
      metalness: 0.6,
      roughness: 0.3
    });
    const podium = new THREE.Mesh(geometry, material);
    podium.position.set(position * 2.5, height / 2, 0);
    podium.castShadow = true;
    podium.receiveShadow = true;
    scene.add(podium);
    return podium;
  };

  const onSceneReady = (scene: THREE.Scene, camera: THREE.PerspectiveCamera) => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 2, 0);

    // Ground
    const groundGeometry = new THREE.PlaneGeometry(20, 20);
    const groundMaterial = new THREE.MeshStandardMaterial({ color: 0x1a1f2e });
    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    // Create podiums
    if (topTeams.length >= 1) {
      const gold = createPodium(scene, 4, 0xffd700, 0); // 1st place (center, tallest)
      podiumsRef.current.push(gold);
    }
    if (topTeams.length >= 2) {
      const silver = createPodium(scene, 3, 0xc0c0c0, -1); // 2nd place (left, medium)
      podiumsRef.current.push(silver);
    }
    if (topTeams.length >= 3) {
      const bronze = createPodium(scene, 2, 0xcd7f32, 1); // 3rd place (right, shortest)
      podiumsRef.current.push(bronze);
    }

    // Spotlight on podiums
    const spotlight = new THREE.SpotLight(0xffffff, 2);
    spotlight.position.set(0, 10, 5);
    spotlight.angle = Math.PI / 4;
    spotlight.penumbra = 0.2;
    spotlight.castShadow = true;
    scene.add(spotlight);
  };

  const animate = (scene: THREE.Scene, camera: THREE.PerspectiveCamera, time: number) => {
    podiumsRef.current.forEach((podium, index) => {
      podium.rotation.y = Math.sin(time + index) * 0.1;
    });

    // Rotate camera slightly
    camera.position.x = Math.sin(time * 0.2) * 2;
    camera.lookAt(0, 2, 0);
  };

  const medals = [
    { icon: Trophy, color: "text-yellow-500", label: "1st" },
    { icon: Medal, color: "text-gray-400", label: "2nd" },
    { icon: Medal, color: "text-orange-600", label: "3rd" },
  ];

  return (
    <div className={`relative ${className}`}>
      <ThreeScene 
        className="w-full h-[400px] rounded-lg overflow-hidden" 
        onSceneReady={onSceneReady}
        animate={animate}
      />
      
      {/* Team labels overlay */}
      <div className="absolute inset-0 pointer-events-none flex items-end justify-center gap-4 pb-8">
        {topTeams.slice(0, 3).map((team, index) => {
          const Icon = medals[index].icon;
          const actualIndex = index === 0 ? 0 : index === 1 ? 1 : 2; // Order: 2nd, 1st, 3rd
          const positions = [0, -150, 150]; // Center, left, right
          
          return (
            <Card 
              key={team.id}
              className="pointer-events-auto backdrop-blur-md bg-card/80 border-2 p-4 min-w-[120px]"
              style={{ 
                transform: `translateX(${positions[actualIndex]}px)`,
                order: actualIndex === 0 ? 2 : actualIndex === 1 ? 1 : 3
              }}
            >
              <div className="flex flex-col items-center gap-2">
                <Icon className={`w-8 h-8 ${medals[index].color}`} />
                <div 
                  className="w-12 h-12 rounded-full flex items-center justify-center font-bold font-display"
                  style={{ backgroundColor: team.color }}
                >
                  {team.name.charAt(0)}
                </div>
                <div className="text-center">
                  <div className="font-bold font-display text-sm">{team.name}</div>
                  <div className="text-xs text-muted-foreground">{team.points} pts</div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
