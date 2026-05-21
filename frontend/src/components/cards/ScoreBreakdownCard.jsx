import { getScoreTone } from '../../utils/scoreTone';

// Each signal's max possible score (weights that sum to 100)
const SIGNAL_MAX = {
  'Commit Consistency': 40,
  'Repository Quality': 30,
  'Project Engagement': 20,
  'Activity Level': 10
};

const SIGNAL_DESCRIPTION = {
  'Commit Consistency': 'Active weeks ratio and gap analysis over 12 weeks',
  'Repository Quality': 'Descriptions, licenses, and recently updated ratio',
  'Project Engagement': 'Stars, forks, and repository breadth',
  'Activity Level': 'Total commits in the measured period'
};

const ScoreBreakdownCard = ({ scoreBreakdown = [], hireabilityScore = 0 }) => {
  if (!scoreBreakdown || scoreBreakdown.length === 0) {
    return null;
  }

  const tone = getScoreTone(hireabilityScore);

  let readinessLabel = 'Early Stage';
  let readinessDetail = 'Focus on building consistent public projects';
  if (hireabilityScore >= 75) {
    readinessLabel = 'Job Ready';
    readinessDetail = 'Strong signals for junior-to-mid applications';
  } else if (hireabilityScore >= 50) {
    readinessLabel = 'Developing';
    readinessDetail = 'Solid base — improve consistency and quality';
  } else if (hireabilityScore >= 30) {
    readinessLabel = 'Building Up';
    readinessDetail = 'Growing profile — keep shipping projects';
  }

  return (
    <section className="card">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-primary">Score Breakdown</h2>
          <p className="mt-0.5 text-xs text-muted">How the hireability score is computed</p>
        </div>

        {/* Readiness badge */}
        <div
          className="flex-shrink-0 rounded-lg border px-3 py-2 text-center"
          style={{ borderColor: tone.border, backgroundColor: tone.background }}
        >
          <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: tone.text }}>
            {readinessLabel}
          </p>
          <p className="mt-0.5 text-2xl font-bold leading-none" style={{ color: tone.text }}>
            {hireabilityScore}
            <span className="text-sm font-medium opacity-70">/100</span>
          </p>
        </div>
      </div>

      {/* Signal bars */}
      <div className="mt-5 space-y-4">
        {scoreBreakdown.map(({ category, score }) => {
          const max = SIGNAL_MAX[category] ?? 100;
          const pct = max === 0 ? 0 : Math.round((score / max) * 100);
          const barTone = getScoreTone(pct);
          const description = SIGNAL_DESCRIPTION[category] ?? '';

          return (
            <div key={category}>
              <div className="flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-primary">{category}</p>
                  <p className="text-xs text-muted">{description}</p>
                </div>
                <div className="flex flex-shrink-0 items-baseline gap-0.5">
                  <span className="text-sm font-bold" style={{ color: barTone.text }}>
                    {score}
                  </span>
                  <span className="text-xs text-muted">/{max}</span>
                </div>
              </div>

              {/* Progress bar track */}
              <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-gray-100">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: barTone.text
                  }}
                />
              </div>

              {/* Weight label */}
              <p className="mt-0.5 text-right text-xs text-muted opacity-60">
                weight: {max}%
              </p>
            </div>
          );
        })}
      </div>

      {/* Readiness detail */}
      <div
        className="mt-5 rounded-lg border-l-4 px-3.5 py-2.5 text-sm"
        style={{ borderLeftColor: tone.text, backgroundColor: tone.background }}
      >
        <p className="font-semibold" style={{ color: tone.text }}>{readinessLabel}</p>
        <p className="mt-0.5 text-xs" style={{ color: tone.text, opacity: 0.85 }}>{readinessDetail}</p>
      </div>
    </section>
  );
};

export default ScoreBreakdownCard;
