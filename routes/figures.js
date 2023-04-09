const express = require('express');
const app = express.Router();

const figure = require('../controllers/figure');

app.get('/figures', figure.figureList)

module.exports = app;