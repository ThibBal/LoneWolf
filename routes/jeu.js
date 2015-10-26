var express = require('express');
var router = express.Router();

/* Pages du jeu, la route est précédée de /jeu/ */

// ROUTES //

// Redirection vers la page de création d'un joueur
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
    // Nous créons la session et les paramètres du joueur 
    //en fonction de la validation du formulaire
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
                        var nbr = randomIntFromInterval(0,9);
                        joueur["maîtrise de l'arme"] = req.app.locals.armes_maîtrise[nbr];
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

    // Redirige le joueur à la première page du jeu
    res.redirect('./page/1');
});

// Retourne le JSON du joueur stockée en session
router.get('/joueur', function(req, res, next) {
    res.json(req.session.joueur);
});


// Construit la page et sa section
// Si :section n'est pas précisé, retourne toute la page 
router.get('/page/:numeroPage/:section?', function(req, res, next) {
    // We get the parameter "numero" from our request
    var page = req.params.numeroPage;

    if(req.params.section){
        var partiePage = req.params.section;
        var pageLivre = "./pages/" + page + "/" + partiePage + ".jade";
    } else {
        var pageLivre = "./pages/" + page + ".jade";
    }

    // La page  est convertie en HTML
    res.render(pageLivre, function(err, html) {
        res.render('page', { title: page, htmlPage: html })
    });
});

// Récupérer le JSON d'une page du livre
router.get('/:numeroPage', function(req, res, next) {
    var numero = req.params.numeroPage;
    var pageLivre = "./pages/" + numero + ".jade";
    var pageJSON = req.app.locals.pages[numero];
    if(typeof pageJSON === 'undefined'){
        res.json("Cette page n'existe pas (pour le moment)");
    } else {
        res.render(pageLivre, function(err, html) {
            pageJSON["html"] = html;
            res.json(pageJSON)
        });
    }
});


// Retourne la page accessible à partir d'un numéro aléatoire
// et de l'invertvalle défini dans une page
router.get('/choixAleatoire/:page', function(req, res, next) {
    var page = req.app.locals.pages[req.params.page];
    if(typeof page === 'undefined' || typeof page.choixAleatoire === 'undefined'){
        res.json("Cette page n'existe pas ou ne possède pas de choix aléatoire");
    } else {
        var nombres = page.choixAleatoire.intervalle;
        var valeur = randomIntFromInterval(nombres[0],nombres[1]);
        var choix = page.choixAleatoire.choix;
        var resultatJSON = {};
        resultatJSON["chiffre"] = valeur;
        for (p in choix){
            if (valeur >= choix[p].intervalle[0] && valeur <= choix[p].intervalle[1]){
                    resultatJSON["page"] = choix[p].page;
            }
        }
        res.json(resultatJSON);
    }  
});

// Retourne les informations sur un round d'un combat
router.get('/combat/:habilete1/:habilete2', function(req, res, next) {
    //var habileteJoueur = parseInt(req.params.habilete1);
    var habileteEnnemi = parseInt(req.params.habilete2);
    var habiletéBonus = parseInt(req.session.joueur["habiletéBonus"]);
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


// FONCTIONS ANNEXES //

// Retourne un entier aléatoire compris entre deux valeurs
// Source : http://stackoverflow.com/questions/4959975/generate-random-value-between-two-numbers-in-javascript
function randomIntFromInterval(min,max)
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

// Permet de savoir si une valeur est contenue dans un tableau
// Source : http://stackoverflow.com/questions/784012/javascript-equivalent-of-phps-in-array
function inArray(needle, haystack) {
    var length = haystack.length;
    for(var i = 0; i < length; i++) {
        if(haystack[i] == needle) return true;
    }
    return false;
}

// Permet de savoir si un nombre est pair ou non
// Source : http://stackoverflow.com/questions/5016313/how-to-determine-if-a-number-is-odd-in-javascript
function isOdd(num) { 
    return num % 2;
}

module.exports = router;
