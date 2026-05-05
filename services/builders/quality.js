const buildRepoQualityIndicators = (repos) => {
  const now = Date.now();
  const days180InMs = 180 * 24 * 60 * 60 * 1000;

  const indicators = repos.map((repo) => {
    const lastUpdateTime = new Date(repo.updated_at).getTime();

    return {
      name: repo.name,
      hasDescription: Boolean(repo.description && repo.description.trim()),
      hasLicense: Boolean(repo.license),
      hasTopics: Array.isArray(repo.topics) && repo.topics.length > 0,
      hasHomepage: Boolean(repo.homepage && String(repo.homepage).trim()),
      issuesEnabled: Boolean(repo.has_issues),
      recentlyUpdated: now - lastUpdateTime <= days180InMs,
      archived: Boolean(repo.archived)
    };
  });

  return {
    repositoriesAnalyzed: indicators.length,
    repositoriesWithDescription: indicators.filter((repo) => repo.hasDescription).length,
    repositoriesWithLicense: indicators.filter((repo) => repo.hasLicense).length,
    repositoriesWithTopics: indicators.filter((repo) => repo.hasTopics).length,
    recentlyUpdatedRepositories: indicators.filter((repo) => repo.recentlyUpdated).length,
    perRepository: indicators
  };
};

module.exports = {
  buildRepoQualityIndicators
};
