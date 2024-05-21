const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const passport = require('passport');
require('./config/passport');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');

const app = express();

// Connect Database
connectDB();
// Init Middleware
app.use(bodyParser.json());
app.use(passport.initialize());

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);

module.exports = app;
