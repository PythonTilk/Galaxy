import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useTexture, Line } from '@react-three/drei';

interface CelestialBodyProps {
    name: string;
    size: number;
    color?: string;
    distance?: number;
    speed?: number;
    texturePath?: string;
    emissive?: string;
    emissiveIntensity?: number;
    moons?: {
        name: string;
        size: number;
        distance: number;
        speed: number;
        color?: string;
        texturePath?: string;
    }[];
    onClick?: () => void;
    isPaused?: boolean;
    children?: React.ReactNode;
    isSelected?: boolean;
}

export const CelestialBody = ({
    name,
    size,
    color,
    distance = 0,
    speed = 1,
    texturePath,
    emissive,
    emissiveIntensity = 0,
    onClick,
    isPaused = false,
    children,
    isSelected = false
}: CelestialBodyProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const orbitRef = useRef<THREE.Group>(null);
    const texture = texturePath ? useTexture(texturePath) : null;

    const orbitTimeRef = useRef(0);

    useFrame(({ clock }, delta) => {
        if (!isPaused) {
            if (orbitRef.current && speed > 0) {
                orbitTimeRef.current += delta * speed * 0.1;
                orbitRef.current.rotation.y = orbitTimeRef.current;
            }
            if (meshRef.current) {
                meshRef.current.rotation.y += 0.005;
            }
        }
    });



    const handleClick = (e: any) => {
        e.stopPropagation();
        onClick?.();
    };

    return (
        <group>
            {/* Orbit path */}
            {distance > 0 && (
                <Line
                    points={new THREE.EllipseCurve(0, 0, distance, distance, 0, 2 * Math.PI, false, 0).getPoints(128)}
                    color="white"
                    opacity={0.15}
                    transparent
                    lineWidth={1}
                    rotation={[Math.PI / 2, 0, 0]}
                />
            )}

            <group ref={orbitRef}>
                <group position={[distance, 0, 0]}>
                    {/* Planet Mesh - Hidden if selected */}
                    {!isSelected && (
                        <mesh
                            ref={meshRef}
                            onClick={handleClick}
                            onPointerOver={() => document.body.style.cursor = 'pointer'}
                            onPointerOut={() => document.body.style.cursor = 'auto'}
                        >
                            <sphereGeometry args={[size, 32, 32]} />
                            <meshStandardMaterial
                                map={texture}
                                color={texture ? undefined : color}
                                emissive={emissive}
                                emissiveIntensity={emissiveIntensity}
                                roughness={1}
                                metalness={0}
                            />
                        </mesh>
                    )}

                    {/* Children (Moons, Rings, Inspector) */}
                    {children}
                </group>
            </group>
        </group>
    );
};
