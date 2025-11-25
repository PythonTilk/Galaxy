import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface AsteroidBeltProps {
    count?: number;
    radius?: number;
    width?: number;
}

export const AsteroidBelt = ({ count = 400, radius = 20, width = 4 }: AsteroidBeltProps) => {
    const meshRef = useRef<THREE.InstancedMesh>(null);

    const { dummy, position, rotation, scale } = useMemo(() => {
        const dummy = new THREE.Object3D();
        const position = new THREE.Vector3();
        const rotation = new THREE.Euler();
        const scale = new THREE.Vector3();
        return { dummy, position, rotation, scale };
    }, []);

    useFrame(({ clock }) => {
        if (meshRef.current) {
            meshRef.current.rotation.y = clock.getElapsedTime() * 0.05;
        }
    });

    useMemo(() => {
        if (!meshRef.current) return;

        for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const r = radius + (Math.random() - 0.5) * width;

            position.set(
                Math.cos(angle) * r,
                (Math.random() - 0.5) * 0.5,
                Math.sin(angle) * r
            );

            rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);

            const s = Math.random() * 0.1 + 0.05;
            scale.set(s, s, s);

            dummy.position.copy(position);
            dummy.rotation.copy(rotation);
            dummy.scale.copy(scale);
            dummy.updateMatrix();

            meshRef.current.setMatrixAt(i, dummy.matrix);
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
    }, [count, radius, width, dummy, position, rotation, scale]);

    return (
        <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
            <dodecahedronGeometry args={[0.2, 0]} />
            <meshStandardMaterial color="#888888" roughness={0.8} />
        </instancedMesh>
    );
};
