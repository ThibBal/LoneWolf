var express = require('express');
var router = express.Router();

/* Pages du jeu */

/* GET Création du joueur. */
router.get('/creer', function(req, res) {
    res.render('creationJoueur', { title: "Création du joueur", wrong : ""});
});


/* POST Commencer une partie. */
router.post('/commencer', function(req, res) {
  var disciplines = req.body.disciplines;
  var equipements = req.body.equipements;

  if (disciplines.length=5 || equipements.length=2){
    erreur = "Vous devez choisir 5 disciplines et 2 équipements. Pas plus. Pas moins."
    res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
  }

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
  var numeroPage = req.params.numero

  // We reach to the "right" page with the value
  var page = "./pages/" + numeroPage + ".jade"

  // The page is converted to HTML and then put in the page.jade
  res.render(page, function(err, html) {
      res.render('page', { title: numeroPage, htmlPage: html })
  });
});

module.exports = router;
