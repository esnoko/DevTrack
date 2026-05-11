const { fetchUserRepositories, fetchUserEvents } = require('./githubApi');

const fetchGithubUserData = async (username) => {
  const [repos, events] = await Promise.all([
    fetchUserRepositories(username),
    fetchUserEvents(username)
  ]);

  return {
    repos,
    events
  };
};

module.exports = {
  fetchGithubUserData
};
