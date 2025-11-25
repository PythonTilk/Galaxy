import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh } from 'three';
import { useTexture, Text } from '@react-three/drei';

interface MoonProps {
    name: string;
    size: number;
    distance: number;
    speed: number;
    texturePath?: string;
    color?: string;
    isPaused?: boolean;
}

export const Moon = ({ name, size, distance, speed, texturePath, color = '#aaaaaa', isPaused = false }: MoonProps) => {
    const orbitRef = useRef<Mesh>(null);
    const meshRef = useRef<Mesh>(null);

    const texture = texturePath ? useTexture(texturePath) : null;

    const orbitTimeRef = useRef(0);

    useFrame(({ clock }, delta) => {
        if (!isPaused) {
            if (orbitRef.current) {
                orbitTimeRef.current += delta * speed * 0.5;
                orbitRef.current.rotation.y = orbitTimeRef.current;
            }
            if (meshRef.current) {
                meshRef.current.rotation.y += 0.01;
            }
        }
    });

    return (
        <group rotation-x={Math.random() * 0.5}> {/* Slight orbital inclination */}
            {/* Orbit path visual (optional, maybe too cluttered) */}
            {/* <mesh rotation-x={Math.PI / 2}>
                <ringGeometry args={[distance - 0.02, distance + 0.02, 64]} />
                <meshBasicMaterial color="#ffffff" opacity={0.05} transparent side={DoubleSide} />
            </mesh> */}

            <group ref={orbitRef}>
                <mesh
                    ref={meshRef}
                    position={[distance, 0, 0]}
                    castShadow
                    receiveShadow
                >
                    <sphereGeometry args={[size, 32, 32]} />
                    <meshStandardMaterial
                        map={texture}
                        color={texture ? 'white' : color}
                        roughness={0.8}
                    />
                    {/* Moon Label */}
                    <Text position={[0, size + 0.2, 0]} fontSize={0.2} color="#cccccc" anchorX="center" anchorY="bottom">
                        {name}
                    </Text>
                </mesh>
            </group>
        </group>
    );
};
