const summaryItemClass = 'rounded-md border border-line bg-page px-3 py-2';

const RepoSummaryCard = ({ repositorySummary, hireabilityScore }) => {
  if (!repositorySummary) {
    return null;
  }

  return (
    <section className="card">
      <h2 className="text-lg font-semibold text-primary">Repository Summary</h2>

      <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <div className={summaryItemClass}>
          <p className="text-xs uppercase tracking-wide text-muted">Repositories</p>
          <p className="mt-1 text-xl font-semibold text-primary">{repositorySummary.totalRepositories}</p>
        </div>

        <div className={summaryItemClass}>
          <p className="text-xs uppercase tracking-wide text-muted">Stars</p>
          <p className="mt-1 text-xl font-semibold text-primary">{repositorySummary.totalStars}</p>
        </div>

        <div className={summaryItemClass}>
          <p className="text-xs uppercase tracking-wide text-muted">Forks</p>
          <p className="mt-1 text-xl font-semibold text-primary">{repositorySummary.totalForks}</p>
        </div>

        <div className={summaryItemClass}>
          <p className="text-xs uppercase tracking-wide text-muted">Hireability</p>
          <p className="mt-1 text-xl font-semibold text-primary">{hireabilityScore}</p>
        </div>
      </div>

      {repositorySummary.mostStarredRepository && (
        <div className="mt-4 rounded-md border border-line bg-page px-3 py-2">
          <p className="text-xs uppercase tracking-wide text-muted">Most Starred Repository</p>
          <p className="mt-1 text-sm font-medium text-primary">
            {repositorySummary.mostStarredRepository.name}
          </p>
          <a
            className="mt-1 inline-block text-sm text-primary underline"
            href={repositorySummary.mostStarredRepository.url}
            target="_blank"
            rel="noreferrer"
          >
            Open Repository
          </a>
        </div>
      )}
    </section>
  );
};

export default RepoSummaryCard;
