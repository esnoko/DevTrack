const { analyzeGithubProfile } = require('../services');

const getGithubAnalysis = async (req, res, next) => {
  try {
    const { username } = req.params;

    if (!username || !username.trim()) {
      const error = new Error('GitHub username is required');
      error.statusCode = 400;
      throw error;
    }

    const { data: analysis, cacheHit } = await analyzeGithubProfile(username.trim());

    res.set('X-Cache', cacheHit ? 'HIT' : 'MISS');

    res.status(200).json({
      success: true,
      data: analysis,
      meta: {
        cached: cacheHit,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getGithubAnalysis
};