const express = require('express');
const { getGithubAnalysis } = require('../controllers/githubController');

const router = express.Router();

router.get('/:username', getGithubAnalysis);

module.exports = router;