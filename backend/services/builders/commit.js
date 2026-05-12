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
      let commitCount = 1;

      if (event.payload) {
        if (Array.isArray(event.payload.commits) && event.payload.commits.length > 0) {
          commitCount = event.payload.commits.length;
        } else if (typeof event.payload.size === 'number' && event.payload.size > 0) {
          commitCount = event.payload.size;
        }
      }

      weekMap[weekLabel] += commitCount;
    }
  }

  return expectedWeeks.map((week) => ({ week, commits: weekMap[week] }));
};

module.exports = {
  buildCommitActivity
};
