// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const { upload } = require('../middlewares/upload');
const validateBlog = require('../middlewares/validateBlog');
const blogController = require('../controllers/blogController');


router.post('/create', upload.single('image'), validateBlog, blogController.create);

router.get('/', blogController.list);

router.get('/:id', blogController.getOne);

router.put('/:id', upload.single('image'), blogController.update);

router.delete('/:id', blogController.remove);

module.exports = router;
