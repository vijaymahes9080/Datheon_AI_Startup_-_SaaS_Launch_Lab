# Document 12: Reddit Community Playbooks & Value-First Launch Threads

## 1. Ethical Operating Protocol & Community Rules

To respect Reddit's anti-spam guidelines and avoid self-promotional backlash:
1. **Full Transparency**: Disclose maker identity on line one. Never use burner accounts or astroturfing.
2. **Give 95% of Value in the Text**: The entire framework, clause checklist, and lessons must be immediately usable without ever clicking an external link.
3. **No Shortened or Affiliate Links**: Link directly to the homepage or GitHub only once in the post body, or strictly in response to user requests.
4. **Follow Subreddit Specific Rules**: Observe self-promotion days (e.g., Share Your Startup threads on r/startups).

---

## 2. Community Playbook & Post Drafts

### Thread 1: Target Subreddit `r/agency`
**Title**: The 5 contract clauses that caused 80% of our scope creep disasters (and the exact wording to replace them)

```text
Full disclosure: I run a dev agency and recently built an open tool (DealForge AI) that scans SOWs for margin risks. But you don't need any software to use the framework below.

Over the past 6 years, our agency wrote off an estimated $120k+ in unbilled developer hours. When we did a post-mortem across our worst 15 projects, 80% of the financial bleed came down to the same five clauses in our Statement of Work templates.

Here is the breakdown and the exact replacement wording we now mandate:

1. THE "COMPLETE SATISFACTION" TRAP
❌ Bad: "Final payment due upon Client's complete satisfaction with deliverables."
Why it kills you: "Satisfaction" is emotional, not functional. A client having a bad quarter will suddenly "not feel completely satisfied."
✅ Fix: "Final milestone deliverables shall be evaluated solely against the functional specifications set forth in Exhibit A. Client shall have five (5) business days from delivery to submit written notice of itemized defects. In the absence of written notice within 5 business days, deliverables are conclusively deemed accepted."

2. THE "UNLIMITED REVISIONS" BLACK HOLE
❌ Bad: "Includes unlimited design revisions until approved."
Why it kills you: Client delegates review to 6 junior stakeholders who contradict each other. You do 14 revision rounds for free.
✅ Fix: "The agreed fixed fee includes up to two (2) consolidated rounds of client review per deliverable milestone. Additional revisions or direction changes shall be executed under a written Change Order at the Agency standard rate of $165/hr."

3. THE "NET 60 UPON CUSTOMER APPROVAL" FINANCING TRAP
❌ Bad: "Payment terms Net 60 days" or "Payable upon client receipt of third-party funds."
Why it kills you: You are effectively giving an enterprise client an interest-free line of credit while you still have to pay payroll every Friday.
✅ Fix: "All invoices are payable Net 15 days from issuance. Overdue balances accrue 1.5% interest per month. Active sprint delivery pauses if any invoice exceeds 20 days past due."

4. THE "UNCAPPED CONSEQUENTIAL DAMAGES" RISK
❌ Bad: "Agency indemnifies Client for all losses arising from project delay."
Why it kills you: A 2-day deployment delay could theoretically prompt a lawsuit claiming $500k in lost holiday sales.
✅ Fix: "In no event shall either party be liable for indirect, incidental, or consequential damages (including lost profits). Agency aggregate liability under this SOW is capped strictly at total fees paid in the preceding 12 months."

5. THE SCHEDULE FREEZE LATENCY TRAP
❌ Bad: "Agency guarantees product launch date of October 1st."
Why it kills you: Client takes 4 weeks to give you API keys, but still holds you to October 1st.
✅ Fix: "Milestone delivery schedules are contingent upon receipt of client feedback and credentials within 3 business days of request. Any client-induced review latency extends delivery deadlines on a day-for-day basis."

Hope this saves someone a painful write-off this quarter.

What is the single worst contract clause a client ever slipped past your agency?
```

---

### Thread 2: Target Subreddit `r/startups`
**Title**: We spent 3 months analyzing 200+ agency scope disputes. Here is the unit economics of a $79/mo B2B niche SaaS.

```text
Hey r/startups,

Vijay here. We just launched DealForge AI (an automated proposal risk scanner for agencies).

Instead of doing a generic "check out my startup" post, I wanted to share the exact financial unit economics and customer discovery methodology we used to validate this niche before writing a single line of backend code.

1. HOW WE VALIDATED WILLINGNESS-TO-PAY:
We interviewed 5 agency founders using The Mom Test protocol. We didn't ask "Would you pay for an AI contract scanner?" (everyone says yes to be polite).
Instead, we asked:
- "When was the last time a client held your final invoice hostage?"
- "What was the exact dollar write-off?"
- "What did you spend on outside counsel last year to fix templates?"

Findings:
- Founders were losing $22k–$45k/year to unbilled scope creep.
- They spent $2k–$5k on external lawyers whose turnarounds took 7+ days.
- Framing our price at $79/mo or $499 lifetime was an instant "no-brainer" because preventing ONE scope dispute per year yielded a 30x–40x ROI.

2. UNIT ECONOMICS OF A $499 LIFETIME PASS:
Many founders warn against lifetime deals because of ongoing compute/API costs. Here is our 36-month sustainability math:
- Average proposal scans per user: 8 scans/month = 288 scans over 3 years.
- Cost per heuristic/LLM scan: ~$0.015
- Total 3-year AI compute cost: $4.32
- Stripe processing fee: $14.77
- Hosting & DB amortized: $9.00
- Total 36-month cost per user: $38.89
- Net contribution margin on $499: $460.11 (92.2% margin!)

By capping the lifetime offer at 50 seats, we generated $24,950 in upfront non-dilutive capital to fund initial cold acquisition.

Happy to answer any questions on agency customer discovery, Mom Test interview phrasing, or how we built the scanner without complex dependencies.
```
