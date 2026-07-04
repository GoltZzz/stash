import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei/native';
import { View } from 'react-native';
import { CatMood } from './cat-sprite';

type Cat3DProps = {
  size?: number;
  mood?: CatMood;
  onTap?: () => void;
};

// Maps mood to colors for visual feedback
const MOOD_COLORS: Record<CatMood, string> = {
  good: '#ffffff',     // Neutral / Original texture
  warning: '#ffe066',  // Yellow tint
  critical: '#ff8787', // Red tint
  empty: '#adb5bd',    // Gray tint
  walking: '#ffffff',  // Neutral
};

function CatMesh({ mood, isJumping, onJumpComplete, onTap }: {
  mood: CatMood;
  isJumping: boolean;
  onJumpComplete: () => void;
  onTap?: () => void;
}) {
  const meshRef = useRef<any>(null);
  const shadowRef = useRef<any>(null);
  const jumpTime = useRef<number>(0);
  
  // Load the cat idle texture
  const texture = useTexture(require('../../assets/images/fg/fg-idle.png'));

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();
    
    // 1. Idle Breathing Animation (Scale & Y position)
    let breathingSpeed = 2;
    let breathingAmplitude = 0.05;
    
    if (mood === 'critical') {
      breathingSpeed = 8; // Fast panic breathing
      breathingAmplitude = 0.08;
      // Panicking shake
      meshRef.current.rotation.z = Math.sin(t * 20) * 0.05;
    } else if (mood === 'empty') {
      breathingSpeed = 0.5; // Very slow/dead breathing
      breathingAmplitude = 0.01;
      meshRef.current.rotation.z = 0;
    } else if (mood === 'warning') {
      breathingSpeed = 4;
      breathingAmplitude = 0.06;
      meshRef.current.rotation.z = 0;
    } else {
      meshRef.current.rotation.z = 0;
    }

    const scaleY = 1 + Math.sin(t * breathingSpeed) * breathingAmplitude;
    meshRef.current.scale.set(1.5, 1.5 * scaleY, 1.5);

    // 2. Walking/Wobble Animation
    if (mood === 'walking') {
      meshRef.current.position.x = Math.sin(t * 3) * 0.5;
      meshRef.current.rotation.y = Math.cos(t * 3) * 0.3;
    } else {
      meshRef.current.position.x = 0;
      if (!isJumping) {
        // Slow rotation to show off 3D
        meshRef.current.rotation.y = Math.sin(t * 0.5) * 0.2;
      }
    }

    // 3. Jump and Spin Animation
    if (isJumping) {
      jumpTime.current += state.delta * 2; // Speed of the jump
      
      if (jumpTime.current >= Math.PI) {
        // Jump finished
        meshRef.current.position.y = 0;
        meshRef.current.rotation.y = 0;
        meshRef.current.rotation.x = 0;
        jumpTime.current = 0;
        onJumpComplete();
      } else {
        // Parabole jump curve: y = sin(progress) * height
        const jumpY = Math.sin(jumpTime.current) * 1.5;
        meshRef.current.position.y = jumpY;
        
        // Flip rotation
        meshRef.current.rotation.y = jumpTime.current * 2;
        meshRef.current.rotation.x = Math.sin(jumpTime.current) * 0.5;
      }
    }

    // 4. Update 3D Shadow scale & opacity
    if (shadowRef.current) {
      const jumpY = meshRef.current.position.y;
      const factor = Math.max(0.2, 1 - (jumpY / 1.5) * 0.8);
      shadowRef.current.scale.set(factor, factor, 1);
      if (shadowRef.current.material) {
        shadowRef.current.material.opacity = 0.15 * factor;
      }
    }
  });

  return (
    <group>
      <mesh 
        ref={meshRef} 
        onClick={() => {
          if (!isJumping) {
            onTap?.();
          }
        }}
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial 
          map={texture} 
          color={MOOD_COLORS[mood]} 
          transparent 
        />
      </mesh>

      {/* 3D Shadow underneath the cat */}
      <mesh 
        ref={shadowRef}
        rotation={[-Math.PI / 2, 0, 0]} 
        position={[0, -0.9, 0]}
      >
        <ringGeometry args={[0, 0.45, 32]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.15} />
      </mesh>
    </group>
  );
}

export default function Cat3D({ size = 150, mood = 'good', onTap }: Cat3DProps) {
  const [isJumping, setIsJumping] = useState(false);

  const handleTap = () => {
    if (isJumping) return;
    setIsJumping(true);
    onTap?.();
  };

  return (
    <View style={{ width: size, height: size }} className="items-center justify-center relative">
      <Canvas style={{ width: '100%', height: '100%' }}>
        <ambientLight intensity={1.5} />
        <directionalLight position={[2, 5, 2]} intensity={1.5} />
        
        <React.Suspense fallback={null}>
          <CatMesh 
            mood={mood} 
            isJumping={isJumping} 
            onJumpComplete={() => setIsJumping(false)}
            onTap={handleTap}
          />
        </React.Suspense>
      </Canvas>
    </View>
  );
}
