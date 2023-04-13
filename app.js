var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');
const mongoose = require('mongoose');
const methodOverride = require('method-override');

const indexRouter = require('./routes/index');
const figuresRouter = require('./routes/figures');
const charactersRouter = require('./routes/characters');
const aboutRouter = require('./routes/about');
const config = require('./utils/config')
const limiter = require('./utils/limiter');

const app = express();

// mongodb setup
mongoose.set('strictQuery', false)
mongoose.connect(config.MONGODB_URI)
	.then(() => {
		console.log('connected to MongoDB')
	})
	.catch((error) => {
		console.log('error connecting to MongoDB:', error.message)
	})

// A little bit of security setup
if(config.NODE_ENV === 'production') {
	app.use(limiter)
}

app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// middlewares setup
app.use(logger('dev'));
app.use(compression());
app.use(express.json({ limit: 10 * 100 * 1000 * 4 })); // request size; limit it to 4mb
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// routes setup
app.use('/', indexRouter);
app.use('/figures', figuresRouter);
app.use('/characters', charactersRouter);
app.use('/about', aboutRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
