require('dotenv').config();

const express = require('express');
const githubRoutes = require('./routes/githubRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/v1/github', githubRoutes);

app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: 'ok'
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: 'Route not found',
      statusCode: 404
    }
  });
});

// ===== Error Handler =====
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: {
      message: message,
      statusCode: statusCode
    },
    meta: {
      timestamp: new Date().toISOString()
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});