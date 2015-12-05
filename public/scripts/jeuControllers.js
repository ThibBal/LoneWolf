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
        $http.get(server+'/jeu/' + $scope.avancement.page +'/' + 1)
            .success(function(response) {
                $scope.page = response;
                $scope.setParametres($scope.page);                
        });
        $scope.sectionsSuivantes = [];
        if($scope.avancement.section != 1){
            for(var k=2; k<=$scope.avancement.section; k++){
                $scope.getSectionInfo($scope.avancement.page, k);
            }
        }
    }

    // Récupérer les informations de la section de la page courante
    $scope.getSectionInfo = function(page, section){
        $http.get(server+'/jeu/' + page +'/' + section)
            .success(function(response) {
                $scope.sectionsSuivantes[section-2] = response.html;
        });
    } 

    // Récupérer les informations de la section de la page courante
    $scope.getPageInfo = function(page){
        $http.get(server+'/jeu/' + page +'/' + 1)
            .success(function(response) {
                $scope.page = response;
        });
    }    
    
    // Charger les paramètres (combat, page possible, chiffre etc.)
    $scope.setParametres = function(){
        $scope.victoireParfaite = false;
        if($scope.avancement.objetsAjoutes != true){   
            $scope.avancement.objetsAjoutables = $scope.page.objetsAjoutables;
        }
        /*if($scope.avancement.choixTable == true){
            //$scope.coucou = "coucou";
            //$scope.deuxiemeavancement.choixTable = false;
            //$scope.pagePossible =$scope.avancement.tableDeHasard.pagePossible;
            //$scope.chiffreAleatoire = $scope.avancement.tableDeHasard.chiffreAleatoire;
        } else {
            $scope.initialiserVariables();
        }*/
    }

    $scope.changerPage = function(pageSuivante) {
        $scope.getPageInfo(pageSuivante);
        $scope.sectionsSuivantes = [];
        // Mise à jour de l'historique
        $scope.avancement.historique.push($scope.getDatetime()+" : Page "+pageSuivante);
        $scope.avancement["page"] = pageSuivante;
        $scope.avancement["section"] = 1;
        $scope.avancement.tableDeHasard = {};
        $scope.avancement.choixTable = false;
        $scope.avancement.enduranceChangee = false;
        $scope.avancement.objetPerdu = false;
        $scope.avancement.victoireParfaite = false;

        if($scope.page.objetsAjoutables){
             $scope.avancement.objetsAjoutables = $scope.page.objetsAjoutables;
        } else {
            $scope.avancement.objetsAjoutables = [];
        }
        AvancementService.save($scope.avancement._id, 
            {"page" : pageSuivante, 
            "section" : 1, 
            "historique" : $scope.avancement.historique, 
            "objetsAjoutables" :  $scope.avancement.objetsAjoutables, 
            "tableDeHasard" : {}, 
            "choixTable": false,
            "enduranceChangee" : false,
            "objetPerdu" : false,
            "objetAjoute" : false,
            "victoireParfaite" : false
        });
        //Reach the top of the page
        $anchorScroll();
        // Guérison
        guerisonCheck();
        //Initialise les variables
        //$scope.initialiserVariables();  
    };

    $scope.changerSection = function(pageCourante, sectionSuivante) {
        $scope.getSectionInfo(pageCourante, sectionSuivante);        
        $scope.avancement["section"] = sectionSuivante;
        AvancementService.save($scope.avancement._id, {"section" : sectionSuivante});
    };

   /* $scope.initialiserVariables = function(){
        $scope.objetsAjoutes = false; 
        $scope.objetAjoute = false;
        $scope.fait = false;
        $scope.enduranceChangee = false;
        $scope.pagePossible = 0;
        $scope.victoireParfaite = "false";
    }
*/
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
       JoueurService.save($scope.joueur._id, 
        {"objets_spéciaux" : $scope.joueur["objets_spéciaux"]});
       //$scope.objetAjoute = true;
       $scope.avancement.objetAjoute =  true;
       AvancementService.save($scope.avancement._id, {"objetAjoute" : true});
       $scope.changerSection($scope.page.numero, $scope.avancement.section+1);  
    }

    $scope.utiliserObjet = function(objet){
        objet.quantite = 1;
        if(objet.nom = "Potion de Lampsur"){
            // Reutilisation de la fonction pour changer l'endurance
            $scope.joueur["endurance"] = $scope.joueur["endurance"] + 4;
            if($scope.joueur["endurance"] > $scope.joueur["enduranceInitiale"]){
                $scope.joueur["endurance"] = $scope.joueur["enduranceInitiale"];
            }
        }
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
        JoueurService.save($scope.joueur._id, 
            {"endurance" : $scope.joueur["endurance"],
            "sac_à_dos" : $scope.joueur["sac_à_dos"],
            "taille_sac_à_dos" : $scope.joueur["taille_sac_à_dos"]
        }); 
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
        var index = $scope.avancement.objetsAjoutables.indexOf(objet);
        $scope.avancement.objetsAjoutables.splice(index, 1);
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
        $scope.avancement.objetPerdu = true;
        AvancementService.save($scope.avancement._id, {"objetPerdu" : true});
        $scope.changerSection($scope.page.numero, $scope.avancement.section+1);  
    }

    $scope.changerEndurance = function(points){
       $scope.joueur["endurance"] = $scope.joueur["endurance"] + points;
       if($scope.joueur["endurance"] > $scope.joueur["enduranceInitiale"]){
            $scope.joueur["endurance"] = $scope.joueur["enduranceInitiale"];
       }
       $scope.avancement.enduranceChangee = true;
       JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur["endurance"]});
       AvancementService.save($scope.avancement._id, {"enduranceChangee" : true})
       $scope.changerSection($scope.page.numero, $scope.avancement.section+1);  
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
                $scope.avancement.tableDeHasard.chiffreAleatoire = res.chiffre;
                $scope.avancement.tableDeHasard.pagePossible = res.page;
                $scope.avancement.choixTable = true;
                AvancementService.save($scope.avancement._id, 
                {"tableDeHasard": 
                    {"pagePossible": res.page,
                    "chiffreAleatoire" : res.chiffre},
                "choixTable" : true});
                $scope.changerSection(page, $scope.avancement.section +1);
            });
    }

    $scope.tableDeHasardSpeciale = function(page){
        var enduranceTotale = $scope.joueur["endurance"] + $scope.joueur["bonusEndurance"];
         $http.get(server+'/jeu/choixAleatoire/'+page+'/'+enduranceTotale)
            .then(function(response) {
                var res = response.data
                $scope.avancement.chiffreAleatoire = res.chiffre;
                $scope.avancement.pagePossible = res.page;
                $scope.avancement.choixTable = true;
                $scope.avancement.special = res.special;
                AvancementService.save($scope.avancement._id, 
                {"tableDeHasard": 
                    {"pagePossible": res.page, 
                    "chiffreAleatoire" : res.chiffre, 
                    "special" : res.special},  
                "choixTable" : true});
                $scope.changerSection(page, $scope.avancement.section +1);
            });
    }

    $scope.choisirObjet = function(choix) {
        if(choix == true){
            $scope.choix = true;
        } else {
            $scope.choix = false;
            AvancementService.save($scope.avancement._id, {"objetsAjoutables": $scope.page.objetsAjoutables, "objetsAjoutes" : true});
            $scope.changerSection($scope.page.numero, $scope.avancement.section+1);  
        }
    } 

    $scope.voirSacADos = function(choix){
        if(choix == true){
            $scope.backpack = true;
        } else {
            $scope.backpack = false;
        }
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