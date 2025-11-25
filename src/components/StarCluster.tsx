import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

const ClusterMaterial = {
    vertexShader: `
    uniform float uTime;
    uniform float uSize;
    
    attribute float aScale;
    attribute vec3 aRandomness;
    
    varying vec3 vColor;
    
    void main() {
      vec4 modelPosition = modelMatrix * vec4(position, 1.0);
      
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
      // Circular particle with glow
      float strength = distance(gl_PointCoord, vec2(0.5));
      strength = 1.0 - strength;
      strength = pow(strength, 5.0);
      
      vec3 color = mix(vec3(0.0), vColor, strength);
      
      gl_FragColor = vec4(color, 1.0);
    }
  `
};

interface StarClusterProps {
    count?: number;
    color: string;
    radius: number;
    position: [number, number, number];
}

export const StarCluster = ({ count = 500, color, radius, position }: StarClusterProps) => {
    const materialRef = useRef<THREE.ShaderMaterial>(null);

    const { positions, colors, scales, randomness } = useMemo(() => {
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const scales = new Float32Array(count * 1);
        const randomness = new Float32Array(count * 3);

        const clusterColor = new THREE.Color(color);

        for (let i = 0; i < count; i++) {
            const i3 = i * 3;

            // Spherical distribution (Gaussian-like for core density)
            const r = Math.random() * radius * (Math.random() < 0.5 ? 0.5 : 1.0); // More density in center
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos(2 * Math.random() - 1);

            positions[i3] = r * Math.sin(phi) * Math.cos(theta);
            positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
            positions[i3 + 2] = r * Math.cos(phi);

            // Randomness
            randomness[i3] = (Math.random() - 0.5) * radius * 0.1;
            randomness[i3 + 1] = (Math.random() - 0.5) * radius * 0.1;
            randomness[i3 + 2] = (Math.random() - 0.5) * radius * 0.1;

            // Color variation
            const mixedColor = clusterColor.clone();
            mixedColor.offsetHSL(0, 0, (Math.random() - 0.5) * 0.1);

            colors[i3] = mixedColor.r;
            colors[i3 + 1] = mixedColor.g;
            colors[i3 + 2] = mixedColor.b;

            // Scale
            scales[i] = Math.random() * 2 + 1; // Brighter/larger stars
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
        uSize: { value: 30 * window.devicePixelRatio }
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
                vertexShader={ClusterMaterial.vertexShader}
                fragmentShader={ClusterMaterial.fragmentShader}
                uniforms={uniforms}
            />
        </points>
    );
};
