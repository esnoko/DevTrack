const viteApiBaseUrl =
  typeof import.meta !== 'undefined' && import.meta.env
    ? import.meta.env.VITE_API_BASE_URL
    : undefined;

const API_BASE_URL = viteApiBaseUrl || 'http://localhost:5000/api/v1';

const extractErrorMessage = async (response) => {
  try {
    const payload = await response.json();

    if (payload?.error?.message) {
      return payload.error.message;
    }

    if (typeof payload?.message === 'string') {
      return payload.message;
    }
  } catch {
    // Ignore parse failures and use status text fallback.
  }

  return response.statusText || 'Request failed';
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
