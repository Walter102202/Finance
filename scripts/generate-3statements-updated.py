# DISCLAIMER: Financial data hardcoded in this script is illustrative only (as of Feb 2026). Update with current data before use. Not investment advice.
import openpyxl
from openpyxl.styles import Font, PatternFill, Alignment, Border, Side
from openpyxl.utils import get_column_letter
import sys

TICKER = sys.argv[1] if len(sys.argv) > 1 else "UBER"
wb = openpyxl.Workbook()

hf = Font(name="Arial", bold=True, color="FFFFFF", size=10)
hfill = PatternFill("solid", fgColor="1B3A5C")
blue = Font(name="Arial", color="0000FF", size=10)
blk = Font(name="Arial", color="000000", size=10)
grn = Font(name="Arial", color="008000", size=10)
bld = Font(name="Arial", bold=True, size=10)
bld_bl = Font(name="Arial", bold=True, size=10, color="1B3A5C")
tf = Font(name="Arial", bold=True, size=14, color="1B3A5C")
yel = PatternFill("solid", fgColor="FFFF00")
proj = PatternFill("solid", fgColor="FFF8E1")
bdr = Border(left=Side("thin","CCCCCC"), right=Side("thin","CCCCCC"), top=Side("thin","CCCCCC"), bottom=Side("thin","CCCCCC"))
totbdr = Border(top=Side("medium","1B3A5C"), bottom=Side("double","1B3A5C"))
ctr = Alignment(horizontal="center", vertical="center")
lft = Alignment(horizontal="left", vertical="center")
NUM = '#,##0;(#,##0);"-"'
PCT = '0.0%'

def hdr(ws, r, n):
    for c in range(1, n+1):
        cell = ws.cell(row=r, column=c)
        cell.font, cell.fill, cell.alignment, cell.border = hf, hfill, ctr, bdr

years_h = ["", "2023A", "2024A", "2025A", "2026E", "2027E", "2028E", "2029E"]
NC = len(years_h)

wa = wb.active
wa.title = "Assumptions"
wa.sheet_properties.tabColor = "1B3A5C"
wa["A1"] = f"Key Assumptions � {TICKER} (Uber Technologies) [UPDATED POST Q4-2025]"
wa["A1"].font = tf

for i, h in enumerate(years_h):
    wa.cell(row=3, column=1+i, value=h)
hdr(wa, 3, NC)
for c in range(2, 5):
    wa.cell(row=3, column=c).fill = PatternFill("solid", fgColor="3D5A80")
for c in range(5, NC):
    wa.cell(row=3, column=c).fill = PatternFill("solid", fgColor="E07A2F")
    wa.cell(row=3, column=c).font = Font(name="Arial", bold=True, color="FFFFFF", size=10)

assumptions_data = {
    4:  ("Revenue Growth %", [0.143, 0.177, 0.183, 0.178, 0.155, 0.136, 0.109], PCT),
    5:  ("COGS % of Revenue", [0.632, 0.625, 0.618, 0.615, 0.608, 0.600, 0.592], PCT),
    6:  ("S&M % of Revenue", [0.125, 0.115, 0.108, 0.110, 0.105, 0.100, 0.095], PCT),
    7:  ("R&D % of Revenue", [0.126, 0.120, 0.117, 0.115, 0.110, 0.105, 0.100], PCT),
    8:  ("G&A % of Revenue", [0.060, 0.055, 0.053, 0.052, 0.050, 0.048, 0.045], PCT),
    9:  ("D&A % of Revenue", [0.020, 0.020, 0.020, 0.020, 0.020, 0.020, 0.020], PCT),
    10: ("Tax Rate", [0.15, 0.18, 0.20, 0.21, 0.21, 0.21, 0.21], PCT),
    11: ("", [], ""),
    12: ("Capex % of Revenue", [0.020, 0.022, 0.022, 0.022, 0.023, 0.023, 0.023], PCT),
    13: ("AR Days", [22, 20, 19, 19, 18, 18, 17], '0'),
    14: ("AP Days", [32, 30, 28, 27, 26, 25, 25], '0'),
    15: ("Accrued Liabilities % Rev", [0.080, 0.078, 0.075, 0.073, 0.070, 0.068, 0.065], PCT),
    16: ("", [], ""),
    17: ("Interest Rate on Debt", [0.050, 0.050, 0.048, 0.048, 0.046, 0.044, 0.042], PCT),
    18: ("Shares Outstanding (M)", [2052, 2068, 2084, 2042, 2000, 1960, 1920], '#,##0'),
}

for r, (label, vals, fmt) in assumptions_data.items():
    wa.cell(row=r, column=1, value=label).font = bld if label else blk
    for i, v in enumerate(vals):
        c = 2 + i
        wa.cell(row=r, column=c, value=v).font = blue
        wa.cell(row=r, column=c).number_format = fmt
        if c >= 5:
            wa.cell(row=r, column=c).fill = yel

wa.column_dimensions["A"].width = 28
for c in range(2, NC+1):
    wa.column_dimensions[get_column_letter(c)].width = 13

# ========== INCOME STATEMENT ==========
wi = wb.create_sheet("Income Statement")
wi.sheet_properties.tabColor = "2C5F8A"
wi["A1"] = f"Income Statement � {TICKER} ($M) [UPDATED POST Q4-2025]"
wi["A1"].font = tf

for i, h in enumerate(years_h):
    wi.cell(row=3, column=1+i, value=h)
hdr(wi, 3, NC)

is_rows = [
    (4, "Revenue", True), (5, "YoY Growth %", False),
    (6, "(-) Cost of Revenue", False), (7, "Gross Profit", True), (8, "Gross Margin %", False),
    (9, "", False),
    (10, "(-) Sales & Marketing", False), (11, "(-) Research & Development", False),
    (12, "(-) General & Administrative", False),
    (13, "Total Operating Expenses", True), (14, "", False),
    (15, "Operating Income (EBIT)", True), (16, "Operating Margin %", False), (17, "", False),
    (18, "(-) Interest Expense", False), (19, "(+) Other Income / (Expense)", False),
    (20, "Pre-Tax Income", True), (21, "(-) Income Tax", False), (22, "Effective Tax Rate", False),
    (23, "Net Income", True), (24, "Net Margin %", False), (25, "", False),
    (26, "EPS (Diluted)", True), (27, "EBITDA", True), (28, "EBITDA Margin %", False),
]

for r, label, is_bold in is_rows:
    wi.cell(row=r, column=1, value=label).font = bld_bl if is_bold else blk

hist_rev = [37281, 43953, 52020]
hist_cogs = [23567, 27471, 32149]
hist_sm = [4661, 5055, 5618]
hist_rd = [4698, 5274, 6086]
hist_ga = [2238, 2418, 2757]
hist_int = [465, 475, 456]
hist_other = [-600, 1800, 900]

aref = "Assumptions!"
for i in range(3):
    c = 2 + i
    cl = get_column_letter(c)
    prev_cl = get_column_letter(c-1)
    wi.cell(row=4, column=c, value=hist_rev[i]).font = blue
    wi.cell(row=5, column=c).value = f"=({cl}4-{prev_cl}4)/{prev_cl}4" if i > 0 else 0.143
    wi.cell(row=5, column=c).number_format = PCT
    wi.cell(row=6, column=c, value=hist_cogs[i]).font = blue
    wi.cell(row=7, column=c).value = f"={cl}4-{cl}6"
    wi.cell(row=8, column=c).value = f"={cl}7/{cl}4"
    wi.cell(row=8, column=c).number_format = PCT
    wi.cell(row=10, column=c, value=hist_sm[i]).font = blue
    wi.cell(row=11, column=c, value=hist_rd[i]).font = blue
    wi.cell(row=12, column=c, value=hist_ga[i]).font = blue
    wi.cell(row=13, column=c).value = f"={cl}10+{cl}11+{cl}12"
    wi.cell(row=15, column=c).value = f"={cl}7-{cl}13"
    wi.cell(row=16, column=c).value = f"={cl}15/{cl}4"
    wi.cell(row=16, column=c).number_format = PCT
    wi.cell(row=18, column=c, value=hist_int[i]).font = blue
    wi.cell(row=19, column=c, value=hist_other[i]).font = blue
    wi.cell(row=20, column=c).value = f"={cl}15-{cl}18+{cl}19"
    wi.cell(row=21, column=c).value = f"={cl}20*{aref}{cl}10"
    wi.cell(row=22, column=c).value = f"=IF({cl}20=0,0,{cl}21/{cl}20)"
    wi.cell(row=22, column=c).number_format = PCT
    wi.cell(row=23, column=c).value = f"={cl}20-{cl}21"
    wi.cell(row=24, column=c).value = f"={cl}23/{cl}4"
    wi.cell(row=24, column=c).number_format = PCT
    wi.cell(row=26, column=c).value = f"={cl}23/{aref}{cl}18"
    wi.cell(row=26, column=c).number_format = '$#,##0.00'
    wi.cell(row=27, column=c).value = f"={cl}15+{cl}4*{aref}{cl}9"
    wi.cell(row=28, column=c).value = f"={cl}27/{cl}4"
    wi.cell(row=28, column=c).number_format = PCT

for i in range(4):
    c = 5 + i
    cl = get_column_letter(c)
    prev = get_column_letter(c - 1)
    acl = get_column_letter(c)
    wi.cell(row=4, column=c).value = f"={prev}4*(1+{aref}{acl}4)"
    wi.cell(row=5, column=c).value = f"={aref}{acl}4"
    wi.cell(row=5, column=c).number_format = PCT
    wi.cell(row=6, column=c).value = f"={cl}4*{aref}{acl}5"
    wi.cell(row=7, column=c).value = f"={cl}4-{cl}6"
    wi.cell(row=8, column=c).value = f"={cl}7/{cl}4"
    wi.cell(row=8, column=c).number_format = PCT
    wi.cell(row=10, column=c).value = f"={cl}4*{aref}{acl}6"
    wi.cell(row=11, column=c).value = f"={cl}4*{aref}{acl}7"
    wi.cell(row=12, column=c).value = f"={cl}4*{aref}{acl}8"
    wi.cell(row=13, column=c).value = f"={cl}10+{cl}11+{cl}12"
    wi.cell(row=15, column=c).value = f"={cl}7-{cl}13"
    wi.cell(row=16, column=c).value = f"={cl}15/{cl}4"
    wi.cell(row=16, column=c).number_format = PCT
    wi.cell(row=18, column=c).value = f"='Balance Sheet'!{cl}14*{aref}{acl}17"
    wi.cell(row=18, column=c).font = grn
    wi.cell(row=19, column=c, value=500).font = blue
    wi.cell(row=20, column=c).value = f"={cl}15-{cl}18+{cl}19"
    wi.cell(row=21, column=c).value = f"={cl}20*{aref}{acl}10"
    wi.cell(row=22, column=c).value = f"=IF({cl}20=0,0,{cl}21/{cl}20)"
    wi.cell(row=22, column=c).number_format = PCT
    wi.cell(row=23, column=c).value = f"={cl}20-{cl}21"
    wi.cell(row=24, column=c).value = f"={cl}23/{cl}4"
    wi.cell(row=24, column=c).number_format = PCT
    wi.cell(row=26, column=c).value = f"={cl}23/{aref}{acl}18"
    wi.cell(row=26, column=c).number_format = '$#,##0.00'
    wi.cell(row=27, column=c).value = f"={cl}15+{cl}4*{aref}{acl}9"
    wi.cell(row=28, column=c).value = f"={cl}27/{cl}4"
    wi.cell(row=28, column=c).number_format = PCT

for r in [4,6,7,10,11,12,13,15,18,19,20,21,23,27]:
    for c in range(2, NC):
        wi.cell(row=r, column=c).number_format = NUM

for r in [7, 13, 15, 20, 23, 27]:
    for c in range(1, NC):
        wi.cell(row=r, column=c).font = bld_bl
        wi.cell(row=r, column=c).border = totbdr if r in [7, 15, 23] else bdr

for r in range(4, 29):
    for c in range(5, NC):
        if not wi.cell(row=r, column=c).fill or wi.cell(row=r, column=c).fill.fgColor.rgb == "00000000":
            wi.cell(row=r, column=c).fill = proj

wi.column_dimensions["A"].width = 32
for c in range(2, NC+1):
    wi.column_dimensions[get_column_letter(c)].width = 14

# ========== BALANCE SHEET ==========
wb2 = wb.create_sheet("Balance Sheet")
wb2.sheet_properties.tabColor = "3D7AB5"
wb2["A1"] = f"Balance Sheet � {TICKER} ($M) [UPDATED POST Q4-2025]"
wb2["A1"].font = tf

for i, h in enumerate(years_h):
    wb2.cell(row=3, column=1+i, value=h)
hdr(wb2, 3, NC)

bs_rows = [
    (4, "ASSETS", True), (5, "Cash & Equivalents", False), (6, "Short-Term Investments", False),
    (7, "Accounts Receivable", False), (8, "Other Current Assets", False),
    (9, "Total Current Assets", True), (10, "", False),
    (11, "PP&E (net)", False), (12, "Goodwill", False),
    (13, "Equity Investments", False), (14, "Long-Term Debt", False),
    (15, "Other Non-Current Assets", False),
    (16, "Total Assets", True), (17, "", False),
    (18, "LIABILITIES", True), (19, "Accounts Payable", False), (20, "Accrued Liabilities", False),
    (21, "Short-Term Debt", False), (22, "Other Current Liabilities", False),
    (23, "Total Current Liabilities", True), (24, "", False),
    (25, "Long-Term Debt", False), (26, "Other Non-Current Liabilities", False),
    (27, "Total Liabilities", True), (28, "", False),
    (29, "EQUITY", True), (30, "Retained Earnings", False), (31, "Other Equity", False),
    (32, "Total Equity", True), (33, "Total Liab. + Equity", True),
    (34, "Balance Check (should be 0)", False),
]

for r, label, is_bold in bs_rows:
    wb2.cell(row=r, column=1, value=label).font = bld_bl if is_bold else blk

hist_bs = {
    5:  [5088, 5700, 7000],
    6:  [900, 1000, 1200],
    7:  [2249, 2403, 2708],
    8:  [1800, 2000, 2300],
    11: [2095, 2300, 2600],
    12: [16100, 16300, 16300],
    13: [13800, 15000, 15000],
    14: [9459, 9500, 9500],
    15: [3200, 3500, 3800],
    19: [1900, 2050, 2350],
    20: [2985, 3432, 3903],
    21: [500, 500, 500],
    22: [3000, 3200, 3500],
    25: [9459, 9500, 9500],
    26: [5000, 5200, 5400],
    31: [20188, 23321, 28000],
}

for r, vals in hist_bs.items():
    for i, v in enumerate(vals):
        wb2.cell(row=r, column=2+i, value=v).font = blue
        wb2.cell(row=r, column=2+i).number_format = NUM

isref = "'Income Statement'!"
for c in range(2, 5):
    cl = get_column_letter(c)
    wb2.cell(row=9, column=c).value = f"=SUM({cl}5:{cl}8)"
    wb2.cell(row=16, column=c).value = f"={cl}9+{cl}11+{cl}12+{cl}13+{cl}14+{cl}15"
    wb2.cell(row=23, column=c).value = f"=SUM({cl}19:{cl}22)"
    wb2.cell(row=27, column=c).value = f"={cl}23+{cl}25+{cl}26"
    wb2.cell(row=30, column=c).value = f"={cl}16-{cl}27-{cl}31"
    wb2.cell(row=32, column=c).value = f"={cl}30+{cl}31"
    wb2.cell(row=33, column=c).value = f"={cl}27+{cl}32"
    wb2.cell(row=34, column=c).value = f"={cl}16-{cl}33"
    wb2.cell(row=34, column=c).number_format = NUM

bsref = "'Balance Sheet'!"
for i in range(4):
    c = 5 + i
    cl = get_column_letter(c)
    prev = get_column_letter(c - 1)
    acl = get_column_letter(c)
    wb2.cell(row=5, column=c).value = f"={prev}5+'Cash Flow'!{cl}19"
    wb2.cell(row=5, column=c).font = grn
    wb2.cell(row=6, column=c).value = f"={prev}6*1.05"
    wb2.cell(row=7, column=c).value = f"={isref}{cl}4*{aref}{acl}13/365"
    wb2.cell(row=8, column=c).value = f"={prev}8*1.05"
    wb2.cell(row=9, column=c).value = f"=SUM({cl}5:{cl}8)"
    wb2.cell(row=11, column=c).value = f"={prev}11+{isref}{cl}4*{aref}{acl}12-{isref}{cl}4*{aref}{acl}9"
    wb2.cell(row=12, column=c).value = f"={prev}12"
    wb2.cell(row=13, column=c).value = f"={prev}13"
    wb2.cell(row=14, column=c).value = f"={prev}14"
    wb2.cell(row=15, column=c).value = f"={prev}15*1.03"
    wb2.cell(row=16, column=c).value = f"={cl}9+{cl}11+{cl}12+{cl}13+{cl}14+{cl}15"
    wb2.cell(row=19, column=c).value = f"={isref}{cl}6*{aref}{acl}14/365"
    wb2.cell(row=20, column=c).value = f"={isref}{cl}4*{aref}{acl}15"
    wb2.cell(row=21, column=c).value = f"={prev}21"
    wb2.cell(row=22, column=c).value = f"={prev}22*1.03"
    wb2.cell(row=23, column=c).value = f"=SUM({cl}19:{cl}22)"
    wb2.cell(row=25, column=c).value = f"={prev}25"
    wb2.cell(row=26, column=c).value = f"={prev}26*1.02"
    wb2.cell(row=27, column=c).value = f"={cl}23+{cl}25+{cl}26"
    wb2.cell(row=30, column=c).value = f"={prev}30+{isref}{cl}23"
    wb2.cell(row=31, column=c).value = f"={prev}31"
    wb2.cell(row=32, column=c).value = f"={cl}30+{cl}31"
    wb2.cell(row=33, column=c).value = f"={cl}27+{cl}32"
    wb2.cell(row=34, column=c).value = f"={cl}16-{cl}33"
    wb2.cell(row=34, column=c).number_format = NUM

for r in [5,6,7,8,9,11,12,13,14,15,16,19,20,21,22,23,25,26,27,30,31,32,33]:
    for c in range(2, NC):
        wb2.cell(row=r, column=c).number_format = NUM

for r in [9, 16, 23, 27, 32, 33]:
    for c in range(1, NC):
        wb2.cell(row=r, column=c).font = bld_bl

wb2.column_dimensions["A"].width = 30
for c in range(2, NC+1):
    wb2.column_dimensions[get_column_letter(c)].width = 14

# ========== CASH FLOW STATEMENT ==========
wc = wb.create_sheet("Cash Flow")
wc.sheet_properties.tabColor = "4A90D9"
wc["A1"] = f"Cash Flow Statement � {TICKER} ($M) [UPDATED POST Q4-2025]"
wc["A1"].font = tf

for i, h in enumerate(years_h):
    wc.cell(row=3, column=1+i, value=h)
hdr(wc, 3, NC)

cf_rows = [
    (4, "OPERATING ACTIVITIES", True), (5, "Net Income", False),
    (6, "(+) Depreciation & Amortization", False), (7, "Stock-Based Compensation", False),
    (8, "Changes in Working Capital", False),
    (9, "  Change in AR", False), (10, "  Change in AP", False),
    (11, "  Change in Accrued Liab", False), (12, "  Other Operating Changes", False),
    (13, "Cash from Operations (CFO)", True),
    (14, "", False), (15, "INVESTING ACTIVITIES", True),
    (16, "(-) Capital Expenditures", False), (17, "(-) Net Investment Changes", False),
    (18, "Cash from Investing (CFI)", True), (19, "Net Change in Cash", True),
]

for r, label, is_bold in cf_rows:
    wc.cell(row=r, column=1, value=label).font = bld_bl if is_bold else blk

hist_cfo = [6867, 7490, 10100]
hist_capex = [620, 750, 900]
hist_sbc = [1900, 1800, 1700]

for i in range(3):
    c = 2 + i
    cl = get_column_letter(c)
    wc.cell(row=5, column=c).value = f"={isref}{cl}23"
    wc.cell(row=5, column=c).font = grn
    wc.cell(row=6, column=c).value = f"={isref}{cl}4*{aref}{cl}9"
    wc.cell(row=7, column=c, value=hist_sbc[i]).font = blue
    wc.cell(row=13, column=c, value=hist_cfo[i]).font = blue
    wc.cell(row=16, column=c, value=hist_capex[i]).font = blue
    wc.cell(row=17, column=c, value=-200).font = blue
    wc.cell(row=18, column=c).value = f"=-{cl}16+{cl}17"
    wc.cell(row=19, column=c).value = f"={cl}13+{cl}18"

for i in range(4):
    c = 5 + i
    cl = get_column_letter(c)
    prev = get_column_letter(c - 1)
    acl = get_column_letter(c)
    wc.cell(row=5, column=c).value = f"={isref}{cl}23"
    wc.cell(row=5, column=c).font = grn
    wc.cell(row=6, column=c).value = f"={isref}{cl}4*{aref}{acl}9"
    wc.cell(row=7, column=c, value=1500).font = blue
    wc.cell(row=9, column=c).value = f"=-({bsref}{cl}7-{bsref}{prev}7)"
    wc.cell(row=10, column=c).value = f"={bsref}{cl}19-{bsref}{prev}19"
    wc.cell(row=11, column=c).value = f"={bsref}{cl}20-{bsref}{prev}20"
    wc.cell(row=12, column=c, value=0).font = blue
    wc.cell(row=8, column=c).value = f"={cl}9+{cl}10+{cl}11+{cl}12"
    wc.cell(row=13, column=c).value = f"={cl}5+{cl}6+{cl}7+{cl}8"
    wc.cell(row=16, column=c).value = f"={isref}{cl}4*{aref}{acl}12"
    wc.cell(row=17, column=c, value=-200).font = blue
    wc.cell(row=18, column=c).value = f"=-{cl}16+{cl}17"
    wc.cell(row=19, column=c).value = f"={cl}13+{cl}18"

for r in [5,6,7,8,9,10,11,12,13,16,17,18,19]:
    for c in range(2, NC):
        wc.cell(row=r, column=c).number_format = NUM

for r in [13, 18, 19]:
    for c in range(1, NC):
        wc.cell(row=r, column=c).font = bld_bl

wc.column_dimensions["A"].width = 30
for c in range(2, NC+1):
    wc.column_dimensions[get_column_letter(c)].width = 14

out = f"coverage/{TICKER}/04-financial-model/3-statements.xlsx"
wb.save(out)
print(f"Updated 3-statement model saved to: {out}")
