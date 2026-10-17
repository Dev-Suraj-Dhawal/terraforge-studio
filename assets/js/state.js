/**
 * TerraForge Studio - Reactive Application State & Presets
 */

export const state = {
    vesselId: 'wardian',
    isSealedLid: true,
    lightLevel: 65,
    substrates: {
        leca: 24,
        charcoal: 10,
        sphagnum: 8,
        soil: 36,
        sand: 6
    },
    placedItems: [],
    selectedInstanceId: null,
    catalogFilter: 'all',
    laborCost: 16,
    retailMarkup: 2.2,
    aiEngineMode: 'ollama', // 'ollama' or 'webgpu'
    activeAiTab: 'listing',
    currentSoilSurfaceY: 350,
    lastBioReport: {
        score: 96,
        effectiveHumidity: 84,
        statusText: 'Self-Sustaining Loop',
        warnings: [],
        strengths: []
    },
    economics: {
        cogs: '28.50',
        labor: '16.00',
        retailPrice: '98.00',
        netProfit: '53.50',
        marginPct: 55
    }
};

export const dragState = {
    isDragging: false,
    instanceId: null,
    offsetX: 0,
    offsetY: 0
};

export const PRESETS = {
    zen: {
        name: 'Zen Mossarium',
        vesselId: 'apothecary',
        isSealedLid: true,
        substrates: { leca: 22, charcoal: 10, sphagnum: 8, soil: 34, sand: 10 },
        placedItems: [
            { instanceId: 'p1', specId: 'seiryu-stone', x: 255, y: 362, scale: 1.35, rotation: -4, flipX: false },
            { instanceId: 'p2', specId: 'cushion-moss', x: 185, y: 366, scale: 1.2, rotation: 4, flipX: false },
            { instanceId: 'p3', specId: 'cushion-moss', x: 315, y: 368, scale: 1.1, rotation: -6, flipX: true },
            { instanceId: 'p4', specId: 'maidenhair-fern', x: 225, y: 358, scale: 1.05, rotation: -8, flipX: false },
            { instanceId: 'p5', specId: 'springtails', x: 250, y: 375, scale: 1.0, rotation: 0, flipX: false }
        ]
    },
    tropical: {
        name: 'Fittonia Rainforest',
        vesselId: 'wardian',
        isSealedLid: true,
        substrates: { leca: 26, charcoal: 12, sphagnum: 10, soil: 40, sand: 4 },
        placedItems: [
            { instanceId: 't1', specId: 'spider-driftwood', x: 245, y: 350, scale: 1.35, rotation: 8, flipX: false },
            { instanceId: 't2', specId: 'maidenhair-fern', x: 195, y: 348, scale: 1.25, rotation: -12, flipX: false },
            { instanceId: 't3', specId: 'fittonia-pink', x: 285, y: 355, scale: 1.25, rotation: 10, flipX: false },
            { instanceId: 't4', specId: 'peperomia-caperata', x: 225, y: 356, scale: 1.05, rotation: -4, flipX: false },
            { instanceId: 't5', specId: 'cushion-moss', x: 160, y: 360, scale: 1.0, rotation: 5, flipX: false },
            { instanceId: 't6', specId: 'dwarf-isopods', x: 260, y: 365, scale: 1.0, rotation: 0, flipX: false }
        ]
    },
    desert: {
        name: 'Conflict Test (Bio-Alert)',
        vesselId: 'flask',
        isSealedLid: true,
        substrates: { leca: 8, charcoal: 0, sphagnum: 12, soil: 42, sand: 12 },
        placedItems: [
            { instanceId: 'd1', specId: 'echeveria-arid', x: 220, y: 365, scale: 1.3, rotation: 0, flipX: false },
            { instanceId: 'd2', specId: 'maidenhair-fern', x: 285, y: 362, scale: 1.2, rotation: 12, flipX: false },
            { instanceId: 'd3', specId: 'fittonia-pink', x: 255, y: 368, scale: 1.1, rotation: -5, flipX: false }
        ]
    }
};
