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

  const recommendation = `${recommendationBase} for ${topRole} roles.`;

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

module.exports = {
  buildInsights
};
