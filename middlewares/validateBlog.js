// middlewares/validateBlog.js
function validateBlog(req, res, next) {
  const { title, content } = req.body;
  if (!title || !content) {
    if (req.file && req.file.path) {
      const fs = require('fs');
      fs.unlink(req.file.path, () => {});
    }
    return res.status(400).json({ message: "title and content are required" });
  }
  next();
}

module.exports = validateBlog;
