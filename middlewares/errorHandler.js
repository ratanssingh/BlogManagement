// middlewares/errorHandler.js
function errorHandler(err, req, res, next) {
  console.error(err);
  if (err.message && err.message.includes('Only image files')) {
    return res.status(400).json({ message: err.message });
  }
  res.status(500).json({ message: err.message || 'Internal Server Error' });
}

module.exports = errorHandler;
