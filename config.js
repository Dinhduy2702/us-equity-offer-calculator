/**
 * EquityOffer US - 2026 US Job Offer, RSU Tax & Salary Negotiation Calculator
 * SINGLE CONFIGURATION FILE FOR AFFILIATE OFFERS & ECOSYSTEM LINKS
 */
window.EQUITYOFFER_CONFIG = {
  brand: {
    name: "EquityOffer US",
    subtitle: "2026 Job Offer, RSU Tax & Negotiation Planner",
    year: "2026"
  },
  ecosystem: {
    hubUrl: "https://dinhduy2702.github.io/us-finance-toolkit-hub/",
    smartMoneyUrl: "https://dinhduy2702.github.io/us-smart-money-calculators/",
    debtFreeUrl: "https://dinhduy2702.github.io/us-debt-free-planner/",
    soloTaxUrl: "https://dinhduy2702.github.io/us-solotax-planner/",
    propYieldUrl: "https://dinhduy2702.github.io/us-propyield-analyzer/",
    retireSmartUrl: "https://dinhduy2702.github.io/us-retiresmart-planner/",
    gumroadWealthOs: {
      label: "Get Wealth OS ($0 Lite / $19 Full)",
      url: "https://897833387907.gumroad.com/l/us-personal-finance-wealth-os-2026"
    }
  },
  affiliates: [
    {
      id: "rsu-withholding",
      context: ["compare", "rsu", "negotiate"],
      badge: "RSU Tax Trap",
      title: "Fix the 22% RSU Supplemental Withholding Gap",
      summary: "Employers default to withholding only 22% federal tax on vested RSUs under $1M — leaving $200k+ earners with a surprise April IRS bill.",
      ctaLabel: "Compare Tax Planning Tools",
      checklistTitle: "RSU 22% Withholding Checklist",
      checklist: [
        "Check if your equity portal (E*TRADE, Schwab, Fidelity) lets you raise RSU withholding from 22% to 32%–37%.",
        "If locked at 22%, calculate the shortfall and park the cash in a 4.5%+ HYSA on every vest date.",
        "Sell vested RSUs immediately upon vest to avoid concentrated single-stock risk (zero extra capital gain tax on day 0).",
        "Remember: RSU vests are taxed as ordinary W-2 income, NOT long-term capital gains."
      ],
      url: ""
    },
    {
      id: "negotiation-playbook",
      context: ["compare", "rsu", "negotiate"],
      badge: "Negotiation",
      title: "2026 Tech & Corporate Offer Negotiation Playbook",
      summary: "Companies expect a counter-offer on Sign-On Bonus and RSU grants even when Base Salary bands are capped.",
      ctaLabel: "Explore Salary Benchmarks",
      checklistTitle: "Offer Counter-Negotiation Checklist",
      checklist: [
        "Never negotiate Base alone — if Base is capped, ask for a Year-1 Sign-On Bonus or +15%–25% more RSUs.",
        "Always convert a back-loaded 5/15/40/40 vesting offer into Year-1 & Year-2 Cash before comparing.",
        "Factor in 0%-tax states (WA, TX, FL, NV) vs. high-tax states (CA, NY) using after-tax take-home, not gross TC.",
        "Ask about 401(k) true-up matching, Mega Backdoor Roth support, and ESPP 15% lookback discounts."
      ],
      url: ""
    },
    {
      id: "equity-options",
      context: ["compare", "rsu", "negotiate"],
      badge: "Startup Equity",
      title: "ISO vs. NSO Stock Options & 83(b) Election Guardrails",
      summary: "Evaluating a startup offer with stock options? Always check strike price, 409A valuation, AMT exposure, and post-termination exercise window.",
      ctaLabel: "Compare Equity Tax Tools",
      checklistTitle: "ISO / NSO & 83(b) Checklist",
      checklist: [
        "Ask for the exact % ownership (your options divided by fully diluted shares), not just share count.",
        "Check the Post-Termination Exercise Window (PTEW): 90 days is risky; 7 to 10 years is employee-friendly.",
        "If early-exercising ISOs/restricted stock, file IRS Form 83(b) within 30 strict calendar days (zero extensions).",
        "Discount illiquid private startup paper by 50%–75% when comparing against public liquid RSUs."
      ],
      url: ""
    }
  ]
};
