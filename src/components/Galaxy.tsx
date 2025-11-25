import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { GalacticLocation } from './GalacticLocation';
import { Nebula } from './Nebula';
import { StarCluster } from './StarCluster';

import { galaxyLocations } from '../data/galaxyLocations';

const GalaxyMaterial = {
    vertexShader: `
    uniform float uTime;
    uniform float uSize;
    
    attribute float aScale;
    attribute vec3 aRandomness;
    
    varying vec3 vColor;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Rotate entire galaxy
      float angle = atan(modelPosition.x, modelPosition.z);
      float distanceToCenter = length(modelPosition.xz);
      float angleOffset = (1.0 / distanceToCenter) * uTime * 0.2;
      angle += angleOffset;
      
      modelPosition.x = cos(angle) * distanceToCenter;
      modelPosition.z = sin(angle) * distanceToCenter;
      
      // Add randomness
      modelPosition.xyz += aRandomness;

      vec4 viewPosition = viewMatrix * modelPosition;
      vec4 projectedPosition = projectionMatrix * viewPosition;
      
      gl_Position = projectedPosition;
      
      // Size attenuation
      gl_PointSize = uSize * aScale;
      gl_PointSize *= (1.0 / -viewPosition.z);

      vColor = color;
    }
  `,
    fragmentShader: `
    varying vec3 vColor;
    
    void main() {
      // Circular particle
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - strength;
      strength = pow(strength, 10.0);
      
      vec3 color = mix(vec3(0.0), vColor, strength);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

export const Galaxy = ({ onLocationSelect }: { onLocationSelect?: (position: THREE.Vector3, data: any) => void }) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const parameters = {
        count: 100000,
        size: 30,
        radius: 100,
        branches: 3,
        spin: 1,
        randomness: 0.2,
        randomnessPower: 3,
    };

    const { positions, colors, scales, randomness } = useMemo(() => {
        const positions = new Float32Array(parameters.count * 3);
        const colors = new Float32Array(parameters.count * 3);
        const scales = new Float32Array(parameters.count * 1);
        const randomness = new Float32Array(parameters.count * 3);

        // Star classification data (Type, Color, Size, Probability)
        const starTypes = [
            { color: new THREE.Color('#9BB0FF'), size: 10.0, prob: 0.001 }, // O - Blue-white
            { color: new THREE.Color('#AABFFF'), size: 7.0, prob: 0.005 },  // B - Blue-white
            { color: new THREE.Color('#CAD7FF'), size: 5.0, prob: 0.01 },   // A - White
            { color: new THREE.Color('#F8F7FF'), size: 3.5, prob: 0.03 },   // F - Yellow-white
            { color: new THREE.Color('#FFF4EA'), size: 2.5, prob: 0.08 },   // G - Yellow
            { color: new THREE.Color('#FFD2A1'), size: 1.8, prob: 0.15 },   // K - Orange
            { color: new THREE.Color('#FFCC6F'), size: 1.2, prob: 1.0 }     // M - Red (remaining)
        ];

        for (let i = 0; i < parameters.count; i++) {
            const i3 = i * 3;

            // Select Star Type based on probability
            const roll = Math.random();
            let starType = starTypes[6]; // Default to M
            for (const type of starTypes) {
                if (roll < type.prob) {
                    starType = type;
                    break;
                }
            }

            // Position
            const radius = Math.random() * parameters.radius;
            const spinAngle = radius * parameters.spin;

            // 3 Branches + Bulge
            let branchAngle;
            let currentRandomness = parameters.randomness;

            // Galactic Bulge (Inner 15% radius)
            if (radius < parameters.radius * 0.15) {
                // Bulge is spherical/uniform, not spiral
                branchAngle = Math.random() * Math.PI * 2;
                currentRandomness = parameters.randomness * 2; // More scatter in bulge

                // Bulge has more older stars (G, K, M)
                if (Math.random() > 0.1) { // 90% chance to force older star in bulge
                    const bulgeTypes = starTypes.slice(4); // G, K, M
                    starType = bulgeTypes[Math.floor(Math.random() * bulgeTypes.length)];
                }
            } else {
                // Spiral Arms
                branchAngle = ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
            }

            positions[i3] = Math.cos(branchAngle + spinAngle) * radius;
            positions[i3 + 1] = 0;
            positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius;

            // Randomness
            const randomX = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * currentRandomness * radius;
            const randomY = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * currentRandomness * radius;
            const randomZ = Math.pow(Math.random(), parameters.randomnessPower) * (Math.random() < 0.5 ? 1 : -1) * currentRandomness * radius;

            randomness[i3] = randomX;
            randomness[i3 + 1] = randomY;
            randomness[i3 + 2] = randomZ;

            // Color
            colors[i3] = starType.color.r;
            colors[i3 + 1] = starType.color.g;
            colors[i3 + 2] = starType.color.b;

            // Scale - vary slightly within type
            // Bulge stars slightly larger for glow effect
            const sizeMultiplier = radius < parameters.radius * 0.15 ? 1.5 : 1.0;
            scales[i] = starType.size * (0.8 + Math.random() * 0.4) * sizeMultiplier;
        }

        return { positions, colors, scales, randomness };
    }, []);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSize: { value: parameters.size * window.devicePixelRatio }
    }), []);

    return (
        <group>
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        count={positions.length / 3}
                        array={positions}
                        itemSize={3}
                        args={[positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-color"
                        count={colors.length / 3}
                        array={colors}
                        itemSize={3}
                        args={[colors, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-aScale"
                        count={scales.length}
                        array={scales}
                        itemSize={1}
                        args={[scales, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-aRandomness"
                        count={randomness.length / 3}
                        array={randomness}
                        itemSize={3}
                        args={[randomness, 3]}
                    />
                </bufferGeometry>
                <shaderMaterial
                    ref={materialRef}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    vertexColors={true}
                    transparent={true}
                    vertexShader={GalaxyMaterial.vertexShader}
                    fragmentShader={GalaxyMaterial.fragmentShader}
                    uniforms={uniforms}
                />
            </points>

            {/* Nebulae for specific locations */}
            {galaxyLocations.filter(loc => loc.type === 'nebula').map((loc, index) => (
                <Nebula
                    key={`nebula-${index}`}
                    color={loc.color}
                    radius={5}
                    position={loc.position}
                    count={1000}
                />
            ))}

            {/* Star Clusters for specific locations */}
            {galaxyLocations.filter(loc => loc.type === 'cluster').map((loc, index) => (
                <StarCluster
                    key={`cluster-${index}`}
                    color={loc.color}
                    radius={3}
                    position={loc.position}
                    count={500}
                />
            ))}

            {/* Interactive Locations */}
            {galaxyLocations.map((loc, index) => (
                <GalacticLocation
                    key={index}
                    {...loc}
                    onClick={() => onLocationSelect?.(new THREE.Vector3(...loc.position), loc)}
                />
            ))}
        </group>
    );
};
