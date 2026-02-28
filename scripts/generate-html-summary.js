const fs = require('fs');
const path = require('path');

const TICKER = process.argv[2] || "UBER";
const DATE = new Date().toISOString().split("T")[0];

// Dummy data mirroring the current hardcoded setup in existing scripts
const dataMap = {
  "UBER": {
    companyName: "Uber Technologies, Inc.",
    rating: "BUY",
    targetPrice: "$100",
    currentPrice: "$72.83",
    upside: "+37%",
    summary: "Uber is the world's largest ride-hailing and on-demand delivery platform. With $52B in FY2025 revenue, $9.8B in free cash flow, and an accelerating profitability profile, Uber has transformed from a cash-burning disruptor into a margin-expanding platform.",
    highlights: [
      "Global Mobility Dominance: ~75% U.S. ride-hailing share. 202M MAPCs.",
      "AV Orchestration Platform: Positioned as the world's largest autonomous vehicle aggregation platform.",
      "High-Margin Diversification: Uber Ads at $1.5B run rate; Uber One at 46M subscribers."
    ]
  },
  "MELI": {
    companyName: "MercadoLibre, Inc.",
    rating: "BUY",
    targetPrice: "$2,220",
    currentPrice: "$1,850",
    upside: "+20%",
    summary: "MercadoLibre is the clear e-commerce and fintech leader in Latin America. Its powerful ecosystem loop between marketplace and MercadoPago continues to take market share with massive network effects.",
    highlights: [
      "Fintech Expansion: Accelerated credit origination and MP wallet adoption.",
      "Logistics Moat: Mercado Envios handles over 90% of shipped volume.",
      "High Growth Ecosystem: Leveraging Ads to turbocharge operating margins."
    ]
  }
};

const data = dataMap[TICKER] || {
    companyName: `${TICKER} Corp.`,
    rating: "HOLD",
    targetPrice: "N/A",
    currentPrice: "N/A",
    upside: "N/A",
    summary: "Generated summary for the ticker based on the local pipeline executing.",
    highlights: ["Data point 1", "Data point 2", "Data point 3"]
};

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${TICKER} - Equity Research Summary</title>
    <style>
        :root {
            --bg-color: #f8fafc;
            --card-bg: #ffffff;
            --primary: #1e293b;
            --accent: #2563eb;
            --success: #16a34a;
            --text-main: #334155;
            --text-light: #64748b;
            --border: #e2e8f0;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: var(--bg-color);
            color: var(--text-main);
            line-height: 1.6;
        }

        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
        }

        .card {
            background-color: var(--card-bg);
            border-radius: 16px;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
            overflow: hidden;
            margin-bottom: 20px;
        }

        .header {
            background: linear-gradient(135deg, var(--primary) 0%, #334155 100%);
            color: white;
            padding: 24px;
            text-align: center;
        }

        .ticker {
            font-size: 2.5rem;
            font-weight: 800;
            margin: 0;
            letter-spacing: -1px;
        }

        .company-name {
            font-size: 1.1rem;
            opacity: 0.9;
            margin: 4px 0 0 0;
        }

        .date-badge {
            display: inline-block;
            background: rgba(255, 255, 255, 0.2);
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.85rem;
            margin-top: 12px;
        }

        .metrics-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
            padding: 24px;
            background-color: var(--card-bg);
        }

        .metric-box {
            text-align: center;
            padding: 16px;
            border-radius: 12px;
            border: 1px solid var(--border);
        }

        .metric-box.rating {
            background-color: #dcfce7;
            border-color: #bbf7d0;
            grid-column: 1 / -1;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 12px;
        }

        .metric-label {
            font-size: 0.85rem;
            color: var(--text-light);
            text-transform: uppercase;
            letter-spacing: 0.5px;
            font-weight: 600;
            margin-bottom: 4px;
        }

        .metric-value {
            font-size: 1.5rem;
            font-weight: 700;
            color: var(--primary);
        }

        .metric-value.rating-val {
            font-size: 2rem;
            color: var(--success);
            margin: 0;
        }
        
        .metric-value.upside {
            color: var(--success);
        }

        .content-section {
            padding: 0 24px 24px 24px;
        }

        h3 {
            color: var(--primary);
            font-size: 1.2rem;
            margin-bottom: 12px;
            border-bottom: 2px solid var(--border);
            padding-bottom: 8px;
        }

        p.summary-text {
            font-size: 1.05rem;
            color: var(--text-main);
            margin-bottom: 20px;
        }

        ul.highlights {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        ul.highlights li {
            position: relative;
            padding-left: 24px;
            margin-bottom: 12px;
            font-size: 0.95rem;
        }

        ul.highlights li::before {
            content: "•";
            color: var(--accent);
            position: absolute;
            left: 0;
            top: -2px;
            font-size: 1.5rem;
        }

        .footer {
            text-align: center;
            padding: 16px;
            font-size: 0.85rem;
            color: var(--text-light);
        }

        .footer a {
            color: var(--accent);
            text-decoration: none;
            font-weight: 600;
        }
    </style>
</head>
<body>

<div class="container">
    <div class="card">
        <!-- Header -->
        <div class="header">
            <h1 class="ticker">${TICKER}</h1>
            <h2 class="company-name">${data.companyName}</h2>
            <div class="date-badge">Initiating Coverage • ${DATE}</div>
        </div>

        <!-- Key Metrics -->
        <div class="metrics-grid">
            <div class="metric-box rating">
                <div class="metric-label" style="margin:0;">Recommendation</div>
                <div class="metric-value rating-val">${data.rating}</div>
            </div>
            
            <div class="metric-box">
                <div class="metric-label">Target Price</div>
                <div class="metric-value">${data.targetPrice}</div>
            </div>
            
            <div class="metric-box">
                <div class="metric-label">Current</div>
                <div class="metric-value">${data.currentPrice}</div>
            </div>
            
            <div class="metric-box" style="grid-column: 1 / -1;">
                <div class="metric-label">Implied Upside</div>
                <div class="metric-value upside">${data.upside}</div>
            </div>
        </div>

        <!-- Executive Summary & Highlights -->
        <div class="content-section">
            <h3>Executive Summary</h3>
            <p class="summary-text">${data.summary}</p>
            
            <h3>Key Investment Pillars</h3>
            <ul class="highlights">
                ${data.highlights.map(hl => `<li>${hl}</li>`).join('')}
            </ul>
        </div>
    </div>
    
    <div class="footer">
        Generated by OpenClaw Financial AI
    </div>
</div>

</body>
</html>
`;

// Ensure directory exists
const dirPath = path.join(process.cwd(), 'coverage', TICKER);
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
}

// Write the file
const filePath = path.join(dirPath, 'summary-card.html');
fs.writeFileSync(filePath, htmlContent.trim());

console.log(`Successfully generated mobile summary card at: ${filePath}`);
