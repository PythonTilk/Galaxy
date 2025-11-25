import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const NebulaMaterial = {
    vertexShader: `
    uniform float uTime;
    uniform float uSize;
    
    attribute float aScale;
    attribute vec3 aRandomness;
    
    varying vec3 vColor;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
      // Rotate nebula slowly
      float angle = atan(modelPosition.x, modelPosition.z);
      float distanceToCenter = length(modelPosition.xz);
      float angleOffset = (1.0 / distanceToCenter) * uTime * 0.05;
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
      // Soft particle
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - strength;
      strength = pow(strength, 3.0);
      
      vec3 color = mix(vec3(0.0), vColor, strength);
      
      gl_FragColor = vec4(color, strength * 0.5); // Transparent
    }
  `
};

interface NebulaProps {
    count?: number;
    color: string;
    radius: number;
    position: [number, number, number];
}

export const Nebula = ({ count = 2000, color, radius, position }: NebulaProps) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const { positions, colors, scales, randomness } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const scales = new Float32Array(count * 1);
        const randomness = new Float32Array(count * 3);

        const nebulaColor = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spherical distribution
            const r = Math.random() * radius;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            // Randomness
            randomness[i3] = (Math.random() - 0.5) * radius * 0.5;
            randomness[i3 + 1] = (Math.random() - 0.5) * radius * 0.5;
            randomness[i3 + 2] = (Math.random() - 0.5) * radius * 0.5;

            // Color variation
            const mixedColor = nebulaColor.clone();
            mixedColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.2);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            // Scale
            scales[i] = Math.random() * 20; // Large particles for cloud effect
        }

        return { positions, colors, scales, randomness };
    }, [count, color, radius]);

    useFrame((state) => {
        if (materialRef.current) {
            materialRef.current.uniforms.uTime.value = state.clock.getElapsedTime();
        }
    });

    const uniforms = useMemo(() => ({
        uTime: { value: 0 },
        uSize: { value: 50 * window.devicePixelRatio }
    }), []);

    return (
        <points position={position}>
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
                vertexShader={NebulaMaterial.vertexShader}
                fragmentShader={NebulaMaterial.fragmentShader}
                uniforms={uniforms}
            />
        </points>
    );
};
