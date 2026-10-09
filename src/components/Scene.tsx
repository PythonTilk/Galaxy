
import { OrbitControls, Stars } from '@react-three/drei';
import { SolarSystem } from './SolarSystem';
import { Galaxy } from './Galaxy';
import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

interface SceneProps {
    view: string;
    onPlanetSelect?: (name: string | null) => void;
    selectedPlanet: string | null;
    onLocationSelect?: (data: any) => void;
}

export const Scene = ({ view, onPlanetSelect, selectedPlanet, onLocationSelect }: SceneProps) => {
    const { camera } = useThree();
    const controlsRef = useRef<any>(null);

    // Handle planet selection - now just notifies parent
    const handlePlanetSelect = (name: string | null) => {
        onPlanetSelect?.(name || '');
    };

    // Reset camera when switching views
    useEffect(() => {
        if (controlsRef.current) {
            if (view === 'Galaxy') {
                camera.position.set(0, 100, 150);
                controlsRef.current.target.set(0, 0, 0);
            } else {
                camera.position.set(0, 20, 25);
                controlsRef.current.target.set(0, 0, 0);
            }
            controlsRef.current.update();
        }
    }, [view, camera]);

    const handleLocationSelect = (position: THREE.Vector3, data: any) => {
        onLocationSelect?.(data);
        // Galaxy view might still want camera movement? 
        // For now leaving Galaxy logic as is, or simplifying if requested.
        // User only mentioned Planet Inspector.

        if (controlsRef.current) {
            const offset = new THREE.Vector3(0, 20, 40);
            const newCamPos = position.clone().add(offset);
            controlsRef.current.object.position.copy(newCamPos);
            controlsRef.current.target.copy(position);
            controlsRef.current.update();
        }
    };

    // Zoom out effect when planet is selected
    useFrame((state, delta) => {
        if (controlsRef.current && view === 'Solar System') {
            const targetZoom = selectedPlanet ? 60 : 25; // Zoom out to 60 when selected, default 25
            const currentPos = state.camera.position;

            // Smoothly interpolate camera Z position
            // We only modify Z to keep the angle consistent-ish, or we could lerp the whole vector.
            // Let's lerp the distance.
            // Actually, just lerping Z is easiest for "stepping back".

            // But we need to respect OrbitControls.
            // OrbitControls updates the camera. If we manually update it, it might fight.
            // Better to update the controls' distance? No, controls don't have a "distance" prop we can animate easily.
            // We can animate the camera position, and OrbitControls will sync.

            const idealPos = new THREE.Vector3(0, 20, targetZoom);
            state.camera.position.lerp(idealPos, 2 * delta);
            controlsRef.current.update();
        }
    });

    return (
        <>
            <OrbitControls
                ref={controlsRef}
                makeDefault
                maxDistance={view === 'Solar System' ? 200 : 500}
                minDistance={0.5}
                enablePan={true}
            />

            {/* Reduced ambient light for better day/night contrast, dimmed further on selection */}
            <ambientLight intensity={selectedPlanet ? 0.02 : 0.1} />

            {/* Main sun light */}
            <pointLight position={[0, 0, 0]} intensity={2.5} color="#ffffff" distance={150} decay={2} />

            {/* Faint fill light, dimmed on selection */}
            <hemisphereLight intensity={selectedPlanet ? 0.02 : 0.1} color="#ffffff" groundColor="#000000" />

            <Stars radius={300} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

            {view === 'Solar System' ? (
                <SolarSystem
                    onPlanetSelect={(name) => handlePlanetSelect(name)}
                    // Only pause if hovered AND NOT selected. If selected, we want it running in background.
                    // Hover removed, so never pause on hover.
                    isPaused={false}
                    selectedPlanet={selectedPlanet}
                />
            ) : (
                <Galaxy onLocationSelect={handleLocationSelect} />
            )}

            <EffectComposer multisampling={0}>
                <Bloom luminanceThreshold={0.5} luminanceSmoothing={0.9} height={300} intensity={1.5} />
            </EffectComposer>
        </>
    );
};
