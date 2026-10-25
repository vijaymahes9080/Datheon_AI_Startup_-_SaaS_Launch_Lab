/**
 * DealForge AI - Core Heuristic Contract Risk & Margin Protection Engine
 * Analyzes Statement of Work (SOW) text for margin bleed, scope creep loopholes,
 * ambiguous acceptance traps, and one-sided indemnity clauses.
 */

export class ProposalAuditEngine {
  constructor() {
    this.rules = [
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
        defaultBleedRatio: 0.25, // 25% of contract value at risk
        amendment: 'Final milestone deliverables shall be evaluated solely against the functional specifications set forth in Exhibit A. Client shall have five (5) business days from delivery to provide written notice of itemized defects. In the absence of written notice within such five-day period, the deliverables shall be conclusively deemed accepted and the final milestone invoice payable within ten (10) calendar days.'
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
        defaultBleedRatio: 0.30, // 30% margin bleed
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
        defaultBleedRatio: 0.15,
        amendment: 'All invoices are payable Net 15 days from issuance. Undisputed amounts overdue beyond fifteen (15) days shall accrue interest at 1.5% per month. Agency reserves the right to suspend active project delivery and withhold release of production credentials if any invoice remains delinquent beyond twenty (20) calendar days.'
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
        defaultBleedRatio: 0.40,
        amendment: 'In no event shall either party be liable to the other for any indirect, special, incidental, or consequential damages (including lost profits or business interruption). Agency aggregate liability arising out of or related to this SOW shall be strictly capped at the total fees actually paid to Agency by Client under this SOW in the preceding twelve (12) months.'
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
        defaultBleedRatio: 0.10,
        amendment: 'Project milestone schedules are contingent upon timely receipt of client feedback, access credentials, and approvals within three (3) business days of request. Any client-induced latency shall automatically extend subsequent delivery deadlines on a day-for-day basis.'
      }
    ];
  }

  /**
   * Run full audit scan on proposal or Statement of Work text
   * @param {string} text - Raw contract text
   * @param {number} dealValue - Estimated total contract value in USD
   * @returns {Object} Comprehensive audit report
   */
  auditText(text = '', dealValue = 50000) {
    if (!text || typeof text !== 'string') {
      return {
        riskScore: 0,
        riskLevel: 'LOW',
        estimatedBleedUsd: 0,
        flaggedCount: 0,
        issues: [],
        summary: 'No text provided for analysis.'
      };
    }

    const cleanText = text.trim();
    const flaggedIssues = [];
    let accumulatedRiskScore = 0;
    let maxBleedRatio = 0;

    for (const rule of this.rules) {
      let matched = false;
      let matchedPhrase = '';

      for (const pattern of rule.patterns) {
        const match = cleanText.match(pattern);
        if (match) {
          matched = true;
          matchedPhrase = match[0];
          break;
        }
      }

      if (matched) {
        accumulatedRiskScore += rule.weight;
        maxBleedRatio += rule.defaultBleedRatio;

        flaggedIssues.push({
          ruleId: rule.id,
          category: rule.category,
          severity: rule.severity,
          matchedPhrase,
          explanation: rule.explanation,
          amendment: rule.amendment
        });
      }
    }

    // Baseline natural risk adjustments
    const normalizedScore = Math.min(100, Math.max(8, accumulatedRiskScore));
    let riskLevel = 'LOW';
    if (normalizedScore >= 75) riskLevel = 'CRITICAL';
    else if (normalizedScore >= 50) riskLevel = 'HIGH';
    else if (normalizedScore >= 25) riskLevel = 'MODERATE';

    const numericDealValue = Number(dealValue) > 0 ? Number(dealValue) : 50000;
    const estimatedBleed = Math.round(numericDealValue * Math.min(0.55, maxBleedRatio > 0 ? maxBleedRatio * 0.75 : 0.05));

    return {
      scanTimestamp: new Date().toISOString(),
      dealValue: numericDealValue,
      riskScore: normalizedScore,
      riskLevel,
      estimatedBleedUsd: estimatedBleed,
      flaggedCount: flaggedIssues.length,
      issues: flaggedIssues,
      summary: flaggedIssues.length > 0
        ? `Audit detected ${flaggedIssues.length} contractual risks with an estimated $${estimatedBleed.toLocaleString()} in margin exposure.`
        : 'Proposal terms appear well-structured with low identifiable scope risk.'
    };
  }
}

export const auditEngine = new ProposalAuditEngine();
