/**
 * Sentiment & Qualitative Insight Coding Engine
 * Module 1.4: Evidence-based customer feedback classification
 */

export class SentimentInsightEngine {
  constructor() {
    this.taxonomy = {
      scope_creep: {
        keywords: ['scope creep', 'ballooned', 'unbilled hours', 'extra work', 'rework', 'overrun', 'free revisions'],
        weight: 1.5,
        category: 'Scope & Deliverables'
      },
      acceptance_criteria: {
        keywords: ['acceptance criteria', 'client satisfaction', 'withheld', 'withholding', 'signoff', 'approval delay', 'frozen invoice'],
        weight: 1.8,
        category: 'Milestone & Cash Flow'
      },
      indemnity_liability: {
        keywords: ['liability', 'indemnity', 'uncapped', 'breach', 'lawyer', 'legal review', 'retainer'],
        weight: 1.6,
        category: 'Legal Exposure'
      },
      speed_turnaround: {
        keywords: ['speed', 'turnaround', 'slow', 'bottleneck', 'fast', 'quick', '60 seconds', 'minutes'],
        weight: 1.2,
        category: 'Operational Efficiency'
      },
      privacy_security: {
        keywords: ['privacy', 'nda', 'confidential', 'training set', 'leak', 'data retention', 'security'],
        weight: 1.4,
        category: 'Trust & Compliance'
      },
      willingness_to_pay: {
        keywords: ['pay', 'subscription', 'lifetime', 'monthly', 'budget', 'price', '$79', '$499', 'worth it'],
        weight: 1.3,
        category: 'Monetization'
      }
    };

    this.sentimentLexicon = {
      frustrated: ['disaster', 'nightmare', 'hate', 'furious', 'refused', 'froze', 'lost', 'collapsed', 'dispute'],
      negative: ['problem', 'delay', 'costly', 'missed', 'unclear', 'vague', 'ambiguous', 'risk', 'headache'],
      neutral: ['standard', 'routine', 'checklist', 'process', 'typical', 'average', 'depends'],
      positive: ['valuable', 'love', 'excited', 'ready', 'eager', 'must-have', 'game changer', 'immediately']
    };
  }

  /**
   * Analyze an interview statement or qualitative feedback string
   * @param {string} text - Raw feedback quote
   * @returns {Object} Structured qualitative insight
   */
  analyzeFeedback(text) {
    if (!text || typeof text !== 'string') {
      return { sentiment: 'neutral', score: 0, themes: [], painIntensity: 1 };
    }

    const lower = text.toLowerCase();
    const detectedThemes = [];
    let weightedPainScore = 0;

    // 1. Theme Detection
    for (const [key, config] of Object.entries(this.taxonomy)) {
      const matches = config.keywords.filter(kw => lower.includes(kw));
      if (matches.length > 0) {
        detectedThemes.push({
          code: key,
          category: config.category,
          matches,
          significance: Math.min(10, matches.length * 3 * config.weight)
        });
        weightedPainScore += matches.length * config.weight * 2.5;
      }
    }

    // 2. Sentiment Classification
    let sentimentCounts = { frustrated: 0, negative: 0, neutral: 0, positive: 0 };
    for (const [sentiment, words] of Object.entries(this.sentimentLexicon)) {
      words.forEach(w => {
        if (lower.includes(w)) sentimentCounts[sentiment]++;
      });
    }

    let dominantSentiment = 'neutral';
    if (sentimentCounts.frustrated > 0) dominantSentiment = 'frustrated';
    else if (sentimentCounts.negative > sentimentCounts.positive) dominantSentiment = 'negative';
    else if (sentimentCounts.positive > sentimentCounts.negative) dominantSentiment = 'positive';

    const calculatedPain = Math.min(10, Math.max(1, Math.round(weightedPainScore + (dominantSentiment === 'frustrated' ? 3 : dominantSentiment === 'negative' ? 1.5 : 0))));

    return {
      textSample: text.length > 90 ? text.substring(0, 90) + '...' : text,
      dominantSentiment,
      painIntensity: calculatedPain,
      themes: detectedThemes,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process a batch of qualitative interview transcripts
   * @param {Array<string>} transcripts
   * @returns {Object} Aggregated analysis report
   */
  batchAnalyze(transcripts = []) {
    const results = transcripts.map(t => this.analyzeFeedback(t));
    const themeCounts = {};
    let totalPain = 0;

    results.forEach(res => {
      totalPain += res.painIntensity;
      res.themes.forEach(th => {
        themeCounts[th.code] = (themeCounts[th.code] || 0) + 1;
      });
    });

    return {
      totalAnalyzed: transcripts.length,
      averagePainIntensity: transcripts.length ? (totalPain / transcripts.length).toFixed(1) : 0,
      themeFrequencies: themeCounts,
      insights: results
    };
  }
}
