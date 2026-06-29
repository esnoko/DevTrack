import { getScoreTone } from '../../utils/scoreTone';
import { motion } from 'framer-motion';

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
    <motion.section
      className="card h-full min-w-0"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-primary">Score Breakdown</h2>
          <p className="mt-0.5 text-xs text-muted">How the hireability score is computed</p>
        </div>

        {/* Readiness badge */}
        <div
          className="w-fit flex-shrink-0 rounded-lg border px-3 py-2 text-center"
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
        {scoreBreakdown.map(({ category, score }, index) => {
          const max = SIGNAL_MAX[category] ?? 100;
          const pct = max === 0 ? 0 : Math.round((score / max) * 100);
          const barTone = getScoreTone(pct);
          const description = SIGNAL_DESCRIPTION[category] ?? '';

          return (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.06, duration: 0.28 }}
            >
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
                <motion.div
                  className="h-full rounded-full transition-all duration-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ delay: 0.16 + index * 0.06, duration: 0.52, ease: [0.22, 1, 0.36, 1] }}
                  style={{
                    backgroundColor: barTone.text
                  }}
                />
              </div>

              {/* Weight label */}
              <p className="mt-0.5 text-right text-xs text-muted opacity-60">
                weight: {max}%
              </p>
            </motion.div>
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
    </motion.section>
  );
};

export default ScoreBreakdownCard;
