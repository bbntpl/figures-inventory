const express = require('express');
const app = express.Router();

/* GET home page. */
app.get('/', function(req, res, next) {
  res.render('index', { 
		primaryQuote: 'A site where you can buy/sell your favorite/owned figures inventory',
		title: 'ABCXYZ Figures' 
	});
});

module.exports = app;
