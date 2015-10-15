var express = require('express');
var router = express.Router();

/* Pages du jeu, la route est précédée de /jeu/ */

// ROUTES //

/* GET creer page. */
router.get('/', function(req, res, next) {
  res.redirect('/jeu/creer');
});


/* GET Création du joueur. */
router.get('/creer', function(req, res) {
    res.render('creationJoueur', { title: "Création du joueur", wrong : ""});
});


/* POST Commencer une partie. */
router.post('/commencer', function(req, res) {
    var disciplines = req.body.disciplines;
    var equipements = req.body.equipements;

    var constantes_disciplines = [
        CAMOUFLAGE = "camouflage",
        CHASSE = "chasse",
        SIXIEME_SENS = "sixième sens",
        ORIENTATION = "orientation",
        GUERISON = "guérison",
        MAITRISE_DES_ARMES = "maîtrise des armes",
        BOUCLIER_PSYCHIQUE = "bouclier psychique",
        PUISSANCE_PSYCHIQUE = "puissance psychique",
        COMMUNICATION_ANIMALE = "communication animale",
        MAITRISE_PSYCHIQUE_DE_LA_MATIERE = "maîtrise psychique de la matière"
    ];

    var constantes_equipements = [
        EPEE = 'épée',
        SABRE = 'sabre',
        LANCE = "lance",
        MASSE_D_ARMES = "masse d'armes",
        MARTEAU_DE_GUERRE = "marteau de guerre",
        HACHE = "hâche",
        BATON = "bâton",
        GLAIVE = "glaive",
        GILET_DE_CUIR_MATELASSE = "gilet de cuir matelassé",
        POTION_DE_LAMPSUR = "potion de lampsur",
        RATIONS_SPECIALES = "rations spéciales"
    ];

    if (disciplines == null || equipements == null){
        erreur =  "Vous devez choisir 5 disciplines et 2 équipements. Pas plus. Pas moins.";
        res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
    }
    else if (disciplines.length != 5  || equipements.length != 2){
        erreur =  "Vous devez choisir 5 disciplines et 2 équipements. Pas plus. Pas moins.";
        res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
    }
    else{
        for (i = 0; i < disciplines.length; i++){
            if (!inArray(disciplines[i], constantes_disciplines)){
                erreur =  "Vous avez essayer de faire planter le formulaire, c'est pas cool!";
                res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
            }
        }
        for (i=0; i < equipements.length; i++){
            if (!inArray(equipements[i], constantes_equipements)){
                erreur =  "Vous avez essayer de faire planter le formulaire, c'est pas cool!";
                res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
            }
        }
    }

    var joueur = req.session.joueur;
    if (!joueur) {
        joueur = req.session.joueur = {}
    }
    joueur["equipements"] = equipements;
    joueur["disciplines"] = disciplines;
    joueur["habilete"] = randomIntFromInterval(10,19);
    joueur["endurance"] = randomIntFromInterval(20,29);
    joueur["bourse"] = randomIntFromInterval(10,19);
    joueur["bonusHabilete"] = 2;
    joueur["bonusEndurance"] = 2;
    //res.send(req.session.joueur);

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

/* GET joueur */
router.get('/joueur', function(req, res, next) {
    res.send(req.session.joueur)
});


/* GET choixAleatoire */
router.get('/choixAleatoire/:max', function(req, res, next) {
    var nombreMax = req.params.max;
    var valeur = randomIntFromInterval(0,nombreMax);
    res.send(valeur.toString());
});

/* GET combat  */
router.get('/combat/:habilete1/:habilete2', function(req, res, next) {
    var habileteJoueur = parseInt(req.params.habilete1);
    var habileteEnnemi = parseInt(req.params.habilete2);
    var bonus = parseInt(req.session.joueur["bonusHabilete"]);
    var infoCombat = {};
    infoCombat["bonusHabilete"] = bonus
    infoCombat["quotient d'attaque"] = habileteJoueur+bonus-habileteEnnemi;
    infoCombat["chiffreAleatoire"] = randomIntFromInterval(0,9);
    infoCombat["points perdus par le joueur"] = randomIntFromInterval(0,9);
    infoCombat["points perdus par l'ennemi"] = randomIntFromInterval(0,9);
    res.send(infoCombat);
});


// FONCTIONS //

// Source : http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Source : http://stackoverflow.com/questions/784012/javascript-equivalent-of-phps-in-array
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

module.exports = router;
