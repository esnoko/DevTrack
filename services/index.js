const {
  getCachedAnalysis,
  setCachedAnalysis,
  inFlightAnalyses
} = require('./cache/cacheService');

const { fetchGithubUserData } = require('./github/githubService');

const {
  buildRepositorySummary,
  buildLanguageBreakdown,
  buildCommitActivity,
  buildRepoQualityIndicators
} = require('./builders');

const { buildHireabilityScore } = require('./scoring/scoringService');
const { buildInsights } = require('./insights/insightsService');

const analyzeGithubProfile = async (username) => {
  const cacheKey = username.toLowerCase();
  const cachedData = getCachedAnalysis(cacheKey);

  if (cachedData) {
    return {
      data: cachedData,
      cacheHit: true
    };
  }

  const existingRequest = inFlightAnalyses.get(cacheKey);

  if (existingRequest) {
    const data = await existingRequest;
    return {
      data,
      cacheHit: true
    };
  }

  const analysisPromise = (async () => {
    const { repos, events } = await fetchGithubUserData(username);

    const repositorySummary = buildRepositorySummary(repos);
    const repoQualityIndicators = buildRepoQualityIndicators(repos);
    const commitActivity = buildCommitActivity(events);

    const { hireabilityScore, scoreBreakdown } = buildHireabilityScore(
      repositorySummary,
      repoQualityIndicators,
      commitActivity
    );

    const insights = buildInsights(
      hireabilityScore,
      commitActivity,
      repoQualityIndicators,
      repositorySummary
    );

    const data = {
      username,
      repositorySummary,
      languageBreakdown: buildLanguageBreakdown(repos),
      repoQualityIndicators,
      commitActivity,
      hireabilityScore,
      scoreBreakdown,
      insights
    };

    setCachedAnalysis(cacheKey, data);
    return data;
  })();

  inFlightAnalyses.set(cacheKey, analysisPromise);

  try {
    const data = await analysisPromise;
    return {
      data,
      cacheHit: false
    };
  } finally {
    inFlightAnalyses.delete(cacheKey);
  }
};

module.exports = {
  analyzeGithubProfile
};
