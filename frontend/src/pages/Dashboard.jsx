import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import { useGithubProfile } from '../hooks/useGithubProfile';

const Dashboard = () => {
  const { profile, loading, error, loadProfile, setUsername } = useGithubProfile('');

  const handleSearch = (nextUsername) => {
    setUsername(nextUsername);
    loadProfile(nextUsername);
  };

  return (
    <section>
      <h1>Developer Dashboard</h1>

      <SearchBar onSearch={handleSearch} loading={loading} />

      {loading && <Loader message="Fetching GitHub profile..." />}
      {!loading && <ErrorMessage message={error} />}

      {!loading && !error && profile && (
        <article>
          <h2>{profile.username}</h2>
          <pre>{JSON.stringify(profile, null, 2)}</pre>
        </article>
      )}
    </section>
  );
};

export default Dashboard;
