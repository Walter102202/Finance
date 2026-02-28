// DISCLAIMER: Financial data hardcoded in this script is illustrative only (as of Feb 2026). Update with current data before use. Not investment advice.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

const TICKER = process.argv[2] || "MELI";
const QUARTER = process.argv[3] || "Q4-2025";
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
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:`${TICKER} (MercadoLibre, Inc.)`,font:"Arial",size:32,color:"2C5F8A"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:200},children:[new TextRun({text:`${QUARTER} | Earnings Date: February 24, 2026`,font:"Arial",size:24,color:"555555"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:120},children:[new TextRun({text:`Rating: BUY | Target: $2,200 | Current: $1,922`,font:"Arial",size:24,bold:true,color:"1B6B3A"})]}),
      new Paragraph({alignment:AlignmentType.CENTER,spacing:{after:600},children:[new TextRun({text:`Prepared: February 10, 2026`,font:"Arial",size:20,italics:true,color:"888888"})]}),

      // KEY CONTEXT
      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[9360],
        rows:[
          new TableRow({children:[new TableCell({borders,width:{size:9360,type:WidthType.DXA},shading:{fill:"F0F7FF",type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:200,right:200},children:[
            new Paragraph({spacing:{after:80},children:[new TextRun({text:"Key Context: ",font:"Arial",size:22,bold:true,color:"1B3A5C"}),new TextRun({text:"Q3 2025 saw revenue of $6.9B (+103% FX-neutral), GMV of $15.8B, and EPS of $12.61. Margins compressed 200bps vs Q2 as MELI invested heavily in free shipping, credit card growth, and logistics. The market is watching whether Q4 continues the investment-over-margins posture or shows early stabilization.",font:"Arial",size:22})]}),
          ]})]}),
        ]
      }),

      PB(),

      // SECTION 1: ESTIMATES TABLE
      h1("1. Our Model vs. Consensus Estimates"),
      p("The table below compares our internal model projections against Wall Street consensus for key Q4 2025 metrics."),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[2800,2200,2200,2160],
        rows:[
          new TableRow({children:[hc("Metric",2800),hc("Our Model",2200),hc("Consensus",2200),hc("Delta (Ours vs Cons.)",2160)]}),
          new TableRow({children:[dcl("Revenue ($B)",2800),dc("$8.52B",2200),dc("$8.49B",2200),dc("+0.4%",2160)]}),
          new TableRow({children:[dcl("Revenue YoY Growth",2800,altS),dc("+40.5%",2200,altS),dc("+40.1%",2200,altS),dc("+0.4pp",2160,altS)]}),
          new TableRow({children:[dcl("Gross Margin",2800),dc("44.8%",2200),dc("44.5%",2200),dc("+0.3pp",2160)]}),
          new TableRow({children:[dcl("Adj. EBITDA ($M)",2800,altS),dc("$1,090M",2200,altS),dc("$1,100M",2200,altS),dc("-0.9%",2160,altS)]}),
          new TableRow({children:[dcl("EBITDA Margin",2800),dc("12.8%",2200),dc("12.9%",2200),dc("-0.1pp",2160)]}),
          new TableRow({children:[dcl("Operating Income ($M)",2800,altS),dc("$890M",2200,altS),dc("$920M",2200,altS),dc("-3.3%",2160,altS)]}),
          new TableRow({children:[dcl("Net Income ($M)",2800),dc("$580M",2200),dc("$610M",2200),dc("-4.9%",2160)]}),
          new TableRow({children:[dcl("Diluted EPS",2800,altS),dc("$11.42",2200,altS),dc("$11.77",2200,altS),dc("-3.0%",2160,altS)]}),
          new TableRow({children:[dcl("GMV ($B)",2800),dc("$19.0B",2200),dc("$18.8B",2200),dc("+1.1%",2160)]}),
          new TableRow({children:[dcl("TPV ($B)",2800,altS),dc("$82.0B",2200,altS),dc("$80.5B",2200,altS),dc("+1.9%",2160,altS)]}),
        ]
      }),

      p(""),
      p("Our model is broadly in-line with consensus on revenue but slightly below on profitability. We model heavier investment spending in Q4 (holiday season logistics + credit card push) compressing margins ~30bps more than the street expects."),

      PB(),

      // SECTION 2: KEY METRICS TO WATCH
      h1("2. Key Metrics to Watch"),
      p("These are the 5 most important metrics that will determine the market's reaction to Q4 results:"),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[2000,1800,1800,1880,1880],
        rows:[
          new TableRow({children:[hc("Metric",2000),hc("Beat Threshold",1800),hc("Miss Threshold",1800),hc("Our Estimate",1880),hc("Why It Matters",1880)]}),
          new TableRow({children:[
            dcl("Revenue",2000),dc("> $8.7B",1800,greenS),dc("< $8.2B",1800,redS),dc("$8.52B",1880),dcl("Top-line growth is the primary narrative",1880)
          ]}),
          new TableRow({children:[
            dcl("EPS",2000,altS),dc("> $12.00",1800,greenS),dc("< $11.00",1800,redS),dc("$11.42",1880,altS),dcl("Margin pressure from investments",1880,altS)
          ]}),
          new TableRow({children:[
            dcl("Credit Portfolio ($B)",2000),dc("> $12.0B",1800,greenS),dc("< $10.0B",1800,redS),dc("$11.5B",1880),dcl("Key growth driver; NPL quality critical",1880)
          ]}),
          new TableRow({children:[
            dcl("GMV Growth (FX-N)",2000,altS),dc("> +35%",1800,greenS),dc("< +25%",1800,redS),dc("+33%",1880,altS),dcl("Core marketplace health indicator",1880,altS)
          ]}),
          new TableRow({children:[
            dcl("Credit Card NPL (15-90d)",2000),dc("< 5.0%",1800,greenS),dc("> 7.0%",1800,redS),dc("4.8%",1880),dcl("Risk metric; deterioration kills fintech thesis",1880)
          ]}),
        ]
      }),

      PB(),

      // SECTION 3: REACTION SCENARIOS
      h1("3. Market Reaction Scenarios"),

      h2("Scenario A: Strong Beat (+5% to +10%)"),
      b("Revenue > $8.8B AND EPS > $12.00 AND credit NPLs stable"),
      b("Market narrative: \"Investment spending is paying off faster than expected\""),
      b("Expected move: +5-8% (stock to $2,010-$2,075 range)"),
      b("Action: Maintain BUY, consider increasing position size"),

      h2("Scenario B: In-Line / Mixed (+/-3%)"),
      b("Revenue $8.3-8.7B, EPS $11.00-$12.00, margins flat QoQ"),
      b("Market narrative: \"Solid execution but margin compression continues\""),
      b("Expected move: -2% to +3% (stock stays $1,880-$1,980)"),
      b("Action: Maintain BUY, no change to position"),

      h2("Scenario C: Miss (-5% to -10%)"),
      b("Revenue < $8.2B OR EPS < $11.00 OR NPL deterioration > 7%"),
      b("Market narrative: \"Investment cycle destroying value; credit risk rising\""),
      b("Expected move: -5% to -10% (stock to $1,730-$1,825)"),
      b("Action: Review thesis pillars; BUY on weakness if thesis intact, downgrade if NPL spike"),

      PB(),

      // SECTION 4: THESIS PILLAR WATCH
      h1("4. Thesis Pillar Watch"),
      p("How Q4 results could impact each thesis pillar:"),

      new Table({
        width:{size:9360,type:WidthType.DXA},
        columnWidths:[2200,3560,3600],
        rows:[
          new TableRow({children:[hc("Pillar",2200),hc("What to Watch in Q4",3560),hc("Risk Signal",3600)]}),
          new TableRow({children:[dcl("Ecosystem Moat",2200),dcl("Unique buyers growth, cross-sell between marketplace and fintech",3560),dcl("Buyer growth < 15% YoY",3600)]}),
          new TableRow({children:[dcl("Take Rate Expansion",2200,altS),dcl("Commerce take rate approaching 25%; ads growth trajectory",3560,altS),dcl("Take rate flat or declining QoQ",3600,altS)]}),
          new TableRow({children:[dcl("Fintech Scaling",2200),dcl("Off-platform TPV mix, credit card issuance pace (2M+ in Q3)",3560),dcl("Off-platform TPV% declining",3600)]}),
          new TableRow({children:[dcl("Credit Quality",2200,altS),dcl("NPL 15-90d trend, NIMAL trajectory, provision coverage",3560,altS),dcl("NPL > 6% or NIMAL < 20%",3600,altS)]}),
          new TableRow({children:[dcl("Margin Expansion",2200),dcl("EBITDA margin trajectory; management commentary on investment cycle duration",3560),dcl("No guidance on margin recovery timeline",3600)]}),
          new TableRow({children:[dcl("Mexico Growth",2200,altS),dcl("Mexico revenue growth >50% FX-neutral; acquiring TPV growth in MX",3560,altS),dcl("Mexico growth deceleration < 35%",3600,altS)]}),
          new TableRow({children:[dcl("Logistics Advantage",2200),dcl("48-hour delivery %, unit shipping cost reduction, fulfillment center expansion",3560),dcl("Shipping cost increase or delivery speed decline",3600)]}),
        ]
      }),

      PB(),

      // SECTION 5: POSITIONING
      h1("5. Positioning Recommendation"),
      pb([["Pre-Earnings Stance: ",{bold:true,color:"1B3A5C"}],["Maintain full position. Do NOT add ahead of earnings.",{}]]),
      p(""),
      p("Rationale: Our model is closely aligned with consensus, reducing the risk of a large surprise in either direction. The primary risk is a larger-than-expected margin miss, but the growth trajectory remains strong enough to support the current valuation. The investment-heavy posture is already known and partially priced in after Q3's margin compression."),
      p(""),
      pb([["Post-Earnings Playbook:",{bold:true,color:"1B3A5C"}]]),
      b("If Beat (Scenario A): Hold; reassess target price upward if credit quality holds"),
      b("If In-Line (Scenario B): Hold; no action needed"),
      b("If Miss (Scenario C): Differentiate between \"investment-driven\" miss (buy the dip) vs. \"fundamental\" miss (NPL spike / competitive loss). Only the latter warrants downgrade consideration"),

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
