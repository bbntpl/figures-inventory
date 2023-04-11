const express = require('express');
const app = express.Router();

/* GET home page. */
app.get('/about', function (req, res, next) {
	try {
		res.render('about_page', { title: 'About the site' });
	} catch (err) {
		next(err)
	}
});

module.exports = app;