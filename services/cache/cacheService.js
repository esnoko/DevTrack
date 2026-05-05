const CACHE_TTL_SECONDS = Number(process.env.CACHE_TTL_SECONDS || 300);
const CACHE_TTL_MS =
  Number.isFinite(CACHE_TTL_SECONDS) && CACHE_TTL_SECONDS > 0
    ? CACHE_TTL_SECONDS * 1000
    : 300 * 1000;

const profileAnalysisCache = new Map();
const inFlightAnalyses = new Map();

const getCachedAnalysis = (cacheKey) => {
  const cacheEntry = profileAnalysisCache.get(cacheKey);

  if (!cacheEntry) {
    return null;
  }

  if (Date.now() >= cacheEntry.expiresAt) {
    profileAnalysisCache.delete(cacheKey);
    return null;
  }

  return cacheEntry.data;
};

const setCachedAnalysis = (cacheKey, data) => {
  profileAnalysisCache.set(cacheKey, {
    data,
    expiresAt: Date.now() + CACHE_TTL_MS
  });
};

module.exports = {
  getCachedAnalysis,
  setCachedAnalysis,
  inFlightAnalyses
};
