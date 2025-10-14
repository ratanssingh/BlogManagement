// models/blogModel.js
const { readDB, writeDB } = require('./db');
const fs = require('fs').promises;
const path = require('path');

async function getAllBlogs({ search, page, limit } = {}) {
  const db = await readDB();
  let list = db.blogs || [];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(b => b.title.toLowerCase().includes(q));
  }

  // Pagination (if provided)
  if (page && limit) {
    page = Number(page);
    limit = Number(limit);
    const start = (page - 1) * limit;
    list = list.slice(start, start + limit);
  }

  return list;
}

async function getBlogById(id) {
  const db = await readDB();
  return db.blogs.find(b => b.id === Number(id));
}

async function createBlog({ title, content, imageFilename }) {
  const db = await readDB();
  const blogs = db.blogs || [];
  const newId = blogs.length ? Math.max(...blogs.map(b => b.id)) + 1 : 1;
  const blog = {
    id: newId,
    title,
    content,
    image: imageFilename || null,
    createdAt: new Date().toISOString()
  };
  blogs.push(blog);
  db.blogs = blogs;
  await writeDB(db);
  return blog;
}

async function updateBlog(id, { title, content, imageFilename }) {
  const db = await readDB();
  const idx = db.blogs.findIndex(b => b.id === Number(id));
  if (idx === -1) return null;

  const blog = db.blogs[idx];
  blog.title = title !== undefined ? title : blog.title;
  blog.content = content !== undefined ? content : blog.content;
  if (imageFilename !== undefined) blog.image = imageFilename;

  db.blogs[idx] = blog;
  await writeDB(db);
  return blog;
}

async function deleteBlog(id) {
  const db = await readDB();
  const idx = db.blogs.findIndex(b => b.id === Number(id));
  if (idx === -1) return null;
  const [deleted] = db.blogs.splice(idx, 1);
  db.blogs = db.blogs;
  await writeDB(db);
  return deleted;
}

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
