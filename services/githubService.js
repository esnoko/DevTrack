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

const COMMIT_ACTIVITY_WEEKS = 12;

const getISOWeekLabel = (date) => {
  const target = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));

  const dayOfWeek = target.getUTCDay() || 7;
  target.setUTCDate(target.getUTCDate() + 4 - dayOfWeek);

  const yearStart = new Date(Date.UTC(target.getUTCFullYear(), 0, 1));
  const weekNumber = Math.ceil(((target - yearStart) / 86400000 + 1) / 7);

  return `${target.getUTCFullYear()}-W${String(weekNumber).padStart(2, '0')}`;
};

const buildExpectedWeeks = () => {
  const weeks = [];
  const now = new Date();

  for (let i = COMMIT_ACTIVITY_WEEKS - 1; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
    d.setUTCDate(d.getUTCDate() - i * 7);
    weeks.push(getISOWeekLabel(d));
  }

  return [...new Set(weeks)];
};

const fetchUserEvents = async (username) => {
  const url = `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(username)}/events?per_page=${PER_PAGE}`;

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'DevTrack-Analyzer'
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    return [];
  }

  const events = await response.json();
  return Array.isArray(events) ? events : [];
};

const buildCommitActivity = (events) => {
  const expectedWeeks = buildExpectedWeeks();
  const cutoffDate = new Date();
  cutoffDate.setUTCDate(cutoffDate.getUTCDate() - COMMIT_ACTIVITY_WEEKS * 7);

  const weekMap = Object.fromEntries(expectedWeeks.map((w) => [w, 0]));

  for (const event of events) {
    if (event.type !== 'PushEvent') {
      continue;
    }

    const eventDate = new Date(event.created_at);

    if (eventDate < cutoffDate) {
      continue;
    }

    const weekLabel = getISOWeekLabel(eventDate);

    if (Object.prototype.hasOwnProperty.call(weekMap, weekLabel)) {
      const commitCount =
        event.payload && typeof event.payload.size === 'number' ? event.payload.size : 0;
      weekMap[weekLabel] += commitCount;
    }
  }

  return expectedWeeks.map((week) => ({ week, commits: weekMap[week] }));
};

const clamp01 = (value) => Math.min(1, Math.max(0, value));

const scoreCommitConsistency = (commitActivity) => {
  const WEIGHT = 40;

  if (!commitActivity || commitActivity.length === 0) {
    return 0;
  }

  const totalWeeks = commitActivity.length;
  const activeWeeks = commitActivity.filter((w) => w.commits > 0).length;
  const activeness = activeWeeks / totalWeeks;

  let longestGap = 0;
  let currentGap = 0;

  for (const week of commitActivity) {
    if (week.commits === 0) {
      currentGap += 1;
      if (currentGap > longestGap) {
        longestGap = currentGap;
      }
    } else {
      currentGap = 0;
    }
  }

  const gapPenalty = longestGap / totalWeeks;
  const raw = 0.7 * activeness + 0.3 * (1 - gapPenalty);

  return Math.round(clamp01(raw) * WEIGHT);
};

const scoreRepositoryQuality = (repoQualityIndicators) => {
  const WEIGHT = 30;
  const total = repoQualityIndicators.repositoriesAnalyzed;

  if (total === 0) {
    return 0;
  }

  const descriptionRatio = repoQualityIndicators.repositoriesWithDescription / total;
  const licenseRatio = repoQualityIndicators.repositoriesWithLicense / total;
  const recentRatio = repoQualityIndicators.recentlyUpdatedRepositories / total;

  const raw = (descriptionRatio + licenseRatio + recentRatio) / 3;

  return Math.round(clamp01(raw) * WEIGHT);
};

const scoreProjectEngagement = (repositorySummary) => {
  const WEIGHT = 20;
  const REACH_CAP = 1000;
  const REPO_CAP = 20;

  const { totalRepositories, totalStars, totalForks } = repositorySummary;

  if (totalRepositories === 0) {
    return 0;
  }

  const combinedReach = totalStars + totalForks;
  const reachScore = Math.log10(combinedReach + 1) / Math.log10(REACH_CAP + 1);

  const breadthScore = totalRepositories / REPO_CAP;

  const raw = 0.6 * reachScore + 0.4 * breadthScore;

  return Math.round(clamp01(raw) * WEIGHT);
};

const scoreActivityLevel = (commitActivity) => {
  const WEIGHT = 10;
  const COMMIT_FLOOR = 50;

  if (!commitActivity || commitActivity.length === 0) {
    return 0;
  }

  const totalCommits = commitActivity.reduce((sum, w) => sum + w.commits, 0);
  const raw = totalCommits / COMMIT_FLOOR;

  return Math.round(clamp01(raw) * WEIGHT);
};

const buildHireabilityScore = (repositorySummary, repoQualityIndicators, commitActivity) => {
  const consistencyScore = scoreCommitConsistency(commitActivity);
  const qualityScore = scoreRepositoryQuality(repoQualityIndicators);
  const engagementScore = scoreProjectEngagement(repositorySummary);
  const activityScore = scoreActivityLevel(commitActivity);

  const total = consistencyScore + qualityScore + engagementScore + activityScore;

  return {
    hireabilityScore: total,
    scoreBreakdown: [
      { category: 'Commit Consistency', score: consistencyScore },
      { category: 'Repository Quality', score: qualityScore },
      { category: 'Project Engagement', score: engagementScore },
      { category: 'Activity Level', score: activityScore }
    ]
  };
};

const clampScore100 = (value) => Math.round(Math.min(100, Math.max(0, value)));

const buildInsights = (
  hireabilityScore,
  commitActivity,
  repoQualityIndicators,
  repositorySummary
) => {
  const totalWeeks = commitActivity.length;
  const activeWeeks = commitActivity.filter((week) => week.commits > 0).length;
  const totalCommits = commitActivity.reduce((sum, week) => sum + week.commits, 0);

  const recentActivity = commitActivity.slice(-4);
  const recentCommits = recentActivity.reduce((sum, week) => sum + week.commits, 0);

  const totalRepos = repositorySummary.totalRepositories;
  const starsAndForks = repositorySummary.totalStars + repositorySummary.totalForks;

  const analyzedRepos = repoQualityIndicators.repositoriesAnalyzed;
  const descriptionRatio =
    analyzedRepos === 0
      ? 0
      : repoQualityIndicators.repositoriesWithDescription / analyzedRepos;
  const licenseRatio =
    analyzedRepos === 0 ? 0 : repoQualityIndicators.repositoriesWithLicense / analyzedRepos;
  const updatedRatio =
    analyzedRepos === 0
      ? 0
      : repoQualityIndicators.recentlyUpdatedRepositories / analyzedRepos;

  const consistencySignal = totalWeeks === 0 ? 0 : (activeWeeks / totalWeeks) * 100;
  const qualitySignal = ((descriptionRatio + licenseRatio + updatedRatio) / 3) * 100;
  const engagementSignal =
    (Math.min(totalRepos, 20) / 20) * 60 + (Math.min(starsAndForks, 500) / 500) * 40;
  const activitySignal = (Math.min(totalCommits, 50) / 50) * 100;

  const frontend = clampScore100(
    hireabilityScore * 0.2 + qualitySignal * 0.45 + consistencySignal * 0.35
  );
  const backend = clampScore100(
    hireabilityScore * 0.4 + engagementSignal * 0.3 + activitySignal * 0.3
  );
  const fullstack = clampScore100((frontend + backend) / 2);
  const roleFit = {
    frontend,
    backend,
    fullstack
  };

  let topRole = 'frontend';
  let topRoleScore = roleFit.frontend;

  if (roleFit.backend > topRoleScore) {
    topRole = 'backend';
    topRoleScore = roleFit.backend;
  }

  if (roleFit.fullstack > topRoleScore) {
    topRole = 'fullstack';
    topRoleScore = roleFit.fullstack;
  }

  let recommendationBase = 'Early stage; build foundational GitHub activity before applying';

  if (hireabilityScore >= 75) {
    recommendationBase = 'Ready for junior-to-mid level applications';
  } else if (hireabilityScore >= 50) {
    recommendationBase = 'Apply but improve consistency and project quality first';
  } else if (hireabilityScore >= 30) {
    recommendationBase = 'Not ready for applications; focus on building consistent projects';
  }

  const recommendation = `${recommendationBase} for ${topRole} roles (top role fit ${topRoleScore}).`;

  let summary = 'Limited public GitHub signal available for reliable interpretation.';

  if (hireabilityScore >= 75) {
    summary = 'Strong GitHub profile with consistent activity and healthy repository signals.';
  } else if (hireabilityScore >= 50) {
    summary = 'Balanced profile with some strong signals and clear areas to improve.';
  } else if (hireabilityScore >= 30) {
    summary = 'Early to mid-stage profile; improving consistency and quality would help most.';
  }

  const strengths = [];
  if (consistencySignal >= 60) {
    strengths.push('Maintains commits across many weeks, showing steady consistency.');
  }
  if (qualitySignal >= 60) {
    strengths.push('Repositories show good maintenance quality (description/license/freshness).');
  }
  if (engagementSignal >= 60) {
    strengths.push('Repository footprint and community engagement are promising.');
  }
  if (activitySignal >= 60) {
    strengths.push('High recent commit volume indicates active development.');
  }
  if (strengths.length === 0) {
    strengths.push('Has a baseline GitHub presence to build on.');
  }

  const weaknesses = [];
  if (totalRepos === 0) {
    weaknesses.push('No public repositories found yet.');
  }
  if (consistencySignal < 40) {
    weaknesses.push('Commit history is inconsistent across recent weeks.');
  }
  if (qualitySignal < 40 && analyzedRepos > 0) {
    weaknesses.push('Repository quality signals are weak (missing descriptions/licenses or stale repos).');
  }
  if (activitySignal < 30) {
    weaknesses.push('Recent commit volume is low.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('No major weaknesses detected from available GitHub data.');
  }

  return {
    summary,
    strengths,
    weaknesses,
    roleFit,
    recommendation
  };
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
    const [repos, events] = await Promise.all([
      fetchUserRepositories(username),
      fetchUserEvents(username)
    ]);

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