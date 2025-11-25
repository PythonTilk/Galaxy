export interface GalacticLocationData {
    name: string;
    type: 'nebula' | 'cluster' | 'star' | 'blackhole' | 'solar-system';
    position: [number, number, number];
    description: string;
    color: string;
}

export const galaxyLocations: GalacticLocationData[] = [
    {
        name: "Galactic Center",
        type: "blackhole",
        position: [0, 0, 0],
        description: "Sagittarius A*, the supermassive black hole at the heart of our galaxy. Mass: 4 million Suns.",
        color: "#ffaa00"
    },
    {
        name: "Solar System",
        type: "solar-system",
        position: [50, 0, 0],
        description: "Our home. Located in the Orion Arm, about 26,000 light-years from the Galactic Center.",
        color: "#00ffff"
    },
    {
        name: "Crab Nebula",
        type: "nebula",
        position: [45, 2, 10],
        description: "Remnant of a supernova observed in 1054 AD. A pulsar lies at its center.",
        color: "#ff00ff"
    },
    {
        name: "Orion Nebula",
        type: "nebula",
        position: [52, -1, 5],
        description: "A stellar nursery where new stars are being born. Visible to the naked eye.",
        color: "#ff6030"
    },
    {
        name: "Pleiades",
        type: "cluster",
        position: [48, 1, -5],
        description: "The Seven Sisters. An open star cluster dominated by hot blue luminous stars.",
        color: "#4169E1"
    }
];
