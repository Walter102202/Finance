// DISCLAIMER: Financial data hardcoded in this script is illustrative only (as of Feb 2026). Update with current data before use. Not investment advice.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

const TICKER = process.argv[2] || "UBER";
const DATE = new Date().toISOString().split("T")[0];

const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 60, bottom: 60, left: 100, right: 100 };
const hdrS = { fill: "1B3A5C", type: ShadingType.CLEAR };
const altS = { fill: "F2F6FA", type: ShadingType.CLEAR };
const greenS = { fill: "E8F5E9", type: ShadingType.CLEAR };

function hc(t,w){return new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:hdrS,margins:cm,children:[new Paragraph({children:[new TextRun({text:t,bold:true,font:"Arial",size:18,color:"FFFFFF"})]})]})}
function dc(t,w,s){const o={borders,width:{size:w,type:WidthType.DXA},margins:cm,children:[new Paragraph({children:[new TextRun({text:t,font:"Arial",size:20})]})]};if(s)o.shading=s;return new TableCell(o)}
function h1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:360,after:240},children:[new TextRun({text:t,bold:true,font:"Arial"})]})}
function h2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:240,after:180},children:[new TextRun({text:t,bold:true,font:"Arial"})]})}
function h3(t){return new Paragraph({heading:HeadingLevel.HEADING_3,spacing:{before:180,after:120},children:[new TextRun({text:t,bold:true,font:"Arial"})]})}
function p(t,o={}){return new Paragraph({spacing:{after:120},children:[new TextRun({text:t,font:"Arial",size:22,...o})]})}
function pb(parts){return new Paragraph({spacing:{after:120},children:parts.map(([t,o])=>new TextRun({text:t,font:"Arial",size:22,...o}))})}
function b(t,ref="bullets"){return new Paragraph({numbering:{reference:ref,level:0},spacing:{after:80},children:[new TextRun({text:t,font:"Arial",size:22})]})}
function PB(){return new Paragraph({children:[new PageBreak()]})}

const doc = new Document({
  styles:{
    default:{document:{run:{font:"Arial",size:22}}},
    paragraphStyles:[
      {id:"Heading1",name:"Heading 1",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:36,bold:true,font:"Arial",color:"1B3A5C"},paragraph:{spacing:{before:360,after:240},outlineLevel:0}},
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:28,bold:true,font:"Arial",color:"2C5F8A"},paragraph:{spacing:{before:240,after:180},outlineLevel:1}},
      {id:"Heading3",name:"Heading 3",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:24,bold:true,font:"Arial",color:"3D7AB5"},paragraph:{spacing:{before:180,after:120},outlineLevel:2}},
    ]
  },
  numbering:{config:[
    {reference:"bullets",levels:[{level:0,format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
    {reference:"numbers",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  ]},
  sections:[{
    properties:{
      page:{size:{width:12240,height:15840},margin:{top:1440,right:1260,bottom:1440,left:1260}}
    },
    headers:{default:new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:`Uber Technologies (${TICKER}) | Initiating Coverage | ${DATE}`,font:"Arial",size:16,color:"888888",italics:true})]})]})},
    footers:{default:new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"CONFIDENTIAL | For Institutional Use Only | Page ",font:"Arial",size:16,color:"888888"}),new TextRun({children:[PageNumber.CURRENT],font:"Arial",size:16,color:"888888"})]})]})},
    children:[
      // ===== COVER PAGE =====
      new Paragraph({spacing:{before:2000}}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:100},children:[new TextRun({text:"INITIATING COVERAGE",font:"Arial",size:52,bold:true,color:"1B3A5C"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:`Uber Technologies, Inc. (NYSE: ${TICKER})`,font:"Arial",size:36,color:"2C5F8A"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:100},children:[new TextRun({text:"Ride-Hailing & On-Demand Delivery | Global",font:"Arial",size:28,color:"666666"})]}),
      new Paragraph({spacing:{before:400}}),

      // Rating box
      new Table({width:{size:9720,type:WidthType.DXA},columnWidths:[2430,2430,2430,2430],rows:[
        new TableRow({children:[
          new TableCell({borders,width:{size:2430,type:WidthType.DXA},shading:{fill:"1B6B3A",type:ShadingType.CLEAR},margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Rating: BUY",bold:true,font:"Arial",size:28,color:"FFFFFF"})]})]}),
          new TableCell({borders,width:{size:2430,type:WidthType.DXA},shading:hdrS,margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Target: $100",bold:true,font:"Arial",size:28,color:"FFFFFF"})]})]}),
          new TableCell({borders,width:{size:2430,type:WidthType.DXA},shading:hdrS,margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Current: $72.83",bold:true,font:"Arial",size:28,color:"FFFFFF"})]})]}),
          new TableCell({borders,width:{size:2430,type:WidthType.DXA},shading:{fill:"2E7D32",type:ShadingType.CLEAR},margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Upside: +37%",bold:true,font:"Arial",size:28,color:"FFFFFF"})]})]})
        ]})
      ]}),

      new Paragraph({spacing:{before:400},alignment:AlignmentType.CENTER,children:[new TextRun({text:DATE,font:"Arial",size:24,color:"666666"})]}),
      PB(),

      // ===== EXECUTIVE SUMMARY =====
      h1("1. Executive Summary"),
      pb([["We initiate coverage of Uber Technologies (UBER) with a ",{}],["BUY",{bold:true,color:"1B6B3A"}],["rating and a 12-month target price of ",{}],["$100",{bold:true}],[", implying ~37% upside from the current price of $72.83.",{}]]),
      p("Uber is the world's largest ride-hailing and on-demand delivery platform, operating in 70 countries and ~15,000 cities with 202M+ Monthly Active Platform Consumers (MAPCs). With $52B in FY2025 revenue, $9.8B in free cash flow, and an accelerating profitability profile, Uber has transformed from a cash-burning disruptor into a margin-expanding platform generating significant shareholder value. We believe the market underappreciates Uber's AV platform optionality, advertising margin accretion, and Uber One membership flywheel."),

      h2("Investment Thesis (4 Pillars)"),
      new Paragraph({numbering:{reference:"numbers",level:0},spacing:{after:80},children:[new TextRun({text:"Global Mobility Platform Dominance: ",bold:true,font:"Arial",size:22}),new TextRun({text:"~75% U.S. ride-hailing share, #1 or #2 in most international markets. 202M MAPCs and 13.6B annual trips create unassailable network effects. 60% of Mobility gross bookings are international, providing geographic diversification.",font:"Arial",size:22})]}),
      new Paragraph({numbering:{reference:"numbers",level:0},spacing:{after:80},children:[new TextRun({text:"AV Orchestration Platform of the Future: ",bold:true,font:"Arial",size:22}),new TextRun({text:"Multi-partner AV strategy (Waymo, WeRide, Nuro/Lucid, Momenta, Wayve) positions Uber as the world's largest autonomous vehicle aggregation platform. AVs on Uber are 30% more utilized vs. standalone competitors. 15 AV cities targeted by end-2026.",font:"Arial",size:22})]}),
      new Paragraph({numbering:{reference:"numbers",level:0},spacing:{after:80},children:[new TextRun({text:"High-Margin Revenue Diversification: ",bold:true,font:"Arial",size:22}),new TextRun({text:"Uber Ads surpassed $1.5B annual run rate (+60% YoY) with ~80% incremental margins. Uber One has 46M subscribers (+55% YoY) driving 3x higher spend and ~50% of total gross bookings. These flywheel businesses dramatically improve unit economics.",font:"Arial",size:22})]}),
      new Paragraph({numbering:{reference:"numbers",level:0},spacing:{after:80},children:[new TextRun({text:"Expanding Profitability & Capital Returns: ",bold:true,font:"Arial",size:22}),new TextRun({text:"Adj. EBITDA of $8.7B (16.7% margin), FCF of $9.8B, with clear path to 20%+ margins by 2029E. $10B+ annual buyback capacity supports per-share value creation.",font:"Arial",size:22})]}),

      new Table({width:{size:9720,type:WidthType.DXA},columnWidths:[2430,2430,2430,2430],rows:[
        new TableRow({children:[hc("Metric",2430),hc("FY2025A",2430),hc("FY2026E",2430),hc("FY2027E",2430)]}),
        new TableRow({children:[dc("Revenue ($B)",2430),dc("$52.0",2430),dc("$60.9",2430),dc("$70.0",2430)]}),
        new TableRow({children:[dc("Revenue Growth",2430,altS),dc("18.3%",2430,altS),dc("17.0%",2430,altS),dc("15.0%",2430,altS)]}),
        new TableRow({children:[dc("Adj. EBITDA ($B)",2430),dc("$8.7",2430),dc("$11.0",2430),dc("$13.5",2430)]}),
        new TableRow({children:[dc("EBITDA Margin",2430,altS),dc("16.7%",2430,altS),dc("18.0%",2430,altS),dc("19.3%",2430,altS)]}),
        new TableRow({children:[dc("Free Cash Flow ($B)",2430),dc("$9.8",2430),dc("$11.5",2430),dc("$13.8",2430)]}),
        new TableRow({children:[dc("EPS (GAAP)",2430,altS),dc("$4.73",2430,altS),dc("$3.50E",2430,altS),dc("$4.50E",2430,altS)]}),
      ]}),
      PB(),

      // ===== COMPANY OVERVIEW =====
      h1("2. Company Overview"),
      p("Uber Technologies, Inc. was founded in 2009 by Travis Kalanick and Garrett Camp in San Francisco, California. The company went public on NYSE in May 2019 at $45/share. Under CEO Dara Khosrowshahi (appointed September 2017, formerly CEO of Expedia), Uber has transformed from a growth-at-all-costs startup into a profitable, cash-generative platform."),

      h2("2.1 Business Segments"),
      h3("Mobility (57% of Revenue)"),
      b("The world's largest ride-hailing platform connecting riders with drivers across 70 countries."),
      b("Products: UberX, Uber Comfort, Uber Black, Uber XL, Uber Reserve, Uber Health, Uber for Business."),
      b("Gross Bookings ~$105B in FY2025; Take Rate ~30%. Highest-margin segment."),
      b("~75% U.S. market share vs. Lyft at ~25%. International gross bookings are 60% of segment total."),

      h3("Delivery (33% of Revenue — Uber Eats)"),
      b("On-demand food, grocery, alcohol, retail, and convenience delivery."),
      b("Gross Bookings ~$85B in FY2025; Take Rate ~18-20%. Margins expanding rapidly."),
      b("26.1% U.S. food delivery market share (vs. DoorDash 60.7%). #1 or #2 internationally."),
      b("New verticals: Grocery (Kohl's, Loblaws, Coles), retail, and alcohol expanding TAM beyond restaurants."),

      h3("Freight (10% of Revenue — Uber Freight)"),
      b("Digital freight brokerage connecting shippers with carriers."),
      b("Revenue ~$5.1B in FY2025 but segment still loss-making amid freight cycle downturn."),
      b("Secular digitization of $260B U.S. freight brokerage market supports long-term growth."),

      h2("2.2 Key Platform Metrics"),
      new Table({width:{size:9720,type:WidthType.DXA},columnWidths:[2430,2430,2430,2430],rows:[
        new TableRow({children:[hc("Metric",2430),hc("FY2023",2430),hc("FY2024",2430),hc("FY2025",2430)]}),
        new TableRow({children:[dc("MAPCs (millions)",2430),dc("150",2430),dc("171",2430),dc("202+",2430)]}),
        new TableRow({children:[dc("Annual Trips (billions)",2430,altS),dc("9.4",2430,altS),dc("11.2",2430,altS),dc("13.6",2430,altS)]}),
        new TableRow({children:[dc("Trips/MAPC/Month",2430),dc("5.4x",2430),dc("6.0x",2430),dc("~6.2x",2430)]}),
        new TableRow({children:[dc("Uber One Subscribers (M)",2430,altS),dc("~20",2430,altS),dc("~30",2430,altS),dc("46",2430,altS)]}),
        new TableRow({children:[dc("Gross Bookings ($B)",2430),dc("$138",2430),dc("$162",2430),dc("$194",2430)]}),
        new TableRow({children:[dc("Drivers & Couriers (M)",2430,altS),dc("~8",2430,altS),dc("~9",2430,altS),dc("10+",2430,altS)]}),
      ]}),

      h2("2.3 Management"),
      b("Dara Khosrowshahi, CEO (since 2017): Transformed Uber from loss-making to FCF-positive. Previously CEO of Expedia for 12 years."),
      b("Prashanth Mahendra-Rajah, CFO (since 2023): Formerly CFO of Analog Devices. Driving capital allocation discipline and shareholder returns."),
      b("Andrew Macdonald, SVP Mobility & Business Ops: Oversees ride-hailing globally."),
      PB(),

      // ===== SECTOR ANALYSIS =====
      h1("3. Sector Analysis"),
      p("The global ride-hailing and on-demand delivery platform sector represents a combined TAM of ~$700B, with Uber's addressable market at ~$450B across its operating geographies. Key highlights:"),
      b("Global ride-hailing market: ~$175B in 2025, growing at 9-13% CAGR toward $350B+ by 2030."),
      b("Global food delivery market: ~$290B in 2025, growing at 9-11% CAGR. Grocery/retail delivery expanding TAM to $400B+."),
      b("U.S. ride-hailing duopoly: Uber ~75%, Lyft ~25% — structurally stable."),
      b("U.S. food delivery: DoorDash 60.7%, Uber Eats 26.1% — competitive but consolidating."),
      b("AV revolution: Waymo, Tesla, and others deploying robotaxis. Uber positioning as the orchestration layer."),
      b("Gig worker regulation: EU Platform Workers Directive, UK worker classification — key risk factor."),
      p("For detailed sector analysis, see the companion Sector Overview document.", {italics:true,color:"888888"}),
      PB(),

      // ===== FINANCIAL ANALYSIS =====
      h1("4. Financial Analysis"),

      h2("4.1 Revenue Trajectory"),
      p("Uber has grown revenue from $17.5B in FY2021 to $52.0B in FY2025, a 31% CAGR. Growth has moderated from pandemic recovery levels but remains solid at ~18% in FY2025. Gross Bookings of $193.5B grew 19.4% YoY, indicating healthy underlying demand."),

      new Table({width:{size:9720,type:WidthType.DXA},columnWidths:[1944,1944,1944,1944,1944],rows:[
        new TableRow({children:[hc("Metric",1944),hc("FY2022",1944),hc("FY2023",1944),hc("FY2024",1944),hc("FY2025",1944)]}),
        new TableRow({children:[dc("Revenue ($B)",1944),dc("$31.9",1944),dc("$37.3",1944),dc("$44.0",1944),dc("$52.0",1944)]}),
        new TableRow({children:[dc("Rev Growth",1944,altS),dc("+83%",1944,altS),dc("+17%",1944,altS),dc("+18%",1944,altS),dc("+18%",1944,altS)]}),
        new TableRow({children:[dc("Gross Bookings ($B)",1944),dc("$115",1944),dc("$138",1944),dc("$162",1944),dc("$194",1944)]}),
        new TableRow({children:[dc("Overall Take Rate",1944,altS),dc("~28%",1944,altS),dc("~27%",1944,altS),dc("~27%",1944,altS),dc("~27%",1944,altS)]}),
      ]}),

      h2("4.2 Profitability Inflection"),
      p("Uber has undergone a remarkable profitability transformation. Adj. EBITDA swung from $90M in FY2021 to $8.7B in FY2025. GAAP operating income was $5.6B in FY2025, nearly double FY2024. Free cash flow of $9.8B demonstrates the capital-light nature of the platform model."),
      b("Adj. EBITDA margin expanded from 0.5% (FY2021) to 16.7% (FY2025) — dramatic operating leverage."),
      b("FCF margin of 18.8% in FY2025 — industry-leading among platform peers."),
      b("Mobility EBITDA margin ~7.8% of GBs; Delivery margin ~3.6% of GBs and expanding."),
      b("Advertising ($1.5B+ ARR) and Uber One provide high-margin incremental revenue."),

      h2("4.3 Balance Sheet"),
      p("Uber ended FY2025 with $7.0B in cash and $9.8B in total debt, implying net debt of ~$2.8B. The company's strong FCF generation ($9.8B) supports aggressive capital returns and debt reduction. Total equity of ~$28B provides a solid capital base."),
      PB(),

      // ===== VALUATION =====
      h1("5. Valuation"),

      h2("5.1 Comparable Company Analysis"),
      p("Uber trades at a meaningful discount to DoorDash on EV/EBITDA despite superior scale, diversification, and profitability. The discount reflects Uber's more mature growth profile vs. DoorDash's pure-play delivery premium."),

      new Table({width:{size:9720,type:WidthType.DXA},columnWidths:[1620,1620,1620,1620,1620,1620],rows:[
        new TableRow({children:[hc("Company",1620),hc("EV/Rev",1620),hc("EV/EBITDA",1620),hc("P/E",1620),hc("Rev Growth",1620),hc("EBITDA Mgn",1620)]}),
        new TableRow({children:[dc("UBER",1620,greenS),dc("2.9x",1620,greenS),dc("24x",1620,greenS),dc("15x",1620,greenS),dc("18%",1620,greenS),dc("16.7%",1620,greenS)]}),
        new TableRow({children:[dc("DASH",1620),dc("5.5x",1620),dc("54x",1620),dc("N/M",1620),dc("38%",1620),dc("~9%",1620)]}),
        new TableRow({children:[dc("LYFT",1620,altS),dc("0.8x",1620,altS),dc("10x",1620,altS),dc("N/M",1620,altS),dc("14%",1620,altS),dc("~8%",1620,altS)]}),
        new TableRow({children:[dc("GRAB",1620),dc("3.6x",1620),dc("24x",1620),dc("N/M",1620),dc("17%",1620),dc("~15%",1620)]}),
        new TableRow({children:[dc("ROO (Deliveroo)",1620,altS),dc("1.2x",1620,altS),dc("27x",1620,altS),dc("N/M",1620,altS),dc("10%",1620,altS),dc("~5%",1620,altS)]}),
        new TableRow({children:[dc("CART (Instacart)",1620),dc("2.8x",1620),dc("11x",1620),dc("16x",1620),dc("15%",1620),dc("~25%",1620)]}),
        new TableRow({children:[dc("Median",1620,{fill:"FFF3CD",type:ShadingType.CLEAR}),dc("2.8x",1620,{fill:"FFF3CD",type:ShadingType.CLEAR}),dc("24x",1620,{fill:"FFF3CD",type:ShadingType.CLEAR}),dc("15x",1620,{fill:"FFF3CD",type:ShadingType.CLEAR}),dc("15%",1620,{fill:"FFF3CD",type:ShadingType.CLEAR}),dc("~12%",1620,{fill:"FFF3CD",type:ShadingType.CLEAR})]}),
      ]}),

      h2("5.2 DCF Valuation"),
      p("Our DCF model uses a 5-year explicit forecast period (2026E-2030E) with a blended terminal value (50% perpetuity growth, 50% exit multiple). Key assumptions:"),
      b("WACC: ~9.2% (risk-free 4.3%, beta 1.15, ERP 5.5%, CRP 0.5%, debt weighting)"),
      b("Revenue CAGR (5Y): ~13% tapering from 17% to 10%"),
      b("Terminal EBITDA margin: 22% (vs 16.7% in FY2025)"),
      b("Terminal growth: 3.0% | Exit EV/EBITDA: 20x"),

      new Table({width:{size:9720,type:WidthType.DXA},columnWidths:[3240,3240,3240],rows:[
        new TableRow({children:[hc("Method",3240),hc("Implied Price",3240),hc("Upside",3240)]}),
        new TableRow({children:[dc("Perpetuity Growth (3.0%)",3240),dc("~$95",3240),dc("+30%",3240)]}),
        new TableRow({children:[dc("Exit Multiple (20x EBITDA)",3240,altS),dc("~$105",3240,altS),dc("+44%",3240,altS)]}),
        new TableRow({children:[
          new TableCell({borders,width:{size:3240,type:WidthType.DXA},shading:greenS,margins:cm,children:[new Paragraph({children:[new TextRun({text:"Blended (50/50)",bold:true,font:"Arial",size:20})]})]}),
          new TableCell({borders,width:{size:3240,type:WidthType.DXA},shading:greenS,margins:cm,children:[new Paragraph({children:[new TextRun({text:"~$100",bold:true,font:"Arial",size:20})]})]}),
          new TableCell({borders,width:{size:3240,type:WidthType.DXA},shading:greenS,margins:cm,children:[new Paragraph({children:[new TextRun({text:"+37%",bold:true,font:"Arial",size:20})]})]})
        ]}),
      ]}),

      h2("5.3 Target Price Derivation"),
      p("Our 12-month target price of $100 is derived from a blended DCF valuation. This implies an EV/EBITDA of ~14x on FY2027E EBITDA — a discount to the peer median of ~24x, which we believe is unjustified given Uber's superior scale, profitability, and AV optionality. The stock's recent 28% decline from its October 2025 all-time high of $100 presents an attractive entry point."),
      PB(),

      // ===== FINANCIAL MODEL SUMMARY =====
      h1("6. Financial Model Summary"),
      p("Key projections from our three-statement model:"),

      new Table({width:{size:9720,type:WidthType.DXA},columnWidths:[1944,1944,1944,1944,1944],rows:[
        new TableRow({children:[hc("($M)",1944),hc("FY2025A",1944),hc("FY2026E",1944),hc("FY2027E",1944),hc("FY2028E",1944)]}),
        new TableRow({children:[dc("Revenue",1944),dc("52,020",1944),dc("60,863",1944),dc("69,993",1944),dc("79,092",1944)]}),
        new TableRow({children:[dc("Gross Profit",1944,altS),dc("20,030",1944,altS),dc("23,737",1944,altS),dc("27,997",1944,altS),dc("32,428",1944,altS)]}),
        new TableRow({children:[dc("EBITDA",1944),dc("8,700",1944),dc("11,000",1944),dc("13,500",1944),dc("16,100",1944)]}),
        new TableRow({children:[dc("Operating Income",1944,altS),dc("5,570",1944,altS),dc("7,700",1944,altS),dc("10,200",1944,altS),dc("12,800",1944,altS)]}),
        new TableRow({children:[dc("Free Cash Flow",1944),dc("9,760",1944),dc("11,500",1944),dc("13,800",1944),dc("16,000",1944)]}),
        new TableRow({children:[dc("EPS (Adj.)",1944,altS),dc("$2.80",1944,altS),dc("$3.50",1944,altS),dc("$4.50",1944,altS),dc("$5.70",1944,altS)]}),
      ]}),

      p("Key assumptions: Revenue CAGR ~13% (FY2025-2030E), EBITDA margin expanding from 16.7% to 22.0%, capex declining from 3.3% to 2.5% of revenue. Full model in 3-statements.xlsx.", {size:20,italics:true,color:"666666"}),
      PB(),

      // ===== RISKS =====
      h1("7. Risks"),

      new Table({width:{size:9720,type:WidthType.DXA},columnWidths:[1620,4860,1620,1620],rows:[
        new TableRow({children:[hc("#",1620),hc("Risk",4860),hc("Probability",1620),hc("Impact",1620)]}),
        new TableRow({children:[dc("1",1620),dc("AV disruption: Waymo, Tesla, or Zoox deploy consumer-facing robotaxi apps at scale without Uber, eliminating Uber's take rate on AV trips. Partially mitigated by Uber's multi-partner strategy.",4860),dc("Medium",1620),dc("High",1620)]}),
        new TableRow({children:[dc("2",1620,altS),dc("Labor classification: EU Platform Workers Directive and UK worker classification rulings could add 20-35% to driver costs if reclassification spreads globally.",4860,altS),dc("High",1620,altS),dc("High",1620,altS)]}),
        new TableRow({children:[dc("3",1620),dc("Delivery share loss: DoorDash holds 60.7% U.S. share vs. Uber Eats 26.1%. DoorDash-Lyft partnership bundles DashPass+rides, directly attacking Uber One.",4860),dc("Medium",1620),dc("Medium",1620)]}),
        new TableRow({children:[dc("4",1620,altS),dc("Macro sensitivity: Ride-hailing is discretionary. Economic downturn reduces trips and delivery orders. Q1 2026 guidance miss suggests near-term margin investment.",4860,altS),dc("Medium",1620,altS),dc("Medium",1620,altS)]}),
        new TableRow({children:[dc("5",1620),dc("Regulatory complexity: Operating in 70 countries exposes Uber to license revocations (e.g. London TfL), data privacy fines (GDPR), and potential antitrust actions.",4860),dc("Medium",1620),dc("Medium",1620)]}),
        new TableRow({children:[dc("6",1620,altS),dc("Take rate pressure: Competition for driver and merchant supply could force higher incentives, compressing net revenue margins.",4860,altS),dc("Medium",1620,altS),dc("Medium",1620,altS)]}),
        new TableRow({children:[dc("7",1620),dc("Freight losses: Uber Freight remains loss-making in the freight downcycle. Sustained losses could weigh on consolidated margins.",4860),dc("Low",1620),dc("Low",1620)]}),
        new TableRow({children:[dc("8",1620,altS),dc("GAAP earnings volatility: Large equity investment positions (Didi, Aurora, Grab) cause non-cash P&L swings that obscure underlying operating performance.",4860,altS),dc("High",1620,altS),dc("Low",1620,altS)]}),
      ]}),
      PB(),

      // ===== APPENDICES =====
      h1("8. Appendices"),
      p("The following companion files contain detailed supporting analysis:"),
      b(`Sector Overview: coverage/${TICKER}/01-sector-overview.docx`),
      b(`Idea Generation & Screening: coverage/${TICKER}/02-idea-generation.docx`),
      b(`Comparable Company Analysis: coverage/${TICKER}/03-valuation/comps-analysis.xlsx`),
      b(`DCF Valuation Model: coverage/${TICKER}/03-valuation/dcf-model.xlsx`),
      b(`Three-Statement Financial Model: coverage/${TICKER}/04-financial-model/3-statements.xlsx`),
      b(`Thesis Tracker: coverage/${TICKER}/06-thesis-tracker.xlsx`),
      b(`Catalyst Calendar: coverage/${TICKER}/07-catalyst-calendar.xlsx`),
      PB(),

      // ===== DISCLAIMER =====
      h1("Disclaimer"),
      p("This report has been prepared for informational purposes only and does not constitute an offer to sell, a solicitation of an offer to buy, or a recommendation to purchase or sell any securities. The information contained herein is based on sources believed to be reliable, but no representation or warranty, express or implied, is made as to its accuracy, completeness, or timeliness.", {size:18,color:"666666"}),
      p("This report does not constitute investment advice. Past performance is not indicative of future results. Investors should conduct their own due diligence and consult with qualified financial professionals before making investment decisions.", {size:18,color:"666666"}),
      p("The analyst(s) responsible for this report certify that (1) the views expressed herein accurately reflect their personal views about the subject securities and issuers, and (2) no part of their compensation was, is, or will be directly or indirectly related to the specific recommendation or views contained in this report.", {size:18,color:"666666"}),
      p("Rating definitions: BUY = expected total return >15% over 12 months. OVERWEIGHT = >5%. HOLD = -5% to +5%. UNDERWEIGHT = <-5%. SELL = <-15%.", {size:18,color:"666666"}),
      p(`All data as of ${DATE}. Sources include company SEC filings, Yahoo Finance, StockAnalysis, Grand View Research, Statista, MacroTrends, and public financial databases.`, {size:18,color:"666666"}),
    ]
  }]
});

const outPath = `coverage/${TICKER}/05-initiation-report/initiation-${TICKER}-${DATE}.docx`;
Packer.toBuffer(doc).then(buf=>{
  fs.writeFileSync(outPath,buf);
  console.log(`Initiation report saved to: ${outPath}`);
});
