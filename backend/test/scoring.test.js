const { test } = require('node:test');
const assert = require('node:assert/strict');
const { buildHireabilityScore } = require('../services/scoring/scoringService');

test('a profile with no repositories or activity scores zero', () => {
  const result = buildHireabilityScore(
    { totalRepositories: 0, totalStars: 0, totalForks: 0 },
    { repositoriesAnalyzed: 0 }, []
  );
  assert.equal(result.hireabilityScore, 0);
  assert.equal(result.scoreBreakdown.length, 4);
  assert.ok(result.scoreBreakdown.every(({ score }) => score === 0));
});

test('maximum signals produce 100 and respect component weights', () => {
  const result = buildHireabilityScore(
    { totalRepositories: 20, totalStars: 1000, totalForks: 0 },
    { repositoriesAnalyzed: 20, repositoriesWithDescription: 20,
      repositoriesWithLicense: 20, recentlyUpdatedRepositories: 20 },
    Array.from({ length: 12 }, () => ({ commits: 10 }))
  );
  assert.equal(result.hireabilityScore, 100);
  assert.deepEqual(result.scoreBreakdown.map(({ score }) => score), [40, 30, 20, 10]);
});

test('long inactive gaps reduce consistency for the same activity total', () => {
  const summary = { totalRepositories: 0, totalStars: 0, totalForks: 0 };
  const quality = { repositoriesAnalyzed: 0 };
  const score = (weeks) => buildHireabilityScore(summary, quality,
    weeks.map((commits) => ({ commits })));
  const grouped = score([10, 10, 0, 0]);
  const spread = score([10, 0, 10, 0]);
  assert.ok(spread.hireabilityScore > grouped.hireabilityScore);
  assert.equal(spread.scoreBreakdown[3].score, grouped.scoreBreakdown[3].score);
});

test('very large valid signals remain bounded and the total equals its breakdown', () => {
  const result = buildHireabilityScore(
    { totalRepositories: 10000, totalStars: 1000000, totalForks: 1000000 },
    { repositoriesAnalyzed: 1, repositoriesWithDescription: 1,
      repositoriesWithLicense: 1, recentlyUpdatedRepositories: 1 },
    [{ commits: 1000000 }]
  );
  assert.equal(result.hireabilityScore, 100);
  assert.equal(result.hireabilityScore,
    result.scoreBreakdown.reduce((sum, item) => sum + item.score, 0));
});
