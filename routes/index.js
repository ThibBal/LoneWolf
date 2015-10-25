var express = require('express');
var router = express.Router();

/* GET page d'accueil de l'application */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Les Grottes de Kalte' });
});

/* GET page d'aide. */
router.get('/aide', function(req, res) {
    res.render('aide', { title: "Règles" });
});

module.exports = router;
