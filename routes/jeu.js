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
    var équipements = req.body.équipements;
    var bonusHabilete = 0;
    var bonusEndurance = 0;
    var cste_disciplines = req.app.locals.disciplines;
    var cste_équipements = req.app.locals.équipements;
    var joueur = req.session.joueur = {};
        joueur["disciplines"] = [];
        joueur["armes"] = [];
        joueur["sacàdos"] = [];
        joueur["objetsspéciaux"] = [];

        

    if (disciplines == null || équipements == null){
        erreur =  "Vous devez choisir 5 disciplines et 2 équipements. Pas plus. Pas moins.";
        res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
    }
    else if (disciplines.length != 5  || équipements.length != 2){
        erreur =  "Vous devez choisir 5 disciplines et 2 équipements. Pas plus. Pas moins.";
        res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
    }
    else{
        for (i in disciplines){
            if (cste_disciplines.hasOwnProperty(disciplines[i])) {
                    joueur["disciplines"].push(cste_disciplines[disciplines[i]]);
                    if(cste_disciplines[disciplines[i]] == cste_disciplines.MAITRISE_DES_ARMES){
                        bonusHabilete = 2;
                    }
            } else {
                erreur =  "Vous avez essayé de faire planter le formulaire, ce n'est pas cool !";
                res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
            }
        }
        for (i in équipements){
            if (cste_équipements.hasOwnProperty(équipements[i])) {
                if(cste_équipements[équipements[i]] == cste_équipements.GILET_DE_CUIR_MATELASSE){
                    bonusEndurance = 2;
                    joueur["objetsspéciaux"].push(cste_équipements[équipements[i]]);
                } else if(cste_équipements[équipements[i]] == cste_équipements.POTION_DE_LAMPSUR || cste_équipements[équipements[i]] ==  cste_équipements.RATIONS_SPECIALES) {
                    joueur["sacàdos"].push(cste_équipements[équipements[i]]);
                } else {
                    joueur["armes"].push(cste_équipements[équipements[i]]);
                }
            } else {
                erreur =  "Vous avez essayé de faire planter le formulaire, ce n'est pas cool !";
                res.render("creationJoueur", {title: "Création du joueur", wrong : erreur});
            }
        }
    }
    joueur["habileté"] = randomIntFromInterval(10,19);
    joueur["endurance"] = randomIntFromInterval(20,29);
    joueur["bourse"] = randomIntFromInterval(10,19);
    joueur["habiletéBonus"] = joueur["habileté"] + bonusHabilete;
    joueur["enduranceBonus"] = joueur["endurance"] + bonusEndurance;

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

// Récupérer le JSON d'une page du livre
router.get('/:numeroPage', function(req, res, next) {
    var numero = req.params.numeroPage;
    var pageLivre = "./pages/" + numero + ".jade";
    var pageJSON = req.app.locals.pages[numero];
    res.render(pageLivre, function(err, html) {
        pageJSON["pageLivre"] = html;
        res.json(pageJSON)
    });
});


/* GET joueur */
router.get('/joueur', function(req, res, next) {
    res.json(req.session.joueur);
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
    //var habiletéBonus = parseInt(req.session.joueur["habiletéBonus"]);
    var habiletéBonus = habileteJoueur;
    var quotientAttaque = habiletéBonus-habileteEnnemi;
    var nbAleatoire = randomIntFromInterval(0,9);
    var infoCombat = {};
    var tableauCombat = req.app.locals.tableauCombatPos;
    var position = Math.abs(quotientAttaque);
    
    // Nous travaillons le quotient d'attaque pour avoir
    // une position dans le tableau des résultats
    if (isOdd(position) == 1){
        position++; 
    } 
    position = position/2;
    
    if (quotientAttaque < 0){
        tableauCombat = req.app.locals.tableauCombatNeg;
        position = position - 1;
        if (quotientAttaque < -10){
            position = 5;   
        } 
    }else{
        tableauCombat = req.app.locals.tableauCombatPos;
        if (quotientAttaque > 10){
            position = 6; 
        }
    }

    var resultats = tableauCombat[nbAleatoire][position];
    infoCombat["habiletéBonus"] = habiletéBonus;
    infoCombat["quotient d'attaque"] = quotientAttaque;
    infoCombat["chiffre aléatoire"] = nbAleatoire;
    infoCombat["points perdus par l'ennemi"] = resultats[0];
    infoCombat["points perdus par le joueur"] = resultats[1];
    
    res.json(infoCombat);
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

// Source : http://stackoverflow.com/questions/5016313/how-to-determine-if-a-number-is-odd-in-javascript
function isOdd(num) { 
    return num % 2;
}

module.exports = router;
