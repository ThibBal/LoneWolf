var app = angular.module('LoneWolf', ['ngRoute', 'ngSanitize']);

// Adresse du serveur pour faciliter l'usage
var server = "http://localhost:3000";

// CONTROLLERS

app.controller('jeuManager', ['$scope', '$http', '$sce', '$window', '$location', '$anchorScroll', 'JoueurService', 'AvancementService', 
        function($scope, $http, $sce, $window, $location, $anchorScroll, JoueurService, AvancementService) {

    // Récupérer le joueur courant
    $http.get(server+'/jeu/joueur/')
        .then(function(response) {
            $scope.id = response.data._id;  
            $scope.setAvancementCourant($scope.id);
        });
    
    // Récupérer l'avancement du joueur
    $scope.setAvancementCourant = function(id){
        $http.get(server+'/api/avancements/' + id)
            .then(function(response) {
                $scope.avancement = response.data; 
                $scope.setInfoJoueurCourant($scope.id);           
        })
    }
    
    // Récupérer les informations du joueur courant
    $scope.setInfoJoueurCourant = function(id){        
        $http.get(server+'/api/joueurs/' + id)
            .then(function(response) {
                $scope.joueur = response.data;
                $scope.setPageCourante($scope.avancement);
        });
    }
    // Récupérer les informations de la section de la page courante
    $scope.setPageCourante = function(avancement){
        $http.get(server+'/jeu/' + $scope.avancement.page +'/' + $scope.avancement.section)
            .success(function(response) {
                $scope.page = response;
                $scope.setParametres();
        });  
    }

    // Charger les paramètres (combat, page possible, chiffre etc.)
    $scope.setParametres = function(){
        $scope.victoireParfaite = false;
        if($scope.avancement['tableDeHasard'] != {}){
            $scope.choixFait = true;
            $scope.deuxiemeChoixFait = false;
            $scope.pagePossible =$scope.avancement.tableDeHasard.pagePossible;
            $scope.chiffreAleatoire = $scope.avancement.tableDeHasard.chiffreAleatoire;
        } else {
            $scope.initialiserVariables();
        }
    }

    $scope.changerPage = function(pageSuivante, sectionSuivante) {
        $scope.afficherSectionSuivante = false;
        $http.get(server+'/jeu/' + pageSuivante + "/" + sectionSuivante)
            .success(function(response) {
            $scope.page = response;
            // Mise à jour de l'historique
            $scope.avancement.historique.push($scope.getDatetime()+" : Page "+pageSuivante);
            $scope.avancement["page"] = pageSuivante;
            $scope.avancement["section"] = sectionSuivante;
            AvancementService.save($scope.avancement._id, {"page" : pageSuivante, "section" : sectionSuivante, "historique" : $scope.avancement.historique});
            //Reach the top of the page
            $anchorScroll();
            // Guérison
            guerisonCheck();
            //Initialise les variables
            $scope.initialiserVariables();
        });        
    };

    $scope.changerSection = function(pageCourante, sectionSuivante) {        
        $http.get(server+'/jeu/' + pageCourante + "/" + sectionSuivante)
            .success(function(response) {
            $scope.afficherSectionSuivante = true;
            $scope.section = response;
            $scope.page.section = sectionSuivante;
            $scope.avancement["page"] = pageCourante;
            $scope.avancement["section"] = sectionSuivante;
            AvancementService.save($scope.avancement._id, {"page" : pageCourante, "section" : sectionSuivante});            
        });
    };

    $scope.initialiserVariables = function(){
        $scope.choixFait = false;
        $scope.objetAjoute = false;
        $scope.fait = false;
        $scope.pagePossible = 0;
        $scope.victoireParfaite = "false";
    }

    $scope.checkDiscipline = function(discipline){
        var disciplines = $scope.joueur.disciplines;
        for(var k=0; k<disciplines.length;k++){
            if(disciplines[k] === discipline){
                return true;
            }
        }
        return false;
    }

    $scope.checkObjet = function(objet){
        var objets = $scope.joueur["sac_à_dos"];
        for(var k=0; k<objets.length;k++){
            if(objets[k]["nom"] === objet){
                return objets[k];
            }
        }
        return {"nom": objet, "nombre" : 0};
    }

    $scope.checkObjetSpecial = function(objet){
        var objets = $scope.joueur["objets_spéciaux"];
        for(var k=0; k<objets.length;k++){
            if(objets[k]["nom"] === objet){
                return objets[k];
            }
        }
        return {"nom": objet, "nombre" : 0};
    }

    $scope.ajouterObjetSpecial = function(objet){
       $scope.joueur["objets_spéciaux"].push(objet);
       JoueurService.save($scope.joueur._id, {"objets_spéciaux" : $scope.joueur["objets_spéciaux"]});
       $scope.objetAjoute = true;
       $scope.changerSection($scope.page.numero, $scope.page.section+1);  
    }

    $scope.utiliserObjet = function(objet){
        objet.quantite = 1;
        if(objet.nom = "Potion de Lampsur"){
            // Reutilisation de la fonction pour changer l'endurance
            $scope.changerEndurance(4);
        }
       JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur["endurance"]});
       $scope.perdreObjet(objet);
    }

    $scope.ajouterObjet = function(objet){
        var currentObjet = $scope.checkObjet(objet.nom);
        var objetAAjouter = {"nom" : objet.nom, "nombre" : currentObjet.nombre + objet.quantite};
        var position = $scope.joueur["sac_à_dos"].indexOf(currentObjet);
        if (position != -1) {
            $scope.joueur["sac_à_dos"][position] = objetAAjouter;
        } else {
            $scope.joueur["sac_à_dos"].push(objetAAjouter);
        }
        $scope.joueur["taille_sac_à_dos"] = $scope.joueur["taille_sac_à_dos"] + objet.taille;   
        JoueurService.save($scope.joueur._id, {"sac_à_dos" : $scope.joueur["sac_à_dos"], "taille_sac_à_dos" : $scope.joueur["taille_sac_à_dos"]});
        var index = $scope.page.objetsAjoutables.indexOf(objet);
        $scope.page.objetsAjoutables.splice(index, 1);
    }

    $scope.perdreObjet = function(objet){
        var currentObjet = $scope.checkObjet(objet.nom);
        var total = currentObjet.nombre - objet.quantite;
        if(total != 0){
            var objetASupprimer = {"nom" : objet.nom, "nombre" : total};
            var position = $scope.joueur["sac_à_dos"].indexOf(currentObjet);
            $scope.joueur["sac_à_dos"][position] = objetASupprimer;
        } else {
            var index = $scope.joueur["sac_à_dos"].indexOf(currentObjet);
            $scope.joueur["sac_à_dos"].splice(index, 1);
        }
        $scope.joueur["taille_sac_à_dos"] = $scope.joueur["taille_sac_à_dos"] - objet.taille;
        JoueurService.save($scope.joueur._id, {"sac_à_dos" : $scope.joueur["sac_à_dos"], "taille_sac_à_dos" : $scope.joueur["taille_sac_à_dos"]});

        $scope.fait = true;
        $scope.changerSection($scope.page.numero, $scope.page.section+1);  
    }

    $scope.changerEndurance = function(points){
       $scope.joueur["endurance"] = $scope.joueur["endurance"] + points;
       $scope.fait = true;
       JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur["endurance"]});
       $scope.changerSection($scope.page.numero, $scope.page.section+1);  
    }

    function guerisonCheck(){
        if($scope.checkDiscipline("La guérison") && $scope.joueur.endurance < $scope.joueur.enduranceInitiale){
            $scope.joueur.endurance = $scope.joueur.endurance + 1;
            JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur.endurance});
            $window.alert("Guérison : vous avez gagné 1 point d'endurance.");
        }
    }    

    $scope.tableDeHasard = function(page){
         $http.get(server+'/jeu/choixAleatoire/'+page)
            .then(function(response) {
                var res = response.data
                $scope.chiffreAleatoire = res.chiffre;
                $scope.pagePossible = res.page;
                $scope.choixFait = true;
                AvancementService.save($scope.avancement._id, {"tableDeHasard": {"pagePossible": res.page, "chiffreAleatoire" : res.chiffre}});
                $scope.changerSection(page, $scope.page.section +1);
            });
    }

    $scope.tableDeHasardSpeciale = function(page){
        var enduranceTotale = $scope.joueur["endurance"] + $scope.joueur["bonusEndurance"];
         $http.get(server+'/jeu/choixAleatoire/'+page+'/'+enduranceTotale)
            .then(function(response) {
                var res = response.data
                $scope.chiffreAleatoire = res.chiffre;
                $scope.pagePossible = res.page;
                $scope.choixFait = true;
                $scope.special = res.special;
                AvancementService.save($scope.avancement._id, {"tableDeHasard": {"pagePossible": res.page, "chiffreAleatoire" : res.chiffre, "special" : res.special}});
                $scope.changerSection(page, $scope.page.section +1);
            });
    }

    $scope.choisirObjet = function(choix) {
        if(choix == true){
            $scope.choix = true;
        } else {
            $scope.choix = false;
           // $scope.2fait = false;
            $scope.changerSection($scope.page.numero, $scope.page.section+1);  
        }
    } 

    $scope.voirSacADos = function(choix){
        if(choix == true){
            $scope.backpack = true;
        } else {
            $scope.backpack = false;
        }
    }

    $scope.victoireParfaiteFunction = function(choix){
        $scope.victoireParfaite = choix;
    }

    function addZero(i) {
        if (i < 10) {
            i = "0" + i;
        }
        return i;
    }

    $scope.getDatetime = function() {
        d = new Date();
        m = addZero(d.getMinutes());
        h = addZero(d.getHours());
        time = h+"h"+m;
        return time;
    };

    function gameOver(){
        $window.alert('Vous êtes mort. Game Over');
        $http.delete(server+'/api/joueurs/' + $scope.joueur._id);
    };

    $scope.tryAgain = function(){
        $http.delete(server+'/api/joueurs/' + $scope.joueur._id);
        $window.location.href= '/jeu/creer';
    };

}]);


// DIRECTIVE

// Compile the HTML to reinject AngularJS components
// Source : http://stackoverflow.com/questions/18157305/angularjs-compiling-dynamic-html-strings-from-database
app.directive('dynamic', function ($compile) {
  return {
    restrict: 'A',
    replace: true,
    link: function (scope, ele, attrs) {
      scope.$watch(attrs.dynamic, function(html) {
        ele.html(html);
        $compile(ele.contents())(scope);
      });
    }
  };
});

// Désactiver un lien si la personne ne possède pas la bonne condition
// Source : http://stackoverflow.com/questions/23425254/enable-disable-anchor-tag-using-angularjs
app.directive('aDisabled', function() {
    return {
        compile: function(tElement, tAttrs, transclude) {
            //Disable ngClick
            tAttrs["ngClick"] = "!("+tAttrs["aDisabled"]+") && ("+tAttrs["ngClick"]+")";
            //return a link function
            return function (scope, iElement, iAttrs) {
                //Toggle "disabled" to class when aDisabled becomes true
                scope.$watch(iAttrs["aDisabled"], function(newValue) {
                    if (newValue !== undefined) {
                        iElement.toggleClass("disabled", newValue);
                    }
                });
                //Disable href on click
                iElement.on("click", function(e) {
                    if (scope.$eval(iAttrs["aDisabled"])) {
                        e.preventDefault();
                    }
                });
            };
        }
    };
});


// SERVICES
app.factory('JoueurService', ['$window', '$http', function($window, $http) {
    function save(id, object) {
        $http.put(server+'/api/joueurs/' + id, object);   
    }
    return {
        save: save
    }
}]);

app.factory('AvancementService', ['$window', '$http', function($window, $http) {
    function save(id, object) {
        $http.put(server+'/api/avancements/' + id, object);   
    }
    return {
        save: save
    }
}]);