// DISCLAIMER: Financial data hardcoded in this script is illustrative only (as of Feb 2026). Update with current data before use. Not investment advice.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

const TICKER = process.argv[2] || "UBER";
const NOTE_DATE = process.argv[3] || "2026-02-28";

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
function h2(t){return new Paragraph({heading:HeadingLevel.HEADING_2,spacing:{before:200,after:120},children:[new TextRun({text:t,bold:true,font:"Arial"})]})}
function p(t,o={}){return new Paragraph({spacing:{after:100},children:[new TextRun({text:t,font:"Arial",size:22,...o})]})}
function b(t){return new Paragraph({numbering:{reference:"bullets",level:0},spacing:{after:60},children:[new TextRun({text:t,font:"Arial",size:22})]})}

const doc = new Document({
  styles:{
    default:{document:{run:{font:"Arial",size:22}}},
    paragraphStyles:[
      {id:"Heading2",name:"Heading 2",basedOn:"Normal",next:"Normal",quickFormat:true,run:{size:28,bold:true,font:"Arial",color:"2C5F8A"},paragraph:{spacing:{before:200,after:120},outlineLevel:1}},
    ]
  },
  numbering:{config:[
    {reference:"bullets",levels:[{level:0,format:LevelFormat.BULLET,text:"\u2022",alignment:AlignmentType.LEFT,style:{paragraph:{indent:{left:720,hanging:360}}}}]},
  ]},
  sections:[{
    properties:{
      page:{size:{width:12240,height:15840},margin:{top:1080,right:1080,bottom:1080,left:1080}}
    },
    headers:{
      default: new Header({children:[new Paragraph({alignment:AlignmentType.CENTER,children:[
        new TextRun({text:`MORNING NOTE | ${TICKER} | ${NOTE_DATE}`,font:"Arial",size:16,color:"888888",italics:true})
      ]})]})
    },
    children:[
      // HEADER TABLE
      new Table({
        width:{size:10080,type:WidthType.DXA},
        columnWidths:[1680,1680,1680,1680,1680,1680],
        rows:[
          new TableRow({children:[
            hc("Ticker",1680), hc("Rating",1680), hc("Target",1680), hc("Price",1680), hc("Upside",1680), hc("Action",1680)
          ]}),
          new TableRow({children:[
            dcb("UBER",1680), dcb("BUY",1680,greenS), dc("$109",1680), dc("$74.80",1680), dcb("+45.7%",1680,greenS), dcb("ACCUMULATE",1680,{fill:"E3F2FD",type:ShadingType.CLEAR})
          ]}),
        ]
      }),

      p(""),

      // PRICE ACTION
      h2("Price Action"),
      new Table({
        width:{size:10080,type:WidthType.DXA},
        columnWidths:[2016,2016,2016,2016,2016],
        rows:[
          new TableRow({children:[hc("1-Day",2016), hc("1-Week",2016), hc("1-Month",2016), hc("YTD",2016), hc("Volume",2016)]}),
          new TableRow({children:[
            dcb("+0.5%",2016,greenS), dcb("-6.4%",2016,redS), dcb("-8.2%",2016,redS), dcb("+3.1%",2016,greenS), dc("~1.2x avg",2016)
          ]}),
        ]
      }),

      p(""),
      p("UBER traded roughly flat on Feb 27, consolidating after the post-earnings selloff. The stock is down -6.4% over the past week following Q4 2025 results (reported Feb 4), with the selloff driven by Q1 2026 EBITDA guidance of $2.37-2.47B below Street expectations of ~$2.55B. Volume has normalized to ~1.2x the 20-day average after spiking 2.5x on the earnings reaction day."),

      // NEWS / EVENTS
      h2("News & Events (Last 24 Hours)"),
      b("Post-earnings analyst updates: Goldman Sachs maintained Buy ($125 PT), BofA maintained Buy ($103 PT), Guggenheim Buy ($125 PT) - all citing operational strength despite margin softness"),
      b("Waymo announced expansion plans for San Francisco ride-hailing service on Uber's platform, expected H2 2026 - positive for AV Platform thesis pillar"),
      b("New CFO Balaji Krishnamurthy officially started Feb 16; first public comments expected at upcoming investor conferences"),
      b("Lyft (LYFT) Q4 2025 results (reported Feb 12): Record revenue, DashPass partnership gaining traction - competitive dynamics stable"),
      b("DoorDash (DASH) Q4 2025 results (reported Feb 13): Revenue +38% YoY, Wolt EU expanding well - delivery competitive pressure continues"),
      b("Federal Reserve FOMC meeting on March 19 - consensus expects hold; watch for rate cut signals supportive of consumer spending"),

      // THESIS UPDATE
      h2("Thesis Update"),
      new Table({
        width:{size:10080,type:WidthType.DXA},
        columnWidths:[3360,3360,3360],
        rows:[
          new TableRow({children:[hc("Status",3360), hc("Change",3360), hc("Conviction",3360)]}),
          new TableRow({children:[
            dcb("7/8 Pillars On Track",3360,greenS),
            dcl("No change post-Q4. AV & Delivery strengthened.",3360),
            dcb("4.6 / 5.0",3360)
          ]}),
        ]
      }),
      p(""),
      p("Q4 results reinforced operational strength: GBs +22%, Delivery revenue +30%, Delivery EBITDA margin expanded to 4.0%, and MAPCs reached 202M. The sole At Risk pillar remains Near-Term Margins given Q1 EBITDA guidance below Street. We increased conviction to 4.6/5.0 (from 4.5) based on AV platform momentum (15-city target, Waabi exclusivity), Uber One reaching 46M subscribers, and record $1.9B Q4 buyback."),

      // ACTION
      h2("Action"),
      new Table({
        width:{size:10080,type:WidthType.DXA},
        columnWidths:[10080],
        rows:[
          new TableRow({children:[new TableCell({borders,width:{size:10080,type:WidthType.DXA},shading:{fill:"E3F2FD",type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:200,right:200},children:[
            new Paragraph({children:[
              new TextRun({text:"RECOMMENDATION: ACCUMULATE ON WEAKNESS",font:"Arial",size:24,bold:true,color:"1565C0"}),
            ]}),
            new Paragraph({spacing:{before:80},children:[
              new TextRun({text:"We recommend accumulating UBER on post-earnings weakness. At $74.80, the stock trades at ~22.7x 2026E adjusted EPS ($3.30), attractive for a platform growing Gross Bookings 20%+ with improving unit economics. The -6.4% weekly decline was driven by near-term margin concerns, not fundamental deterioration. Our updated target of $109 implies +45.7% upside. Key near-term catalysts: FOMC March 19, AV city expansion (Q2), and Q1 2026 earnings (~May 7). Reiterate BUY.",font:"Arial",size:20}),
            ]}),
          ]})]}),
        ]
      }),

      // UPCOMING CATALYSTS
      h2("Upcoming Catalysts"),
      new Table({
        width:{size:10080,type:WidthType.DXA},
        columnWidths:[2520,5040,2520],
        rows:[
          new TableRow({children:[hc("Date",2520), hc("Event",5040), hc("Impact",2520)]}),
          new TableRow({children:[dcl("Mar 19",2520),dcl("Federal Reserve FOMC Meeting - Rate decision impacts consumer spending",5040),dc("Medium",2520)]}),
          new TableRow({children:[dcl("Q2 2026",2520,altS),dcl("AV City Expansion Updates - Progress toward 15-city target",5040,altS),dc("High",2520,redS)]}),
          new TableRow({children:[dcl("May 7 (Est.)",2520),dcl("UBER Q1 2026 Earnings - Key: EBITDA vs guide, margin trajectory",5040),dc("High",2520,redS)]}),
          new TableRow({children:[dcl("May 8 (Est.)",2520,altS),dcl("Lyft Q1 2026 Earnings - U.S. ride-hailing competitive dynamics",5040,altS),dc("Medium",2520,altS)]}),
          new TableRow({children:[dcl("H1 2026",2520),dcl("Waymo-Uber SF Launch - Major AV catalyst if timeline holds",5040),dc("High",2520,redS)]}),
          new TableRow({children:[dcl("H1 2026",2520,altS),dcl("EU Platform Workers Directive Transposition - Regulatory headwind",5040,altS),dc("High",2520,redS)]}),
        ]
      }),

      p(""),
      p("Near-term focus is on March FOMC (dovish signals supportive for consumer discretionary) and Q2 AV expansion updates. Q1 2026 earnings (~May 7) will be critical to assess margin investment trajectory."),

      p(""),
      p("This note is for informational purposes only. Not investment advice.", {italics:true, color:"888888", size:16}),
    ]
  }]
});

const out = `coverage/${TICKER}/09-morning-notes/${NOTE_DATE}-note.docx`;
Packer.toBuffer(doc).then(buf => {
  fs.writeFileSync(out, buf);
  console.log(`Morning note saved to: ${out}`);
});
