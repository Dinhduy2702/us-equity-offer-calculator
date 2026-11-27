(function () {
  "use strict";

  const THEME_KEY = "equityoffer_us_theme_v1";
  const STATE_KEY = "equityoffer_us_state_v1";
  const TAX = window.US_TAX_DATA;
  const CONFIG = window.EQUITYOFFER_CONFIG;

  const VEST_SCHEDULES = {
    standard: [0.25, 0.25, 0.25, 0.25],
    amazon: [0.05, 0.15, 0.40, 0.40],
    front: [0.40, 0.30, 0.20, 0.10]
  };

  const TOOL_META = {
    compare: {
      title: "2026 US Job Offer & Total Comp Comparator (After 50-State Taxes)",
      desc: "Compare two US job offers side by side — including Base, Annual Bonus, 4-Year RSU Vesting schedules, Sign-On Bonus, 401(k) Match, and true 2026 Federal + 50-State take-home pay."
    },
    rsu: {
      title: "2026 RSU Tax & 22% Supplemental Withholding Gap Calculator",
      desc: "See your real 4-year after-tax RSU cash value under Bear/Base/Bull stock moves and calculate the exact tax shortfall above your employer's 22% default withholding."
    },
    negotiate: {
      title: "State-to-State Relocation & Salary Negotiation Reverse Calculator",
      desc: "Moving between states (e.g., Texas to California) or countering an offer? Reverse-calculate the exact gross salary needed to match after-tax + Cost-of-Living purchasing power."
    }
  };

  const PRESETS = {
    compare: [
      { label: "CA BigTech vs. WA 0% Tax", set: { cmpFiling: "single", oaBase: 175000, oaState: "CA", oaBonusPct: 15, oaRsu: 220000, oaSignOn: 20000, oaVest: "standard", oaMatchPct: 4, obBase: 170000, obState: "WA", obBonusPct: 15, obRsu: 220000, obSignOn: 25000, obVest: "standard", obMatchPct: 5 } },
      { label: "Standard vs. Back-Loaded 5/15/40/40", set: { cmpFiling: "single", oaBase: 165000, oaState: "WA", oaBonusPct: 15, oaRsu: 200000, oaSignOn: 15000, oaVest: "standard", oaMatchPct: 4, obBase: 175000, obState: "WA", obBonusPct: 0, obRsu: 300000, obSignOn: 45000, obVest: "amazon", obMatchPct: 2 } },
      { label: "NYC Finance vs. Austin TX", set: { cmpFiling: "married", oaBase: 210000, oaState: "NY", oaBonusPct: 25, oaRsu: 160000, oaSignOn: 15000, oaVest: "standard", oaMatchPct: 5, obBase: 190000, obState: "TX", obBonusPct: 20, obRsu: 180000, obSignOn: 20000, obVest: "front", obMatchPct: 5 } }
    ],
    rsu: [
      { label: "Senior SWE ($240k · CA 32%+9.3%)", set: { rsuGrant: 240000, rsuVest: "standard", rsuStockMove: "0", rsuFedBracket: 32, rsuStateRate: 9.3, rsuWithheld: 22 } },
      { label: "Staff Eng ($500k · WA 35%+0%)", set: { rsuGrant: 500000, rsuVest: "front", rsuStockMove: "20", rsuFedBracket: 35, rsuStateRate: 0, rsuWithheld: 22 } },
      { label: "Back-Loaded ($320k · Bear -25%)", set: { rsuGrant: 320000, rsuVest: "amazon", rsuStockMove: "-25", rsuFedBracket: 32, rsuStateRate: 6.5, rsuWithheld: 22 } }
    ],
    negotiate: [
      { label: "TX -> CA (+22% COL · +10% Raise)", set: { ngCurComp: 150000, ngFiling: "single", ngFromState: "TX", ngToState: "CA", ngColDiff: 22, ngTargetRaise: 10 } },
      { label: "Midwest OH -> NYC (+30% COL)", set: { ngCurComp: 130000, ngFiling: "single", ngFromState: "OH", ngToState: "NY", ngColDiff: 30, ngTargetRaise: 10 } },
      { label: "CA -> WA Remote (-5% COL · 0% Tax)", set: { ngCurComp: 200000, ngFiling: "married", ngFromState: "CA", ngToState: "WA", ngColDiff: -5, ngTargetRaise: 5 } }
    ]
  };

  const RESULT_CTA_COPY = {
    compare: {
      title: "Track Your New Salary, RSU Vests & Net Worth Jump in Google Sheets",
      desc: "Prevent lifestyle creep after a raise — manage 50/30/20 budgets and equity vesting inside the 2026 Wealth OS."
    },
    rsu: {
      title: "Log Every Quarterly RSU Vest & Tax Shortfall Reserve Automatically",
      desc: "Track vested shares, extra tax set-asides beyond 22%, and FIRE milestones inside one Google Sheet."
    },
    negotiate: {
      title: "Turn Your Negotiated Raise Into a Faster 2026 FIRE Timeline",
      desc: "Channel your higher take-home pay directly into savings and index funds with the 2026 Wealth OS."
    }
  };

  const SAVED_FIELDS = [
    "cmpFiling", "oaBase", "oaState", "oaBonusPct", "oaRsu", "oaSignOn", "oaVest", "oaMatchPct",
    "obBase", "obState", "obBonusPct", "obRsu", "obSignOn", "obVest", "obMatchPct",
    "rsuGrant", "rsuVest", "rsuStockMove", "rsuFedBracket", "rsuStateRate", "rsuWithheld",
    "ngCurComp", "ngFiling", "ngFromState", "ngToState", "ngColDiff", "ngTargetRaise"
  ];

  const URL_MAP = {
    compare: {
      filing: "cmpFiling", aBase: "oaBase", aSt: "oaState", aBon: "oaBonusPct", aRsu: "oaRsu", aSign: "oaSignOn", aVest: "oaVest", aMat: "oaMatchPct",
      bBase: "obBase", bSt: "obState", bBon: "obBonusPct", bRsu: "obRsu", bSign: "obSignOn", bVest: "obVest", bMat: "obMatchPct"
    },
    rsu: { grant: "rsuGrant", vest: "rsuVest", move: "rsuStockMove", fed: "rsuFedBracket", st: "rsuStateRate", wh: "rsuWithheld" },
    negotiate: { comp: "ngCurComp", filing: "ngFiling", from: "ngFromState", to: "ngToState", col: "ngColDiff", raise: "ngTargetRaise" }
  };

  let activeTool = "compare";
  let lastSummaryText = "";
  let lastCmpRows = [];
  let toastTimer = null;

  const $ = (id) => document.getElementById(id);

  function fmtUSD(n) {
    const val = Math.round(Number(n) || 0);
    return (val < 0 ? "-$" : "$") + Math.abs(val).toLocaleString("en-US");
  }

  function showToast(msg) {
    const box = $("toastBox");
    box.textContent = msg;
    box.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => { box.hidden = true; }, 2600);
  }

  function downloadCsv(filename, headers, rows) {
    const lines = [headers.join(",")].concat(
      rows.map((r) => r.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    );
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(`Downloaded ${filename}`);
  }

  /* 2026 Federal + FICA + 50-State Net Pay Engine */
  function calcAnnualNet(grossWages, stateCode, filing) {
    const gross = Math.max(0, grossWages);
    const stdDed = TAX.standardDeduction[filing] || 16100;
    const fedTaxable = Math.max(0, gross - stdDed);
    const brackets = TAX.federalBrackets[filing] || TAX.federalBrackets.single;

    let fedTax = 0;
    let prev = 0;
    for (const b of brackets) {
      if (fedTaxable <= prev) break;
      const slice = Math.min(fedTaxable, b.upTo) - prev;
      fedTax += slice * b.rate;
      prev = b.upTo;
    }

    const st = TAX.states.find((s) => s.code === stateCode) || TAX.states[0];
    let stateTax = 0;
    const stTaxable = Math.max(0, gross - Math.min(stdDed, 10000));
    if (st.type === "flat") {
      stateTax = stTaxable * st.baseRate;
    } else if (st.type === "progressive") {
      const highW = Math.min(1, Math.max(0, (stTaxable - 75000) / 350000));
      const eff = st.baseRate + (st.topRate - st.baseRate) * highW * 0.65;
      stateTax = stTaxable * eff;
    }

    const ss = Math.min(gross, TAX.fica.socialSecurityWageCap) * TAX.fica.socialSecurityRate;
    const med = gross * TAX.fica.medicareRate;
    const addThresh = filing === "married" ? TAX.fica.additionalMedicareThresholdMarried : TAX.fica.additionalMedicareThresholdSingle;
    const addMed = Math.max(0, gross - addThresh) * TAX.fica.additionalMedicareRate;
    const fica = ss + med + addMed;

    const totalTax = fedTax + stateTax + fica;
    return { net: Math.max(0, gross - totalTax), totalTax, stateTax, fedTax, fica, stObj: st };
  }

  function saveState() {
    const data = {};
    SAVED_FIELDS.forEach((id) => {
      const el = $(id);
      if (el) data[id] = el.value;
    });
    try { localStorage.setItem(STATE_KEY, JSON.stringify(data)); } catch (_) {}
  }

  function restoreState() {
    try {
      const raw = localStorage.getItem(STATE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      SAVED_FIELDS.forEach((id) => {
        const el = $(id);
        if (el && data[id] !== undefined) el.value = data[id];
      });
    } catch (_) {}
  }

  function buildShareUrl() {
    const params = new URLSearchParams();
    params.set("tab", activeTool);
    const map = URL_MAP[activeTool] || {};
    Object.entries(map).forEach(([k, id]) => {
      const el = $(id);
      if (el) params.set(k, el.value);
    });
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }

  function applyUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const tabParam = params.get("tab");
    const targetTab = TOOL_META[tabParam] ? tabParam : null;
    if (!targetTab) return null;
    const map = URL_MAP[targetTab] || {};
    Object.entries(map).forEach(([k, id]) => {
      if (params.has(k) && $(id)) $(id).value = params.get(k);
    });
    return targetTab;
  }

  function syncSliders() {
    $("rsuGrantSlider").value = Math.min(800000, Math.max(40000, Number($("rsuGrant").value) || 40000));
  }

  /* TAB 1: 2-OFFER SIDE-BY-SIDE COMPARISON */
  function evalOffer(base, stateCode, bonusPct, rsuGrant, signOn, vestKey, matchPct, filing) {
    const weights = VEST_SCHEDULES[vestKey] || VEST_SCHEDULES.standard;
    const annualBonus = base * (bonusPct / 100);
    const matchAnnual = base * (matchPct / 100);
    const years = [];
    let sumGross = 0;
    let sumNetWithMatch = 0;

    for (let i = 0; i < 4; i++) {
      const rsuYr = rsuGrant * weights[i];
      const signYr = i === 0 ? signOn : 0;
      const taxableGross = base + annualBonus + rsuYr + signYr;
      const taxInfo = calcAnnualNet(taxableGross, stateCode, filing);
      const totalGrossWithMatch = taxableGross + matchAnnual;
      const netPlusMatch = taxInfo.net + matchAnnual;
      sumGross += totalGrossWithMatch;
      sumNetWithMatch += netPlusMatch;
      years.push({ year: i + 1, gross: totalGrossWithMatch, net: netPlusMatch, stObj: taxInfo.stObj });
    }
    return { years, sumGross, sumNet: sumNetWithMatch, avgGross: sumGross / 4, avgNet: sumNetWithMatch / 4 };
  }

  function updateCompare() {
    const filing = $("cmpFiling").value;
    const oa = evalOffer(
      Math.max(0, Number($("oaBase").value) || 0),
      $("oaState").value,
      Math.max(0, Number($("oaBonusPct").value) || 0),
      Math.max(0, Number($("oaRsu").value) || 0),
      Math.max(0, Number($("oaSignOn").value) || 0),
      $("oaVest").value,
      Math.max(0, Number($("oaMatchPct").value) || 0),
      filing
    );
    const ob = evalOffer(
      Math.max(0, Number($("obBase").value) || 0),
      $("obState").value,
      Math.max(0, Number($("obBonusPct").value) || 0),
      Math.max(0, Number($("obRsu").value) || 0),
      Math.max(0, Number($("obSignOn").value) || 0),
      $("obVest").value,
      Math.max(0, Number($("obMatchPct").value) || 0),
      filing
    );

    const diff4Yr = ob.sumNet - oa.sumNet;
    const bWins = diff4Yr >= 0;
    const absDiff = Math.abs(diff4Yr);

    $("cmpWinnerTitle").textContent = absDiff < 500 ? "Virtual Tie" : (bWins ? "Offer B Wins" : "Offer A Wins");
    $("cmpWinnerSub").textContent = absDiff < 500
      ? "Both offers deliver nearly identical 4-year after-tax take-home value."
      : `${bWins ? "Offer B" : "Offer A"} (${bWins ? ob.years[0].stObj.code : oa.years[0].stObj.code}) puts ${fmtUSD(absDiff)} more after-tax wealth in your pocket over 4 years (${fmtUSD(absDiff / 4)}/yr).`;
    $("cmpDeltaBadge").textContent = `+${fmtUSD(absDiff)} / 4 yrs`;

    $("oaAvgGross").textContent = `${fmtUSD(oa.avgGross)}/yr`;
    $("oaAvgNet").textContent = `${fmtUSD(oa.avgNet)}/yr`;
    $("obAvgGross").textContent = `${fmtUSD(ob.avgGross)}/yr`;
    $("obAvgNet").textContent = `${fmtUSD(ob.avgNet)}/yr`;

    const maxBar = Math.max(1, oa.sumNet, ob.sumNet);
    $("cmpOfferBars").innerHTML = `
      <div>
        <div class="cbar-row-head"><span>Offer A (${oa.years[0].stObj.code}) · 4-Yr Net + Match</span><span class="tabular">${fmtUSD(oa.sumNet)}</span></div>
        <div class="cbar-track"><div class="cbar-fill" style="width:${((oa.sumNet / maxBar) * 100).toFixed(1)}%; background:${!bWins ? "var(--accent-emerald)" : "var(--accent-navy)"};"></div></div>
      </div>
      <div>
        <div class="cbar-row-head"><span>Offer B (${ob.years[0].stObj.code}) · 4-Yr Net + Match</span><span class="tabular">${fmtUSD(ob.sumNet)}</span></div>
        <div class="cbar-track"><div class="cbar-fill" style="width:${((ob.sumNet / maxBar) * 100).toFixed(1)}%; background:${bWins ? "var(--accent-emerald)" : "var(--accent-navy)"};"></div></div>
      </div>
    `;

    const yr1Diff = ob.years[0].net - oa.years[0].net;
    $("cmpInsightBox").innerHTML = `<strong>Year-1 Liquidity Check:</strong> In Year 1 alone, <strong>${yr1Diff >= 0 ? "Offer B" : "Offer A"}</strong> pays <strong>${fmtUSD(Math.abs(yr1Diff))} more</strong> net take-home cash. Watch back-loaded 5/15/40/40 vesting schedules closely if you might switch roles within 2 years.`;

    const winBase = Math.round(bWins ? Number($("obBase").value) : Number($("oaBase").value));
    const winSt = bWins ? $("obState").value : $("oaState").value;
    const smartUrl = `${CONFIG.ecosystem.smartMoneyUrl}?tab=paycheck&salary=${winBase}&state=${winSt}&filing=${filing}`;
    $("cmpBridgeBox").innerHTML = `
      <div>
        <strong>Inspect Exact Bi-Weekly Paychecks &amp; Tax Brackets?</strong><br>
        Send the winning <strong>${fmtUSD(winBase)}</strong> base salary (${winSt}) directly into SmartMoney US for a full paycheck breakdown.
      </div>
      <a class="btn btn-primary btn-sm" href="${smartUrl}" target="_blank" rel="noopener noreferrer" style="flex-shrink:0;">Open Paycheck Breakdown &rarr;</a>
    `;

    lastCmpRows = [];
    $("cmpTableBody").innerHTML = [0, 1, 2, 3].map((i) => {
      const aY = oa.years[i];
      const bY = ob.years[i];
      const d = bY.net - aY.net;
      lastCmpRows.push({ year: i + 1, aGross: aY.gross, aNet: aY.net, bGross: bY.gross, bNet: bY.net, diff: d });
      const pill = d >= 0
        ? `<span class="status-pill pass">Offer B +${fmtUSD(d)}</span>`
        : `<span class="status-pill warn">Offer A +${fmtUSD(Math.abs(d))}</span>`;
      return `
        <tr>
          <td>Year ${i + 1}</td>
          <td>${fmtUSD(aY.gross)}</td>
          <td>${fmtUSD(aY.net)}</td>
          <td>${fmtUSD(bY.gross)}</td>
          <td><strong>${fmtUSD(bY.net)}</strong></td>
          <td>${pill}</td>
        </tr>
      `;
    }).join("");

    if (activeTool === "compare") {
      lastSummaryText = `EquityOffer US (4-Yr Net): ${bWins ? "Offer B" : "Offer A"} wins by ${fmtUSD(absDiff)} (${fmtUSD(oa.avgNet)}/yr vs ${fmtUSD(ob.avgNet)}/yr after-tax).`;
    }
  }

  /* TAB 2: RSU TAX & 22% SUPPLEMENTAL WITHHOLDING GAP */
  function updateRsu() {
    const grant = Math.max(0, Number($("rsuGrant").value) || 240000);
    const vestKey = $("rsuVest").value;
    const movePct = Number($("rsuStockMove").value) || 0;
    const fedRate = Math.min(40, Math.max(0, Number($("rsuFedBracket").value) || 32)) / 100;
    const stateRate = Math.min(15, Math.max(0, Number($("rsuStateRate").value) || 9.3)) / 100;
    const whRate = Math.min(40, Math.max(0, Number($("rsuWithheld").value) || 22)) / 100;

    $("rsuGrantHint").textContent = fmtUSD(grant);

    const weights = VEST_SCHEDULES[vestKey] || VEST_SCHEDULES.standard;
    const adjGrant = grant * (1 + movePct / 100);
    const medicareRate = 0.0235; // 1.45% + 0.9% additional Medicare for high earners
    const trueTotalRate = fedRate + stateRate + medicareRate;
    const fedGapRate = Math.max(0, fedRate - whRate);

    const totalTax4Yr = adjGrant * trueTotalRate;
    const net4Yr = Math.max(0, adjGrant - totalTax4Yr);
    const gap4Yr = adjGrant * fedGapRate;

    $("rsuNetTotal").textContent = fmtUSD(net4Yr);
    $("rsuGrossSub").textContent = `Adjusted 4-Year Gross Value (${movePct >= 0 ? "+" : ""}${movePct}% stock move): ${fmtUSD(adjGrant)}`;
    $("rsuGapBadge").textContent = gap4Yr > 0 ? `Tax Gap: ${fmtUSD(gap4Yr / 4)}/yr` : "Fully Withheld";
    $("rsuGapBadge").className = gap4Yr > 0 ? "status-pill warn tabular" : "status-pill pass tabular";

    $("rsuTotalTax").textContent = fmtUSD(totalTax4Yr);
    $("rsuGap4Yr").textContent = fmtUSD(gap4Yr);
    $("rsuAvgNet").textContent = `${fmtUSD(net4Yr / 4)}/yr`;

    $("rsuInsightBox").innerHTML = gap4Yr > 0
      ? `<strong>April 15 Tax Bill Alert:</strong> Because your marginal federal bracket (<strong>${Math.round(fedRate * 100)}%</strong>) is higher than your employer's <strong>${Math.round(whRate * 100)}%</strong> default RSU withholding, you will owe an extra <strong>${fmtUSD(gap4Yr)}</strong> over 4 years (<strong>${fmtUSD(gap4Yr / 4)}/yr</strong>). Park that gap in a 4.5%+ HYSA immediately on every vest date.`
      : `<strong>Withholding Covered:</strong> Your ${Math.round(whRate * 100)}% federal withholding fully covers your ${Math.round(fedRate * 100)}% bracket — no surprise federal underwithholding bill expected.`;

    $("rsuTableBody").innerHTML = weights.map((w, idx) => {
      const gYr = adjGrant * w;
      const tYr = gYr * trueTotalRate;
      const gapYr = gYr * fedGapRate;
      const nYr = Math.max(0, gYr - tYr);
      return `
        <tr>
          <td>Year ${idx + 1}</td>
          <td>${Math.round(w * 100)}%</td>
          <td>${fmtUSD(gYr)}</td>
          <td>${fmtUSD(tYr)}</td>
          <td>${gapYr > 0 ? `<span class="status-pill warn">+${fmtUSD(gapYr)}</span>` : "$0"}</td>
          <td><strong>${fmtUSD(nYr)}</strong></td>
        </tr>
      `;
    }).join("");

    if (activeTool === "rsu") {
      lastSummaryText = `EquityOffer US RSU (${fmtUSD(adjGrant)}): ${fmtUSD(net4Yr)} after-tax cash over 4 yrs; set aside ${fmtUSD(gap4Yr / 4)}/yr extra for 22% withholding gap.`;
    }
  }

  /* TAB 3: RELOCATION & NEGOTIATION REVERSE */
  function updateNegotiate() {
    const curComp = Math.max(20000, Number($("ngCurComp").value) || 150000);
    const filing = $("ngFiling").value;
    const fromSt = $("ngFromState").value;
    const toSt = $("ngToState").value;
    const colDiff = Number($("ngColDiff").value) || 0;
    const targetRaise = Math.max(0, Number($("ngTargetRaise").value) || 0);

    const curInfo = calcAnnualNet(curComp, fromSt, filing);
    const breakEvenNet = curInfo.net * (1 + colDiff / 100);
    const targetNet = breakEvenNet * (1 + targetRaise / 100);

    // Linear scan from low to high (step $1,000) to find exact gross required in target state
    const findGrossForNet = (desiredNet) => {
      for (let g = 20000; g <= 2500000; g += 1000) {
        if (calcAnnualNet(g, toSt, filing).net >= desiredNet) return g;
      }
      return 2500000;
    };

    const breakEvenGross = findGrossForNet(breakEvenNet);
    const targetGross = findGrossForNet(targetNet);
    const breakEvenJumpPct = ((breakEvenGross - curComp) / curComp) * 100;
    const targetJumpPct = ((targetGross - curComp) / curComp) * 100;
    const toStObj = TAX.states.find((s) => s.code === toSt) || TAX.states[0];

    $("ngTargetOffer").textContent = fmtUSD(targetGross);
    $("ngBreakEvenSub").textContent = `Minimum Break-Even Offer in ${toStObj.name}: ${fmtUSD(breakEvenGross)} (${breakEvenJumpPct >= 0 ? "+" : ""}${breakEvenJumpPct.toFixed(1)}% gross)`;
    $("ngStateDiffBadge").textContent = `${fromSt} -> ${toSt}`;
    $("ngCurNet").textContent = `${fmtUSD(curInfo.net)}/yr`;
    $("ngNeedNet").textContent = `${fmtUSD(targetNet)}/yr`;
    $("ngGrossJump").textContent = `${targetJumpPct >= 0 ? "+" : ""}${targetJumpPct.toFixed(1)}%`;

    $("ngInsightBox").innerHTML = `<strong>Counter-Offer Script:</strong> "Based on 2026 ${toStObj.name} state tax rates and a ${colDiff >= 0 ? "+" : ""}${colDiff}% cost-of-living shift from ${fromSt}, <strong>${fmtUSD(breakEvenGross)}</strong> is my break-even baseline. To make the move a true ${targetRaise}% step forward, I'm targeting <strong>${fmtUSD(targetGross)}</strong> in total compensation."`;

    if (activeTool === "negotiate") {
      lastSummaryText = `EquityOffer US Relocation (${fromSt} -> ${toSt}): To beat ${fmtUSD(curComp)} + ${colDiff}% COL + ${targetRaise}% raise, target ${fmtUSD(targetGross)} (Break-even: ${fmtUSD(breakEvenGross)}).`;
    }
  }

  /* Presets Bar */
  function renderPresets() {
    const list = PRESETS[activeTool] || [];
    $("quickPresetsRow").innerHTML = list.map((p, idx) =>
      `<button type="button" class="preset-chip" data-preset-idx="${idx}">${p.label}</button>`
    ).join("");

    $("quickPresetsRow").querySelectorAll(".preset-chip").forEach((btn) => {
      btn.addEventListener("click", () => {
        const preset = list[Number(btn.dataset.presetIdx)];
        if (!preset || !preset.set) return;
        Object.entries(preset.set).forEach(([id, val]) => {
          const el = $(id);
          if (el) el.value = val;
        });
        syncSliders();
        recalcAll();
        saveState();
        showToast(`Loaded scenario: ${preset.label}`);
      });
    });
  }

  /* Offers, Checklists & Ecosystem Links (Zero Coming Soon / (Soon)) */
  function openModal() {
    const m = $("wealthOsModal");
    if (m && typeof m.showModal === "function") m.showModal();
  }

  function renderOffers() {
    $("offersGrid").innerHTML = CONFIG.affiliates.map((offer) => {
      const hasUrl = Boolean(offer.url && offer.url.trim());
      let actionHtml = "";
      if (hasUrl) {
        actionHtml = `<a class="btn btn-primary btn-sm" href="${offer.url}" target="_blank" rel="noopener noreferrer sponsored">${offer.ctaLabel}</a>`;
      } else {
        const itemsHtml = (offer.checklist || []).map((line) => `<li>${line}</li>`).join("");
        actionHtml = `
          <details class="offer-guide">
            <summary class="btn btn-sm">${offer.checklistTitle || "View 2026 Playbook"}</summary>
            <ul class="offer-guide-list">${itemsHtml}</ul>
          </details>
        `;
      }
      return `
        <article class="offer-card">
          <div>
            <span class="offer-badge">${offer.badge}</span>
            <h3>${offer.title}</h3>
            <p>${offer.summary}</p>
          </div>
          <div>${actionHtml}</div>
        </article>
      `;
    }).join("");

    const sheetOffer = CONFIG.ecosystem.gumroadWealthOs;
    const hasSheetUrl = Boolean(sheetOffer.url && sheetOffer.url.trim());
    const ecoBtns = [
      `<a class="btn btn-sm" href="${CONFIG.ecosystem.hubUrl}" target="_blank" rel="noopener noreferrer">US SmartMoney Hub</a>`,
      `<a class="btn btn-sm" href="${CONFIG.ecosystem.smartMoneyUrl}" target="_blank" rel="noopener noreferrer">SmartMoney US</a>`,
      `<a class="btn btn-sm" href="${CONFIG.ecosystem.retireSmartUrl}" target="_blank" rel="noopener noreferrer">RetireSmart US</a>`
    ];
    if (hasSheetUrl) {
      ecoBtns.push(`<a class="btn btn-sm btn-primary" href="${sheetOffer.url}" target="_blank" rel="noopener noreferrer">${sheetOffer.label}</a>`);
    } else {
      ecoBtns.push(`<button type="button" class="btn btn-sm btn-primary" data-open-os-modal="1">Preview 2026 Wealth OS (Free Lite)</button>`);
    }
    $("ecoLinksContainer").innerHTML = ecoBtns.join("");

    document.querySelectorAll("[data-result-cta]").forEach((box) => {
      const key = box.dataset.resultCta;
      const copy = RESULT_CTA_COPY[key] || RESULT_CTA_COPY.compare;
      const btn = hasSheetUrl
        ? `<a class="btn btn-primary btn-sm" href="${sheetOffer.url}" target="_blank" rel="noopener noreferrer">${sheetOffer.label}</a>`
        : `<button type="button" class="btn btn-primary btn-sm" data-open-os-modal="1">Preview 2026 Wealth OS</button>`;
      box.innerHTML = `
        <div class="result-cta-copy">
          <strong>${copy.title}</strong>
          <p>${copy.desc}</p>
        </div>
        <div style="flex-shrink:0;">${btn}</div>
      `;
    });

    document.querySelectorAll("[data-open-os-modal]").forEach((b) => {
      b.addEventListener("click", openModal);
    });
  }

  function switchTool(toolId, updateHash) {
    if (!TOOL_META[toolId]) toolId = "compare";
    activeTool = toolId;

    document.querySelectorAll(".tool-tab").forEach((btn) => {
      btn.setAttribute("aria-selected", String(btn.dataset.tool === toolId));
    });
    document.querySelectorAll(".calc-panel").forEach((panel) => {
      panel.hidden = panel.id !== "panel-" + toolId;
    });

    $("activeToolHeading").textContent = TOOL_META[toolId].title;
    $("activeToolDesc").textContent = TOOL_META[toolId].desc;

    if (updateHash) history.replaceState(null, "", "#" + toolId);

    renderPresets();
    recalcAll();
    renderOffers();
  }

  function recalcAll() {
    updateCompare();
    updateRsu();
    updateNegotiate();
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (_) {}
    $("themeToggleBtn").textContent = theme === "dark" ? "Light Mode" : "Dark Mode";
  }

  function init() {
    $("brandNameText").textContent = CONFIG.brand.name;
    $("brandSubText").textContent = CONFIG.brand.subtitle;

    const buildOpts = (def) => TAX.states.map((s) =>
      `<option value="${s.code}" ${s.code === def ? "selected" : ""}>${s.name} (${s.code})${s.type === "none" ? " - 0% Tax" : ""}</option>`
    ).join("");
    $("oaState").innerHTML = buildOpts("CA");
    $("obState").innerHTML = buildOpts("WA");
    $("ngFromState").innerHTML = buildOpts("TX");
    $("ngToState").innerHTML = buildOpts("CA");

    restoreState();
    const urlTab = applyUrlParams();
    syncSliders();
    applyTheme(localStorage.getItem(THEME_KEY) || "light");

    document.querySelectorAll(".tool-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchTool(btn.dataset.tool, true));
    });

    $("themeToggleBtn").addEventListener("click", () => {
      const cur = document.documentElement.getAttribute("data-theme") || "light";
      applyTheme(cur === "dark" ? "light" : "dark");
    });

    $("shareLinkBtn").addEventListener("click", () => {
      const url = buildShareUrl();
      history.replaceState(null, "", url);
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => showToast("Shareable offer link copied to clipboard!")).catch(() => showToast("Share link updated in address bar."));
      } else {
        showToast("Share link updated in address bar.");
      }
    });

    $("copyScenarioBtn").addEventListener("click", () => {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(lastSummaryText).then(() => showToast("Offer summary copied to clipboard.")).catch(() => showToast(lastSummaryText));
      } else {
        showToast(lastSummaryText);
      }
    });

    $("printReportBtn").addEventListener("click", () => window.print());

    $("resetDefaultsBtn").addEventListener("click", () => {
      try { localStorage.removeItem(STATE_KEY); } catch (_) {}
      window.location.href = window.location.pathname;
    });

    $("cmpExportCsvBtn").addEventListener("click", () => {
      downloadCsv(
        "equityoffer-us-4yr-offer-comparison-2026.csv",
        ["Year", "Offer A Gross ($)", "Offer A Net ($)", "Offer B Gross ($)", "Offer B Net ($)", "Annual Net Edge B vs A ($)"],
        lastCmpRows.map((r) => [r.year, Math.round(r.aGross), Math.round(r.aNet), Math.round(r.bGross), Math.round(r.bNet), Math.round(r.diff)])
      );
    });

    const closeModal = () => {
      const m = $("wealthOsModal");
      if (m && m.open) m.close();
    };
    $("closeModalBtn").addEventListener("click", closeModal);
    $("modalCloseFooterBtn").addEventListener("click", closeModal);
    $("modalPrintBtn").addEventListener("click", () => { closeModal(); window.print(); });

    const bind = (id, fn) => {
      const el = $(id);
      if (!el) return;
      const h = () => { fn(); saveState(); };
      el.addEventListener("input", h);
      el.addEventListener("change", h);
    };

    ["cmpFiling", "oaBase", "oaState", "oaBonusPct", "oaRsu", "oaSignOn", "oaVest", "oaMatchPct",
      "obBase", "obState", "obBonusPct", "obRsu", "obSignOn", "obVest", "obMatchPct"].forEach((id) => bind(id, updateCompare));

    $("rsuGrant").addEventListener("input", (e) => {
      $("rsuGrantSlider").value = Math.min(800000, Math.max(40000, Number(e.target.value) || 40000));
      updateRsu(); saveState();
    });
    $("rsuGrantSlider").addEventListener("input", (e) => {
      $("rsuGrant").value = e.target.value;
      updateRsu(); saveState();
    });
    ["rsuVest", "rsuStockMove", "rsuFedBracket", "rsuStateRate", "rsuWithheld"].forEach((id) => bind(id, updateRsu));
    ["ngCurComp", "ngFiling", "ngFromState", "ngToState", "ngColDiff", "ngTargetRaise"].forEach((id) => bind(id, updateNegotiate));

    const initialHash = (window.location.hash || "").replace("#", "");
    const startTab = urlTab || (TOOL_META[initialHash] ? initialHash : "compare");
    switchTool(startTab, false);
  }

  init();
})();
