const viteApiBaseUrl =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_API_BASE_URL
    : undefined;

const API_BASE_URL = viteApiBaseUrl || 'http://localhost:5000/api/v1';

const classifyError = (response, rawMessage) => {
  if (response.status === 404) {
    return 'GitHub user not found. Check the username and try again.';
  }

  if (response.status === 429 || response.status === 403) {
    return 'GitHub API rate limit reached. Please wait a moment and try again.';
  }

  if (response.status >= 500) {
    return 'The DevTrack server encountered an error. Please try again shortly.';
  }

  return rawMessage || 'Something went wrong. Please try again.';
};

const extractErrorMessage = async (response) => {
  try {
    const payload = await response.json();
    const raw = payload?.error?.message || payload?.message || null;
    return classifyError(response, raw);
  } catch {
    return classifyError(response, response.statusText);
  }
};

export const fetchGithubProfile = async (username, options = {}) => {
  const trimmedUsername = username.trim();

  if (!trimmedUsername) {
    throw new Error('GitHub username is required');
  }

  const response = await fetch(
    `${API_BASE_URL}/github/${encodeURIComponent(trimmedUsername)}`,
    {
      method: 'GET',
      signal: options.signal,
      headers: {
        Accept: 'application/json'
      }
    }
  );

  if (!response.ok) {
    const message = await extractErrorMessage(response);
    throw new Error(message);
  }

  const data = await response.json();
  return {
    profile: data?.data || null,
    meta: {
      ...(data?.meta || {}),
      cacheHeader: response.headers.get('X-Cache') || null
    }
  };
};
