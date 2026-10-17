/**
 * TerraForge Studio - Deterministic Bio-Compatibility & Microclimate Simulator
 * Analyzes relative humidity (RH%), substrate stratigraphy drainage, and botanical biome co-habitation
 */

import { VESSELS, BIOME_CATALOG } from './catalog.js';
import { state } from './state.js';

export function evaluateBioCompatibility() {
    const vessel = VESSELS.find(v => v.id === state.vesselId) || VESSELS[0];
    let effectiveHumidity = vessel.humidityRetention;
    if (!state.isSealedLid) {
        effectiveHumidity -= 28;
    }
    // Moss and sphagnum boost internal moisture retention
    if (state.substrates.sphagnum >= 6) effectiveHumidity += 4;
    effectiveHumidity = Math.max(25, Math.min(99, effectiveHumidity));

    // Update mist visibility
    const mistGroup = document.getElementById('humidityMistGroup');
    if (mistGroup) {
        mistGroup.setAttribute('opacity', effectiveHumidity > 75 ? '0.75' : '0.15');
    }

    let score = 100;
    const warnings = [];
    const strengths = [];

    // 1. Check Drainage + Charcoal Health
    if (state.isSealedLid && state.substrates.leca < 15) {
        score -= 22;
        warnings.push('⚠️ Low LECA drainage (<15mm) in a sealed vessel risks anaerobic root rot.');
    } else if (state.substrates.leca >= 18 && state.substrates.charcoal >= 6) {
        strengths.push('✅ Optimal false-bottom LECA & activated charcoal filtration cycle.');
    }

    if (state.isSealedLid && state.substrates.charcoal < 4) {
        score -= 12;
        warnings.push('⚠️ Missing activated charcoal layer in closed terrarium can cause sour odors.');
    }

    if (state.substrates.soil < 20) {
        score -= 15;
        warnings.push('⚠️ Soil depth (<20mm) is too shallow for stable root establishment.');
    }

    // 2. Check Specimen Biome Compatibility
    const placedSpecs = state.placedItems.map(i => BIOME_CATALOG.find(b => b.id === i.specId)).filter(Boolean);
    const hasTropical = placedSpecs.some(s => s.biome === 'tropical');
    const hasArid = placedSpecs.some(s => s.biome === 'arid');
    const hasFauna = placedSpecs.some(s => s.category === 'fauna');

    if (hasTropical && hasArid) {
        score -= 42;
        warnings.push('🚨 BIOME CONFLICT: Arid Desert Succulent (Echeveria) mixed with high-humidity Tropical Flora! Succulents will rot rapidly.');
    }

    placedSpecs.forEach((spec) => {
        if (spec.category === 'plant') {
            if (effectiveHumidity < spec.idealHumidity[0]) {
                score -= 14;
                warnings.push(`💧 ${spec.name} prefers ${spec.idealHumidity[0]}%+ RH (Current: ${effectiveHumidity}%). Consider closing the cork lid.`);
            } else if (effectiveHumidity > spec.idealHumidity[1]) {
                score -= 25;
                warnings.push(`💧 ${spec.name} will rot at ${effectiveHumidity}% RH (Needs open air <${spec.idealHumidity[1]}% RH).`);
            }
        }
    });

    if (hasFauna && effectiveHumidity >= 68) {
        strengths.push('🐞 Bio-active micro-fauna crew (Springtails/Isopods) actively suppresses mold.');
    } else if (!hasFauna && state.isSealedLid) {
        warnings.push('💡 Tip: Add Springtails to make this closed ecosystem 100% self-cleaning against fungal bloom.');
    }

    score = Math.max(12, Math.min(100, score));

    // Update UI Badges & Telemetry
    const humEl = document.getElementById('telemetryHumidity');
    if (humEl) humEl.textContent = `${effectiveHumidity}% RH`;

    const bioCrewEl = document.getElementById('telemetryBioactive');
    if (bioCrewEl) bioCrewEl.textContent = hasFauna ? 'Bio-Active Crew' : 'Standard Botanical';

    const scoreValEl = document.getElementById('bioScoreValue');
    const scoreDotEl = document.getElementById('bioScoreIndicator');
    const maintBadge = document.getElementById('maintenanceBadge');

    if (scoreValEl && scoreDotEl && maintBadge) {
        scoreValEl.textContent = `${score}%`;

        if (score >= 85) {
            scoreValEl.className = 'font-mono font-bold text-sm text-emerald-400';
            scoreDotEl.className = 'w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399]';
            maintBadge.textContent = 'Thriving Microclimate';
            maintBadge.className = 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold';
        } else if (score >= 60) {
            scoreValEl.className = 'font-mono font-bold text-sm text-amber-400';
            scoreDotEl.className = 'w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]';
            maintBadge.textContent = 'Moderate Care Needed';
            maintBadge.className = 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold';
        } else {
            scoreValEl.className = 'font-mono font-bold text-sm text-rose-400';
            scoreDotEl.className = 'w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_#f43f5e] animate-ping';
            maintBadge.textContent = 'High Risk / Conflict';
            maintBadge.className = 'text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold';
        }
    }

    const alertsContainer = document.getElementById('bioAlertsContainer');
    if (alertsContainer) {
        const allMessages = [...warnings.slice(0, 2), ...strengths.slice(0, 2)];
        if (allMessages.length === 0) {
            alertsContainer.innerHTML = `<p class="text-forest-300 text-xs">Add plants and hardscape from the Biome tab to simulate compatibility.</p>`;
        } else {
            alertsContainer.innerHTML = allMessages.map(m => `<p class="leading-snug text-xs">${m}</p>`).join('');
        }
    }

    state.lastBioReport = {
        score,
        effectiveHumidity,
        statusText: maintBadge ? maintBadge.textContent : 'Calculated',
        warnings,
        strengths
    };
}
