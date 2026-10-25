/**
 * A/B Testing & Statistical Significance Engine
 * Computes two-proportion z-tests, p-values, confidence intervals, and required sample sizes.
 */

export class ABExperimentEngine {
  /**
   * Calculate required sample size per variant for a two-proportion test
   * @param {number} p1 - Baseline conversion rate (e.g., 0.06)
   * @param {number} mde - Minimum detectable relative effect (e.g., 0.25 for 25% lift)
   * @param {number} alpha - Type I error rate (default 0.05)
   * @param {number} power - Statistical power (default 0.80)
   * @returns {Object} Sample size recommendation
   */
  static calculateSampleSize(p1 = 0.06, mde = 0.25, alpha = 0.05, power = 0.80) {
    const p2 = p1 * (1 + mde);
    const pBar = (p1 + p2) / 2;

    // Critical Z values
    const zAlpha = alpha === 0.01 ? 2.576 : alpha === 0.05 ? 1.96 : 1.645;
    const zBeta = power === 0.90 ? 1.282 : power === 0.80 ? 0.842 : 0.674;

    const numerator = Math.pow(
      zAlpha * Math.sqrt(2 * pBar * (1 - pBar)) +
      zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)),
      2
    );
    const denominator = Math.pow(p2 - p1, 2);
    const n = Math.ceil(numerator / denominator);

    return {
      baselineRate: p1,
      targetRate: p2,
      relativeLiftPercent: (mde * 100).toFixed(1) + '%',
      requiredSampleSizePerVariant: n,
      totalSampleSize: n * 2,
      confidenceLevel: ((1 - alpha) * 100).toFixed(0) + '%',
      powerLevel: (power * 100).toFixed(0) + '%'
    };
  }

  /**
   * Evaluate observed A/B test results
   * @param {number} nA - Visitors in Variant A
   * @param {number} convA - Conversions in Variant A
   * @param {number} nB - Visitors in Variant B
   * @param {number} convB - Conversions in Variant B
   * @returns {Object} Test evaluation verdict
   */
  static evaluateTest(nA, convA, nB, convB) {
    if (nA <= 0 || nB <= 0) {
      return { error: 'Sample size must be greater than zero' };
    }

    const pA = convA / nA;
    const pB = convB / nB;
    const pooledP = (convA + convB) / (nA + nB);
    const se = Math.sqrt(pooledP * (1 - pooledP) * (1 / nA + 1 / nB));

    if (se === 0) {
      return { pA, pB, zScore: 0, pValue: 1.0, isSignificant: false };
    }

    const zScore = (pB - pA) / se;
    // Approximation for two-tailed normal CDF
    const pValue = 2 * (1 - this.normalCdf(Math.abs(zScore)));
    const isSignificant = pValue < 0.05;
    const relativeLift = pA > 0 ? (((pB - pA) / pA) * 100).toFixed(2) + '%' : 'N/A';

    return {
      variantA: { visitors: nA, conversions: convA, rate: (pA * 100).toFixed(2) + '%' },
      variantB: { visitors: nB, conversions: convB, rate: (pB * 100).toFixed(2) + '%' },
      relativeLift,
      zScore: Number(zScore.toFixed(3)),
      pValue: Number(pValue.toFixed(4)),
      isSignificant,
      recommendation: isSignificant
        ? (pB > pA ? 'WINNER: Deploy Variant B permanently' : 'WINNER: Retain Variant A')
        : 'INCONCLUSIVE: Insufficient sample size or variance to declare a winner'
    };
  }

  static normalCdf(x) {
    // Standard normal cumulative distribution approximation
    const t = 1 / (1 + 0.2316419 * x);
    const d = 0.3989423 * Math.exp((-x * x) / 2);
    const prob = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    return 1 - prob;
  }
}
