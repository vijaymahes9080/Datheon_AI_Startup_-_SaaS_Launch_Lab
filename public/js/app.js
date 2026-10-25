/**
 * DealForge AI - Proposal Audit Workspace Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  const proposalText = document.getElementById('proposal-text');
  const proposalTitle = document.getElementById('proposal-title');
  const dealValueInput = document.getElementById('deal-value');
  const btnRunAudit = document.getElementById('btn-run-audit');
  const resultsPlaceholder = document.getElementById('results-placeholder');
  const resultsContent = document.getElementById('results-content');
  const scoreBanner = document.getElementById('score-banner');
  const riskScoreDisplay = document.getElementById('risk-score-display');
  const riskLevelTag = document.getElementById('risk-level-tag');
  const marginBleedDisplay = document.getElementById('margin-bleed-display');
  const issuesCountBadge = document.getElementById('issues-count-badge');
  const issuesListContainer = document.getElementById('issues-list-container');

  // Sample Templates
  const sampleWebSow = `STATEMENT OF WORK: NEXT.JS ENTERPRISE WEB PORTAL
1. Scope of Work: Agency shall engineer and deploy the customer web portal. Agency guarantees delivery within 60 days.
2. Deliverable Revisions: The fixed price of $75,000 includes unlimited revisions until approved by Client stakeholders.
3. Acceptance & Final Milestone: Final payment of $25,000 shall be issued upon complete satisfaction and unrestricted approval of the steering committee.
4. Payment Terms: Invoices are payable Net 60 days from final acceptance.
5. Liability: Agency agrees to indemnify Client without limitation for breach and consequential damages including lost profits.`;

  const sampleCloudSow = `STATEMENT OF WORK: CLOUD INFRASTRUCTURE MIGRATION
1. Scope: Migration of 20 legacy microservices to AWS Kubernetes.
2. Schedule: Agency guarantees delivery date of November 15th with strict deadline regardless of client review latency. Penalties for delay of $500/day apply.
3. Acceptance: All deliverables are subject to the sole discretion of the client VP Engineering.
4. Terms: Invoices payable upon client receipt of customer funds from downstream enterprise contracts.`;

  // Template Click Handlers
  document.getElementById('chip-sample-web')?.addEventListener('click', () => {
    proposalTitle.value = 'Apex Studio — Next.js Enterprise Portal SOW';
    dealValueInput.value = '75000';
    proposalText.value = sampleWebSow;
  });

  document.getElementById('chip-sample-cloud')?.addEventListener('click', () => {
    proposalTitle.value = 'Apex Studio — Cloud Infrastructure Migration SOW';
    dealValueInput.value = '60000';
    proposalText.value = sampleCloudSow;
  });

  document.getElementById('chip-clear')?.addEventListener('click', () => {
    proposalText.value = '';
    resultsContent.style.display = 'none';
    resultsPlaceholder.style.display = 'block';
  });

  // Default pre-fill
  if (proposalText && !proposalText.value) {
    proposalText.value = sampleWebSow;
  }

  // Run Audit Execution
  btnRunAudit?.addEventListener('click', async () => {
    const text = proposalText.value.trim();
    const title = proposalTitle.value.trim() || 'Untitled Proposal';
    const dealValue = parseFloat(dealValueInput.value) || 50000;

    if (!text) {
      alert('Please enter or paste proposal text to audit.');
      return;
    }

    btnRunAudit.disabled = true;
    btnRunAudit.innerHTML = '<span>⚡ Scanning 50 Risk Patterns...</span>';

    try {
      const response = await fetch('/api/proposals/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, text, dealValue })
      });

      if (!response.ok) throw new Error('API server returned ' + response.status);
      const report = await response.json();
      renderAuditResults(report);
    } catch (err) {
      console.warn('Network API unavailable (static hosting mode), executing client heuristic engine:', err);
      const clientReport = runClientSideAudit(text, dealValue);
      renderAuditResults(clientReport);
    } finally {
      btnRunAudit.disabled = false;
      btnRunAudit.innerHTML = '<span>⚡ Run Deep Risk Audit (60s)</span>';
    }
  });

  // Client-side heuristic rule definitions for GitHub Pages static execution
  const clientRules = [
    {
      id: 'RULE_ACCEPTANCE_SUBJECTIVE',
      category: 'Acceptance Criteria & Milestone Freeze',
      severity: 'HIGH',
      weight: 22,
      patterns: [
        /complete satisfaction/i,
        /sole discretion of (the )?client/i,
        /to (the )?client('s)? satisfaction/i,
        /deemed reasonable by (the )?client/i,
        /unrestricted approval/i,
        /steering committee (sole )?approval/i,
        /satisfactory to client/i
      ],
      explanation: 'Subjective acceptance criteria gives the client legal grounds to withhold your final milestone payment indefinitely while demanding free custom changes.',
      bleedRatio: 0.25,
      amendment: 'Final milestone deliverables shall be evaluated solely against the functional specifications set forth in Exhibit A. Client shall have five (5) business days from delivery to provide written notice of itemized defects. In the absence of written notice within such period, deliverables are conclusively deemed accepted and final invoice payable within ten (10) days.'
    },
    {
      id: 'RULE_REVISIONS_UNCAPPED',
      category: 'Uncapped Revisions & Scope Creep',
      severity: 'CRITICAL',
      weight: 25,
      patterns: [
        /unlimited revisions/i,
        /as many changes as needed/i,
        /modify until approved/i,
        /iterative until satisfied/i,
        /all necessary adjustments without additional (cost|charge)/i,
        /no limit on revisions/i
      ],
      explanation: 'Uncapped revisions eliminate your project profit margin by permitting infinite subjective feedback rounds with zero financial friction for the client.',
      bleedRatio: 0.30,
      amendment: 'The agreed fixed fee includes up to two (2) consolidated rounds of client review and revisions per deliverable milestone. Any additional revisions, changes in direction, or out-of-scope feature requests shall be executed pursuant to a written Change Order at the Agency standard rate of $165 per hour.'
    },
    {
      id: 'RULE_PAYMENT_TERMS_DELAY',
      category: 'Cash Flow & Payment Terms',
      severity: 'HIGH',
      weight: 18,
      patterns: [
        /net 60/i,
        /net 90/i,
        /paid when paid/i,
        /contingent upon (client )?funding/i,
        /upon receipt of customer funds/i,
        /payment terms of 60 days/i
      ],
      explanation: 'Extended payment terms (Net 60/90) or contingent pay-when-paid clauses force your agency to act as an uncompensated bank, threatening payroll and project solvency.',
      bleedRatio: 0.15,
      amendment: 'All invoices are payable Net 15 days from issuance. Undisputed amounts overdue beyond fifteen (15) days shall accrue interest at 1.5% per month. Agency reserves the right to suspend active delivery if any invoice remains delinquent beyond twenty (20) calendar days.'
    },
    {
      id: 'RULE_LIABILITY_UNCAPPED',
      category: 'Indemnification & Legal Exposure',
      severity: 'CRITICAL',
      weight: 24,
      patterns: [
        /consequential damages/i,
        /lost profits/i,
        /unlimited indemnif(y|ication)/i,
        /liquidated damages of/i,
        /punitive damages/i,
        /without limitation for breach/i
      ],
      explanation: 'Uncapped consequential damages expose your entire agency balance sheet to theoretical lost-profit lawsuits far exceeding the total value of this engagement.',
      bleedRatio: 0.40,
      amendment: 'In no event shall either party be liable to the other for any indirect, special, incidental, or consequential damages (including lost profits). Agency aggregate liability arising out of or related to this SOW shall be strictly capped at total fees actually paid in the preceding twelve (12) months.'
    },
    {
      id: 'RULE_SCHEDULE_SLIPPAGE',
      category: 'Client Review Latency & Schedule Slippage',
      severity: 'MEDIUM',
      weight: 11,
      patterns: [
        /strict deadline regardless of/i,
        /time is of the essence without (extension|delay)/i,
        /penalties for delay of/i,
        /no extension for client review/i
      ],
      explanation: 'Failing to link project deadlines to prompt client feedback leaves your delivery team liable for delays caused entirely by client review bottlenecks.',
      bleedRatio: 0.10,
      amendment: 'Project milestone schedules are contingent upon timely receipt of client feedback, access credentials, and approvals within three (3) business days of request. Any client-induced latency shall automatically extend subsequent delivery deadlines on a day-for-day basis.'
    }
  ];

  function runClientSideAudit(rawText, dealValue) {
    const issues = [];
    let cumulativeRiskScore = 0;
    let totalBleedRatio = 0;

    for (const rule of clientRules) {
      for (const pattern of rule.patterns) {
        const match = rawText.match(pattern);
        if (match) {
          cumulativeRiskScore += rule.weight;
          totalBleedRatio += rule.bleedRatio;
          issues.push({
            category: rule.category,
            severity: rule.severity,
            matchedPhrase: match[0],
            explanation: rule.explanation,
            amendment: rule.amendment
          });
          break; // Avoid double triggering same rule
        }
      }
    }

    const clampedScore = Math.min(Math.max(cumulativeRiskScore, issues.length > 0 ? 35 : 12), 98);
    let riskLevel = 'LOW';
    if (clampedScore >= 70) riskLevel = 'CRITICAL';
    else if (clampedScore >= 50) riskLevel = 'HIGH';
    else if (clampedScore >= 30) riskLevel = 'MEDIUM';

    const estimatedBleedUsd = Math.round(dealValue * Math.min(totalBleedRatio, 0.65));

    return {
      riskScore: clampedScore,
      riskLevel,
      estimatedBleedUsd,
      issues
    };
  }

  function renderAuditResults(report) {
    resultsPlaceholder.style.display = 'none';
    resultsContent.style.display = 'block';

    riskScoreDisplay.innerText = `${report.riskScore} / 100`;
    riskLevelTag.innerText = `${report.riskLevel} MARGIN EXPOSURE`;
    marginBleedDisplay.innerText = `$${(report.estimatedBleedUsd || 0).toLocaleString()}`;
    issuesCountBadge.innerText = `${report.issues ? report.issues.length : 0} Issues Flagged`;

    // Dynamic Banner Styling
    scoreBanner.className = 'score-banner ' + (report.riskLevel === 'CRITICAL' || report.riskLevel === 'HIGH' ? 'score-banner-critical' : 'score-banner-safe');

    // Populate Issue Cards
    issuesListContainer.innerHTML = '';
    if (!report.issues || report.issues.length === 0) {
      issuesListContainer.innerHTML = `
        <div style="padding:2rem; text-align:center; color:#10b981; font-weight:600;">
          ✓ Watertight SOW! No high-severity scope creep loopholes detected.
        </div>`;
      return;
    }

    report.issues.forEach((issue, index) => {
      const card = document.createElement('div');
      card.className = 'issue-card';
      card.innerHTML = `
        <div class="issue-header">
          <span class="issue-type">⚠️ ${escapeHtml(issue.category)}</span>
          <button class="btn-copy" id="btn-copy-${index}">Copy Amendment Text</button>
        </div>
        <div style="font-size:0.85rem; color:#fca5a5; margin-bottom:0.5rem; font-family:var(--font-mono); background:rgba(239,68,68,0.1); padding:0.4rem 0.6rem; border-radius:4px;">
          Flagged text: "${escapeHtml(issue.matchedPhrase)}"
        </div>
        <div style="font-size:0.85rem; color:var(--text-secondary); margin-bottom:0.75rem;">
          ${escapeHtml(issue.explanation)}
        </div>
        <div style="background:rgba(16,185,129,0.08); border-left:3px solid #10b981; padding:0.6rem 0.85rem; border-radius:0 4px 4px 0; font-size:0.83rem; color:#86efac; font-family:var(--font-mono);">
          🛡️ <strong>Recommended Amendment:</strong><br>
          ${escapeHtml(issue.amendment)}
        </div>
      `;

      card.querySelector(`#btn-copy-${index}`).addEventListener('click', () => {
        navigator.clipboard.writeText(issue.amendment);
        const btn = card.querySelector(`#btn-copy-${index}`);
        btn.innerText = 'Copied! ✓';
        setTimeout(() => { btn.innerText = 'Copy Amendment Text'; }, 2000);
      });

      issuesListContainer.appendChild(card);
    });
  }

  function escapeHtml(str = '') {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  // Logout handler
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    localStorage.removeItem('dealforge_token');
    window.location.href = 'index.html';
  });
});
