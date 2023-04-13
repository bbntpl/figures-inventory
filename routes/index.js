const express = require('express');
const app = express.Router();

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { 
		isHomepage: true,
		primaryQuote: 'Discover and trade your favorite figures at the ultimate collector\'s marketplace!',
		title: 'ABCXYZ Figures' 
	});
});

module.exports = app;
