/**
 * TerraForge Studio - Main Application Bootstrap & UI Controller
 * Orchestrates CAD canvas, biological telemetry, commercial economics & AI co-pilot
 */

import { VESSELS, SUBSTRATE_DEFS, BIOME_CATALOG } from './catalog.js';
import { state, PRESETS } from './state.js';
import {
    renderTerrariumCanvas,
    addSpecimenToTerrarium,
    selectPlacedItem,
    deleteSelectedItem,
    updateSelectedItemTransform,
    changeSelectedItemLayer,
    flipSelectedItem,
    clearAllSpecimens,
    exportTerrariumSnapshot
} from './vector-engine.js';
import { evaluateBioCompatibility } from './bio-simulator.js';
import { recalculateEconomics } from './economics.js';
import {
    setAIEngineMode,
    switchAiTab,
    runAiGenerator,
    testOllamaConnection,
    copyAiOutputText,
    copySubmissionMarkdown,
    populateSubmissionTemplate,
    renderDefaultAiPreview,
    appendToneTag
} from './ai-copilot.js';

// --- Toast Notification System ---
export function showToast(msg) {
    const toast = document.getElementById('toastNotification');
    const label = document.getElementById('toastMessage');
    if (!toast || !label) return;

    label.textContent = msg;
    toast.classList.remove('translate-y-20', 'opacity-0');
    clearTimeout(window._toastTimer);
    window._toastTimer = setTimeout(() => {
        toast.classList.add('translate-y-20', 'opacity-0');
    }, 2800);
}

// --- Clipboard Copy Helper ---
export function copyTextToClipboard(text, message) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showToast(message || 'Copied to clipboard!');
}

// --- Tab & Navigation Controls ---
export function switchLeftTab(tabName) {
    ['vessel', 'substrate', 'flora'].forEach(t => {
        const tabEl = document.getElementById(`leftTab-${t}`);
        const btnEl = document.getElementById(`tabBtn-${t}`);
        if (!tabEl || !btnEl) return;

        if (t === tabName) {
            tabEl.classList.remove('hidden');
            tabEl.classList.add('flex');
            btnEl.className = 'py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 bg-forest-700 text-white shadow transition';
        } else {
            tabEl.classList.add('hidden');
            tabEl.classList.remove('flex');
            btnEl.className = 'py-2 px-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-forest-300 hover:text-white transition';
        }
    });
}

// --- Vessel Selection ---
export function selectVessel(vesselId) {
    state.vesselId = vesselId;
    initUIControls();
    renderTerrariumCanvas();
}

// --- Environment Controls ---
export function toggleCorkLid() {
    state.isSealedLid = !state.isSealedLid;
    const btn = document.getElementById('lidToggleBtn');
    if (btn) {
        if (state.isSealedLid) {
            btn.innerHTML = '<i class="ph-bold ph-lock-key"></i> SEALED (CLOSED)';
            btn.className = 'px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-emerald-600/30 text-emerald-300 border border-emerald-500/40 flex items-center gap-1.5 transition';
        } else {
            btn.innerHTML = '<i class="ph-bold ph-wind"></i> OPEN AIRFLOW';
            btn.className = 'px-3 py-1.5 rounded-xl text-xs font-mono font-semibold bg-amber-600/30 text-amber-300 border border-amber-500/40 flex items-center gap-1.5 transition';
        }
    }
    renderTerrariumCanvas();
}

export function updateEnvironment() {
    const slider = document.getElementById('lightSlider');
    if (!slider) return;
    state.lightLevel = parseInt(slider.value, 10);
    const label = document.getElementById('lightLevelLabel');
    if (label) {
        if (state.lightLevel < 35) label.textContent = `Low Shade (${state.lightLevel}%)`;
        else if (state.lightLevel <= 75) label.textContent = `Indirect Bright (${state.lightLevel}%)`;
        else label.textContent = `Direct Sun / High Lux (${state.lightLevel}%)`;
    }
    renderTerrariumCanvas();
}

// --- Substrate Stratigraphy Depth ---
export function updateSubstrateDepth(subId, val) {
    state.substrates[subId] = parseInt(val, 10);
    const valEl = document.getElementById(`subVal-${subId}`);
    if (valEl) valEl.textContent = `${val}mm`;
    renderTerrariumCanvas();
}

export function resetSubstrates() {
    state.substrates = { leca: 24, charcoal: 10, sphagnum: 8, soil: 36, sand: 6 };
    initUIControls();
    renderTerrariumCanvas();
    showToast('Reset stratigraphy to default 5-stage ratio');
}

// --- Biome Catalog Filtering & Rendering ---
export function filterCatalog(cat) {
    state.catalogFilter = cat;
    ['all', 'plant', 'hardscape', 'fauna'].forEach(c => {
        const btn = document.getElementById(`catFilter-${c}`);
        if (!btn) return;
        if (c === cat) {
            btn.className = 'flex-1 py-1 rounded-lg bg-forest-700 text-white font-medium shadow-sm transition';
        } else {
            btn.className = 'flex-1 py-1 rounded-lg text-forest-300 hover:text-white transition';
        }
    });
    renderBiomeCatalog();
}

export function renderBiomeCatalog() {
    const grid = document.getElementById('catalogGrid');
    if (!grid) return;
    const filtered = BIOME_CATALOG.filter(item => state.catalogFilter === 'all' || item.category === state.catalogFilter);

    grid.innerHTML = filtered.map(item => `
        <button onclick="window.terraforge.addSpecimenToTerrarium('${item.id}')" class="p-3 rounded-2xl bg-forest-950/80 hover:bg-forest-900 border border-forest-800 hover:border-terracotta-500/50 text-left transition flex flex-col justify-between group shadow-sm">
            <div>
                <div class="flex items-center justify-between mb-1.5">
                    <span class="text-2xl group-hover:scale-110 transition drop-shadow">${item.emoji}</span>
                    <span class="text-[10px] font-mono px-2 py-0.5 rounded-full ${item.biome === 'arid' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' : 'bg-forest-800 text-emerald-300 border border-forest-700'} font-semibold">$${item.wholesaleCost.toFixed(2)}</span>
                </div>
                <div class="text-xs font-bold text-parchment-100 leading-tight group-hover:text-parchment-50">${item.name}</div>
                <div class="text-[10px] italic text-forest-400 truncate mt-0.5">${item.latin}</div>
            </div>
            <div class="mt-2.5 pt-2 border-t border-forest-800/80 flex items-center justify-between text-[10px] text-forest-300">
                <span class="font-mono">RH ${item.idealHumidity[0]}-${item.idealHumidity[1]}%</span>
                <span class="text-terracotta-400 font-semibold group-hover:underline flex items-center gap-0.5">
                    <i class="ph-bold ph-plus"></i> Plant
                </span>
            </div>
        </button>
    `).join('');
}

// --- Preset Loader ---
export function loadPreset(presetKey) {
    const preset = PRESETS[presetKey];
    if (!preset) return;

    selectPlacedItem(null);
    state.vesselId = preset.vesselId;
    state.isSealedLid = preset.isSealedLid;
    state.substrates = { ...preset.substrates };
    state.placedItems = JSON.parse(JSON.stringify(preset.placedItems));

    showToast(`Loaded "${preset.name}" preset`);
    initUIControls();
    renderTerrariumCanvas();
    renderDefaultAiPreview();
}

// --- UI Controls Initialization ---
export function initUIControls() {
    // 1. Populate Vessel Selector List
    const vesselList = document.getElementById('vesselSelectorList');
    if (vesselList) {
        vesselList.innerHTML = VESSELS.map(v => `
            <button onclick="window.terraforge.selectVessel('${v.id}')" id="vesselBtn-${v.id}" class="w-full text-left p-3 rounded-2xl border transition flex items-center justify-between shadow-sm ${state.vesselId === v.id ? 'bg-forest-800 border-terracotta-500 text-white shadow-md' : 'bg-forest-950/60 border-forest-800 text-forest-200 hover:bg-forest-900'}">
                <div>
                    <div class="text-xs font-bold flex items-center gap-1.5">
                        <i class="ph-fill ph-flask text-terracotta-400"></i> ${v.name}
                    </div>
                    <div class="text-[11px] text-forest-400 mt-0.5">${v.subtitle}</div>
                </div>
                <div class="text-right font-mono">
                    <span class="text-xs text-terracotta-300 block font-bold">$${v.wholesaleCost.toFixed(2)}</span>
                    <span class="text-[10px] text-emerald-400">${v.humidityRetention}% RH</span>
                </div>
            </button>
        `).join('');
    }

    // 2. Populate Substrate Stratigraphy Controls
    const subList = document.getElementById('substrateControlsList');
    if (subList) {
        subList.innerHTML = SUBSTRATE_DEFS.map(s => `
            <div class="bg-forest-950/70 p-3 rounded-2xl border border-forest-800/80 shadow-sm">
                <div class="flex justify-between items-center text-xs mb-1.5">
                    <div class="flex items-center gap-2">
                        <span class="w-2.5 h-2.5 rounded-full" style="background-color: ${s.colorDot};"></span>
                        <span class="font-semibold text-parchment-100">${s.name}</span>
                    </div>
                    <span id="subVal-${s.id}" class="font-mono text-terracotta-300 font-bold bg-forest-900 px-2 py-0.5 rounded-md border border-forest-700">${state.substrates[s.id]}mm</span>
                </div>
                <input type="range" min="${s.minMm}" max="${s.maxMm}" value="${state.substrates[s.id]}"
                    oninput="window.terraforge.updateSubstrateDepth('${s.id}', this.value)"
                    class="w-full h-1.5 bg-forest-800 rounded-lg cursor-pointer">
                <div class="text-[10px] text-forest-400 mt-1">${s.role}</div>
            </div>
        `).join('');
    }

    // 3. Populate Biome Catalog
    renderBiomeCatalog();

    // 4. Populate Challenge Markdown
    populateSubmissionTemplate();
}

// --- Modal System ---
export function openModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.remove('hidden');
    m.classList.add('flex');
}

export function closeModal(id) {
    const m = document.getElementById(id);
    if (!m) return;
    m.classList.add('hidden');
    m.classList.remove('flex');
}

// --- Expose API onto global namespace for inline onclick bindings ---
window.terraforge = {
    loadPreset,
    selectVessel,
    switchLeftTab,
    toggleCorkLid,
    updateEnvironment,
    updateSubstrateDepth,
    resetSubstrates,
    filterCatalog,
    addSpecimenToTerrarium,
    selectPlacedItem,
    deleteSelectedItem,
    updateSelectedItemTransform,
    changeSelectedItemLayer,
    flipSelectedItem,
    clearAllSpecimens,
    exportTerrariumSnapshot,
    recalculateEconomics,
    setAIEngineMode,
    switchAiTab,
    runAiGenerator,
    testOllamaConnection,
    copyAiOutputText,
    copySubmissionMarkdown,
    appendToneTag,
    openModal,
    closeModal,
    showToast
};

// Also expose common root functions for legacy inline event signatures
Object.assign(window, window.terraforge);

// --- Bootstrap on Load ---
document.addEventListener('DOMContentLoaded', () => {
    loadPreset('tropical');
});

