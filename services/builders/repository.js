const buildRepositorySummary = (repos) => {
  const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
  const totalForks = repos.reduce((sum, repo) => sum + repo.forks_count, 0);
  const totalOpenIssues = repos.reduce((sum, repo) => sum + repo.open_issues_count, 0);

  const mostStarredRepo = repos.reduce(
    (currentTop, repo) => {
      if (!currentTop || repo.stargazers_count > currentTop.stargazers_count) {
        return repo;
      }

      return currentTop;
    },
    null
  );

  return {
    totalRepositories: repos.length,
    totalStars,
    totalForks,
    totalOpenIssues,
    mostStarredRepository: mostStarredRepo
      ? {
          name: mostStarredRepo.name,
          stars: mostStarredRepo.stargazers_count,
          url: mostStarredRepo.html_url
        }
      : null
  };
};

module.exports = {
  buildRepositorySummary
};
