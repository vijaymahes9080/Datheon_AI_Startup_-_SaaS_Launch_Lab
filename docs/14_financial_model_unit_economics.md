# Document 14: Comprehensive Financial Model & SaaS Unit Economics

## 1. Executive Summary & Core Unit Economics

DealForge AI operates on high-leverage B2B SaaS economics characterized by low marginal serving costs, negative churn expansion potential, and rapid payback periods.

### Core Financial Formulas & Baseline Metrics:

| Metric | Formula | Value | Strategic Assessment |
|:---|:---|:---:|:---|
| **Blended ARPU** | $\frac{\text{Total MRR}}{\text{Active Paying Customers}}$ | **$112.50 / mo** | Derived from 70% Monthly ($79/mo) and 30% Annual ($790/yr equivalent to $65.80/mo) + seat add-ons. |
| **Gross Margin %** | $\frac{\text{Revenue} - \text{COGS}}{\text{Revenue}} \times 100$ | **86.4%** | Software-only delivery; low compute overhead via heuristic pre-filtering. |
| **Blended CAC** | $\frac{\text{Sales \& Marketing Spend}}{\text{New Customers Acquired}}$ | **$185.00** | Organic LinkedIn inbound + high-relevance cold audit emails ($250/mo tools). |
| **Average Monthly Churn ($c$)** | $\frac{\text{Cancelled Customers}}{\text{Total Customers}}$ | **4.2%** | Standard for early B2B agency utilities; projected to drop to 2.5% with workflow integration. |
| **Customer Lifetime ($t$)** | $\frac{1}{\text{Monthly Churn}} = \frac{1}{0.042}$ | **23.8 Months** (~24 mo) | High retention driven by recurrent monthly proposal generation. |
| **Customer Lifetime Value (LTV)** | $\text{ARPU} \times \text{Gross Margin \%} \times \text{Lifetime}$ | **$2,330.00** | ($112.50 × 0.864 × 24 = $2,332.80). Highly defensive. |
| **LTV-to-CAC Ratio** | $\frac{\text{LTV}}{\text{CAC}} = \frac{\$2,330}{\$185}$ | **12.6x** | Significantly exceeds standard SaaS target of 3.0x. |
| **CAC Payback Period** | $\frac{\text{CAC}}{\text{ARPU} \times \text{Gross Margin \%}}$ | **1.9 Months** | Rapid cash recovery within first 60 days of customer tenure. |
| **Break-Even Volume** | $\frac{\text{Fixed Monthly OpEx}}{\text{Contribution Margin per Customer}}$ | **145 Customers** | Reached at ~$16,300 MRR. |

---

## 2. Cost of Goods Sold (COGS) Breakdown per 1,000 Audits

Because DealForge AI leverages an intelligent multi-stage engine (deterministic regex and AST syntax pattern matching before calling LLM inference), serving costs are ultra-low:

| Operational Component | Cost Basis | Cost per 1,000 Scans |
|:---|:---|:---:|
| **Heuristic & Pattern Preprocessing** | Node.js compute (sub-millisecond execution) | $0.20 |
| **Semantic AI Classification (Batch / API)** | ~6,500 tokens per proposal × $0.0015/1k tokens | $9.75 |
| **Database & File Storage** | SQLite / Persistent JSON store on edge server | $1.20 |
| **Stripe Merchant Processing (Blended)** | 2.9% + $0.30 per charge (amortized across scans) | $4.85 |
| **TOTAL COGS PER 1,000 SCANS** | — | **$16.00 ($0.016 / scan)** |

---

## 3. 24-Month Financial Pro-Forma Forecast

*All monetary amounts in USD ($). Assumes $500,000 Seed financing closed in Month 1.*

| Month | Active Paying Customers | Monthly Recurring Revenue (MRR) | Gross Margin (86.4%) | R&D & Hosting OpEx | Marketing & Growth OpEx | Total Monthly Burn | Net Monthly Cash Flow | Ending Cash Balance |
|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|:---:|
| **M01** | 25 | $2,812 | $2,430 | $14,000 | $6,000 | $20,000 | -$17,570 | $482,430 |
| **M03** | 65 | $7,312 | $6,318 | $15,500 | $8,000 | $23,500 | -$17,182 | $447,215 |
| **M06** | 145 | $16,312 | $14,094 | $17,000 | $10,500 | $27,500 | -$13,406 | $398,540 |
| **M09** | 270 | $30,375 | $26,244 | $19,500 | $14,000 | $33,500 | -$7,256 | $362,110 |
| **M11 (Break-Even)** | **395** | **$44,437** | **$38,394** | **$21,000** | **$17,000** | **$38,000** | **+$394** | **$355,420** |
| **M12** | 460 | $51,750 | $44,712 | $22,500 | $19,000 | $41,500 | +$3,212 | $358,632 |
| **M18** | 890 | $100,125 | $86,508 | $32,000 | $28,000 | $60,000 | +$26,508 | $448,150 |
| **M24** | **1,520** | **$171,000** | **$147,744** | **$45,000** | **$38,000** | **$83,000** | **+$64,744** | **$728,940** |

---

## 4. Key Milestones & Capital Efficiency Takeaways

1. **Capital Conservation**: Peak capital consumption is under $150,000 of the $500,000 Seed ask, leaving a 24-month liquidity cushion of $355,000+ at the breakeven inflection point (Month 11).
2. **Month 24 Run-Rate**: $2.05M ARR ($171,000 MRR) with 1,520 active agency accounts, generating over $64,000 in monthly net profit (37.8% net profit margin).
3. **Valuation Milestone**: At Month 24, a $2.05M ARR B2B SaaS growing at 70%+ YoY with 86% gross margins commands a Series A valuation between $16M and $24M (8x–12x ARR multiple).
