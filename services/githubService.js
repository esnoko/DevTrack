const GITHUB_API_BASE_URL = 'https://api.github.com';
const PER_PAGE = 100;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 300);
const CACHE_TTL_MS =
  Number.isFinite(CACHE_TTL_SECONDS) && CACHE_TTL_SECONDS > 0
    ? CACHE_TTL_SECONDS * 1000
    : 300 * 1000;

const profileAnalysisCache = new Map();
const inFlightAnalyses = new Map();

const getCachedAnalysis = (cacheKey) => {
  const cacheEntry = profileAnalysisCache.get(cacheKey);

  if (!cacheEntry) {
    return null;
  }

  if (Date.now() >= cacheEntry.expiresAt) {
    profileAnalysisCache.delete(cacheKey);
    return null;
  }

  return cacheEntry.data;
};

const setCachedAnalysis = (cacheKey, data) => {
  profileAnalysisCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
};

const fetchUserRepositories = async (username) => {
  const repositories = [];
  let page = 1;

  while (true) {
    const url = `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(username)}/repos?per_page=${PER_PAGE}&page=${page}&sort=updated`;

    const headers = {
      Accept: 'application/vnd.github+json',
      'User-Agent': 'DevTrack-Analyzer'
    };

    if (GITHUB_TOKEN) {
      headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
    }

    const response = await fetch(url, { headers });

    if (response.status === 404) {
      const error = new Error('GitHub user not found');
      error.statusCode = 404;
      throw error;
    }

    if (!response.ok) {
      const error = new Error('Failed to fetch data from GitHub API');
      error.statusCode = response.status;
      throw error;
    }

    const pageData = await response.json();

    if (!Array.isArray(pageData) || pageData.length === 0) {
      break;
    }

    repositories.push(...pageData);

    if (pageData.length < PER_PAGE) {
      break;
    }

    page += 1;
  }

  return repositories;
};

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
    const repos = await fetchUserRepositories(username);

    const data = {
      username,
      repositorySummary: buildRepositorySummary(repos),
      languageBreakdown: buildLanguageBreakdown(repos),
      repoQualityIndicators: buildRepoQualityIndicators(repos)
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