import SearchBar from '../components/common/SearchBar';
import Loader from '../components/common/Loader';
import ErrorMessage from '../components/common/ErrorMessage';
import Footer from '../components/layout/Footer';
import HeaderCard from '../components/cards/HeaderCard';
import RepoSummaryCard from '../components/cards/RepoSummaryCard';
import InsightsCard from '../components/cards/InsightsCard';
import TechStackCard from '../components/cards/TechStackCard';
import ScoreBreakdownCard from '../components/cards/ScoreBreakdownCard';
import CommitChart from '../components/charts/CommitChart';
import RoleFitChart from '../components/charts/RoleFitChart';
import LanguageChart from '../components/charts/LanguageChart';
import { useGithubProfile } from '../hooks/useGithubProfile';
import { AnimatePresence, motion } from 'framer-motion';

const EXAMPLE_USERNAMES = ['esnoko', 'torvalds', 'addyosmani', 'yyx990803'];

const fadeUp = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1]
    }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.08
    }
  }
};

const Dashboard = () => {
  const { profile, metadata, loading, error, loadProfile, setUsername } = useGithubProfile('');

  const handleSearch = (nextUsername) => {
    setUsername(nextUsername);
    loadProfile(nextUsername);
  };

  return (
    <div className="app-shell">
      <div className="hero-glow" aria-hidden="true" />

      {/* ── Sticky top nav ── */}
      <motion.nav
        className="top-nav"
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <motion.span className="brand" whileHover={{ y: -1 }} transition={{ duration: 0.2 }}>
          DevTrack
        </motion.span>
        <div className="flex-1 max-w-sm">
          <SearchBar onSearch={handleSearch} loading={loading} defaultValue={profile?.username || ''} compact />
        </div>
      </motion.nav>

      {/* ── Page content ── */}
      <div className="page-content">
        <AnimatePresence mode="wait">
          {/* Empty state */}
          {!profile && !loading && !error && (
            <motion.div
              key="empty"
              className="flex flex-col items-center justify-center py-24 text-center"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 10, transition: { duration: 0.22 } }}
            >
              <p className="text-4xl font-bold tracking-tight text-primary">GitHub Profile Analytics</p>
              <p className="mt-3 text-base text-muted max-w-md">
                Enter a GitHub username to generate a full developer profile — scores, commit trends, and role fit.
              </p>
              <p className="mt-4 text-sm text-muted">Try an example username:</p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                {EXAMPLE_USERNAMES.map((username, index) => (
                  <motion.button
                    key={username}
                    className="rounded-md border px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-slate-50"
                    style={{ borderColor: 'var(--color-line)' }}
                    type="button"
                    onClick={() => handleSearch(username)}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.14 + index * 0.06, duration: 0.3 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {username}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Loading */}
          {loading && (
            <motion.div
              key="loading"
              className="mt-16"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
            >
              <Loader message="Fetching GitHub profile..." />
            </motion.div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div
              key="error"
              className="mt-8"
              variants={fadeUp}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
            >
              <ErrorMessage message={error} />
            </motion.div>
          )}

          {/* Profile */}
          {!loading && !error && profile && (
            <motion.div
              key="profile"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 10, transition: { duration: 0.2 } }}
            >
              <motion.div variants={fadeUp}>
                <HeaderCard username={profile.username} metadata={metadata} />
              </motion.div>

              <motion.div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2" variants={staggerContainer}>
                <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                  <RepoSummaryCard
                    repositorySummary={profile.repositorySummary}
                    hireabilityScore={profile.hireabilityScore}
                  />
                </motion.div>
                <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                  <ScoreBreakdownCard
                    scoreBreakdown={profile.scoreBreakdown || []}
                    hireabilityScore={profile.hireabilityScore}
                  />
                </motion.div>
              </motion.div>

              <motion.div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3" variants={staggerContainer}>
                <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                  <CommitChart data={profile.commitActivity || []} />
                </motion.div>
                <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                  <RoleFitChart roleFit={profile?.insights?.roleFit} />
                </motion.div>
                <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                  <LanguageChart languageBreakdown={profile.languageBreakdown || []} />
                </motion.div>
              </motion.div>

              <motion.div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-2" variants={staggerContainer}>
                <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                  <TechStackCard techStack={profile.techStack || []} languageBreakdown={profile.languageBreakdown || []} />
                </motion.div>
                <motion.div variants={fadeUp} whileHover={{ y: -4 }} transition={{ duration: 0.25 }}>
                  <InsightsCard insights={profile.insights} />
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
