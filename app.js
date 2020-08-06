var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mysql = require('mysql');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); //probs use ejs instead

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    database : 'movie_info',
    password : 'morganchase'
  });

  app.get("/", function(req, res){
    // Find count of users in DB
    var q = "SELECT COUNT(*) AS count FROM movies";
    connection.query(q, function(err, results){
        if(err) throw err;
        var count = results[0].count; 
        res.render("index", {count: count});
    });
});

  app.post("/add_movie", function(req, res){
    var movie = {
        title: req.body.title,
        year: req.body.year,
        imbd: req.body.imbd
    };
    connection.query('INSERT INTO movies SET ?', movie, function(err, result) {
        if (err) throw err;
        res.redirect("/");
    });
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
