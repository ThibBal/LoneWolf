var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var index = require('./routes/index');
var jeu = require('./routes/jeu');

var constantes_disciplines =
{
  CAMOUFLAGE : "camouflage",
  CHASSE : "chasse",
  SIXIEME_SENS : "sixième sens",
  ORIENTATION : "orientation",
  GUERISON : "guérison",
  MAITRISE_DES_ARMES : "maîtrise des armes",
  BOUCLIER_PSYCHIQUE : "bouclier psychique",
  PUISSANCE_PSYCHIQUE : "puissance psychique",
  COMMUNICATION_ANIMALE : "communication animale",
  MAITRISE_PSYCHIQUE_DE_LA_MATIERE : "maîtrise psychique de la matière"
};

//var constantes_equipements =
//    {
//        EPEE = "épée",
//        SABRE = "sabre",
//        LANCE = "lance",
//        MASSE_D_ARMES = "masse d'armes",
//        MARTEAU_DE_GUERRE = "marteau de guerre",
//        HACHE = "hâche",
//        BATON = "bâton",
//        GLAIVE = "glaive",
//        GILET_DE_CUIR_MATELASSE = "gilet de cuir matelassé",
//        POTION_DE_LAMPSUR = "potion de lampsur",
//        RATIONS_SPECIALES = "rations spéciales"
//};

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


module.exports = app;
