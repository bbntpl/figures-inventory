const express = require('express');
const app = express.Router();

/* GET home page. */
app.get('/about', function(req, res, next) {
  res.render('about_page', { title: 'About the site' });
});

module.exports = app;
