const express = require('express');
const app = express.Router();

/* GET home page. */
app.get('/', function (req, res, next) {
	try {
		res.render('about', { isAboutPage: true });
	} catch (err) {
		next(err)
	}
});

module.exports = app;