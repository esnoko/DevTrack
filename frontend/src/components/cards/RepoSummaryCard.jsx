import { getScoreTone } from '../../utils/scoreTone';
import { motion } from 'framer-motion';

const RepoSummaryCard = ({ repositorySummary, hireabilityScore }) => {
  if (!repositorySummary) {
    return null;
  }

  const hireabilityTone = getScoreTone(hireabilityScore);

  return (
    <motion.section
      className="card h-full min-w-0"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -2 }}
    >
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <motion.div className="stat-item" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08, duration: 0.25 }}>
          <p className="stat-label">Repositories</p>
          <p className="stat-value">{repositorySummary.totalRepositories}</p>
        </motion.div>

        <motion.div className="stat-item" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12, duration: 0.25 }}>
          <p className="stat-label">Stars</p>
          <p className="stat-value">{repositorySummary.totalStars}</p>
        </motion.div>

        <motion.div className="stat-item" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16, duration: 0.25 }}>
          <p className="stat-label">Forks</p>
          <p className="stat-value">{repositorySummary.totalForks}</p>
        </motion.div>

        <motion.div
          className="stat-item"
          style={{ borderColor: hireabilityTone.border, backgroundColor: hireabilityTone.background }}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.25 }}
        >
          <p className="stat-label" style={{ color: hireabilityTone.text }}>Hireability</p>
          <p className="stat-value" style={{ color: hireabilityTone.text }}>
            {hireabilityScore}
            <span className="text-base font-medium" style={{ color: hireabilityTone.text, opacity: 0.7 }}>/100</span>
          </p>
        </motion.div>
      </div>

      {repositorySummary.mostStarredRepository && (
        <div className="mt-4 flex items-center justify-between rounded-lg border px-4 py-3" style={{ borderColor: 'var(--color-line)', backgroundColor: 'var(--color-surface)' }}>
          <div>
            <p className="stat-label">Most Starred Repository</p>
            <p className="mt-0.5 text-sm font-semibold text-primary">{repositorySummary.mostStarredRepository.name}</p>
          </div>
          <a
            className="flex-shrink-0 rounded-md px-3 py-1.5 text-xs font-medium text-white transition-opacity hover:opacity-80"
            style={{ backgroundColor: 'var(--color-primary)' }}
            href={repositorySummary.mostStarredRepository.url}
            target="_blank"
            rel="noreferrer"
          >
            View &rarr;
          </a>
        </div>
      )}
    </motion.section>
  );
};

export default RepoSummaryCard;
