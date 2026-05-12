import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import HeaderCard from '../components/cards/HeaderCard';
import RepoSummaryCard from '../components/cards/RepoSummaryCard';
import InsightsCard from '../components/cards/InsightsCard';
import CommitChart from '../components/charts/CommitChart';
import RoleFitChart from '../components/charts/RoleFitChart';
import { useGithubProfile } from '../hooks/useGithubProfile';

const EXAMPLE_USERNAMES = ['gaearon', 'torvalds', 'addyosmani', 'yyx990803'];

const Dashboard = () => {
  const { profile, loading, error, loadProfile, setUsername } = useGithubProfile('');

  const handleSearch = (nextUsername) => {
    setUsername(nextUsername);
    loadProfile(nextUsername);
  };

  return (
    <div className="app-shell">
      {/* ── Sticky top nav ── */}
      <nav className="top-nav">
        <span className="brand">DevTrack</span>
        <div className="flex-1 max-w-sm">
          <SearchBar onSearch={handleSearch} loading={loading} defaultValue={profile?.username || ''} compact />
        </div>
      </nav>

      {/* ── Page content ── */}
      <div className="page-content">

        {/* Empty state */}
        {!profile && !loading && !error && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <p className="text-4xl font-bold tracking-tight text-primary">GitHub Profile Analytics</p>
            <p className="mt-3 text-base text-muted max-w-md">
              Enter a GitHub username to generate a full developer profile — scores, commit trends, and role fit.
            </p>
            <p className="mt-4 text-sm text-muted">Try an example username:</p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              {EXAMPLE_USERNAMES.map((username) => (
                <button
                  key={username}
                  className="rounded-md border px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-slate-50"
                  style={{ borderColor: 'var(--color-line)' }}
                  type="button"
                  onClick={() => handleSearch(username)}
                >
                  {username}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-16">
            <Loader message="Fetching GitHub profile..." />
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8">
            <ErrorMessage message={error} />
          </div>
        )}

        {/* Profile */}
        {!loading && !error && profile && (
          <div>
            <HeaderCard username={profile.username} />

            <RepoSummaryCard
              repositorySummary={profile.repositorySummary}
              hireabilityScore={profile.hireabilityScore}
            />

            <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
              <CommitChart data={profile.commitActivity || []} />
              <RoleFitChart roleFit={profile?.insights?.roleFit} />
            </div>

            <div className="mt-5">
              <InsightsCard insights={profile.insights} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
