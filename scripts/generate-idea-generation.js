// DISCLAIMER: Financial data hardcoded in this script is illustrative only (as of Feb 2026). Update with current data before use. Not investment advice.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

const TICKER = process.argv[2] || "UBER";
const SECTOR = "Ride-Hailing & On-Demand Delivery Platforms";
const DATE = new Date().toISOString().split("T")[0];

const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 60, bottom: 60, left: 100, right: 100 };
const hdrS = { fill: "1B3A5C", type: ShadingType.CLEAR };
const altS = { fill: "F2F6FA", type: ShadingType.CLEAR };
const greenS = { fill: "E8F5E9", type: ShadingType.CLEAR };

function hc(t, w) {
  return new TableCell({ borders, width: { size: w, type: WidthType.DXA }, shading: hdrS, margins: cm, verticalAlign: "center",
    children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, font: "Arial", size: 20, color: "FFFFFF" })] })] });
}
function dc(t, w, s) {
  const o = { borders, width: { size: w, type: WidthType.DXA }, margins: cm, children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20 })] })] };
  if (s) o.shading = s;
  return new TableCell(o);
}
function h(t, lv) { return new Paragraph({ heading: lv, spacing: { before: 300, after: 150 }, children: [new TextRun({ text: t, bold: true, font: "Arial" })] }); }
function p(t, o = {}) { return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: t, font: "Arial", size: 22, ...o })] }); }
function bull(t) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: t, font: "Arial", size: 22 })] }); }
const PB = () => new Paragraph({ children: [new PageBreak()] });

const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 36, bold: true, font: "Arial", color: "1B3A5C" },
        paragraph: { spacing: { before: 360, after: 240 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "Arial", color: "2C5F8A" },
        paragraph: { spacing: { before: 240, after: 180 }, outlineLevel: 1 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1080, bottom: 1440, left: 1080 } }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({ alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `Idea Generation | ${SECTOR}`, font: "Arial", size: 16, color: "888888", italics: true })] })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({ alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "CONFIDENTIAL | For Institutional Use Only | Page ", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" })
          ] })]
      })
    },
    children: [
      // COVER
      new Paragraph({ spacing: { before: 3000 } }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "IDEA GENERATION", font: "Arial", size: 48, bold: true, color: "1B3A5C" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: SECTOR, font: "Arial", size: 36, color: "2C5F8A" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: DATE, font: "Arial", size: 24, color: "666666" })] }),
      PB(),

      // 1. LONG LIST
      h("1. Long List — Ride-Hailing & Delivery Universe", HeadingLevel.HEADING_1),
      p("We screened the global ride-hailing and on-demand delivery universe for companies with meaningful public market presence, liquidity, and institutional relevance."),

      new Table({
        width: { size: 10200, type: WidthType.DXA },
        columnWidths: [1275, 1275, 1275, 1275, 1275, 1275, 1275, 1275],
        rows: [
          new TableRow({ children: [hc("Company", 1275), hc("Ticker", 1275), hc("Exchange", 1275), hc("Mkt Cap ($B)", 1275), hc("Rev ($B)", 1275), hc("Segment", 1275), hc("Geography", 1275), hc("Adj. EBITDA Mgn", 1275)] }),
          new TableRow({ children: [dc("Uber Technologies",1275),dc("UBER",1275),dc("NYSE",1275),dc("$152",1275),dc("$52.0",1275),dc("Mob+Del+Freight",1275),dc("Global (70 ctry)",1275),dc("16.7%",1275)] }),
          new TableRow({ children: [dc("DoorDash",1275,altS),dc("DASH",1275,altS),dc("NASDAQ",1275,altS),dc("$74",1275,altS),dc("$13.7",1275,altS),dc("Delivery",1275,altS),dc("U.S., Canada, EU",1275,altS),dc("~9%",1275,altS)] }),
          new TableRow({ children: [dc("Lyft",1275),dc("LYFT",1275),dc("NASDAQ",1275),dc("$5.3",1275),dc("$6.3",1275),dc("Mobility",1275),dc("U.S. only",1275),dc("~8%",1275)] }),
          new TableRow({ children: [dc("Grab Holdings",1275,altS),dc("GRAB",1275,altS),dc("NASDAQ",1275,altS),dc("$16.6",1275,altS),dc("$3.2",1275,altS),dc("Mob+Del+Fin",1275,altS),dc("SE Asia",1275,altS),dc("~15%",1275,altS)] }),
          new TableRow({ children: [dc("DiDi Global",1275),dc("DIDIY",1275),dc("OTC",1275),dc("$21.7",1275),dc("~$30",1275),dc("Mobility",1275),dc("China, LatAm",1275),dc("~5%",1275)] }),
          new TableRow({ children: [dc("Deliveroo",1275,altS),dc("ROO.L",1275,altS),dc("LSE",1275,altS),dc("$3.5",1275,altS),dc("$2.6",1275,altS),dc("Delivery",1275,altS),dc("UK, EU, ME",1275,altS),dc("~5%",1275,altS)] }),
          new TableRow({ children: [dc("Just Eat Takeaway",1275),dc("TKWY",1275),dc("Euronext",1275),dc("$4.8",1275),dc("$3.7",1275),dc("Delivery",1275),dc("EU",1275),dc("~8%",1275)] }),
          new TableRow({ children: [dc("Instacart",1275,altS),dc("CART",1275,altS),dc("NASDAQ",1275,altS),dc("$10",1275,altS),dc("$3.4",1275,altS),dc("Grocery Del.",1275,altS),dc("U.S., Canada",1275,altS),dc("~25%",1275,altS)] }),
          new TableRow({ children: [dc("Waymo (Alphabet)",1275),dc("GOOGL",1275),dc("NASDAQ",1275),dc("(congl.)",1275),dc("N/A",1275),dc("AV Robotaxi",1275),dc("U.S. cities",1275),dc("Pre-rev",1275)] }),
          new TableRow({ children: [dc("Tesla Robotaxi",1275,altS),dc("TSLA",1275,altS),dc("NASDAQ",1275,altS),dc("(congl.)",1275,altS),dc("N/A",1275,altS),dc("AV Robotaxi",1275,altS),dc("Austin",1275,altS),dc("Pre-rev",1275,altS)] }),
          new TableRow({ children: [dc("Bolt",1275),dc("Private",1275),dc("N/A",1275),dc("~$8",1275),dc("~$2",1275),dc("Mob+Del",1275),dc("Europe, Africa",1275),dc("~b/e",1275)] }),
          new TableRow({ children: [dc("InDrive",1275,altS),dc("Private",1275,altS),dc("N/A",1275,altS),dc("~$5",1275,altS),dc("~$1",1275,altS),dc("Mobility",1275,altS),dc("EM",1275,altS),dc("~profitable",1275,altS)] }),
          new TableRow({ children: [dc("Rappi",1275),dc("Private",1275),dc("N/A",1275),dc("~$5",1275),dc("~$1",1275),dc("Del+Mob",1275),dc("LatAm",1275),dc("Pre-profit",1275)] }),
        ]
      }),

      PB(),

      // 2. SCREENING FILTERS
      h("2. Screening Filters Applied", HeadingLevel.HEADING_1),
      new Table({
        width: { size: 10200, type: WidthType.DXA },
        columnWidths: [2550, 3825, 3825],
        rows: [
          new TableRow({ children: [hc("Filter", 2550), hc("Criteria", 3825), hc("Rationale", 3825)] }),
          new TableRow({ children: [dc("Public listing",2550),dc("Listed on major exchange (NYSE, NASDAQ, LSE, Euronext)",3825),dc("Institutional investability; ADR/OTC excluded",3825)] }),
          new TableRow({ children: [dc("Market cap",2550,altS),dc(">$3B market capitalization",3825,altS),dc("Minimum size for institutional coverage",3825,altS)] }),
          new TableRow({ children: [dc("Liquidity",2550),dc(">$10M average daily volume",3825),dc("Tradeable for institutional investors",3825)] }),
          new TableRow({ children: [dc("Profitability path",2550,altS),dc("Positive Adj. EBITDA or clear path within 12 months",3825,altS),dc("Focus on operationally sustainable businesses",3825,altS)] }),
          new TableRow({ children: [dc("Pure-play",2550),dc("Ride-hailing/delivery as core business",3825),dc("Exclude conglomerate subsidiaries (GOOGL, TSLA)",3825)] }),
        ]
      }),

      p(""),
      h("Companies Eliminated", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 10200, type: WidthType.DXA },
        columnWidths: [2550, 3825, 3825],
        rows: [
          new TableRow({ children: [hc("Company", 2550), hc("Filter Failed", 3825), hc("Reason", 3825)] }),
          new TableRow({ children: [dc("DiDi (DIDIY)",2550),dc("Exchange (OTC only)",3825),dc("Delisted from NYSE; OTC ADR with regulatory risk",3825)] }),
          new TableRow({ children: [dc("Waymo (Alphabet)",2550,altS),dc("Pure-play",3825,altS),dc("Subsidiary; not independently investable",3825,altS)] }),
          new TableRow({ children: [dc("Tesla Robotaxi",2550),dc("Pure-play",3825),dc("AV is small part of Tesla's business",3825)] }),
          new TableRow({ children: [dc("Bolt",2550,altS),dc("Public listing",3825,altS),dc("Private company",3825,altS)] }),
          new TableRow({ children: [dc("InDrive",2550),dc("Public listing",3825),dc("Private company",3825)] }),
          new TableRow({ children: [dc("Rappi",2550,altS),dc("Public listing",3825,altS),dc("Private company",3825,altS)] }),
        ]
      }),

      PB(),

      // 3. SHORT LIST
      h("3. Short List — Top 5 Candidates", HeadingLevel.HEADING_1),

      h("3.1 Uber Technologies (UBER) — NYSE", HeadingLevel.HEADING_2),
      p("The undisputed global leader in ride-hailing and a top-3 player in food delivery. Multi-product platform with Mobility, Delivery, and Freight segments operating in 70 countries."),
      bull("Thesis: AV orchestration platform + advertising engine + Uber One flywheel + expanding margins."),
      bull("Valuation: 2.9x EV/Revenue, 17-24x EV/EBITDA. Discount to DoorDash despite superior scale."),
      bull("Catalyst: 15 AV cities by end-2026; $10B+ buyback; continued margin expansion."),

      h("3.2 DoorDash (DASH) — NASDAQ", HeadingLevel.HEADING_2),
      p("Dominant U.S. food delivery platform with 60.7% market share. Expanding internationally through Wolt acquisition."),
      bull("Thesis: U.S. delivery monopoly with pricing power; Wolt provides European growth runway."),
      bull("Valuation: 5.5x EV/Revenue — premium reflects dominance but limits upside."),
      bull("Risk: Stretched valuation; competition from Uber Eats internationally."),

      h("3.3 Lyft (LYFT) — NASDAQ", HeadingLevel.HEADING_2),
      p("U.S.-only ride-hailing company with ~25% domestic market share. Deep value play."),
      bull("Thesis: Cheapest peer at 0.8x EV/Revenue; operational turnaround potential."),
      bull("Risk: U.S.-only; secular share loss to Uber; limited growth runway."),

      h("3.4 Grab Holdings (GRAB) — NASDAQ", HeadingLevel.HEADING_2),
      p("Southeast Asia's leading super-app for mobility, delivery, and financial services."),
      bull("Thesis: SE Asia digital economy growing 15-20% annually; fintech optionality."),
      bull("Risk: Intense competition from GoTo; regulatory complexity across 8 markets."),

      h("3.5 Deliveroo (ROO.L) — LSE", HeadingLevel.HEADING_2),
      p("UK and European food delivery platform approaching profitability."),
      bull("Thesis: Potential M&A target; cheapest delivery platform at 1.2x EV/Revenue."),
      bull("Risk: Small scale; UK economic headwinds; competitive pressure."),

      PB(),

      // 4. TARGET RECOMMENDATION
      h("4. Target Recommendation: UBER", HeadingLevel.HEADING_1),
      new Table({
        width: { size: 10200, type: WidthType.DXA },
        columnWidths: [2550, 7650],
        rows: [
          new TableRow({ children: [
            new TableCell({ borders, width: { size: 2550, type: WidthType.DXA }, shading: greenS, margins: cm,
              children: [new Paragraph({ children: [new TextRun({ text: "RECOMMENDATION", bold: true, font: "Arial", size: 20 })] })] }),
            new TableCell({ borders, width: { size: 7650, type: WidthType.DXA }, shading: greenS, margins: cm,
              children: [new Paragraph({ children: [new TextRun({ text: "Initiate coverage on Uber Technologies (UBER) — the best risk-reward in the ride-hailing & delivery sector. Global scale, AV optionality, advertising growth, and expanding profitability make UBER the most compelling investment.", font: "Arial", size: 20 })] })] })
          ] }),
        ]
      }),

      p(""),
      h("Why UBER vs. Alternatives", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 10200, type: WidthType.DXA },
        columnWidths: [2040, 2040, 2040, 2040, 2040],
        rows: [
          new TableRow({ children: [hc("Criteria",2040),hc("UBER",2040),hc("DASH",2040),hc("LYFT",2040),hc("GRAB",2040)] }),
          new TableRow({ children: [dc("Global Scale",2040),dc("Best: 70 ctry, 202M MAPCs",2040),dc("Growing: U.S.+EU",2040),dc("Weak: U.S. only",2040),dc("Regional: SE Asia",2040)] }),
          new TableRow({ children: [dc("Multi-Product",2040,altS),dc("Best: Mob+Del+Frt+Ads",2040,altS),dc("Good: Del+Grocery",2040,altS),dc("Weak: Rides only",2040,altS),dc("Good: Super-app",2040,altS)] }),
          new TableRow({ children: [dc("AV Optionality",2040),dc("Best: Multi-partner",2040),dc("Limited",2040),dc("Moderate: Waymo",2040),dc("None",2040)] }),
          new TableRow({ children: [dc("Profitability",2040,altS),dc("Best: $9.8B FCF",2040,altS),dc("Early: ~9% EBITDA",2040,altS),dc("Improving: ~8%",2040,altS),dc("Improving: ~15%",2040,altS)] }),
          new TableRow({ children: [dc("Valuation",2040),dc("Fair: 2.9x EV/Rev",2040),dc("Rich: 5.5x EV/Rev",2040),dc("Cheap: 0.8x",2040),dc("Fair: 3.6x",2040)] }),
        ]
      }),

      PB(),
      h("Disclaimer", HeadingLevel.HEADING_1),
      p("This document is for informational purposes only and does not constitute investment advice. All data from publicly available sources as of February 2026.", { size: 18, color: "666666" }),
    ]
  }]
});

const outPath = `coverage/${TICKER}/02-idea-generation.docx`;
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log(`Idea generation saved to: ${outPath}`);
});
