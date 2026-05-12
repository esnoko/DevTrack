import { getScoreTone } from '../../utils/scoreTone';

const RepoSummaryCard = ({ repositorySummary, hireabilityScore }) => {
  if (!repositorySummary) {
    return null;
  }

  const hireabilityTone = getScoreTone(hireabilityScore);

  return (
    <section>
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="stat-item">
          <p className="stat-label">Repositories</p>
          <p className="stat-value">{repositorySummary.totalRepositories}</p>
        </div>

        <div className="stat-item">
          <p className="stat-label">Stars</p>
          <p className="stat-value">{repositorySummary.totalStars}</p>
        </div>

        <div className="stat-item">
          <p className="stat-label">Forks</p>
          <p className="stat-value">{repositorySummary.totalForks}</p>
        </div>

        <div
          className="stat-item"
          style={{ borderColor: hireabilityTone.border, backgroundColor: hireabilityTone.background }}
        >
          <p className="stat-label" style={{ color: hireabilityTone.text }}>Hireability</p>
          <p className="stat-value" style={{ color: hireabilityTone.text }}>
            {hireabilityScore}
            <span className="text-base font-medium" style={{ color: hireabilityTone.text, opacity: 0.7 }}>/100</span>
          </p>
        </div>
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
    </section>
  );
};

export default RepoSummaryCard;
