import { CelestialBody } from './CelestialBody';
import { Moon } from './Moon';
import { Rings } from './Rings';
import { AsteroidBelt } from './AsteroidBelt';
import { PlanetInspector } from './PlanetInspector';
import { fetchPlanetData, type PlanetData } from '../services/api';
import * as THREE from 'three';
import earthTexture from '../assets/textures/earth.jpg';
import mercuryTexture from '../assets/textures/mercury.jpg';
import venusTexture from '../assets/textures/venus.jpg';
import marsTexture from '../assets/textures/mars.jpg';
import jupiterTexture from '../assets/textures/jupiter.jpg';
import saturnTexture from '../assets/textures/saturn.jpg';
import uranusTexture from '../assets/textures/uranus.jpg';
import neptuneTexture from '../assets/textures/neptune.jpg';
import sunTexture from '../assets/textures/sun.jpg';
import moonTexture from '../assets/textures/moon.jpg';

const planets = [
    { name: 'Mercury', size: 0.38, color: '#A5A5A5', distance: 6, speed: 1.5, texturePath: mercuryTexture },
    { name: 'Venus', size: 0.95, color: '#E3BB76', distance: 9, speed: 1.2, texturePath: venusTexture },
    {
        name: 'Earth', size: 1, color: '#2233FF', distance: 13, speed: 1.0, texturePath: earthTexture,
        moons: [{ name: 'Moon', size: 0.27, distance: 2, speed: 2, texturePath: moonTexture }]
    },
    {
        name: 'Mars', size: 0.53, color: '#DD4422', distance: 17, speed: 0.8, texturePath: marsTexture,
        moons: [
            { name: 'Phobos', size: 0.1, distance: 0.8, speed: 4, color: '#555' },
            { name: 'Deimos', size: 0.08, distance: 1.2, speed: 3, color: '#666' }
        ]
    },
    {
        name: 'Jupiter', size: 3.0, color: '#D9A066', distance: 25, speed: 0.4, texturePath: jupiterTexture,
        moons: [
            { name: 'Io', size: 0.2, distance: 3.5, speed: 2.5, color: '#eebb66' },
            { name: 'Europa', size: 0.18, distance: 4.0, speed: 2.0, color: '#ccc' },
            { name: 'Ganymede', size: 0.3, distance: 4.8, speed: 1.5, color: '#aaa' },
            { name: 'Callisto', size: 0.25, distance: 5.5, speed: 1.0, color: '#888' }
        ]
    },
    {
        name: 'Saturn', size: 2.5, color: '#EAD6B8', distance: 32, speed: 0.3, texturePath: saturnTexture,
        rings: { inner: 3.0, outer: 5.0 },
        moons: [
            { name: 'Titan', size: 0.35, distance: 6, speed: 1.2, color: '#dcb' }
        ]
    },
    { name: 'Uranus', size: 1.8, color: '#D1E7E7', distance: 38, speed: 0.2, texturePath: uranusTexture },
    { name: 'Neptune', size: 1.7, color: '#5B5DDF', distance: 43, speed: 0.1, texturePath: neptuneTexture },
];

interface SolarSystemProps {
    onPlanetSelect?: (name: string) => void;
    isPaused?: boolean;
    selectedPlanet: string | null;
}

export const SolarSystem = ({ onPlanetSelect, isPaused = false, selectedPlanet }: SolarSystemProps) => {

    return (
        <group>
            {/* Sun */}
            <CelestialBody
                name="Sun"
                size={4}
                color="#ffaa00"
                emissive="#ffaa00"
                emissiveIntensity={2}
                texturePath={sunTexture}
                onClick={() => onPlanetSelect?.('Sun')}
                isPaused={isPaused}
                isSelected={selectedPlanet === 'Sun'}
            >

            </CelestialBody>

            {/* Planets */}
            {planets.map((planet) => {
                // Logic:
                // 1. If selectedPlanet exists:
                //    - Current planet IS selected -> Moons ACTIVE
                //    - Current planet NOT selected -> Moons PAUSED
                // 2. Default -> Moons ACTIVE

                let areMoonsPaused = false;

                if (selectedPlanet) {
                    areMoonsPaused = selectedPlanet !== planet.name;
                }

                const isSelected = selectedPlanet === planet.name;

                return (
                    <CelestialBody
                        key={planet.name}
                        {...planet}
                        onClick={() => onPlanetSelect?.(planet.name)}
                        isPaused={isPaused}
                        isSelected={isSelected}
                    >
                        {/* Rings */}
                        {planet.rings && (
                            <Rings
                                innerRadius={planet.rings.inner}
                                outerRadius={planet.rings.outer}
                            />
                        )}

                        {/* Moons */}
                        {planet.moons?.map((moon) => (
                            <Moon
                                key={moon.name}
                                {...moon}
                                isPaused={areMoonsPaused}
                            />
                        ))}
                    </CelestialBody>
                );
            })}

            {/* Asteroid Belt */}
            <AsteroidBelt radius={21} width={4} count={800} />
        </group>
    );
};
