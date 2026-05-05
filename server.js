require('dotenv').config();

const express = require('express');
const githubRoutes = require('./routes/githubRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.use('/api/github', githubRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});