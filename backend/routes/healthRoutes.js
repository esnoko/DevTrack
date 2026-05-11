const express = require('express');
const { successResponse } = require('../utils/response');

const router = express.Router();

router.get('/', (req, res) => {
  return successResponse(res, { status: 'ok' });
});

module.exports = router;
