import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html, useTexture, Text } from '@react-three/drei';
import * as THREE from 'three';
import type { PlanetData } from '../services/api';
import { motion } from 'framer-motion';

interface PlanetInspectorProps {
    data: PlanetData;
    texturePath: string;
    onClose: () => void;
}

export const PlanetInspector = ({ data, texturePath, onClose }: PlanetInspectorProps) => {
    const meshRef = useRef<THREE.Mesh>(null);
    const texture = useTexture(texturePath);
    const [hoveredFact, setHoveredFact] = useState<number | null>(null);

    useFrame(() => {
        if (meshRef.current) {
            meshRef.current.rotation.y += 0.002; // Slow rotation for inspection
        }
    });

    // Positions for floating cards around the planet
    const factPositions = [
        [1.5, 0.5, 0],
        [-1.5, 0.8, 0.5],
        [0, -1.2, 1.2]
    ];

    return (
        <group>
            {/* Dedicated lights for the inspector view */}
            <ambientLight intensity={0.2} />
            <directionalLight position={[5, 5, 5]} intensity={2} />

            {/* High-res Planet Mesh */}
            <mesh ref={meshRef} scale={[2, 2, 2]}> {/* Scaled up for inspection */}
                <sphereGeometry args={[1, 64, 64]} />
                <meshStandardMaterial
                    map={texture}
                    roughness={1}
                    metalness={0}
                    emissive={new THREE.Color(0x222222)} // Slight glow
                    emissiveIntensity={0.1}
                />
            </mesh>

            {/* Title Annotation */}
            <Html position={[0, 2.5, 0]} center>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        color: 'white',
                        fontSize: '3rem',
                        fontWeight: 'bold',
                        textShadow: '0 0 10px rgba(0,0,0,0.8)',
                        pointerEvents: 'none',
                        textAlign: 'center'
                    }}
                >
                    {data.englishName}
                    <div style={{ fontSize: '1rem', fontWeight: 'normal', opacity: 0.8 }}>
                        {data.facts?.[0]?.split(' ').slice(0, 3).join(' ')}... {/* Tagline */}
                    </div>
                </motion.div>
            </Html>

            {/* Fact Annotations */}
            {data.facts?.map((fact, index) => (
                <Html
                    key={index}
                    position={factPositions[index % factPositions.length] as [number, number, number]}
                    center
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.2 + index * 0.1 }}
                        onMouseEnter={() => setHoveredFact(index)}
                        onMouseLeave={() => setHoveredFact(null)}
                        style={{
                            background: hoveredFact === index ? 'rgba(0,0,0,0.9)' : 'rgba(0,0,0,0.6)',
                            backdropFilter: 'blur(5px)',
                            padding: '15px',
                            borderRadius: '10px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            color: 'white',
                            width: '200px',
                            fontSize: '0.9rem',
                            cursor: 'help',
                            transition: 'all 0.3s ease',
                            transform: hoveredFact === index ? 'scale(1.1)' : 'scale(1)'
                        }}
                    >
                        {fact}
                    </motion.div>
                </Html>
            ))}

            {/* Close Button */}
            <Html position={[0, -3, 0]} center>
                <button
                    onClick={onClose}
                    style={{
                        background: 'white',
                        color: 'black',
                        border: 'none',
                        padding: '10px 30px',
                        borderRadius: '20px',
                        fontSize: '1.2rem',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(255,255,255,0.5)',
                        transition: 'transform 0.2s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    CLOSE VIEW
                </button>
            </Html>
        </group>
    );
};
