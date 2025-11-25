import { solarSystemData } from '../data/planets';

export interface PlanetData {
    id: string;
    englishName: string;
    mass?: { massValue: number; massExponent: number };
    vol?: { volValue: number; volExponent: number };
    gravity: number;
    density: number;
    avgTemp: number;
    meanRadius: number;
    sideralOrbit: number;
    sideralRotation: number;
    moons?: { moon: string; rel: string }[];
    imageUrl?: string;
    referenceLinks?: { label: string; url: string }[];
    facts?: string[];
}

export const fetchPlanetData = async (planetId: string): Promise<PlanetData | null> => {
    // Simulate async delay for realism
    await new Promise(resolve => setTimeout(resolve, 500));

    const data = solarSystemData[planetId.toLowerCase()];
    if (data) {
        return data;
    }

    console.error(`Planet data not found for ID: ${planetId}`);
    return null;
};
