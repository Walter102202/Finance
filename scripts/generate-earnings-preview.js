// DISCLAIMER: Financial data hardcoded in this script is illustrative only (as of Feb 2026). Update with current data before use. Not investment advice.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

const TICKER = process.argv[2] || "UBER";
const QUARTER = process.argv[3] || "Q1-2026";
const DATE = new Date().toISOString().split("T")[0];

const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 60, bottom: 60, left: 100, right: 100 };
const hdrS = { fill: "1B3A5C", type: ShadingType.CLEAR };
const altS = { fill: "F2F6FA", type: ShadingType.CLEAR };
const greenS = { fill: "E8F5E9", type: ShadingType.CLEAR };
const yellowS = { fill: "FFF8E1", type: ShadingType.CLEAR };
const redS = { fill: "FFEBEE", type: ShadingType.CLEAR };

function hc(t,w){return new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:hdrS,margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:t,bold:true,font:"Arial",size:18,color:"FFFFFF"})]})]})}
function dc(t,w,s){const o={borders,width:{size:w,type:WidthType.DXA},margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:t,font:"Arial",size:20})]})]};if(s)o.shading=s;return new TableCell(o)}
function dcl(t,w,s){const o={borders,width:{size:w,type:WidthType.DXA},margins:cm,children:[new Paragraph({children:[new TextRun({text:t,font:"Arial",size:20})]})]};if(s)o.shading=s;return new TableCell(o)}
function h1(t){return new Paragraph({heading:HeadingLevel.HEADING_1,spacing:{before:360,after:240},children:[new TextRun({text:t,bold:true,font:"Arial"})]})}
function h2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:240,after:180},children:[new TextRun({text:t,bold:true,font:"Arial"})]})}
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
    ]
  },
  numbering:{config:[
    {reference:"bullets",levels:[{level:0,format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
    {reference:"numbers",levels:[{level:0,format:LevelFormat.DECIMAL,text:"%1.",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  ]},
  sections:[{
    properties:{
      page:{
        size:{width:12240,height:15840},
        margin:{top:1440,right:1440,bottom:1440,left:1440}
      }
    },
    headers:{
      default: new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:`${TICKER} | Earnings Preview | ${QUARTER}`,font:"Arial",size:16,color:"888888",italics:true})]})]})
    },
    footers:{
      default: new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Page ",font:"Arial",size:16,color:"888888"}),new TextRun({children:[PageNumber.CURRENT],font:"Arial",size:16,color:"888888"})]})]})
    },
    children:[
      // COVER
      new Paragraph({spacing:{before:2400},alignment:AlignmentType.CENTER,children:[new TextRun({text:"EARNINGS PREVIEW",font:"Arial",size:44,bold:true,color:"1B3A5C"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:`${TICKER} (Uber Technologies, Inc.)`,font:"Arial",size:32,color:"2C5F8A"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:`${QUARTER} | Earnings Date: May 7, 2026 (Estimated)`,font:"Arial",size:24,color:"555555"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:120},children:[new TextRun({text:`Rating: BUY | Target: $109 | Current: $74.80`,font:"Arial",size:24,bold:true,color:"1B6B3A"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:600},children:[new TextRun({text:`Prepared: ${DATE}`,font:"Arial",size:20,italics:true,color:"888888"})]}),

      // KEY CONTEXT
      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[9360],
        rows:[
          new TableRow({children:[new TableCell({borders,width:{size:9360,type:WidthType.DXA},shading:{fill:"F0F7FF",type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:200,right:200},children:[
            new Paragraph({spacing:{after:80},children:[new TextRun({text:"Key Context: ",font:"Arial",size:22,bold:true,color:"1B3A5C"}),new TextRun({text:"Q4 2025 saw Revenue $14.37B (+20% YoY), GBs $54.14B (+22%), Adj. EBITDA $2.49B (+35%), and FCF $2.8B. Q1 2026 guidance: GBs $52.0-53.5B (+17-21% cc), EBITDA $2.37-2.47B (below Street ~$2.55B). Stock fell ~6.4% post-earnings as management signaled near-term investment in affordable mobility products and driver supply. Non-GAAP EPS estimates cut from ~$4.15 to ~$3.30 for FY2026. The market is watching whether Q1 EBITDA lands within/above guidance or continues to compress.",font:"Arial",size:22})]}),
          ]})]}),
        ]
      }),

      PB(),

      // SECTION 1: ESTIMATES TABLE
      h1("1. Our Model vs. Consensus Estimates"),
      p("The table below compares our internal model projections against Wall Street consensus for key Q1 2026 metrics."),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[2800,2200,2200,2160],
        rows:[
          new TableRow({children:[hc("Metric",2800),hc("Our Model",2200),hc("Consensus",2200),hc("Delta",2160)]}),
          new TableRow({children:[dcl("Revenue ($B)",2800),dc("$14.75B",2200),dc("$14.60B",2200),dc("+1.0%",2160)]}),
          new TableRow({children:[dcl("Revenue YoY Growth",2800,altS),dc("+18.5%",2200,altS),dc("+17.3%",2200,altS),dc("+1.2pp",2160,altS)]}),
          new TableRow({children:[dcl("Gross Bookings ($B)",2800),dc("$53.0B",2200),dc("$52.8B",2200),dc("+0.4%",2160)]}),
          new TableRow({children:[dcl("GB Growth (cc)",2800,altS),dc("+19%",2200,altS),dc("+18%",2200,altS),dc("+1pp",2160,altS)]}),
          new TableRow({children:[dcl("Adj. EBITDA ($B)",2800),dc("$2.42B",2200),dc("$2.40B",2200),dc("+0.8%",2160)]}),
          new TableRow({children:[dcl("EBITDA % of GBs",2800,altS),dc("4.6%",2200,altS),dc("4.5%",2200,altS),dc("+0.1pp",2160,altS)]}),
          new TableRow({children:[dcl("GAAP Op. Income ($B)",2800),dc("$1.65B",2200),dc("$1.60B",2200),dc("+3.1%",2160)]}),
          new TableRow({children:[dcl("Non-GAAP EPS",2800,altS),dc("$0.72",2200,altS),dc("$0.68",2200,altS),dc("+5.9%",2160,altS)]}),
          new TableRow({children:[dcl("MAPCs (M)",2800),dc("212M",2200),dc("210M",2200),dc("+1.0%",2160)]}),
          new TableRow({children:[dcl("Trips (B)",2800,altS),dc("3.95B",2200,altS),dc("3.9B",2200,altS),dc("+1.3%",2160,altS)]}),
        ]
      }),

      p(""),
      p("Our model is slightly above consensus on revenue and EBITDA, reflecting our view that management's guidance was deliberately conservative to manage expectations. We model EBITDA at the upper end of the $2.37-2.47B guidance range, as Q4 showed strong execution and we believe the investment ramp is partially front-loaded."),

      PB(),

      // SECTION 2: KEY METRICS TO WATCH
      h1("2. Key Metrics to Watch"),
      p("The 5 most important metrics that will determine market reaction to Q1 2026 results:"),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[2000,1800,1800,1880,1880],
        rows:[
          new TableRow({children:[hc("Metric",2000),hc("Beat Threshold",1800),hc("Miss Threshold",1800),hc("Our Estimate",1880),hc("Why It Matters",1880)]}),
          new TableRow({children:[
            dcl("Adj. EBITDA ($B)",2000),dc("> $2.50B",1800,greenS),dc("< $2.35B",1800,redS),dc("$2.42B",1880),dcl("Above guide = margin fears overblown",1880)
          ]}),
          new TableRow({children:[
            dcl("Gross Bookings",2000,altS),dc("> $53.5B",1800,greenS),dc("< $51.5B",1800,redS),dc("$53.0B",1880,altS),dcl("Demand health indicator; top end of guide",1880,altS)
          ]}),
          new TableRow({children:[
            dcl("Delivery Rev Growth",2000),dc("> +28%",1800,greenS),dc("< +20%",1800,redS),dc("+25%",1880),dcl("Delivery momentum vs DASH/competitors",1880)
          ]}),
          new TableRow({children:[
            dcl("MAPCs",2000,altS),dc("> 215M",1800,greenS),dc("< 205M",1800,redS),dc("212M",1880,altS),dcl("Platform engagement; affordable product impact",1880,altS)
          ]}),
          new TableRow({children:[
            dcl("Q2 EBITDA Guidance",2000),dc("> $2.60B",1800,greenS),dc("< $2.40B",1800,redS),dc("$2.55B",1880),dcl("Recovery trajectory from investment cycle",1880)
          ]}),
        ]
      }),

      PB(),

      // SECTION 3: REACTION SCENARIOS
      h1("3. Market Reaction Scenarios"),

      h2("Scenario A: Strong Beat (+5% to +10%)"),
      b("EBITDA > $2.50B (above guidance) AND Delivery growth > 28% AND positive Q2 guidance > $2.60B"),
      b("Market narrative: \"Investment cycle fears overblown; Uber executing on both growth and profitability\""),
      b("Expected move: +5-10% (stock to $78-82 range)"),
      b("Action: Maintain BUY; operational beat validates thesis. Hold position."),

      h2("Scenario B: In-Line / Mixed (+/-3%)"),
      b("EBITDA $2.37-2.50B (within guidance), GBs within guide, Q2 guide roughly flat sequentially"),
      b("Market narrative: \"Management delivering as promised; margin investment proceeding as planned\""),
      b("Expected move: -2% to +3% (stock stays $73-77)"),
      b("Action: Maintain BUY; no change to position. Monitor margin trajectory."),

      h2("Scenario C: Miss (-5% to -10%)"),
      b("EBITDA < $2.35B (below guidance) OR GBs < $51.5B OR negative Q2 guidance commentary"),
      b("Market narrative: \"Investment cycle deeper and longer than communicated; margin recovery uncertain\""),
      b("Expected move: -5% to -10% (stock to $67-71)"),
      b("Action: Review Near-Term Margins pillar closely; if miss is temporary and demand intact, BUY on weakness. If structural, consider downgrade to HOLD."),

      h2("Scenario D: Severe Miss with Downgrade Risk (-10%+)"),
      b("EBITDA < $2.20B AND GBs < $50B AND management signals extended investment cycle into 2027"),
      b("Market narrative: \"Fundamental thesis impaired; competitive dynamics deteriorating\""),
      b("Expected move: -10% to -15% (stock to $63-67)"),
      b("Action: Downgrade to HOLD if 2+ thesis pillars move to At Risk. Revisit target price significantly."),

      PB(),

      // SECTION 4: THESIS PILLAR WATCH
      h1("4. Thesis Pillar Watch"),
      p("How Q1 2026 results could impact each thesis pillar:"),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[2200,3560,3600],
        rows:[
          new TableRow({children:[hc("Pillar",2200),hc("What to Watch in Q1",3560),hc("Risk Signal",3600)]}),
          new TableRow({children:[dcl("1. Global Mobility",2200),dcl("MAPCs trajectory, trip growth, affordable product adoption",3560),dcl("MAPCs < 205M or trip growth < 15%",3600)]}),
          new TableRow({children:[dcl("2. AV Platform",2200,altS),dcl("City expansion updates, Waabi fleet progress, SF launch timeline",3560,altS),dcl("15-city target at risk; partner delays",3600,altS)]}),
          new TableRow({children:[dcl("3. Ads Revenue",2200),dcl("Ads ARR trajectory toward $2B; enterprise vs SMB mix",3560),dcl("Ads growth deceleration below 40% YoY",3600)]}),
          new TableRow({children:[dcl("4. Uber One",2200,altS),dcl("Subscriber growth (46M base), GBs penetration approaching 50%",3560,altS),dcl("Sub growth deceleration below 30%",3600,altS)]}),
          new TableRow({children:[dcl("5. Delivery Margins",2200),dcl("Delivery EBITDA margin trajectory (was 4.0% in Q4)",3560),dcl("Margin contraction below 3.5%",3600)]}),
          new TableRow({children:[dcl("6. Intl Growth",2200,altS),dcl("International Mobility GB share, EMEA delivery growth",3560,altS),dcl("International growth < 15% cc",3600,altS)]}),
          new TableRow({children:[dcl("7. FCF & Returns",2200),dcl("FCF generation, buyback pace ($1.9B in Q4), share count reduction",3560),dcl("FCF margin compression or buyback slowdown",3600)]}),
          new TableRow({children:[dcl("8. Near-Term Margins",2200,altS),dcl("EBITDA vs guidance, management tone on investment duration, Q2 outlook",3560,altS),dcl("EBITDA below guide or extended investment cycle",3600,altS)]}),
        ]
      }),

      PB(),

      // SECTION 5: POSITIONING
      h1("5. Positioning Recommendation"),
      pb([["Pre-Earnings Stance: ",{bold:true,color:"1B3A5C"}],["Maintain full position. Consider adding on any pre-earnings weakness below $72.",{}]]),
      p(""),
      p("Rationale: With the stock already down ~6% from pre-Q4 levels, much of the margin concern is priced in. Management's guidance was intentionally conservative after the market punished the Q1 guide. We expect EBITDA to land at the upper end of guidance ($2.42-2.49B range) as the affordable product investment ramp was partially front-loaded in Q1. The asymmetry is favorable: a beat could drive a meaningful relief rally, while an in-line result is largely expected."),
      p(""),
      pb([["Post-Earnings Playbook:",{bold:true,color:"1B3A5C"}]]),
      b("If Beat (Scenario A): Hold; raise target price if Q2 guidance confirms margin recovery trajectory"),
      b("If In-Line (Scenario B): Hold; focus on Q2 guidance and management commentary on investment duration"),
      b("If Miss (Scenario C): Differentiate between \"planned investment\" (buy the dip) vs \"competitive pressure\" (review thesis). Check Delivery margin and MAPCs carefully"),
      b("If Severe Miss (Scenario D): Downgrade to HOLD; reassess thesis pillars and target price"),

      // ADDITIONAL CONTEXT
      h1("6. Competitive Read-Throughs"),
      p("Key competitor results to inform Q1 expectations:"),
      b("Lyft (LYFT) Q1 2026 earnings (~May 8): U.S. ride-hailing share trends, DashPass partnership impact"),
      b("DoorDash (DASH) Q1 2026 earnings (~May 9): Delivery market share, DashPass penetration, Wolt EU growth"),
      b("Tesla Robotaxi update (Austin): 44 vehicles as of early 2026 - scale risk low near-term but watch expansion plans"),
      b("Grab Holdings (GRAB): Southeast Asia ride-hailing demand; Uber comparison market"),

      // DISCLAIMER
      p(""),
      p("This document is for informational purposes only and does not constitute investment advice. All estimates are subject to material revision.", {italics:true, color:"888888", size:18}),
    ]
  }]
});

const out = `coverage/${TICKER}/08-earnings/${QUARTER}/earnings-preview.docx`;
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(out, buf);
  console.log(`Earnings preview saved to: ${out}`);
});
