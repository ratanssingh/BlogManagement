// server.js
const express = require('express');
const path = require('path');
const blogRoutes = require('./routes/blogRoutes');
const imageRoutes = require('./routes/imageRoutes');
const bodyParser = express.urlencoded; // built-in
const { UPLOAD_DIR } = require('./middlewares/upload'); // ensures folder created
const requestLogger = require('./middlewares/logger');
const errorHandler = require('./middlewares/errorHandler');

const app = express();
const PORT = process.env.PORT || 3000;

// Inbuilt middlewares
app.use(express.json()); // parse JSON bodies
app.use(express.urlencoded({ extended: true })); // parse urlencoded bodies for forms

// Bonus logger middleware
app.use(requestLogger);

// Serve uploaded files statically (optional convenience):
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/blogs', blogRoutes);
app.use('/images', imageRoutes);

// Healthcheck
app.get('/', (req, res) => res.send({ message: 'Blog API running' }));

// Error handling (last)
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
