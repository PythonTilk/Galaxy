import type { PlanetData } from '../services/api';

export const solarSystemData: Record<string, PlanetData> = {
    sun: {
        id: 'sun',
        englishName: 'Sun',
        gravity: 274,
        avgTemp: 5778,
        meanRadius: 695700,
        density: 1.41,
        sideralOrbit: 0,
        sideralRotation: 609.12,
        mass: { massValue: 1.989, massExponent: 30 },
        moons: [],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/b/b4/The_Sun_by_the_Atmospheric_Imaging_Assembly_of_NASA%27s_Solar_Dynamics_Observatory_-_20100819.jpg',
        referenceLinks: [
            { label: 'NASA Sun Facts', url: 'https://science.nasa.gov/sun/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Sun' }
        ],
        facts: [
            "Accounts for 99.86% of the solar system's mass.",
            "More than a million Earths could fit inside the Sun.",
            "It is a 'yellow dwarf' star, about 4.6 billion years old."
        ]
    },
    mercury: {
        id: 'mercury',
        englishName: 'Mercury',
        gravity: 3.7,
        avgTemp: 440,
        meanRadius: 2439.7,
        density: 5.43,
        sideralOrbit: 87.97,
        sideralRotation: 1407.6,
        mass: { massValue: 3.3011, massExponent: 23 },
        moons: [],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/4/4a/Mercury_in_true_color.jpg',
        referenceLinks: [
            { label: 'NASA Mercury Facts', url: 'https://science.nasa.gov/mercury/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Mercury_(planet)' }
        ],
        facts: [
            "A year is 88 Earth days, but a day is 176 Earth days.",
            "Smallest planet, only slightly larger than Earth's Moon.",
            "Has water ice in permanently shadowed craters."
        ]
    },
    venus: {
        id: 'venus',
        englishName: 'Venus',
        gravity: 8.87,
        avgTemp: 737,
        meanRadius: 6051.8,
        density: 5.24,
        sideralOrbit: 224.7,
        sideralRotation: -5832.5,
        mass: { massValue: 4.8675, massExponent: 24 },
        moons: [],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/08/Venus_from_Mariner_10.jpg',
        referenceLinks: [
            { label: 'NASA Venus Facts', url: 'https://science.nasa.gov/venus/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Venus' }
        ],
        facts: [
            "A day on Venus is longer than its year.",
            "Spins clockwise, opposite to most other planets.",
            "Hottest planet, with temperatures around 462°C."
        ]
    },
    earth: {
        id: 'earth',
        englishName: 'Earth',
        gravity: 9.8,
        avgTemp: 288,
        meanRadius: 6371,
        density: 5.51,
        sideralOrbit: 365.25,
        sideralRotation: 23.93,
        mass: { massValue: 5.972, massExponent: 24 },
        moons: [{ moon: 'Moon', rel: '' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/9/97/The_Earth_seen_from_Apollo_17.jpg',
        referenceLinks: [
            { label: 'NASA Earth Facts', url: 'https://science.nasa.gov/earth/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Earth' }
        ],
        facts: [
            "Not perfectly round; bulges at the equator.",
            "Oceans cover 70% of the surface.",
            "Days are getting longer by 1.7ms every century."
        ]
    },
    mars: {
        id: 'mars',
        englishName: 'Mars',
        gravity: 3.71,
        avgTemp: 210,
        meanRadius: 3389.5,
        density: 3.93,
        sideralOrbit: 687,
        sideralRotation: 24.62,
        mass: { massValue: 6.4171, massExponent: 23 },
        moons: [{ moon: 'Phobos', rel: '' }, { moon: 'Deimos', rel: '' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/0/02/OSIRIS_Mars_true_color.jpg',
        referenceLinks: [
            { label: 'NASA Mars Facts', url: 'https://science.nasa.gov/mars/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Mars' }
        ],
        facts: [
            "Called the 'Red Planet' due to rusty iron soil.",
            "Home to Olympus Mons, the largest volcano in the solar system.",
            "Has two potato-shaped moons, Phobos and Deimos."
        ]
    },
    jupiter: {
        id: 'jupiter',
        englishName: 'Jupiter',
        gravity: 24.79,
        avgTemp: 165,
        meanRadius: 69911,
        density: 1.33,
        sideralOrbit: 4332.59,
        sideralRotation: 9.93,
        mass: { massValue: 1.8982, massExponent: 27 },
        moons: [{ moon: 'Io', rel: '' }, { moon: 'Europa', rel: '' }, { moon: 'Ganymede', rel: '' }, { moon: 'Callisto', rel: '' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/2/2b/Jupiter_and_its_shrunken_Great_Red_Spot.jpg',
        referenceLinks: [
            { label: 'NASA Jupiter Facts', url: 'https://science.nasa.gov/jupiter/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Jupiter' }
        ],
        facts: [
            "Largest planet, could fit 1,300 Earths inside.",
            "Shortest day of any planet (less than 10 hours).",
            "Great Red Spot is a storm raging for over 350 years."
        ]
    },
    saturn: {
        id: 'saturn',
        englishName: 'Saturn',
        gravity: 10.44,
        avgTemp: 134,
        meanRadius: 58232,
        density: 0.69,
        sideralOrbit: 10759.22,
        sideralRotation: 10.7,
        mass: { massValue: 5.6834, massExponent: 26 },
        moons: [{ moon: 'Titan', rel: '' }, { moon: 'Enceladus', rel: '' }, { moon: 'Mimas', rel: '' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Saturn_during_Equinox.jpg',
        referenceLinks: [
            { label: 'NASA Saturn Facts', url: 'https://science.nasa.gov/saturn/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Saturn' }
        ],
        facts: [
            "Less dense than water; would float in a giant bathtub.",
            "Has a hexagon-shaped jet stream at its north pole.",
            "Has the most extensive ring system."
        ]
    },
    uranus: {
        id: 'uranus',
        englishName: 'Uranus',
        gravity: 8.69,
        avgTemp: 76,
        meanRadius: 25362,
        density: 1.27,
        sideralOrbit: 30688.5,
        sideralRotation: -17.24,
        mass: { massValue: 8.681, massExponent: 25 },
        moons: [{ moon: 'Titania', rel: '' }, { moon: 'Oberon', rel: '' }, { moon: 'Umbriel', rel: '' }, { moon: 'Ariel', rel: '' }, { moon: 'Miranda', rel: '' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/3/3d/Uranus2.jpg',
        referenceLinks: [
            { label: 'NASA Uranus Facts', url: 'https://science.nasa.gov/uranus/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Uranus' }
        ],
        facts: [
            "Tipped on its side with an axial tilt of 98 degrees.",
            "Coldest planetary atmosphere, down to -224°C.",
            "Has faint rings and 27 moons."
        ]
    },
    neptune: {
        id: 'neptune',
        englishName: 'Neptune',
        gravity: 11.15,
        avgTemp: 72,
        meanRadius: 24622,
        density: 1.64,
        sideralOrbit: 60182,
        sideralRotation: 16.11,
        mass: { massValue: 1.02413, massExponent: 26 },
        moons: [{ moon: 'Triton', rel: '' }],
        imageUrl: 'https://upload.wikimedia.org/wikipedia/commons/6/63/Neptune_-_Voyager_2_%2829347980845%29_flatten_crop.jpg',
        referenceLinks: [
            { label: 'NASA Neptune Facts', url: 'https://science.nasa.gov/neptune/facts/' },
            { label: 'Wikipedia', url: 'https://en.wikipedia.org/wiki/Neptune' }
        ],
        facts: [
            "Windiest world, with winds over 2,000 km/h.",
            "First planet predicted by mathematics before observation.",
            "A year lasts 165 Earth years."
        ]
    }
};
