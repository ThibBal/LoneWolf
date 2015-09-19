var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Les Grottes de Kalte' });
});

router.get('/help', function(req, res) {
    res.render('help', { title: "Aide" });
});

router.get('/begin', function(req, res) {
    res.render('createPlayer', { title: "Création du joueur" });
});

router.post('/createPlayer', function(req, res) {
  var disciplines = req.body.disciplines;
  var equipements = req.body.equipements;

  // TO DO
  console.log("Les disciplines sont : " + disciplines);
	res.redirect('./page/1');
});

/* GET page page. */
// http://stackoverflow.com/questions/20089582/how-to-get-url-parameter-in-express-node-js
// http://stackoverflow.com/questions/12132978/use-a-variable-in-a-jade-include
router.get('/page/:value', function(req, res, next) {
  // On récupère le paramètre de l'URL
  var v = req.params.value

  // On crée dynamiquement la page qu'on souhaite charger
  var page = "./page" + v + ".jade"

  // On veut d'abord convertir la page en HTML, une fois que la conversion
  // est faite, on va injecter le HTML généré vers le fichier page.jade
  res.render(page, function(err, html) {
      res.render('page', { title: v, htmlPage: html })
  });
});

module.exports = router;
