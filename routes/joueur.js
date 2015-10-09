var express = require('express');
var router = express.Router();

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

module.exports = router;