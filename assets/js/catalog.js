/**
 * TerraForge Studio - Data Catalog
 * Vessels, Substrate Stratigraphy Definitions & Botanical/Micro-Fauna Specimens
 */

export const VESSELS = [
    {
        id: 'wardian',
        name: 'Geometric Wardian Case',
        subtitle: 'Faceted leaded-glass prism',
        wholesaleCost: 22.00,
        humidityRetention: 88,
        clipId: 'clip-wardian',
        baseY: 485,
        topY: 70
    },
    {
        id: 'apothecary',
        name: 'Victorian Apothecary Jar',
        subtitle: 'Heavy bell-curved glass dome',
        wholesaleCost: 18.00,
        humidityRetention: 92,
        clipId: 'clip-apothecary',
        baseY: 485,
        topY: 85
    },
    {
        id: 'flask',
        name: 'Erlenmeyer Bio-Flask (2000ml)',
        subtitle: 'Borosilicate narrow-neck laboratory vessel',
        wholesaleCost: 19.50,
        humidityRetention: 95,
        clipId: 'clip-flask',
        baseY: 485,
        topY: 70
    },
    {
        id: 'globe',
        name: 'Wide Botanical Bowl',
        subtitle: 'Open-mouth crystal sphere',
        wholesaleCost: 14.50,
        humidityRetention: 65,
        clipId: 'clip-globe',
        baseY: 485,
        topY: 105
    },
    {
        id: 'cylinder',
        name: 'Modern Gallery Cylinder',
        subtitle: 'Tall seamless museum column',
        wholesaleCost: 16.50,
        humidityRetention: 84,
        clipId: 'clip-cylinder',
        baseY: 485,
        topY: 75
    }
];

export const SUBSTRATE_DEFS = [
    {
        id: 'leca',
        name: 'Expanded Clay (LECA) Drainage',
        role: 'False bottom water reservoir',
        pattern: 'url(#pat-leca)',
        stroke: '#6b4423',
        colorDot: '#8b5a2b',
        costPerMm: 0.08,
        minMm: 0,
        maxMm: 50
    },
    {
        id: 'charcoal',
        name: 'Activated Horticultural Charcoal',
        role: 'Filtration & anti-fungal toxin trap',
        pattern: 'url(#pat-charcoal)',
        stroke: '#111314',
        colorDot: '#2d3338',
        costPerMm: 0.14,
        minMm: 0,
        maxMm: 25
    },
    {
        id: 'sphagnum',
        name: 'Long-Fiber Sphagnum Barrier',
        role: 'Prevents soil sifting into drainage',
        pattern: 'url(#pat-sphagnum)',
        stroke: '#8a794d',
        colorDot: '#a99967',
        costPerMm: 0.10,
        minMm: 0,
        maxMm: 25
    },
    {
        id: 'soil',
        name: 'ABG Bio-Active Tropical Mix',
        role: 'Coco coir, tree fern fiber, orchid bark & worm castings',
        pattern: 'url(#pat-soil)',
        stroke: '#2b1d14',
        colorDot: '#3d291d',
        costPerMm: 0.11,
        minMm: 10,
        maxMm: 70
    },
    {
        id: 'sand',
        name: 'Decorative Silica Top-Dress',
        role: 'Aesthetic geological accent layer',
        pattern: 'url(#pat-sand)',
        stroke: '#bfa57a',
        colorDot: '#d6c19c',
        costPerMm: 0.07,
        minMm: 0,
        maxMm: 25
    }
];

export const BIOME_CATALOG = [
    {
        id: 'fittonia-pink',
        name: 'Pink Angel Fittonia',
        latin: 'Fittonia albivenis',
        category: 'plant',
        biome: 'tropical',
        idealHumidity: [70, 98],
        idealLight: [35, 75],
        wholesaleCost: 4.25,
        emoji: '🌺',
        description: 'Striking pink-veined nerve plant; thrives in sealed humid glass.'
    },
    {
        id: 'cushion-moss',
        name: 'Pillow Cushion Moss',
        latin: 'Leucobryum glaucum',
        category: 'plant',
        biome: 'tropical',
        idealHumidity: [72, 99],
        idealLight: [25, 75],
        wholesaleCost: 3.00,
        emoji: '🟢',
        description: 'Lush velvety mounds that regulate micro-humidity.'
    },
    {
        id: 'maidenhair-fern',
        name: 'Dwarf Maidenhair Fern',
        latin: 'Adiantum raddianum',
        category: 'plant',
        biome: 'tropical',
        idealHumidity: [75, 98],
        idealLight: [35, 70],
        wholesaleCost: 5.50,
        emoji: '🌿',
        description: 'Delicate cascading fronds on dark wiry stems.'
    },
    {
        id: 'peperomia-caperata',
        name: 'Emerald Ripple Peperomia',
        latin: 'Peperomia caperata',
        category: 'plant',
        biome: 'tropical',
        idealHumidity: [60, 90],
        idealLight: [40, 80],
        wholesaleCost: 4.75,
        emoji: '🌱',
        description: 'Deeply corrugated foliage with burgundy undersides.'
    },
    {
        id: 'Marcgravia',
        name: 'Shingle Climbing Vine',
        latin: 'Marcgravia rectiflora',
        category: 'plant',
        biome: 'tropical',
        idealHumidity: [75, 99],
        idealLight: [30, 75],
        wholesaleCost: 7.50,
        emoji: '🍃',
        description: 'Collector epiphyte that climbs driftwood & stone.'
    },
    {
        id: 'echeveria-arid',
        name: 'Desert Rosette Succulent',
        latin: 'Echeveria elegans',
        category: 'plant',
        biome: 'arid',
        idealHumidity: [15, 48],
        idealLight: [70, 100],
        wholesaleCost: 3.75,
        emoji: '🌵',
        description: 'Arid succulent. WARNING: Rots quickly in closed humid vessels!'
    },
    {
        id: 'seiryu-stone',
        name: 'Mini Seiryu Dragon Stone',
        latin: 'Calcite veined limestone',
        category: 'hardscape',
        biome: 'neutral',
        idealHumidity: [0, 100],
        idealLight: [0, 100],
        wholesaleCost: 4.50,
        emoji: '🪨',
        description: 'Dramatic craggy iwagumi mountain stone.'
    },
    {
        id: 'spider-driftwood',
        name: 'Twisted Azalea Driftwood',
        latin: 'Rhododendron rootwood',
        category: 'hardscape',
        biome: 'neutral',
        idealHumidity: [0, 100],
        idealLight: [0, 100],
        wholesaleCost: 5.25,
        emoji: '🪵',
        description: 'Sculptural aged branch for epiphytes and moss.'
    },
    {
        id: 'springtails',
        name: 'Temperate White Springtails',
        latin: 'Folsomia candida (Colony)',
        category: 'fauna',
        biome: 'tropical',
        idealHumidity: [65, 99],
        idealLight: [0, 100],
        wholesaleCost: 3.50,
        emoji: '🐜',
        description: 'Essential micro-fauna clean-up crew that consumes mold.'
    },
    {
        id: 'dwarf-isopods',
        name: 'Rubber Ducky Isopods (x5)',
        latin: 'Cubaris sp.',
        category: 'fauna',
        biome: 'tropical',
        idealHumidity: [70, 95],
        idealLight: [0, 90],
        wholesaleCost: 9.00,
        emoji: '🐞',
        description: 'Adorable detritivores that cycle decaying leaves into plant nutrients.'
    }
];

