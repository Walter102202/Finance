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

function hc(t, w) {
  return new TableCell({
    borders, width: { size: w, type: WidthType.DXA },
    shading: hdrS, margins: cm, verticalAlign: "center",
    children: [new Paragraph({ children: [new TextRun({ text: t, bold: true, font: "Arial", size: 20, color: "FFFFFF" })] })]
  });
}

function dc(t, w, s) {
  const o = { borders, width: { size: w, type: WidthType.DXA }, margins: cm, children: [new Paragraph({ children: [new TextRun({ text: t, font: "Arial", size: 20 })] })] };
  if (s) o.shading = s;
  return new TableCell(o);
}

function h(t, lv) { return new Paragraph({ heading: lv, spacing: { before: 300, after: 150 }, children: [new TextRun({ text: t, bold: true, font: "Arial" })] }); }
function p(t, o = {}) { return new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: t, font: "Arial", size: 22, ...o })] }); }
function b(t) { return new Paragraph({ numbering: { reference: "bullets", level: 0 }, spacing: { after: 80 }, children: [new TextRun({ text: t, font: "Arial", size: 22 })] }); }
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
      { id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 24, bold: true, font: "Arial", color: "3D7AB5" },
        paragraph: { spacing: { before: 180, after: 120 }, outlineLevel: 2 } },
    ]
  },
  numbering: {
    config: [
      { reference: "bullets", levels: [{ level: 0, format: LevelFormat.BULLET, text: "\u2022", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "numbers", levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT, style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ]
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } }
    },
    headers: {
      default: new Header({
        children: [new Paragraph({
          alignment: AlignmentType.RIGHT,
          children: [new TextRun({ text: `Sector Overview | ${SECTOR}`, font: "Arial", size: 16, color: "888888", italics: true })]
        })]
      })
    },
    footers: {
      default: new Footer({
        children: [new Paragraph({
          alignment: AlignmentType.CENTER,
          children: [
            new TextRun({ text: "CONFIDENTIAL | For Institutional Use Only | Page ", font: "Arial", size: 16, color: "888888" }),
            new TextRun({ children: [PageNumber.CURRENT], font: "Arial", size: 16, color: "888888" })
          ]
        })]
      })
    },
    children: [
      // ===== COVER =====
      new Paragraph({ spacing: { before: 3000 } }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 200 }, children: [new TextRun({ text: "SECTOR OVERVIEW", font: "Arial", size: 48, bold: true, color: "1B3A5C" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 100 }, children: [new TextRun({ text: SECTOR, font: "Arial", size: 36, color: "2C5F8A" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 600 }, children: [new TextRun({ text: DATE, font: "Arial", size: 24, color: "666666" })] }),
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "This report provides an overview of the global ride-hailing and on-demand delivery platforms sector, covering market sizing, competitive dynamics, autonomous vehicle disruption, regulatory landscape, and key performance indicators.", font: "Arial", size: 22, color: "444444", italics: true })]
      }),
      PB(),

      // ===== 1. MARKET SIZE & GROWTH =====
      h("1. Market Size & Growth (TAM/SAM/SOM)", HeadingLevel.HEADING_1),

      h("1.1 Ride-Hailing Market", HeadingLevel.HEADING_2),
      p("The global ride-hailing market reached approximately US$150-182 billion in 2025, driven by urbanization, smartphone adoption, and increasing consumer preference for on-demand mobility. The market is projected to grow at a 9-13% CAGR through 2030, reaching US$300-440 billion."),
      p("The U.S. market is a duopoly: Uber commands ~75% share and Lyft holds ~25%. Internationally, markets are more fragmented with regional leaders (DiDi in China, Grab in SE Asia, Bolt in Europe/Africa)."),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 1755, 1755, 1755, 1755],
        rows: [
          new TableRow({ children: [hc("Metric", 2340), hc("2023", 1755), hc("2024", 1755), hc("2025E", 1755), hc("2030E", 1755)] }),
          new TableRow({ children: [dc("Global Ride-Hailing TAM (US$B)", 2340), dc("$130", 1755), dc("$150", 1755), dc("$175", 1755), dc("$350+", 1755)] }),
          new TableRow({ children: [dc("YoY Growth", 2340, altS), dc("12%", 1755, altS), dc("15%", 1755, altS), dc("13%", 1755, altS), dc("~10%", 1755, altS)] }),
          new TableRow({ children: [dc("U.S. Market (US$B)", 2340), dc("$40", 1755), dc("$46", 1755), dc("$52", 1755), dc("$80+", 1755)] }),
          new TableRow({ children: [dc("Asia-Pacific Share", 2340, altS), dc("~50%", 1755, altS), dc("~50%", 1755, altS), dc("~48%", 1755, altS), dc("~45%", 1755, altS)] }),
        ]
      }),
      p("Source: Grand View Research, ResearchAndMarkets, Statista (2025 estimates)", { size: 18, italics: true, color: "888888" }),

      h("1.2 On-Demand Delivery Market", HeadingLevel.HEADING_2),
      p("The global online food delivery market reached approximately US$290 billion in 2025, with the U.S. market at ~US$75 billion. Grocery and retail delivery are expanding the TAM beyond restaurant food, with estimated total on-demand delivery approaching US$400 billion globally."),
      p("The U.S. food delivery market is led by DoorDash (60.7% share), followed by Uber Eats (26.1%) and Grubhub (6.3%). Internationally, Uber Eats is the #1 or #2 player in most markets outside China."),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 1755, 1755, 1755, 1755],
        rows: [
          new TableRow({ children: [hc("Metric", 2340), hc("2023", 1755), hc("2024", 1755), hc("2025E", 1755), hc("2030E", 1755)] }),
          new TableRow({ children: [dc("Global Food Delivery (US$B)", 2340), dc("$220", 1755), dc("$256", 1755), dc("$290", 1755), dc("$500+", 1755)] }),
          new TableRow({ children: [dc("YoY Growth", 2340, altS), dc("10%", 1755, altS), dc("11%", 1755, altS), dc("10%", 1755, altS), dc("~9%", 1755, altS)] }),
          new TableRow({ children: [dc("U.S. Food Delivery (US$B)", 2340), dc("$62", 1755), dc("$69", 1755), dc("$75", 1755), dc("$110+", 1755)] }),
          new TableRow({ children: [dc("Grocery + Retail Delivery (US$B)", 2340, altS), dc("$60", 1755, altS), dc("$80", 1755, altS), dc("$100", 1755, altS), dc("$180+", 1755, altS)] }),
        ]
      }),
      p("Source: Statista, Grand View Research, eMarketer (2025 estimates)", { size: 18, italics: true, color: "888888" }),

      h("1.3 Digital Freight Brokerage", HeadingLevel.HEADING_2),
      p("The U.S. freight brokerage market totals approximately US$260 billion. Digital freight brokerages represent ~15% of the market but are growing 3-4x faster than traditional brokers. The freight sector is currently in a cyclical downturn following the pandemic boom, but secular digitization trends remain intact."),

      h("1.4 TAM/SAM/SOM Framework", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 3900, 3900],
        rows: [
          new TableRow({ children: [hc("Scope", 1560), hc("Definition", 3900), hc("Size (2025E)", 3900)] }),
          new TableRow({ children: [dc("TAM", 1560), dc("Global ride-hailing + food/grocery delivery + freight brokerage", 3900), dc("~US$700 billion", 3900)] }),
          new TableRow({ children: [dc("SAM", 1560, altS), dc("Markets where Uber operates (70 countries, 15,000 cities) + Uber Freight corridors", 3900, altS), dc("~US$450 billion", 3900, altS)] }),
          new TableRow({ children: [dc("SOM", 1560), dc("Uber's realistic addressable based on current market positions + growth trajectory", 3900), dc("~US$250 billion (Gross Bookings)", 3900)] }),
        ]
      }),

      PB(),

      // ===== 2. KEY GROWTH DRIVERS AND HEADWINDS =====
      h("2. Key Growth Drivers and Headwinds", HeadingLevel.HEADING_1),

      h("2.1 Growth Drivers", HeadingLevel.HEADING_2),
      b("Autonomous vehicles (AV): The single largest long-term catalyst. Uber is positioning as the world's largest AV orchestration platform, partnering with Waymo, WeRide, Baidu, Momenta, Wayve, and Nuro/Lucid. Target: 15 cities with AV rides by end of 2026."),
      b("Advertising revenue: Uber Ads surpassed a $1.5B annual run rate in early 2025, growing 60%+ YoY. Journey Ads, sponsored listings, and restaurant promotions deliver ~80%+ incremental margins."),
      b("Membership flywheel (Uber One): 46 million subscribers at year-end 2025, +55% YoY. Members spend 3x more and represent ~50% of total gross bookings, driving engagement and retention."),
      b("New delivery verticals: Grocery, alcohol, retail, and convenience delivery expanding TAM beyond restaurant food. Exclusive partnerships with Kohl's (U.S.), Loblaws (Canada), Coles (Australia), Biedronka (Poland)."),
      b("International expansion: Underpenetrated markets in LatAm, India, Africa, and SE Asia. 60% of Mobility gross bookings already originate outside the U.S., with room for further growth."),
      b("Urbanization trends: Global urban population growing ~1.5% annually. Rising congestion and parking costs make ride-hailing increasingly attractive vs. car ownership, particularly for younger demographics."),

      h("2.2 Headwinds", HeadingLevel.HEADING_2),
      b("Labor classification risk: EU Platform Workers Directive (April 2024) creates presumption of employee status. UK Supreme Court (2025) classified drivers as 'workers.' If reclassified broadly, driver costs could increase 20-35%."),
      b("AV disruption risk: Waymo, Tesla, and Zoox developing integrated robotaxi ecosystems that could disintermediate Uber. If AV operators deploy consumer-facing apps without Uber, its take rate on those trips is eliminated."),
      b("Delivery competition: DoorDash holds 60.7% U.S. share vs. Uber Eats 26.1%. DoorDash-Lyft DashPass partnership directly attacks Uber One's value proposition."),
      b("Macroeconomic sensitivity: Ride-hailing is discretionary; economic slowdowns reduce trips. Delivery faces consumer trade-down as households cook more at home during recessions."),
      b("Take rate pressure: Competition for driver and merchant supply can force higher incentives and lower commissions, compressing net revenue margins."),
      b("Freight cyclicality: Uber Freight remains loss-making amid a multi-year freight downturn. A sustained recession would delay the path to segment profitability."),

      PB(),

      // ===== 3. COMPETITIVE LANDSCAPE =====
      h("3. Competitive Landscape", HeadingLevel.HEADING_1),

      h("3.1 Ride-Hailing Market Share", HeadingLevel.HEADING_2),
      p("Uber dominates the U.S. with ~75% market share. Globally, markets are fragmented with strong regional leaders. Uber holds the #1 or #2 position in most international markets outside China."),

      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 1560, 1560, 1560, 1560, 1560],
        rows: [
          new TableRow({ children: [hc("Company", 1560), hc("Geography", 1560), hc("Mkt Cap", 1560), hc("Revenue", 1560), hc("U.S. Share", 1560), hc("Key Strength", 1560)] }),
          new TableRow({ children: [dc("Uber", 1560), dc("Global (70 countries)", 1560), dc("$152B", 1560), dc("$52B", 1560), dc("~75%", 1560), dc("Scale, network effects, multi-product platform", 1560)] }),
          new TableRow({ children: [dc("Lyft", 1560, altS), dc("U.S. only", 1560, altS), dc("$5.3B", 1560, altS), dc("$6.3B", 1560, altS), dc("~25%", 1560, altS), dc("U.S. focus, DashPass partnership", 1560, altS)] }),
          new TableRow({ children: [dc("DiDi", 1560), dc("China, LatAm, ANZ", 1560), dc("$21.7B", 1560), dc("~$30B", 1560), dc("N/A", 1560), dc("China dominance (>80% share)", 1560)] }),
          new TableRow({ children: [dc("Grab", 1560, altS), dc("SE Asia (8 countries)", 1560, altS), dc("$16.6B", 1560, altS), dc("$3.2B", 1560, altS), dc("N/A", 1560, altS), dc("SE Asia super-app", 1560, altS)] }),
          new TableRow({ children: [dc("Bolt", 1560), dc("Europe, Africa", 1560), dc("Private", 1560), dc("~$2B", 1560), dc("N/A", 1560), dc("Price competitiveness in EU", 1560)] }),
          new TableRow({ children: [dc("InDrive", 1560, altS), dc("Emerging markets", 1560, altS), dc("Private", 1560, altS), dc("~$1B", 1560, altS), dc("N/A", 1560, altS), dc("Peer-to-peer pricing", 1560, altS)] }),
        ]
      }),
      p("Source: Company filings, Statista, Bloomberg (2025 data)", { size: 18, italics: true, color: "888888" }),

      h("3.2 Food Delivery Market Share", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1560, 1560, 1560, 1560, 1560, 1560],
        rows: [
          new TableRow({ children: [hc("Company", 1560), hc("Geography", 1560), hc("Mkt Cap", 1560), hc("Revenue", 1560), hc("U.S. Share", 1560), hc("Key Strength", 1560)] }),
          new TableRow({ children: [dc("DoorDash", 1560), dc("U.S., Canada, Wolt (EU)", 1560), dc("$70-78B", 1560), dc("$13.7B", 1560), dc("60.7%", 1560), dc("U.S. dominance, Wolt expansion", 1560)] }),
          new TableRow({ children: [dc("Uber Eats", 1560, altS), dc("Global (40+ countries)", 1560, altS), dc("(part of UBER)", 1560, altS), dc("$17.3B", 1560, altS), dc("26.1%", 1560, altS), dc("Mobility cross-sell, global reach", 1560, altS)] }),
          new TableRow({ children: [dc("Grubhub", 1560), dc("U.S.", 1560), dc("(Wonder)", 1560), dc("~$1.5B", 1560), dc("6.3%", 1560), dc("Legacy market position", 1560)] }),
          new TableRow({ children: [dc("Deliveroo", 1560, altS), dc("UK, EU, ME, Asia", 1560, altS), dc("$3.5B", 1560, altS), dc("$2.6B", 1560, altS), dc("N/A", 1560, altS), dc("UK/EU presence, Plus membership", 1560, altS)] }),
          new TableRow({ children: [dc("Just Eat Takeaway", 1560), dc("EU, UK", 1560), dc("$4.8B", 1560), dc("$3.7B", 1560), dc("N/A", 1560), dc("EU marketplace scale", 1560)] }),
        ]
      }),

      PB(),

      // ===== 4. REGULATORY ENVIRONMENT =====
      h("4. Regulatory Environment", HeadingLevel.HEADING_1),

      h("4.1 Labor Classification & Gig Worker Rights", HeadingLevel.HEADING_2),
      b("EU Platform Workers Directive (April 2024): Creates a rebuttable presumption of employment for platform workers. EU member states have until 2026 to transpose into national law. Could add payroll taxes, benefits, and social security costs."),
      b("UK Supreme Court (2025 upheld): Uber drivers classified as 'workers' entitled to minimum wage, holiday pay, and pensions. Uber has already paid ~GBP 600M in compensation."),
      b("U.S. (California Prop 22): Currently protects independent contractor model in California, but ongoing litigation. Other states considering similar AB5-style laws."),
      b("Australia: Introduced gig worker minimum standards in 2024. New 'fair conditions guarantee' framework requires minimum pay per engagement."),

      h("4.2 Autonomous Vehicle Regulation", HeadingLevel.HEADING_2),
      b("U.S. federal: No comprehensive federal AV legislation yet. NHTSA regulates safety; states set deployment rules individually. California, Arizona, Texas leading in AV deployment permits."),
      b("State-level variation: California CPUC permits for driverless commercial service. Texas has minimal AV regulation, enabling rapid Waymo/Uber deployment in Austin/Dallas."),
      b("EU: Proposed AI Act and updated General Safety Regulation framework for AV deployment. Slower rollout expected in Europe vs. U.S. and China."),
      b("China: Advanced AV regulatory framework. Baidu Apollo, Pony.ai, and WeRide hold commercial licenses in multiple cities. DiDi testing autonomous fleet."),

      h("4.3 Data Privacy & Platform Regulation", HeadingLevel.HEADING_2),
      b("GDPR (EU): Stringent data protection requirements affecting driver and rider data processing. Fines up to 4% of global revenue for violations."),
      b("CCPA/CPRA (California): Comprehensive privacy rights for California consumers. Expanding to other U.S. states (Virginia, Colorado, Connecticut, etc.)."),
      b("Digital Markets Act (EU): Uber not currently designated as a 'gatekeeper,' but evolving rules could impose interoperability and data-sharing requirements."),
      b("Competition scrutiny: Antitrust reviews of ride-hailing pricing algorithms, surge pricing transparency, and potential market concentration concerns."),

      PB(),

      // ===== 5. SECTOR KPIs =====
      h("5. Sector KPIs and Benchmarks", HeadingLevel.HEADING_1),

      h("5.1 Platform Engagement KPIs", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({ children: [hc("KPI", 2340), hc("Industry Benchmark", 2340), hc("Uber (FY2025)", 2340), hc("Commentary", 2340)] }),
          new TableRow({ children: [dc("MAPCs (Monthly Active Platform Consumers)", 2340), dc("N/A", 2340), dc("202M+", 2340), dc("+18% YoY, accelerating", 2340)] }),
          new TableRow({ children: [dc("Trips Per MAPC / Month", 2340, altS), dc("3-5x", 2340, altS), dc("~6.2x", 2340, altS), dc("Best-in-class frequency", 2340, altS)] }),
          new TableRow({ children: [dc("Annual Trips", 2340), dc("N/A", 2340), dc("13.6B", 2340), dc("+21% YoY", 2340)] }),
          new TableRow({ children: [dc("Uber One Subscribers", 2340, altS), dc("N/A", 2340, altS), dc("46M", 2340, altS), dc("+55% YoY; ~50% of GBs", 2340, altS)] }),
        ]
      }),

      h("5.2 Financial KPIs", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [2340, 2340, 2340, 2340],
        rows: [
          new TableRow({ children: [hc("Metric", 2340), hc("Sector Range", 2340), hc("Uber (FY2025)", 2340), hc("Trend", 2340)] }),
          new TableRow({ children: [dc("Gross Bookings Growth (YoY)", 2340), dc("10-20%", 2340), dc("19.4% ($193.5B)", 2340), dc("Consistent high-teens growth", 2340)] }),
          new TableRow({ children: [dc("Overall Take Rate", 2340, altS), dc("15-30%", 2340, altS), dc("~27% (Rev/GBs)", 2340, altS), dc("Mobility ~30%, Delivery ~18%", 2340, altS)] }),
          new TableRow({ children: [dc("Adj. EBITDA Margin (% Rev)", 2340), dc("5-15%", 2340), dc("~16.7% ($8.7B)", 2340), dc("Expanding rapidly", 2340)] }),
          new TableRow({ children: [dc("Free Cash Flow Margin (% Rev)", 2340, altS), dc("5-15%", 2340, altS), dc("~18.8% ($9.8B)", 2340, altS), dc("Industry-leading FCF conversion", 2340, altS)] }),
          new TableRow({ children: [dc("Revenue Growth (YoY)", 2340), dc("10-25%", 2340), dc("18.3% ($52.0B)", 2340), dc("Steady mid-to-high teens", 2340)] }),
        ]
      }),

      h("5.3 Comparable Valuation Benchmarks", HeadingLevel.HEADING_2),
      new Table({
        width: { size: 9360, type: WidthType.DXA },
        columnWidths: [1872, 1872, 1872, 1872, 1872],
        rows: [
          new TableRow({ children: [hc("Company", 1872), hc("EV/Revenue", 1872), hc("EV/EBITDA", 1872), hc("P/E (Trailing)", 1872), hc("FCF Yield", 1872)] }),
          new TableRow({ children: [dc("Uber", 1872), dc("2.9x", 1872), dc("17-24x", 1872), dc("~15x", 1872), dc("~6.4%", 1872)] }),
          new TableRow({ children: [dc("DoorDash", 1872, altS), dc("5.5x", 1872, altS), dc("~54x", 1872, altS), dc("N/M", 1872, altS), dc("~2.5%", 1872, altS)] }),
          new TableRow({ children: [dc("Lyft", 1872), dc("0.8x", 1872), dc("9-11x", 1872), dc("N/M", 1872), dc("~8%", 1872)] }),
          new TableRow({ children: [dc("Grab", 1872, altS), dc("3.6x", 1872, altS), dc("24-52x", 1872, altS), dc("N/M", 1872, altS), dc("N/M", 1872, altS)] }),
          new TableRow({ children: [dc("Deliveroo", 1872), dc("1.2x", 1872), dc("27-48x", 1872), dc("N/M", 1872), dc("~4%", 1872)] }),
        ]
      }),

      new Paragraph({ spacing: { before: 400 } }),

      // ===== DISCLAIMER =====
      PB(),
      h("Disclaimer", HeadingLevel.HEADING_1),
      p("This document is for informational purposes only and does not constitute an offer to sell or a solicitation of an offer to buy any securities. The information contained herein is based on publicly available data and sources believed to be reliable, but no representation or warranty, express or implied, is made as to its accuracy or completeness.", { size: 18, color: "666666" }),
      p("This report does not constitute investment advice. Investors should conduct their own due diligence and consult with qualified financial professionals before making investment decisions. Past performance is not indicative of future results.", { size: 18, color: "666666" }),
      p("All market data as of February 2026 unless otherwise noted. Sources include Grand View Research, ResearchAndMarkets, Statista, eMarketer, company filings, and public financial databases.", { size: 18, color: "666666" }),
    ]
  }]
});

const outPath = `coverage/${TICKER}/01-sector-overview.docx`;
Packer.toBuffer(doc).then(buffer => {
  fs.writeFileSync(outPath, buffer);
  console.log(`Sector overview saved to: ${outPath}`);
});
