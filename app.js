var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var jeu = require('./routes/jeu');
var constantes = require('./constantes.js');
var pages = require('./pages.js');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));
// Rend accessible la session à la route suivante
// Source : http://stackoverflow.com/a/19070292
app.use(function(req,res,next){
    res.locals.session = req.session;
    next();
});
app.use('/', index);
app.use('/jeu', jeu);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


app.listen(app.get('port'), function(){
  console.log('Application lancée sur  http://localhost:' +
    app.get('port') + '; entrer Ctrl-C pour terminer.\n' );
  console.log('Nous vous invitons à consulter le fichier README pour découvrir le fonctionnement de notre application.\n' );
})

// Constantes de l'application
app.locals.disciplines = constantes.disciplines;
app.locals.équipements = constantes.équipements;
app.locals.tableauCombatPos = constantes.tableauCombatPositif;
app.locals.tableauCombatNeg = constantes.tableauCombatNegatif;
app.locals.armes_maîtrise = constantes.armes_maîtrise;
app.locals.pages = pages.pages;
module.exports = app;
