// DISCLAIMER: Financial data hardcoded in this script is illustrative only (as of Feb 2026). Update with current data before use. Not investment advice.
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  Header, Footer, AlignmentType, LevelFormat, HeadingLevel,
  BorderStyle, WidthType, ShadingType, PageNumber, PageBreak
} = require("docx");

const TICKER = process.argv[2] || "MELI";
const NOTE_DATE = process.argv[3] || "2026-02-27";

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
            dcb("MELI",1680), dcb("BUY",1680,greenS), dc("$2,220",1680), dc("$1,794",1680), dcb("+23.7%",1680,greenS), dcb("ACCUMULATE",1680,{fill:"E3F2FD",type:ShadingType.CLEAR})
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
            dcb("+2.8%",2016,greenS), dcb("-6.7%",2016,redS), dcb("-4.5%",2016,redS), dcb("-3.8%",2016,redS), dc("~1.5x avg",2016)
          ]}),
        ]
      }),

      p(""),
      p("MELI bounced +2.8% on Feb 26, recovering a portion of the -9.25% post-earnings selloff from the prior session. Volume was ~1.5x the 20-day average, normalizing from 3.5x on the selloff day. The partial recovery was led by value-oriented buyers stepping in at ~25x 2026E EPS. Pre-market futures indicate a flat open today."),

      // NEWS / EVENTS
      h2("News & Events (Last 24 Hours)"),
      b("Post-earnings analyst notes: Morgan Stanley reiterated OW ($2,950 PT), citing credit quality inflection; Goldman maintained Buy ($2,600 PT) noting Mexico acceleration"),
      b("Nubank (NU) reported Q4 2025 yesterday (Feb 26 AMC): Revenue +36% YoY, ROE 29% — read-across positive for MELI's fintech thesis"),
      b("Brazil real strengthened +0.6% vs USD to R$5.72, supportive for MELI's BRL-denominated revenue"),
      b("Mexico nearshoring data: January industrial production +4.2% YoY, above consensus, positive for MELI Mexico commerce"),
      b("Sea Limited (SE) Q4 results due Mar 4 — key read-across for Shopee Brazil competitive dynamics"),

      // THESIS UPDATE
      h2("Thesis Update"),
      new Table({
        width:{size:10080,type:WidthType.DXA},
        columnWidths:[3360,3360,3360],
        rows:[
          new TableRow({children:[hc("Status",3360), hc("Change",3360), hc("Conviction",3360)]}),
          new TableRow({children:[
            dcb("7/8 Pillars On Track",3360,greenS),
            dcl("No change. NU results reinforce fintech thesis.",3360),
            dcb("4.25 / 5.0",3360)
          ]}),
        ]
      }),
      p(""),
      p("Nubank's strong Q4 results (ROE 29%, asset quality stable) validate the broader LATAM fintech opportunity and support our Fintech Scaling pillar. NU's off-platform credit growth parallels MELI's Mercado Credito trajectory. Margin Expansion remains the sole At Risk pillar — no change in assessment; requires Q1 2026 data to evaluate whether investment cycle moderates."),

      // ACTION
      h2("Action"),
      new Table({
        width:{size:10080,type:WidthType.DXA},
        columnWidths:[10080],
        rows:[
          new TableRow({children:[new TableCell({borders,width:{size:10080,type:WidthType.DXA},shading:{fill:"E3F2FD",type:ShadingType.CLEAR},margins:{top:120,bottom:120,left:200,right:200},children:[
            new Paragraph({children:[
              new TextRun({text:"RECOMMENDATION: ACCUMULATE",font:"Arial",size:24,bold:true,color:"1565C0"}),
            ]}),
            new Paragraph({spacing:{before:80},children:[
              new TextRun({text:"We continue to recommend accumulating MELI on post-earnings weakness. At $1,794 (+2.8% bounce), the stock remains ~7% below pre-earnings levels, offering an attractive entry at ~25x 2026E EPS. The partial recovery confirms buy-the-dip interest from institutional accounts. Near-term focus shifts to Brazil Q4 GDP (Mar 4), SE Q4 results (Mar 4 — Shopee competitive read), and Copom (Mar 18). Reiterate BUY with $2,220 target (+23.7% upside).",font:"Arial",size:20}),
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
          new TableRow({children:[dcl("Mar 4",2520),dcl("Brazil Q4 2025 GDP Release — consensus +1.6-1.8% QoQ",5040),dc("Medium",2520)]}),
          new TableRow({children:[dcl("Mar 4",2520,altS),dcl("Sea Limited (SE) Q4 2024 Results — Shopee Brazil GMV commentary",5040,altS),dc("Medium",2520,altS)]}),
          new TableRow({children:[dcl("Mar 18",2520),dcl("Brazil Copom Meeting (Selic) — Expected hold at 15.0%",5040),dc("Medium",2520)]}),
          new TableRow({children:[dcl("Mar 27",2520,altS),dcl("Mexico Banxico Rate Decision — Expected hold at 9.5%",5040,altS),dc("Medium",2520,altS)]}),
          new TableRow({children:[dcl("May 7",2520),dcl("MELI Q1 2026 Earnings — Key: margin trajectory & credit quality",5040),dc("High",2520,redS)]}),
        ]
      }),

      p(""),
      p("Near-term catalyst density increases next week: Brazil GDP and SE results on Mar 4 will provide macro and competitive read-throughs. Copom on Mar 18 will signal Selic trajectory — any dovish pivot would be a meaningful positive for MELI's credit portfolio and consumer spending."),

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
