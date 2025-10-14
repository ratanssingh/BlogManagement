const path = require('path');
const fs = require('fs').promises;
const { UPLOAD_DIR } = require('../middlewares/upload');
const { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog } = require('../models/blogModel');

async function create(req, res, next) {
  try {
    const { title, content } = req.body;
    const imageFilename = req.file ? path.basename(req.file.filename) : null;

    const blog = await createBlog({ title, content, imageFilename });
    const response = {
      ...blog,
      imageUrl: blog.image ? `/images/${blog.image}` : null
    };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

async function list(req, res, next) {
  try {
    const { search, page, limit } = req.query;
    const pageNum = page ? Number(page) : undefined;
    const limitNum = limit ? Number(limit) : undefined;

    const blogs = await getAllBlogs({ search, page: pageNum, limit: limitNum });
    const result = blogs.map(b => ({ ...b, imageUrl: b.image ? `/images/${b.image}` : null }));
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const { id } = req.params;
    const blog = await getBlogById(id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json({ ...blog, imageUrl: blog.image ? `/images/${blog.image}` : null });
  } catch (err) {
    next(err);
  }
}

async function update(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content } = req.body;

    const existing = await getBlogById(id);
    if (!existing) {
      if (req.file && req.file.path) await fs.unlink(req.file.path).catch(() => {});
      return res.status(404).json({ message: "Blog not found" });
    }

    let newImageFilename;
    if (req.file) {
      newImageFilename = path.basename(req.file.filename);
      if (existing.image) {
        const toDelete = path.join(UPLOAD_DIR, existing.image);
        await fs.unlink(toDelete).catch(() => {});
      }
    }

    const updated = await updateBlog(id, {
      title,
      content,
      imageFilename: newImageFilename !== undefined ? newImageFilename : undefined
    });

    res.json({ ...updated, imageUrl: updated.image ? `/images/${updated.image}` : null });
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    const { id } = req.params;
    const existing = await getBlogById(id);
    if (!existing) return res.status(404).json({ message: "Blog not found" });

    if (existing.image) {
      const loc = path.join(UPLOAD_DIR, existing.image);
      await fs.unlink(loc).catch(() => {});
    }

    await deleteBlog(id);
    res.json({ message: "Blog deleted" });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, list, getOne, update, remove };
