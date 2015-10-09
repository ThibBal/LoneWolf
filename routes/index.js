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


/* GET creationJoueur page. */
router.get('/creationJoueur', function(req, res) {
    res.render('creationJoueur', { title: "Création du joueur" });
});

/* POST commencer page. */
router.post('/commencer', function(req, res) {
  var disciplines = req.body.disciplines;
  var equipements = req.body.equipements;

  //disciplines.length>5
  //equipements.length>5

  var joueur = req.session.joueur;
  if (!joueur) {
    joueur = req.session.joueur = {}
  }
  joueur["equipements"] = equipements;
  joueur["disciplines"] = disciplines;
  joueur["statistiques"] = Math.random();
  //res.send(req.session.joueur)

  // Redirect the joueur to the first page of the book
	res.redirect('./page/1');
});

/* GET page (with the right number) page. */
// see @exempleExpress on Moodle
router.get('/page/:numero', function(req, res, next) {
  // We get the parameter "numero" from our request
  var numeroPage = req.params.numero;
  //var sousnumeroPage = req.params.numero2;

  // We reach to the "right" page with the value
  var page = "./pages/" + numeroPage + ".jade";

  // The page is converted to HTML and then put in the page.jade
  res.render(page, function(err, html) {
      res.render('page', { title: numeroPage, htmlPage: html })
  });
});

module.exports = router;
