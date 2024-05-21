const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// Init Middleware
app.use(bodyParser.json());

module.exports = app;
