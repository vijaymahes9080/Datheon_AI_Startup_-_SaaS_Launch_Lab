import { describe, it } from 'node:test';
import assert from 'node:assert';
import { auditEngine } from '../src/services/auditEngine.js';

describe('ProposalAuditEngine - Heuristic Risk Analysis', () => {
  it('should flag subjective acceptance criteria and calculate exposure', () => {
    const text = 'Final payment shall be released upon complete satisfaction of the client.';
    const report = auditEngine.auditText(text, 100000);

    assert.ok(report.riskScore >= 20, 'Risk score should be elevated');
    assert.strictEqual(report.flaggedCount, 1);
    assert.strictEqual(report.issues[0].ruleId, 'RULE_ACCEPTANCE_SUBJECTIVE');
    assert.ok(report.estimatedBleedUsd > 0, 'Estimated bleed should be greater than zero');
    assert.ok(report.issues[0].amendment.includes('five (5) business days'), 'Amendment should include deemed acceptance');
  });

  it('should flag uncapped revisions as critical severity', () => {
    const text = 'Agency shall provide unlimited revisions until approved by stakeholders.';
    const report = auditEngine.auditText(text, 50000);

    const issue = report.issues.find(i => i.ruleId === 'RULE_REVISIONS_UNCAPPED');
    assert.ok(issue, 'Should flag unlimited revisions');
    assert.strictEqual(issue.severity, 'CRITICAL');
  });

  it('should detect multiple compound contract traps and calculate cumulative score', () => {
    const compoundText = `
      Payment terms are Net 60 days.
      Deliverables subject to sole discretion of the client.
      Agency shall provide unlimited revisions until approved.
      Agency agrees to pay for lost profits and consequential damages.
    `;
    const report = auditEngine.auditText(compoundText, 80000);

    assert.ok(report.flaggedCount >= 3, 'Should detect at least 3 distinct risks');
    assert.strictEqual(report.riskLevel, 'CRITICAL');
  });

  it('should return LOW risk level for well-drafted objective clauses', () => {
    const safeText = 'Deliverables shall be reviewed against Exhibit A within 5 business days, after which deemed accepted.';
    const report = auditEngine.auditText(safeText, 25000);

    assert.strictEqual(report.flaggedCount, 0);
    assert.strictEqual(report.riskLevel, 'LOW');
  });
});
