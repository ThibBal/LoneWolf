var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  var currentPage = "home";
  res.render('index', { title: 'Les Grottes de Kalte', currentPage: "home" });
});

/* GET help page. */
router.get('/help', function(req, res) {
  var currentPage = "help";
    res.render('help', { title: "Aide", currentPage: "help" });
});

/* GET createPlayer page. */
router.get('/createPlayer', function(req, res) {
    var currentPage = "createPlayer";
    res.render('createPlayer', { title: "Création du joueur", currentPage: "createPlayer" });
});

/* POST begin page. */
router.post('/begin', function(req, res) {
  var disciplines = req.body.disciplines;
  var equipements = req.body.equipements;

  // TO DO : create a session with the values "disciplines" and "equipements"
  console.log("Les disciplines sont : " + disciplines);
  console.log("Les équipements sont : " + equipements);

  // Redirect the player to the first page of the book
	res.redirect('./page/1');
});

/* GET page (with the right number) page. */
// see @exempleExpress on Moodle
router.get('/page/:value', function(req, res, next) {
  // We get the parameter "value" from our request
  var numberPage = req.params.value

  // We reach to the "right" page with the value
  var page = "./pages/" + numberPage + ".jade"

  // The page is converted to HTML and then put in the page.jade
  res.render(page, function(err, html) {
      res.render('page', { title: numberPage, htmlPage: html })
  });
});

module.exports = router;
