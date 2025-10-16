// models/blogModel.js
const Blog = require('./Blog');

async function getAllBlogs({ search, page, limit } = {}) {
    let query = {};
    
    if (search) {
        query.title = { $regex: search, $options: 'i' };
    }

    let blogsQuery = Blog.find(query);

    if (page && limit) {
        page = Number(page);
        limit = Number(limit);
        blogsQuery = blogsQuery.skip((page - 1) * limit).limit(limit);
    }

    return await blogsQuery.exec();
}

async function getBlogById(id) {
    return await Blog.findById(id);
}

async function createBlog({ title, content, imageFilename }) {
    const blog = new Blog({
        title,
        content,
        image: imageFilename || null
    });
    return await blog.save();
}

async function updateBlog(id, { title, content, imageFilename }) {
    const updates = {};
    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;
    if (imageFilename !== undefined) updates.image = imageFilename;

    return await Blog.findByIdAndUpdate(
        id,
        updates,
        { new: true } // returns the updated document
    );
}

async function deleteBlog(id) {
    return await Blog.findByIdAndDelete(id);
}

module.exports = { getAllBlogs, getBlogById, createBlog, updateBlog, deleteBlog };
