const buildLanguageBreakdown = (repos) => {
  const languageCountMap = repos.reduce((accumulator, repo) => {
    if (!repo.language) {
      return accumulator;
    }

    accumulator[repo.language] = (accumulator[repo.language] || 0) + 1;
    return accumulator;
  }, {});

  const totalLanguageTaggedRepos = Object.values(languageCountMap).reduce(
    (sum, count) => sum + count,
    0
  );

  return Object.entries(languageCountMap)
    .map(([language, count]) => ({
      language,
      repositoryCount: count,
      percentage:
        totalLanguageTaggedRepos === 0
          ? 0
          : Number(((count / totalLanguageTaggedRepos) * 100).toFixed(2))
    }))
    .sort((a, b) => b.repositoryCount - a.repositoryCount);
};

module.exports = {
  buildLanguageBreakdown
};
