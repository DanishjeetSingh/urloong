const app = require('../index.js'); // Import your Express app

module.exports = (req, res) => {
  // This is needed because Vercel's serverless functions have a different request format
  req.originalUrl = req.url;
  return app(req, res);
};