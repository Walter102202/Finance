const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

const TICKER = process.argv[2] || "MELI";
const QUARTER = process.argv[3] || "Q4-2025";
const DATE = "2026-02-25";

const border = { style: BorderStyle.SINGLE, size: 1, color: "999999" };
const borders = { top: border, bottom: border, left: border, right: border };
const cm = { top: 60, bottom: 60, left: 100, right: 100 };
const hdrS = { fill: "1B3A5C", type: ShadingType.CLEAR };
const altS = { fill: "F2F6FA", type: ShadingType.CLEAR };
const greenS = { fill: "E8F5E9", type: ShadingType.CLEAR };
const redS = { fill: "FFEBEE", type: ShadingType.CLEAR };
const yellowS = { fill: "FFF8E1", type: ShadingType.CLEAR };

function hc(t,w){return new TableCell({borders,width:{size:w,type:WidthType.DXA},shading:hdrS,margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:t,bold:true,font:"Arial",size:18,color:"FFFFFF"})]})]})}
function dc(t,w,s){const o={borders,width:{size:w,type:WidthType.DXA},margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:t,font:"Arial",size:20})]})]};if(s)o.shading=s;return new TableCell(o)}
function dcl(t,w,s){const o={borders,width:{size:w,type:WidthType.DXA},margins:cm,children:[new Paragraph({children:[new TextRun({text:t,font:"Arial",size:20})]})]};if(s)o.shading=s;return new TableCell(o)}
function dcb(t,w,s){const o={borders,width:{size:w,type:WidthType.DXA},margins:cm,children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:t,font:"Arial",size:20,bold:true})]})]};if(s)o.shading=s;return new TableCell(o)}
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
  ]},
  sections:[{
    properties:{
      page:{size:{width:12240,height:15840},margin:{top:1440,right:1440,bottom:1440,left:1440}}
    },
    headers:{
      default: new Header({children:[new Paragraph({alignment:AlignmentType.RIGHT,children:[new TextRun({text:`${TICKER} | Post-Earnings Analysis | ${QUARTER}`,font:"Arial",size:16,color:"888888",italics:true})]})]})
    },
    footers:{
      default: new Footer({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[new TextRun({text:"Page ",font:"Arial",size:16,color:"888888"}),new TextRun({children:[PageNumber.CURRENT],font:"Arial",size:16,color:"888888"})]})]})
    },
    children:[
      // COVER
      new Paragraph({spacing:{before:2400},alignment:AlignmentType.CENTER,children:[new TextRun({text:"POST-EARNINGS ANALYSIS",font:"Arial",size:44,bold:true,color:"1B3A5C"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:`${TICKER} (MercadoLibre, Inc.) \u2014 ${QUARTER}`,font:"Arial",size:32,color:"2C5F8A"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:`Reported: February 24, 2026 | Analysis Date: ${DATE}`,font:"Arial",size:22,color:"555555"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:120},children:[new TextRun({text:"Rating: BUY (Maintained) | Target: $2,200 (Under Review) | Current: $1,745",font:"Arial",size:24,bold:true,color:"1B6B3A"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:"Stock Reaction: -9.25% on Feb 25",font:"Arial",size:22,bold:true,color:"CC0000"})]}),

      PB(),

      // QUICK TAKE
      new Table({
        width:{size:9360,type:WidthType.DXA},columnWidths:[9360],
        rows:[new TableRow({children:[new TableCell({borders,width:{size:9360,type:WidthType.DXA},shading:{fill:"F0F7FF",type:ShadingType.CLEAR},margins:{top:140,bottom:140,left:200,right:200},children:[
          new Paragraph({spacing:{after:80},children:[new TextRun({text:"QUICK TAKE",font:"Arial",size:24,bold:true,color:"1B3A5C"})]}),
          new Paragraph({spacing:{after:0},children:[new TextRun({text:"Revenue blowout ($8.76B, +45% YoY) masked by EPS miss ($11.03 vs $11.77 consensus). The miss is entirely investment-driven: MELI deliberately compressed margins to fund free shipping expansion, credit card acceleration (3M issued in Q4 alone), and 16 new fulfillment centers. Credit quality actually improved (NPL 4.4%, historic low). GMV +37%, items sold +43%, credit portfolio +90%. This is a \"strategic margin compression\" quarter, not a fundamental miss. We maintain BUY and view the -9.25% selloff as a buying opportunity.",font:"Arial",size:22})]}),
        ]})]})]
      }),

      p(""),

      // SECTION 1: RESULTS VS EXPECTATIONS
      h1("1. Results vs. Expectations"),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[2200,1600,1600,1600,1180,1180],
        rows:[
          new TableRow({children:[hc("Metric",2200),hc("Actual",1600),hc("Our Model",1600),hc("Consensus",1600),hc("vs Model",1180),hc("vs Cons.",1180)]}),
          new TableRow({children:[dcl("Revenue ($B)",2200),dcb("$8.76B",1600),dc("$8.52B",1600),dc("$8.49B",1600),dc("+2.8%",1180,greenS),dc("+3.2%",1180,greenS)]}),
          new TableRow({children:[dcl("Rev Growth YoY",2200,altS),dcb("+44.6%",1600,altS),dc("+40.5%",1600,altS),dc("+40.1%",1600,altS),dc("+4.1pp",1180,greenS),dc("+4.5pp",1180,greenS)]}),
          new TableRow({children:[dcl("Gross Margin",2200),dcb("45.4%",1600),dc("44.8%",1600),dc("44.5%",1600),dc("+0.6pp",1180,greenS),dc("+0.9pp",1180,greenS)]}),
          new TableRow({children:[dcl("Adj. EBITDA ($M)",2200,altS),dcb("$1,127M",1600,altS),dc("$1,090M",1600,altS),dc("$1,100M",1600,altS),dc("+3.4%",1180,greenS),dc("+2.5%",1180,greenS)]}),
          new TableRow({children:[dcl("EBITDA Margin",2200),dcb("12.9%",1600),dc("12.8%",1600),dc("12.9%",1600),dc("+0.1pp",1180),dc("0.0pp",1180)]}),
          new TableRow({children:[dcl("Operating Income",2200,altS),dcb("$889M",1600,altS),dc("$890M",1600,altS),dc("$920M",1600,altS),dc("-0.1%",1180,altS),dc("-3.4%",1180,redS)]}),
          new TableRow({children:[dcl("Op. Margin",2200),dcb("10.1%",1600),dc("10.4%",1600),dc("10.8%",1600),dc("-0.3pp",1180,redS),dc("-0.7pp",1180,redS)]}),
          new TableRow({children:[dcl("Net Income ($M)",2200,altS),dcb("$559M",1600,altS),dc("$580M",1600,altS),dc("$610M",1600,altS),dc("-3.6%",1180,redS),dc("-8.4%",1180,redS)]}),
          new TableRow({children:[dcl("Diluted EPS",2200),dcb("$11.03",1600),dc("$11.42",1600),dc("$11.77",1600),dc("-3.4%",1180,redS),dc("-6.3%",1180,redS)]}),
          new TableRow({children:[dcl("GMV ($B)",2200,altS),dcb("$19.9B",1600,altS),dc("$19.0B",1600,altS),dc("$18.8B",1600,altS),dc("+4.7%",1180,greenS),dc("+5.9%",1180,greenS)]}),
          new TableRow({children:[dcl("TPV ($B)",2200),dcb("$83.7B",1600),dc("$82.0B",1600),dc("$80.5B",1600),dc("+2.1%",1180,greenS),dc("+4.0%",1180,greenS)]}),
        ]
      }),

      pb([["Verdict: ",{bold:true}],["Revenue and volume metrics significantly beat expectations across the board. Profitability missed due to deliberate investment spending, not operational deterioration.",{}]]),

      PB(),

      // SECTION 2: KEY SURPRISES
      h1("2. Key Surprises"),

      h2("Positive Surprises"),
      b("Revenue of $8.76B crushed even the high end of estimates (+45% YoY); FX-neutral growth was even stronger"),
      b("Credit portfolio surged to $12.5B (+90% YoY), with credit card portfolio at $5.7B (+114%) \u2014 far above expectations"),
      b("Credit quality improved: NPL 15-90 day at 4.4% (historic low), NIMAL expanded to 23% from 21% in Q3"),
      b("Items sold +43% YoY (752M units) \u2014 acceleration from Q3's +36%, showing marketplace engagement strengthening"),
      b("Advertising revenue grew +67% FX-neutral, making ads an increasingly meaningful margin contributor"),
      b("Fintech MAUs reached 78M (+28%), AUM surged to $18.8B (+78%)"),
      b("Brazil items sold +45% (accelerated from +42% in Q3), showing free shipping strategy is working"),

      h2("Negative Surprises"),
      b("EPS of $11.03 missed consensus of $11.77 by 6.3% \u2014 the primary driver of the stock selloff"),
      b("Operating margin compressed to 10.1% (from 13.5% in Q4 2024), a 340bps contraction"),
      b("Argentina revenue growth of +23% underperformed (missed estimates of $1.67B with $1.61B)"),
      b("Net income declined -13% YoY despite +45% revenue growth, highlighting the margin trade-off"),
      b("No specific margin recovery guidance from management \u2014 \"not trying to optimize short-term margin\""),

      PB(),

      // SECTION 3: MANAGEMENT COMMENTARY
      h1("3. Management Commentary Analysis"),

      h2("Investment Posture"),
      p("CFO Martin de los Santos explicitly stated: \"We are not trying to optimize short-term margin.\" This confirms the margin compression is deliberate and will continue. Management views the current period as a strategic investment window to capture market share in LATAM e-commerce and fintech while the opportunity exists."),

      h2("Key Strategic Highlights"),
      b("Leadership transition: Ariel Szarfsztejn became CEO on Jan 1, 2026; Marcos Galperin moved to Executive Chairman"),
      b("\"Agentic Commerce\" initiative using proprietary AI for product discovery and negotiation"),
      b("16 new fulfillment centers opened in 2025, including first facility in China for cross-border trade"),
      b("Free shipping threshold lowered in Brazil \u2192 \"record conversion rates\" and \"record retention rates\""),
      b("Credit card issuance accelerated to ~3M in Q4 (from 2M in Q3, 1.5M in Q2)"),
      b("AI assistant in Mercado Pago handled 9M conversations in Q4; 87% resolved without human support"),

      h2("Capital Allocation"),
      b("Capex 2025: ~$1.23B; 2026 guided at ~$1.42B (+15% increase)"),
      b("Minimal share buyback ($4.05M authorization) \u2014 NOT a capital return story"),
      b("Priority: aggressive reinvestment in logistics, fintech, 1P retail, free shipping, credit"),

      h2("Guidance"),
      p("No specific numeric guidance for 2026. Management signaled all business units growing at a \"fast pace\" with investments \"generating results and unlocking long-term value.\" The absence of margin guidance is notable and keeps uncertainty elevated."),

      PB(),

      // SECTION 4: GEOGRAPHIC BREAKDOWN
      h1("4. Geographic Performance"),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[1800,1600,1600,1560,1400,1400],
        rows:[
          new TableRow({children:[hc("Country",1800),hc("Revenue",1600),hc("YoY Growth",1600),hc("% of Total",1560),hc("vs Estimate",1400),hc("Assessment",1400)]}),
          new TableRow({children:[dcl("Brazil",1800),dc("$4.64B",1600),dc("+47.9%",1600),dc("54.9%",1560),dc("Beat",1400,greenS),dc("Strong",1400,greenS)]}),
          new TableRow({children:[dcl("Mexico",1800,altS),dc("$2.1B",1600,altS),dc("+55.6%",1600,altS),dc("22.4%",1560,altS),dc("N/A",1400,altS),dc("Very Strong",1400,greenS)]}),
          new TableRow({children:[dcl("Argentina",1800),dc("$1.61B",1600),dc("+23.3%",1600),dc("18.4%",1560),dc("Miss",1400,redS),dc("Soft",1400,yellowS)]}),
          new TableRow({children:[dcl("Other",1800,altS),dc("$414M",1600,altS),dc("+53.9%",1600,altS),dc("4.3%",1560,altS),dc("Beat",1400,greenS),dc("Strong",1400,greenS)]}),
        ]
      }),

      p(""),
      b("Brazil (+47.9%) and Mexico (+55.6%) are the twin growth engines, together representing 77% of revenue"),
      b("Mexico continues to outperform as nearshoring tailwinds drive economic activity; acquiring TPV +50%"),
      b("Argentina underperformed at +23.3% amid ongoing macro uncertainty; currency dynamics remain challenging"),
      b("\"Other\" markets (Colombia, Chile, Uruguay, etc.) showed strong +53.9% growth, indicating geographic diversification"),

      PB(),

      // SECTION 5: THESIS IMPACT
      h1("5. Thesis Impact Assessment"),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[2200,1400,1400,4360],
        rows:[
          new TableRow({children:[hc("Thesis Pillar",2200),hc("Pre-Q4 Status",1400),hc("Post-Q4 Status",1400),hc("Evidence / Commentary",4360)]}),
          new TableRow({children:[dcl("1. Ecosystem Moat",2200),dc("On Track",1400,greenS),dc("On Track",1400,greenS),dcl("83M unique buyers (+24%), cross-sell strong (Pago MAUs 78M)",4360)]}),
          new TableRow({children:[dcl("2. Take Rate Expansion",2200,altS),dc("On Track",1400,greenS),dc("On Track",1400,greenS),dcl("Commerce take rate reached 25.0%; ads +67% FX-neutral driving mix",4360,altS)]}),
          new TableRow({children:[dcl("3. Fintech Scaling",2200),dc("On Track",1400,greenS),dc("On Track",1400,greenS),dcl("TPV $83.7B (+42%), AUM $18.8B (+78%), credit portfolio +90%",4360)]}),
          new TableRow({children:[dcl("4. Credit Quality",2200,altS),dc("On Track",1400,greenS),dc("STRENGTHENED",1400,greenS),dcl("NPL 4.4% (historic low, down 300bps over 3yr), NIMAL improved to 23%",4360,altS)]}),
          new TableRow({children:[dcl("5. Margin Expansion",2200),dc("On Track",1400,greenS),dc("At Risk",1400,yellowS),dcl("Op margin 10.1% vs 13.5% prior year; deliberate but no recovery timeline",4360)]}),
          new TableRow({children:[dcl("6. LATAM Digitization",2200,altS),dc("On Track",1400,greenS),dc("On Track",1400,greenS),dcl("752M items (+43%), GMV $19.9B; penetration gains in all markets",4360,altS)]}),
          new TableRow({children:[dcl("7. Mexico Growth",2200),dc("On Track",1400,greenS),dc("STRENGTHENED",1400,greenS),dcl("Mexico rev +55.6%, acquiring TPV +50%; nearshoring tailwind visible",4360)]}),
          new TableRow({children:[dcl("8. Logistics Advantage",2200,altS),dc("On Track",1400,greenS),dc("On Track",1400,greenS),dcl("75%+ within 48hr, Brazil unit cost -11%, 16 new FCs opened",4360,altS)]}),
        ]
      }),

      p(""),
      pb([["Summary: ",{bold:true}],["7 of 8 pillars remain On Track or Strengthened. Only \"Margin Expansion\" moves to At Risk due to the 340bps operating margin contraction and absence of recovery guidance. However, this is a deliberate management choice, not structural deterioration.",{}]]),

      PB(),

      // SECTION 6: RATING AND TARGET
      h1("6. Rating & Target Price Review"),

      new Table({
        width:{size:9360,type:WidthType.DXA},columnWidths:[4680,4680],
        rows:[
          new TableRow({children:[hc("Item",4680),hc("Decision",4680)]}),
          new TableRow({children:[dcl("Rating",4680),dcb("MAINTAIN BUY",4680,greenS)]}),
          new TableRow({children:[dcl("Target Price",4680,altS),dcb("$2,200 (Under Review \u2014 Likely Increase)",4680,altS)]}),
          new TableRow({children:[dcl("Current Price (Feb 25)",4680),dc("$1,745",4680)]}),
          new TableRow({children:[dcl("Implied Upside",4680,altS),dcb("+26.1%",4680,greenS)]}),
          new TableRow({children:[dcl("Conviction Score",4680),dc("4.1 / 5.0 (from 4.3)",4680)]}),
        ]
      }),

      p(""),
      h2("Rationale for Maintaining BUY"),
      b("Revenue growth of +45% validates the core growth thesis \u2014 MELI is gaining market share across all key markets"),
      b("The EPS miss is investment-driven, not operational: credit quality actually improved, not deteriorated"),
      b("7/8 thesis pillars intact; margin compression is a known, deliberate trade-off for long-term dominance"),
      b("At $1,745, the stock trades at ~25x 2026E EPS \u2014 attractive for a company growing revenue 40%+"),
      b("The -9.25% selloff creates a better entry point; view as tactical buying opportunity"),

      h2("Target Price Under Review"),
      p("We will update our DCF and comps models with Q4 actuals (see Model Update). Preliminary assessment suggests upward target revision is warranted given the stronger-than-expected revenue trajectory. Higher revenue base partially offset by lower near-term margins."),

      p(""),
      p("This document is for informational purposes only and does not constitute investment advice.", {italics:true, color:"888888", size:18}),
    ]
  }]
});

const out = `coverage/${TICKER}/08-earnings/${QUARTER}/earnings-analysis.docx`;
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(out, buf);
  console.log(`Earnings analysis saved to: ${out}`);
});
