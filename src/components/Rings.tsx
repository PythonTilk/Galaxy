import { DoubleSide } from 'three';
import { useTexture } from '@react-three/drei';

interface RingsProps {
    innerRadius: number;
    outerRadius: number;
    texturePath?: string;
    rotation?: [number, number, number];
}

export const Rings = ({ innerRadius, outerRadius, texturePath, rotation = [Math.PI / 2, 0, 0] }: RingsProps) => {
    const texture = texturePath ? useTexture(texturePath) : null;

    return (
        <mesh rotation={rotation}>
            <ringGeometry args={[innerRadius, outerRadius, 64]} />
            <meshStandardMaterial
                map={texture}
                color={texture ? 'white' : '#A49B72'}
                side={DoubleSide}
                transparent
                opacity={0.8}
            />
        </mesh>
    );
};
