# Document 07: Three-Tier Pricing Architecture & Lifetime Sustainability Model

## 1. Executive Summary & Pricing Strategy
DealForge AI employs a value-metric pricing strategy anchored on **avoided project margin loss**. With an average agency scope creep incident costing $22,000–$45,000, pricing is structured to ensure an immediate 10x–30x ROI for every paid tier.

---

## 2. Detailed Three-Tier Offer Specifications

### Tier 1: Starter (Free)
- **Positioning**: Zero-friction discovery tool for solo consultants, boutique agencies, and prospective enterprise buyers evaluating scan accuracy.
- **Entitlements**:
  - 2 Proposal / SOW Audits per calendar month.
  - Overall Proposal Risk Score (0–100 scale).
  - Identification of Top 3 highest-severity clause risks.
  - Basic recommended protective clause replacements.
- **Usage Limits**: Max 15,000 words per document; single user seat; no PDF export.
- **Clear Upgrade Triggers**:
  - Scanning a 3rd proposal in a single month triggers the Pro upgrade modal.
  - Viewing financial "Dollar-at-Risk" margin calculations requires Pro.
  - Exporting a white-labeled client redline report requires Pro.

### Tier 2: Agency Pro (Recurring SaaS)
- **Positioning**: The standard operational copilot for growth-stage agencies delivering 2+ client proposals per month.
- **Pricing**:
  - **$79 / month** (Monthly commitment, cancel anytime).
  - **$790 / year** ($65.83/mo equivalent, 2 months free when billed annually).
- **Entitlements**:
  - **Unlimited** Proposal & SOW Audits.
  - **Dollar-at-Risk** Financial Bleed & Margin Impact Calculator.
  - Full 50-point deterministic and semantic clause redline engine.
  - White-label PDF & JSON client audit exports.
  - Custom agency boilerplate clause library.
  - 5 Team Seats included (Founder, VP Delivery, Bid Managers).
  - Priority Email & Slack Community Support.
- **Billing Terms**: Automated recurring subscription via Stripe Billing; 14-day no-questions-asked refund policy; prorated seat upgrades.

### Tier 3: Founder Lifetime License (One-Time Early Cash Offer)
- **Positioning**: High-urgency launch catalyst for agency founders who dislike recurring SaaS sprawl and want early product input.
- **Pricing**: **$499 one-time payment** (Strictly capped at 50 licenses).
- **Entitlements**:
  - Lifetime Agency Pro access (Guaranteed minimum 36 months of service).
  - All future Pro feature upgrades included at zero recurring charge.
  - 1-on-1 private contract audit onboarding call with DealForge founders.
  - Founder Badge in agency community + direct WhatsApp/Slack feedback channel.

---

## 3. Lifetime Sustainability & Unit Economics Audit

A common failure mode of SaaS lifetime deals is unbudgeted compute and LLM inference costs over the user lifetime. Below is our formal **36-Month Sustainability Amortization Model**:

### Assumptions per Active Lifetime Customer:
- **Average Scan Volume**: 8 proposals per month (96 proposals / year = 288 proposals over 36 months).
- **Average Proposal Size**: 5,000 words (~6,500 tokens).

### 36-Month Cost Breakdown per Lifetime License ($499 Revenue):

| Cost Component | Monthly Cost | 36-Month Cumulative Cost | % of $499 Revenue |
|:---|:---:|:---:|:---:|
| **Stripe Payment Fee (2.9% + $0.30)** | One-time | $14.77 | 2.96% |
| **LLM Inference & Heuristic Processing** ($0.015 / scan × 8 scans) | $0.12 | $4.32 | 0.87% |
| **Cloud Hosting & Database Storage (Amortized)** | $0.25 | $9.00 | 1.80% |
| **Customer Support Overhead (Self-serve documentation)** | $0.30 | $10.80 | 2.16% |
| **TOTAL 3-YEAR OPERATIONAL COST** | — | **$38.89** | **7.79%** |
| **NET LIFETIME CONTRIBUTION MARGIN** | — | **$460.11** | **92.21%** |

### Sustainability Conclusion:
Even under aggressive power-user assumptions (e.g., 25 proposals/month), the total 36-month COGS is under **$75**, leaving **$424+ net margin** per lifetime customer. The $499 Lifetime offer is mathematically sound, highly sustainable, and provides $24,950 in non-dilutive upfront cash flow to fund initial acquisition.

---

## 4. Taxes, Refunds & Regulatory Compliance

- **Tax Compliance**: Stripe Tax configured to collect destination-based VAT / GST for international B2B buyers where reverse-charge VAT rules apply.
- **Refund Policy**: Transparent 14-day money-back guarantee if the user runs fewer than 5 scans and is dissatisfied with the clause recommendations.
- **Chargeback Defense**: Detailed audit logs capturing timestamped scan executions and terms acceptance.
