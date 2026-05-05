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

module.exports = {
  buildHireabilityScore
};
