var express = require('express');
var router = express.Router();

/* Pages du jeu, la route est précédée de /jeu/ */

/* GET Création du joueur. */
router.get('/creer', function(req, res) {
    res.render('creationJoueur', { title: "Création du joueur", wrong : ""});
});


/* POST Commencer une partie. */
router.post('/commencer', function(req, res) {
  var disciplines = req.body.disciplines;
  var equipements = req.body.equipements;

  // A FAIRE : Ajouter la mise en forme du message d'erreur
  if (disciplines.length != 5 || equipements.length != 2){
    erreur = "Vous devez choisir 5 disciplines et 2 équipements. Pas plus. Pas moins."
    res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
  }

  var joueur = req.session.joueur;
  if (!joueur) {
    joueur = req.session.joueur = {}
  }
  joueur["equipements"] = equipements;
  joueur["disciplines"] = disciplines;
  joueur["habilete"] = randomIntFromInterval(0,9);
  joueur["endurance"] = randomIntFromInterval(0,9);
  joueur["bourse"] = randomIntFromInterval(10,19);
  joueur["habileteAvecBonus"] = joueur["habilete"] + 2;
  joueur["enduranceAvecBonus"] = joueur["endurance"] + 2;
  //res.send(req.session.joueur)

  // Redirect the joueur to the first page of the book
  res.redirect('./page/1');
});


/* GET page (with the right number) page. */
// see @exempleExpress on Moodle
router.get('/page/:numeroPage/:numero?', function(req, res, next) {
  // We get the parameter "numero" from our request
  var page = req.params.numeroPage;

  if(req.params.numero){
    var partiePage = req.params.numero;
     // We reach to the "right" page with the value
    var pageLivre = "./pages/" + page + "/" + partiePage + ".jade";
  } else {
    var pageLivre = "./pages/" + page + ".jade";
  }

  // The page is converted to HTML and then put in the page.jade
  res.render(pageLivre, function(err, html) {
      res.render('page', { title: page, htmlPage: html })
  });
});

// Source : http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

module.exports = router;
