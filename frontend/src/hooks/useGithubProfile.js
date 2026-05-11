import { useCallback, useEffect, useRef, useState } from 'react';
import { fetchGithubProfile } from '../services/githubApi';

export const useGithubProfile = (initialUsername = '') => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [username, setUsername] = useState(initialUsername);
  const activeRequestRef = useRef(null);

  const loadProfile = useCallback(async (nextUsername = username) => {
    const trimmedUsername = nextUsername.trim();

    if (!trimmedUsername) {
      setError('Enter a GitHub username to continue.');
      setProfile(null);
      return null;
    }

    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    const controller = new AbortController();
    activeRequestRef.current = controller;

    setLoading(true);
    setError('');

    try {
      const nextProfile = await fetchGithubProfile(trimmedUsername, {
        signal: controller.signal
      });

      setProfile(nextProfile);
      return nextProfile;
    } catch (requestError) {
      if (requestError.name !== 'AbortError') {
        setError(requestError.message || 'Failed to fetch GitHub profile.');
        setProfile(null);
      }

      return null;
    } finally {
      if (activeRequestRef.current === controller) {
        activeRequestRef.current = null;
      }
      setLoading(false);
    }
  }, [username]);

  useEffect(() => {
    return () => {
      if (activeRequestRef.current) {
        activeRequestRef.current.abort();
      }
    };
  }, []);

  return {
    username,
    setUsername,
    profile,
    loading,
    error,
    loadProfile
  };
};
