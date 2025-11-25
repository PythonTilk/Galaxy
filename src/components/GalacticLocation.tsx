import { useState, useRef } from 'react';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

interface GalacticLocationProps {
    position: [number, number, number];
    name: string;
    description: string;
    color: string;
    type: 'nebula' | 'cluster' | 'star' | 'blackhole' | 'solar-system';
    onClick?: () => void;
}

export const GalacticLocation = ({ position, name, description, color, type, onClick }: GalacticLocationProps) => {
    const [hovered, setHovered] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Make the marker face the camera
            meshRef.current.lookAt(state.camera.position);
        }
    });

    return (
        <group position={position}>
            {/* Interactive Marker */}
            <mesh
                ref={meshRef}
                onClick={(e) => {
                    e.stopPropagation();
                    onClick?.();
                }}
                onPointerOver={(e) => {
                    e.stopPropagation();
                    setHovered(true);
                    document.body.style.cursor = 'pointer';
                }}
                onPointerOut={(e) => {
                    e.stopPropagation();
                    setHovered(false);
                    document.body.style.cursor = 'auto';
                }}
            >
                <ringGeometry args={[0.5, 0.7, 32]} />
                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.8}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Inner Glow */}
            <mesh>
                <sphereGeometry args={[0.3, 16, 16]} />
                <meshBasicMaterial color={color} transparent opacity={0.4} />
            </mesh>

            {/* Tooltip */}
            {hovered && (
                <Html distanceFactor={15}>
                    <div style={{
                        background: 'rgba(0, 0, 0, 0.8)',
                        backdropFilter: 'blur(4px)',
                        padding: '12px',
                        borderRadius: '8px',
                        border: `1px solid ${color}`,
                        color: 'white',
                        width: '200px',
                        pointerEvents: 'none',
                        transform: 'translate3d(-50%, -100%, 0)',
                        marginTop: '-20px'
                    }}>
                        <h3 style={{ margin: '0 0 4px 0', fontSize: '16px', color: color }}>{name}</h3>
                        <div style={{ fontSize: '12px', color: '#ccc' }}>{type.toUpperCase()}</div>
                        <p style={{ margin: '8px 0 0 0', fontSize: '12px', lineHeight: '1.4' }}>
                            {description}
                        </p>
                    </div>
                </Html>
            )}
        </group>
    );
};
