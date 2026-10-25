# Document 08: Conversion Measurement & A/B Experimentation Protocol

## 1. Primary Funnel Metric Taxonomy

| Metric Identifier | Definition | Measurement Hook / Trigger | Target Benchmark |
|:---|:---|:---|:---:|
| **Unique Visitors** | Distinct non-bot browser sessions visiting landing page. | First pageview load with unique session cookie. | Baseline |
| **CTA Clicks** | Visitors clicking primary "Try Live Scanner" or "Get Priority Access". | DOM click event on `#btn-launch-demo` or `#btn-submit-waitlist`. | ≥18.0% |
| **Form Starts** | Visitors focusing inside the email input field. | Input `focus` event on `#waitlist-email`. | ≥12.0% |
| **Completed Signups** | Validated submissions stored in database store. | HTTP 201 response from `/api/waitlist`. | **≥8.0%** |
| **Qualified Lead Rate** | Signups with valid corporate agency domain (non-gmail/yahoo). | Domain parser separating custom email domains. | ≥65.0% |
| **Activation Rate** | Users running at least one proposal audit scan in demo. | Trigger of `audit_scan_completed` event. | ≥45.0% |

---

## 2. Controlled Experiment Specifications

### Experiment 1: Hero Headline Positioning
- **Objective**: Determine whether pain-driven loss aversion or outcome-driven speed produces higher waitlist conversion among agency founders.
- **Hypothesis**: Headline Variant A (Loss Aversion) will outperform Variant B by ≥25% because agency founders experience severe emotional pain from historical scope disputes.
- **Variant A (Pain-Led / Loss Aversion)**:
  > *"Stop Bleeding 30% Margin on Fixed-Fee Client Proposals"*
  > Supporting: *"Audit Statements of Work in 60 seconds. Detect scope creep traps, unbilled revision cycles, and ambiguous acceptance criteria before you sign."*
- **Variant B (Outcome-Led / Speed & Control)**:
  > *"Audit Agency SOWs in 60 Seconds & Lock In Watertight Milestones"*
  > Supporting: *"The AI Proposal Copilot that redlines dangerous clauses, guarantees objective acceptance rules, and protects your project cash flow."*

### Experiment 2: Pricing Offer Architecture
- **Hypothesis**: Displaying the $499 Lifetime Founder license prominently on the landing page will increase initial qualified lead urgency without depressing Pro SaaS signups.
- **Offer Arm 1 (Standard SaaS First)**: Free ($0) + Pro ($79/mo) with Lifetime hidden behind a "Founder Cohort" waitlist toggle.
- **Offer Arm 2 (Three-Tier Equal Visibility)**: Free ($0), Pro ($79/mo), and Lifetime ($499) displayed side-by-side with explicit 50-license cap badge.

---

## 3. Statistical Rigor & Minimum Sample Size Power Analysis

To avoid false positive conclusions (p-hacking), we calculate minimum sample size using two-tailed Z-test for proportions:
- **Baseline Conversion ($p_1$)**: 6.0% (0.06)
- **Minimum Detectable Effect (MDE)**: 30% relative lift (Target $p_2$ = 7.8%)
- **Significance Level ($\alpha$)**: 0.05 (95% Confidence)
- **Statistical Power ($1 - \beta$)**: 0.80 (80% Power)

### Sample Size Calculation Formula:
$$n = \frac{\left(Z_{\alpha/2}\sqrt{2\bar{p}(1-\bar{p})} + Z_{\beta}\sqrt{p_1(1-p_1) + p_2(1-p_2)}\right)^2}{(p_2 - p_1)^2}$$

Where $\bar{p} = \frac{p_1 + p_2}{2} = 0.069$.
- $Z_{\alpha/2} = 1.96$
- $Z_{\beta} = 0.84$
- **Required Sample Size**: **1,840 visitors per variant** (3,680 total visitors across Variant A and Variant B).

### Decision Threshold Rules:
1. **Never declare significance before reaching 1,840 visits per arm**.
2. **Confidence Threshold**: $p < 0.05$ and Bayesian posterior probability $> 95\%$.
3. If after 3,000 visitors the difference is statistically indistinguishable ($p > 0.15$), declare the experiment inconclusive and default to Variant A for stronger brand alignment.
