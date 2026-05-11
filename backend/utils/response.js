const successResponse = (res, data, statusCode = 200, meta = {}) => {
  return res.status(statusCode).json({
    success: true,
    data,
    meta: {
      ...meta,
      timestamp: new Date().toISOString()
    }
  });
};

const errorResponse = (res, message, statusCode = 500, meta = {}) => {
  return res.status(statusCode).json({
    success: false,
    error: {
      message,
      statusCode
    },
    meta: {
      ...meta,
      timestamp: new Date().toISOString()
    }
  });
};

module.exports = {
  successResponse,
  errorResponse
};
