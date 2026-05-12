import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import HeaderCard from '../components/cards/HeaderCard';
import RepoSummaryCard from '../components/cards/RepoSummaryCard';
import InsightsCard from '../components/cards/InsightsCard';
import CommitChart from '../components/charts/CommitChart';
import RoleFitChart from '../components/charts/RoleFitChart';
import { useGithubProfile } from '../hooks/useGithubProfile';

const Dashboard = () => {
  const { profile, loading, error, loadProfile, setUsername } = useGithubProfile('');

  const handleSearch = (nextUsername) => {
    setUsername(nextUsername);
    loadProfile(nextUsername);
  };

  return (
    <main className="mx-auto w-full max-w-screen-xl p-5 sm:p-8 lg:p-10">
      <div className="grid grid-cols-1 gap-4">
        <HeaderCard username={profile?.username} />
        <SearchBar onSearch={handleSearch} loading={loading} defaultValue={profile?.username || ''} />
      </div>

      {loading && (
        <div className="mt-4">
          <Loader message="Fetching GitHub profile..." />
        </div>
      )}

      {!loading && (
        <div className="mt-4">
          <ErrorMessage message={error} />
        </div>
      )}

      {!loading && !error && profile && (
        <div className="mt-4 grid grid-cols-1 gap-4">
          <RepoSummaryCard
            repositorySummary={profile.repositorySummary}
            hireabilityScore={profile.hireabilityScore}
          />

          <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
            <CommitChart data={profile.commitActivity || []} />
            <RoleFitChart roleFit={profile?.insights?.roleFit} />
          </div>

          <InsightsCard insights={profile.insights} />
        </div>
      )}
    </main>
  );
};

export default Dashboard;
