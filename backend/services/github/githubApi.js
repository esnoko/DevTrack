const GITHUB_API_BASE_URL = 'https://api.github.com';
const PER_PAGE = 100;
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

module.exports = {
  fetchUserRepositories,
  fetchUserEvents
};
