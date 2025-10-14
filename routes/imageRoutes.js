// routes/imageRoutes.js
const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const router = express.Router();
const { UPLOAD_DIR } = require('../middlewares/upload');

router.get('/:filename', async (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(UPLOAD_DIR, filename);

    // Check exists
    await fs.access(filePath);
    return res.sendFile(filePath);
  } catch (err) {
    return res.status(404).json({ message: "Image not found" });
  }
});

module.exports = router;
