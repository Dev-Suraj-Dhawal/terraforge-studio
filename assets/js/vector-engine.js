/**
 * TerraForge Studio - Vector CAD & SVG Rendering Engine
 * Handles vessel silhouettes, substrate wave geometry, specimen rendering, drag-and-drop & blueprint export
 */

import { VESSELS, SUBSTRATE_DEFS, BIOME_CATALOG } from './catalog.js';
import { state, dragState } from './state.js';
import { evaluateBioCompatibility } from './bio-simulator.js';
import { recalculateEconomics } from './economics.js';
import { showToast } from './app.js';

export function getSpecimenSvgMarkup(specId) {
    switch (specId) {
        case 'fittonia-pink':
            return `
                <g>
                    <!-- Stems -->
                    <path d="M0,0 Q-8,-18 -22,-32 M0,0 Q4,-22 18,-36 M0,0 Q0,-25 0,-46" stroke="#2d5546" stroke-width="3" fill="none" stroke-linecap="round"/>
                    <!-- Left Leaf -->
                    <g transform="translate(-22,-32) rotate(-28)">
                        <ellipse cx="0" cy="0" rx="18" ry="12" fill="#1e4631" stroke="#386a56" stroke-width="1"/>
                        <path d="M-15,0 L15,0 M-6,0 L-11,-7 M-6,0 L-11,7 M2,0 L-3,-9 M2,0 L-3,9 M9,0 L5,-6 M9,0 L5,6" stroke="#f472b6" stroke-width="1.6" stroke-linecap="round"/>
                    </g>
                    <!-- Right Leaf -->
                    <g transform="translate(20,-34) rotate(25)">
                        <ellipse cx="0" cy="0" rx="17" ry="11" fill="#1e4631" stroke="#386a56" stroke-width="1"/>
                        <path d="M-14,0 L14,0 M-5,0 L-9,-6 M-5,0 L-9,6 M3,0 L-2,-8 M3,0 L-2,8" stroke="#f472b6" stroke-width="1.5" stroke-linecap="round"/>
                    </g>
                    <!-- Center Top Leaf -->
                    <g transform="translate(0,-48) rotate(-5)">
                        <ellipse cx="0" cy="0" rx="14" ry="20" fill="#23533a" stroke="#4c856e" stroke-width="1"/>
                        <path d="M0,16 L0,-16 M0,6 L-8,1 M0,6 L8,1 M0,-3 L-9,-8 M0,-3 L9,-8 M0,-10 L-5,-14 M0,-10 L5,-14" stroke="#fb7185" stroke-width="1.7" stroke-linecap="round"/>
                    </g>
                </g>
            `;
        case 'cushion-moss':
            return `
                <g>
                    <path d="M-38,4 C-40,-18 -18,-28 0,-26 C20,-28 40,-16 38,4 Z" fill="#3f7d20" />
                    <path d="M-28,4 C-26,-12 -10,-20 6,-18 C22,-18 32,-8 30,4 Z" fill="#539e2b" />
                    <circle cx="-14" cy="-10" r="7" fill="#68b836" opacity="0.7"/>
                    <circle cx="8" cy="-12" r="9" fill="#72c83d" opacity="0.6"/>
                    <circle cx="20" cy="-6" r="6" fill="#68b836" opacity="0.7"/>
                </g>
            `;
        case 'maidenhair-fern':
            return `
                <g>
                    <!-- Dark wiry stems -->
                    <path d="M0,0 Q-18,-35 -42,-58 M0,0 Q0,-45 -8,-76 M0,0 Q20,-38 44,-52" stroke="#1f1610" stroke-width="1.8" fill="none"/>
                    <!-- Frond leaflets -->
                    <circle cx="-16" cy="-26" r="6" fill="#4ade80" opacity="0.9"/>
                    <circle cx="-28" cy="-42" r="6.5" fill="#22c55e" opacity="0.9"/>
                    <circle cx="-40" cy="-55" r="5.5" fill="#4ade80" opacity="0.9"/>
                    <circle cx="-4" cy="-35" r="6.5" fill="#22c55e" opacity="0.95"/>
                    <circle cx="-12" cy="-52" r="7" fill="#4ade80" opacity="0.9"/>
                    <circle cx="4" cy="-62" r="6" fill="#16a34a" opacity="0.9"/>
                    <circle cx="-8" cy="-75" r="5" fill="#4ade80" opacity="0.9"/>
                    <circle cx="16" cy="-28" r="6" fill="#22c55e" opacity="0.9"/>
                    <circle cx="29" cy="-41" r="6.5" fill="#4ade80" opacity="0.9"/>
                    <circle cx="42" cy="-51" r="5.5" fill="#22c55e" opacity="0.9"/>
                </g>
            `;
        case 'peperomia-caperata':
            return `
                <g>
                    <path d="M-4,0 L-18,-26 M0,0 L0,-36 M4,0 L19,-24" stroke="#7f1d1d" stroke-width="3.2" stroke-linecap="round"/>
                    <!-- Heart-shaped corrugated leaves -->
                    <path d="M-18,-22 C-32,-34 -30,-48 -18,-44 C-6,-48 -4,-34 -18,-22 Z" fill="#14532d" stroke="#052e16" stroke-width="1.5"/>
                    <path d="M0,-30 C-16,-44 -14,-62 0,-56 C14,-62 16,-44 0,-30 Z" fill="#166534" stroke="#052e16" stroke-width="1.5"/>
                    <path d="M18,-20 C4,-32 6,-46 18,-42 C30,-46 32,-32 18,-20 Z" fill="#15803d" stroke="#052e16" stroke-width="1.5"/>
                </g>
            `;
        case 'Marcgravia':
            return `
                <g>
                    <path d="M-20,5 Q-8,-20 5,-40 T22,-78" stroke="#5c4033" stroke-width="2.2" fill="none"/>
                    <ellipse cx="-14" cy="-8" rx="8" ry="5" transform="rotate(-30 -14 -8)" fill="#2d6a4f" stroke="#52b788" stroke-width="0.8"/>
                    <ellipse cx="-4" cy="-22" rx="8" ry="5" transform="rotate(-25 -4 -22)" fill="#40916c" stroke="#74c69d" stroke-width="0.8"/>
                    <ellipse cx="6" cy="-38" rx="7.5" ry="4.8" transform="rotate(-20 6 -38)" fill="#2d6a4f" stroke="#52b788" stroke-width="0.8"/>
                    <ellipse cx="14" cy="-55" rx="7" ry="4.5" transform="rotate(-15 14 -55)" fill="#52b788"/>
                    <ellipse cx="20" cy="-70" rx="6" ry="4" transform="rotate(-10 20 -70)" fill="#74c69d"/>
                </g>
            `;
        case 'echeveria-arid':
            return `
                <g transform="translate(0,-14)">
                    <ellipse cx="-18" cy="4" rx="14" ry="7" transform="rotate(-15 -18 4)" fill="#5e8c76" stroke="#fca5a5" stroke-width="1"/>
                    <ellipse cx="18" cy="4" rx="14" ry="7" transform="rotate(15 18 4)" fill="#5e8c76" stroke="#fca5a5" stroke-width="1"/>
                    <ellipse cx="-12" cy="-6" rx="13" ry="7" transform="rotate(-35 -12 -6)" fill="#74a892" stroke="#fca5a5" stroke-width="1"/>
                    <ellipse cx="12" cy="-6" rx="13" ry="7" transform="rotate(35 12 -6)" fill="#74a892" stroke="#fca5a5" stroke-width="1"/>
                    <ellipse cx="0" cy="-12" rx="8" ry="14" fill="#8ec3b0" stroke="#fda4af" stroke-width="1.2"/>
                    <circle cx="0" cy="-4" r="5" fill="#a7f3d0"/>
                </g>
            `;
        case 'seiryu-stone':
            return `
                <g>
                    <polygon points="-32,6 -24,-45 -4,-68 18,-52 34,6" fill="#475569" stroke="#1e293b" stroke-width="2"/>
                    <polygon points="-4,-68 18,-52 28,6 4,6" fill="#334155"/>
                    <!-- White calcite veins -->
                    <path d="M-16,-35 L-2,-22 L6,-38 M-8,-10 L12,-24" stroke="#cbd5e1" stroke-width="1.8" fill="none" opacity="0.8"/>
                </g>
            `;
        case 'spider-driftwood':
            return `
                <g>
                    <path d="M-28,6 Q-10,-25 12,-48 Q28,-65 45,-72 M-4,-18 Q-22,-42 -36,-58 M8,-38 Q16,-60 12,-80" stroke="#6b4423" stroke-width="8" stroke-linecap="round" fill="none"/>
                    <path d="M-26,6 Q-8,-25 14,-48 Q30,-65 45,-72" stroke="#8b5a2b" stroke-width="3" stroke-linecap="round" fill="none"/>
                </g>
            `;
        case 'springtails':
            return `
                <g>
                    <ellipse cx="-10" cy="-3" rx="3.5" ry="1.6" fill="#f8fafc"/>
                    <ellipse cx="4" cy="-6" rx="3" ry="1.4" fill="#f8fafc"/>
                    <ellipse cx="14" cy="-2" rx="3.5" ry="1.6" fill="#f8fafc"/>
                </g>
            `;
        case 'dwarf-isopods':
            return `
                <g transform="translate(0,-5)">
                    <ellipse cx="0" cy="0" rx="11" ry="6" fill="#334155" stroke="#1e293b" stroke-width="1"/>
                    <ellipse cx="-6" cy="0" rx="4" ry="5" fill="#facc15"/>
                    <ellipse cx="7" cy="0" rx="3.5" ry="4.5" fill="#facc15"/>
                    <path d="M-11,-2 L-15,-5 M-11,2 L-15,5" stroke="#facc15" stroke-width="1.2"/>
                </g>
            `;
        default:
            return `<circle cx="0" cy="-15" r="15" fill="#4ade80"/>`;
    }
}

export function getVesselLidSvg(vesselId) {
    switch (vesselId) {
        case 'wardian':
            return `<polygon points="146,56 354,56 350,72 150,72" fill="#b47b48" stroke="#784f2a" stroke-width="2"/>`;
        case 'apothecary':
            return `
                <circle cx="250" cy="60" r="18" fill="#d9ecff" fill-opacity="0.45" stroke="#e2e8f0" stroke-width="2"/>
                <rect x="172" y="74" width="156" height="16" rx="6" fill="#b47b48" stroke="#784f2a" stroke-width="2"/>
            `;
        case 'flask':
            return `<polygon points="205,50 295,50 288,82 212,82" fill="#b47b48" stroke="#784f2a" stroke-width="2"/>`;
        case 'globe':
            return `<rect x="162" y="95" width="176" height="14" rx="5" fill="#b47b48" stroke="#784f2a" stroke-width="2"/>`;
        case 'cylinder':
            return `<rect x="112" y="64" width="276" height="16" rx="6" fill="#b47b48" stroke="#784f2a" stroke-width="2"/>`;
        default:
            return '';
    }
}

export function getVesselGlassOutlineSvg(vesselId) {
    switch (vesselId) {
        case 'wardian':
            return `
                <polygon points="150,70 350,70 430,190 390,485 110,485 70,190" fill="url(#glassSheen)" stroke="#b4916c" stroke-width="4" stroke-linejoin="round"/>
                <line x1="150" y1="70" x2="190" y2="190" stroke="#b4916c" stroke-width="2.5" opacity="0.8"/>
                <line x1="350" y1="70" x2="310" y2="190" stroke="#b4916c" stroke-width="2.5" opacity="0.8"/>
                <line x1="70" y1="190" x2="430" y2="190" stroke="#b4916c" stroke-width="3" opacity="0.85"/>
                <line x1="190" y1="190" x2="175" y2="485" stroke="#b4916c" stroke-width="2.5" opacity="0.75"/>
                <line x1="310" y1="190" x2="325" y2="485" stroke="#b4916c" stroke-width="2.5" opacity="0.75"/>
            `;
        case 'apothecary':
            return `
                <path d="M 175,85 L 325,85 L 325,120 C 395,145 415,220 415,320 C 415,435 375,485 250,485 C 125,485 85,435 85,320 C 85,220 105,145 175,120 Z" fill="url(#glassSheen)" stroke="#d1fae5" stroke-opacity="0.65" stroke-width="3.5"/>
                <path d="M 115,220 C 102,280 105,360 125,420" stroke="#ffffff" stroke-opacity="0.35" stroke-width="5" stroke-linecap="round" fill="none"/>
            `;
        case 'flask':
            return `
                <path d="M 210,70 L 290,70 L 290,175 L 420,425 C 435,455 415,485 370,485 L 130,485 C 85,485 65,455 80,425 L 210,175 Z" fill="url(#glassSheen)" stroke="#d1fae5" stroke-opacity="0.7" stroke-width="3.5"/>
                <g stroke="#ffffff" stroke-opacity="0.45" stroke-width="1.5" font-family="JetBrains Mono" font-size="9" fill="#ffffff" fill-opacity="0.5">
                    <line x1="310" y1="280" x2="330" y2="280"/><text x="335" y="283" stroke="none">1500ml</text>
                    <line x1="335" y1="340" x2="355" y2="340"/><text x="360" y="343" stroke="none">1000ml</text>
                    <line x1="360" y1="400" x2="380" y2="400"/><text x="385" y="403" stroke="none">500ml</text>
                </g>
            `;
        case 'globe':
            return `
                <path d="M 165,105 L 335,105 C 415,165 435,285 405,390 C 380,460 325,485 250,485 C 175,485 120,460 95,390 C 65,285 85,165 165,105 Z" fill="url(#glassSheen)" stroke="#d1fae5" stroke-opacity="0.65" stroke-width="3.5"/>
                <path d="M 110,210 C 92,275 98,350 125,405" stroke="#ffffff" stroke-opacity="0.35" stroke-width="5" stroke-linecap="round" fill="none"/>
            `;
        case 'cylinder':
            return `
                <rect x="115" y="75" width="270" height="410" rx="28" fill="url(#glassSheen)" stroke="#d1fae5" stroke-opacity="0.65" stroke-width="3.5"/>
                <line x1="135" y1="115" x2="135" y2="440" stroke="#ffffff" stroke-opacity="0.32" stroke-width="5" stroke-linecap="round"/>
            `;
        default:
            return '';
    }
}

export function renderTerrariumCanvas() {
    const vessel = VESSELS.find(v => v.id === state.vesselId) || VESSELS[0];

    // 1. Update ClipPath on the interior group
    const clipGroup = document.getElementById('vesselInteriorClipGroup');
    if (clipGroup) clipGroup.setAttribute('clip-path', `url(#${vessel.clipId})`);

    // 2. Update Grow Light intensity
    const lightRect = document.getElementById('svgGrowLightRect');
    if (lightRect) lightRect.setAttribute('opacity', (state.lightLevel / 100).toFixed(2));

    // 3. Render Substrate Stratigraphy from bottom up
    const subGroup = document.getElementById('substrateLayersSvgGroup');
    if (subGroup) {
        subGroup.innerHTML = '';
        let currentBottomY = vessel.baseY;
        const scalePxPerMm = 1.65;

        SUBSTRATE_DEFS.forEach((sub) => {
            const mm = state.substrates[sub.id] || 0;
            if (mm <= 0) return;
            const layerHeight = mm * scalePxPerMm;
            const topY = currentBottomY - layerHeight;

            const pathData = `
                M 50,${topY}
                Q 150,${topY + 4} 250,${topY - 2}
                T 450,${topY + 2}
                L 450,${currentBottomY + 4}
                L 50,${currentBottomY + 4}
                Z
            `;
            const pathEl = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            pathEl.setAttribute('d', pathData);
            pathEl.setAttribute('fill', sub.pattern);
            pathEl.setAttribute('stroke', sub.stroke);
            pathEl.setAttribute('stroke-width', '1');
            subGroup.appendChild(pathEl);

            if (layerHeight >= 22) {
                const labelEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                labelEl.setAttribute('x', '250');
                labelEl.setAttribute('y', String(topY + layerHeight / 2 + 4));
                labelEl.setAttribute('text-anchor', 'middle');
                labelEl.setAttribute('fill', 'rgba(255,255,255,0.65)');
                labelEl.setAttribute('font-size', '9');
                labelEl.setAttribute('font-weight', '600');
                labelEl.setAttribute('font-family', 'JetBrains Mono, monospace');
                labelEl.textContent = `${sub.name.split(' ')[0].toUpperCase()} (${mm}mm)`;
                subGroup.appendChild(labelEl);
            }

            currentBottomY = topY;
        });

        state.currentSoilSurfaceY = currentBottomY;
    }

    // 4. Render Placed Flora, Hardscape & Fauna
    const itemsGroup = document.getElementById('placedItemsGroup');
    if (itemsGroup) {
        itemsGroup.innerHTML = '';
        state.placedItems.forEach((item) => {
            const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
            const flipScaleX = item.flipX ? -item.scale : item.scale;
            g.setAttribute('transform', `translate(${item.x}, ${item.y}) rotate(${item.rotation}) scale(${flipScaleX}, ${item.scale})`);
            g.setAttribute('class', `cursor-grab active:cursor-grabbing transition-filter ${state.selectedInstanceId === item.instanceId ? 'selected-item-ring' : ''}`);
            g.dataset.instanceId = item.instanceId;
            g.innerHTML = getSpecimenSvgMarkup(item.specId);

            g.addEventListener('pointerdown', (e) => startDragItem(e, item.instanceId));
            itemsGroup.appendChild(g);
        });
    }

    // 5. Render Cork Lid if sealed
    const lidGroup = document.getElementById('vesselLidSvgGroup');
    if (lidGroup) {
        lidGroup.innerHTML = state.isSealedLid ? getVesselLidSvg(vessel.id) : '';
    }

    // 6. Render Glass Vessel Frame & Specular Highlights
    const outlineGroup = document.getElementById('vesselGlassOutlineGroup');
    if (outlineGroup) {
        outlineGroup.innerHTML = getVesselGlassOutlineSvg(vessel.id);
    }

    // 7. Update Bio-Compatibility & Economics Telemetry
    evaluateBioCompatibility();
    recalculateEconomics();
}

export function getSvgCoords(evt) {
    const svg = document.getElementById('terrariumSvg');
    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}

export function startDragItem(evt, instanceId) {
    evt.stopPropagation();
    selectPlacedItem(instanceId);
    const item = state.placedItems.find(i => i.instanceId === instanceId);
    if (!item) return;

    const coords = getSvgCoords(evt);
    dragState.isDragging = true;
    dragState.instanceId = instanceId;
    dragState.offsetX = coords.x - item.x;
    dragState.offsetY = coords.y - item.y;
}

export function addSpecimenToTerrarium(specId) {
    const spec = BIOME_CATALOG.find(s => s.id === specId);
    if (!spec) return;

    const surfaceY = state.currentSoilSurfaceY || 350;
    const randomX = Math.round(180 + Math.random() * 140);
    const newInstance = {
        instanceId: 'inst_' + Date.now() + '_' + Math.floor(Math.random() * 999),
        specId: spec.id,
        x: randomX,
        y: surfaceY + 4,
        scale: 1.0,
        rotation: 0,
        flipX: false
    };

    state.placedItems.push(newInstance);
    selectPlacedItem(newInstance.instanceId);
    renderTerrariumCanvas();
    showToast(`Planted ${spec.name} into vessel`);
}

export function selectPlacedItem(instanceId) {
    state.selectedInstanceId = instanceId;
    const panel = document.getElementById('itemInspectorPanel');
    const item = state.placedItems.find(i => i.instanceId === instanceId);

    if (!panel) return;

    if (!item) {
        panel.classList.add('hidden');
        panel.classList.remove('flex');
        return;
    }

    const spec = BIOME_CATALOG.find(s => s.id === item.specId);
    panel.classList.remove('hidden');
    panel.classList.add('flex');

    document.getElementById('inspectorEmoji').textContent = spec.emoji;
    document.getElementById('inspectorName').textContent = spec.name;
    document.getElementById('inspectorLatin').textContent = spec.latin;
    document.getElementById('inspectorScale').value = item.scale;
    document.getElementById('inspectorScaleVal').textContent = item.scale.toFixed(2) + 'x';
    document.getElementById('inspectorRot').value = item.rotation;
    document.getElementById('inspectorRotVal').textContent = item.rotation + '°';
}

export function updateSelectedItemTransform() {
    const item = state.placedItems.find(i => i.instanceId === state.selectedInstanceId);
    if (!item) return;
    item.scale = parseFloat(document.getElementById('inspectorScale').value);
    item.rotation = parseInt(document.getElementById('inspectorRot').value, 10);
    document.getElementById('inspectorScaleVal').textContent = item.scale.toFixed(2) + 'x';
    document.getElementById('inspectorRotVal').textContent = item.rotation + '°';
    renderTerrariumCanvas();
}

export function flipSelectedItem() {
    const item = state.placedItems.find(i => i.instanceId === state.selectedInstanceId);
    if (!item) return;
    item.flipX = !item.flipX;
    renderTerrariumCanvas();
}

export function changeSelectedItemLayer(dir) {
    const idx = state.placedItems.findIndex(i => i.instanceId === state.selectedInstanceId);
    if (idx === -1) return;
    const targetIdx = idx + dir;
    if (targetIdx < 0 || targetIdx >= state.placedItems.length) return;
    const temp = state.placedItems[idx];
    state.placedItems[idx] = state.placedItems[targetIdx];
    state.placedItems[targetIdx] = temp;
    renderTerrariumCanvas();
}

export function deleteSelectedItem() {
    if (!state.selectedInstanceId) return;
    state.placedItems = state.placedItems.filter(i => i.instanceId !== state.selectedInstanceId);
    selectPlacedItem(null);
    renderTerrariumCanvas();
}

export function clearAllSpecimens() {
    if (state.placedItems.length === 0) return;
    state.placedItems = [];
    selectPlacedItem(null);
    renderTerrariumCanvas();
    showToast('Cleared all specimens from vessel');
}

export function exportTerrariumSnapshot() {
    const svgEl = document.getElementById('terrariumSvg');
    if (!svgEl) return;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgEl);
    const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `terraforge-${state.vesselId}-blueprint.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Downloaded SVG Terrarium Blueprint!');
}

// Global Pointer Movement Listeners for Specimen Dragging
window.addEventListener('pointermove', (evt) => {
    if (!dragState.isDragging || !dragState.instanceId) return;
    const item = state.placedItems.find(i => i.instanceId === dragState.instanceId);
    if (!item) return;

    const coords = getSvgCoords(evt);
    item.x = Math.max(95, Math.min(405, Math.round(coords.x - dragState.offsetX)));
    item.y = Math.max(120, Math.min(465, Math.round(coords.y - dragState.offsetY)));
    renderTerrariumCanvas();
});

window.addEventListener('pointerup', () => {
    dragState.isDragging = false;
    dragState.instanceId = null;
});
