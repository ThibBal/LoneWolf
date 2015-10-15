var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Les Grottes de Kalte' });
});

/* GET aide page. */
router.get('/aide', function(req, res) {
    res.render('aide', { title: "Règles" });
});

module.exports = router;
