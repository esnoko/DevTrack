const { errorResponse } = require('../utils/response');

const notFound = (req, res) => {
  return errorResponse(res, 'Route not found', 404);
};

module.exports = notFound;
