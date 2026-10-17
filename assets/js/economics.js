/**
 * TerraForge Studio - Commercial Unit Economics & Margin Engine
 * Computes Bill of Materials (BOM), raw COGS, artisan assembly labor, and retail markups
 */

import { VESSELS, SUBSTRATE_DEFS, BIOME_CATALOG } from './catalog.js';
import { state } from './state.js';

export function recalculateEconomics() {
    const vessel = VESSELS.find(v => v.id === state.vesselId) || VESSELS[0];
    
    const laborInput = document.getElementById('laborInput');
    const markupInput = document.getElementById('markupInput');

    if (laborInput) state.laborCost = parseFloat(laborInput.value);
    if (markupInput) state.retailMarkup = parseFloat(markupInput.value);

    const laborValLabel = document.getElementById('laborValLabel');
    const markupValLabel = document.getElementById('markupValLabel');
    const vesselCostBadge = document.getElementById('vesselCostBadge');

    if (laborValLabel) laborValLabel.textContent = `$${state.laborCost}`;
    if (markupValLabel) markupValLabel.textContent = `${state.retailMarkup.toFixed(1)}x`;
    if (vesselCostBadge) vesselCostBadge.textContent = `$${vessel.wholesaleCost.toFixed(2)} wholesale`;

    // 1. Calculate Substrate Raw Material Cost
    let subCost = 0;
    SUBSTRATE_DEFS.forEach(s => {
        subCost += (state.substrates[s.id] || 0) * s.costPerMm;
    });

    // 2. Calculate Specimens Wholesale Cost
    let itemsCost = 0;
    state.placedItems.forEach(item => {
        const spec = BIOME_CATALOG.find(b => b.id === item.specId);
        if (spec) itemsCost += spec.wholesaleCost;
    });

    // 3. Compute Totals & Margin Metrics
    const cogs = vessel.wholesaleCost + subCost + itemsCost;
    const totalCost = cogs + state.laborCost;
    const retailPrice = Math.round(totalCost * state.retailMarkup);
    const netProfit = retailPrice - totalCost;
    const marginPct = retailPrice > 0 ? Math.round((netProfit / retailPrice) * 100) : 0;

    // 4. Update UI Dashboard Cards
    const cogsEl = document.getElementById('econCogs');
    const laborEl = document.getElementById('econLabor');
    const retailEl = document.getElementById('econRetail');
    const profitEl = document.getElementById('econProfit');

    if (cogsEl) cogsEl.textContent = `$${cogs.toFixed(2)}`;
    if (laborEl) laborEl.textContent = `$${state.laborCost.toFixed(2)}`;
    if (retailEl) retailEl.textContent = `$${retailPrice.toFixed(2)}`;
    if (profitEl) profitEl.textContent = `+$${netProfit.toFixed(0)} (${marginPct}%)`;

    // 5. Update Visual Profit Margin Progress Meter (if present)
    const marginMeter = document.getElementById('marginMeterBar');
    if (marginMeter) {
        marginMeter.style.width = `${Math.min(100, Math.max(0, marginPct))}%`;
    }

    state.economics = {
        cogs: cogs.toFixed(2),
        labor: state.laborCost.toFixed(2),
        retailPrice: retailPrice.toFixed(2),
        netProfit: netProfit.toFixed(2),
        marginPct
    };
}
