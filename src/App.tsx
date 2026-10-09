import { useState, useEffect, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { Scene } from './components/Scene';
import { UI } from './components/UI';
import { DetailsPanel } from './components/DetailsPanel';
import { PlanetInspectorOverlay } from './components/PlanetInspectorOverlay';
import { fetchPlanetData, type PlanetData } from './services/api';
import { Leva } from 'leva';
import { Html, useProgress } from '@react-three/drei';
import { ErrorBoundary } from './components/ErrorBoundary';
import type { GalacticLocationData } from './data/galaxyLocations';

import earthTexture from './assets/textures/earth.jpg';
import mercuryTexture from './assets/textures/mercury.jpg';
import venusTexture from './assets/textures/venus.jpg';
import marsTexture from './assets/textures/mars.jpg';
import jupiterTexture from './assets/textures/jupiter.jpg';
import saturnTexture from './assets/textures/saturn.jpg';
import uranusTexture from './assets/textures/uranus.jpg';
import neptuneTexture from './assets/textures/neptune.jpg';
import sunTexture from './assets/textures/sun.jpg';

// Map textures for easy access
const textureMap: Record<string, string> = {
  'mercury': mercuryTexture,
  'venus': venusTexture,
  'earth': earthTexture,
  'mars': marsTexture,
  'jupiter': jupiterTexture,
  'saturn': saturnTexture,
  'uranus': uranusTexture,
  'neptune': neptuneTexture,
  'sun': sunTexture
};

function Loader() {
  const { progress } = useProgress();
  return <Html center>{progress.toFixed(1)} % loaded</Html>;
}

function App() {
  const [view, setView] = useState('Solar System');
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<GalacticLocationData | null>(null);
  const [selectedPlanetData, setSelectedPlanetData] = useState<PlanetData | null>(null);
  const [loading, setLoading] = useState(false);

  // Fetch data when a planet is selected
  useEffect(() => {
    if (selectedPlanet) {
      setLoading(true);
      fetchPlanetData(selectedPlanet.toLowerCase())
        .then(data => {
          setSelectedPlanetData(data);
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setSelectedPlanetData(null);
    }
  }, [selectedPlanet]);

  const handleClosePanel = () => {
    setSelectedPlanet(null);
    setSelectedLocation(null);
  };

  const handleLocationSelect = (data: GalacticLocationData) => {
    setSelectedLocation(data);
    setSelectedPlanet(null); // Deselect planet if any
  };

  const handlePlanetSelect = (planetName: string | null) => {
    setSelectedPlanet(planetName);
    setSelectedLocation(null); // Deselect location if any
  };

  return (
    <div style={{ width: '100vw', height: '100vh', background: 'black', overflow: 'hidden' }}>
      <Leva collapsed />
      <UI
        currentView={view}
        onViewChange={setView}
      />
      <PlanetInspectorOverlay
        isOpen={!!selectedPlanet}
        selectedPlanet={selectedPlanet}
        planetData={selectedPlanetData}
        texturePath={selectedPlanet ? textureMap[selectedPlanet.toLowerCase()] : null}
        onClose={() => setSelectedPlanet(null)}
      />

      {/* Only show DetailsPanel for Galaxy locations now */}
      <DetailsPanel
        data={selectedLocation}
        loading={loading && !selectedPlanet}
        onClose={handleClosePanel}
      />
      <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
        <ErrorBoundary>
          <Suspense fallback={<Loader />}>
            <Scene
              view={view}
              onPlanetSelect={handlePlanetSelect}
              selectedPlanet={selectedPlanet}
              onLocationSelect={handleLocationSelect}
            />
          </Suspense>
        </ErrorBoundary>
      </Canvas>
    </div>
  );
}

export default App;
