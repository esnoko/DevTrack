const GITHUB_API_BASE_URL = 'https://api.github.com';
const PER_PAGE = 100;
const MAX_EVENT_PAGES = 3;
const COMMIT_ACTIVITY_WEEKS = 12;
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

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

    if (response.status === 403 || response.status === 429) {
      const retryAfter = response.headers.get('Retry-After') || response.headers.get('X-RateLimit-Reset');
      const error = new Error(
        'GitHub API rate limit exceeded. Please wait a moment and try again, or add a GitHub token to increase the limit.'
      );
      error.statusCode = 429;
      if (retryAfter) error.retryAfter = retryAfter;
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

const fetchUserEvents = async (username) => {
  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'DevTrack-Analyzer'
  };

  if (GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${GITHUB_TOKEN}`;
  }

  const cutoffDate = new Date();
  cutoffDate.setUTCDate(cutoffDate.getUTCDate() - COMMIT_ACTIVITY_WEEKS * 7);

  const events = [];

  for (let page = 1; page <= MAX_EVENT_PAGES; page += 1) {
    const url = `${GITHUB_API_BASE_URL}/users/${encodeURIComponent(username)}/events?per_page=${PER_PAGE}&page=${page}`;
    const response = await fetch(url, { headers });

    if (!response.ok) {
      return events;
    }

    const pageData = await response.json();

    if (!Array.isArray(pageData) || pageData.length === 0) {
      break;
    }

    events.push(...pageData);

    const oldestEvent = pageData[pageData.length - 1];
    const oldestEventDate = oldestEvent && oldestEvent.created_at ? new Date(oldestEvent.created_at) : null;

    if (oldestEventDate && oldestEventDate < cutoffDate) {
      break;
    }

    if (pageData.length < PER_PAGE) {
      break;
    }
  }

  return events;
};

module.exports = {
  fetchUserRepositories,
  fetchUserEvents
};
