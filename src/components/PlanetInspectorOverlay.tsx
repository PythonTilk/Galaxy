import { Canvas } from '@react-three/fiber';
import { PlanetInspector } from './PlanetInspector';
import type { PlanetData } from '../services/api';
import { motion, AnimatePresence } from 'framer-motion';

interface PlanetInspectorOverlayProps {
    isOpen: boolean;
    selectedPlanet: string | null;
    planetData: PlanetData | null;
    texturePath: string | null;
    onClose: () => void;
}

export const PlanetInspectorOverlay = ({ isOpen, selectedPlanet, planetData, texturePath, onClose }: PlanetInspectorOverlayProps) => {
    return (
        <AnimatePresence>
            {isOpen && selectedPlanet && planetData && texturePath && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        zIndex: 20, // Above UI
                        background: 'rgba(0, 0, 0, 0.2)', // Darken background slightly
                        // backdropFilter: 'blur(10px)', // Removed per user request
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div style={{ width: '100%', height: '100%' }}>
                        <Canvas camera={{ position: [0, 0, 9], fov: 45 }}>
                            <PlanetInspector
                                data={planetData}
                                texturePath={texturePath}
                                onClose={onClose}
                            />
                        </Canvas>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};
