var app = angular.module('LoneWolf', ['ngRoute', 'ngSanitize']);

// Adresse du serveur pour faciliter l'usage
var server = "http://localhost:3000";

// CONTROLLERS

app.controller('validationFormulaire', function($scope) {
    $scope.joueur = {};
    $scope.invalid = true;
    $scope.title = "Création de joueur";

    $scope.checkForm = function(){
        $scope.invalid = false;
        var nom = $scope.joueur.nom;

        if(nom.length < 4){
            $scope.invalid = true;
        }
        var disciplines = $scope.joueur.disciplines;
        var taille = 0;
        for(var key in $scope.joueur.disciplines)
        {
            if ($scope.joueur.disciplines[key])
                ++taille;
        }

        if (taille != 5) {
            $scope.invalid = true;
        }

        var equipements = $scope.joueur.equipements;
        var taille = 0;
        for(var key in $scope.joueur.equipements)
        {
            if ($scope.joueur.equipements[key])
                ++taille;
        }

        if (taille != 2) {
            $scope.invalid = true;
        }
    }
});


app.controller('recuperationJoueur', ['$scope', '$http', '$sce', '$window', "JoueurService", "AvancementService",
    function($scope, $http, $sce, $window, JoueurService, AvancementService) {
    $scope.joueursPrecedents = [];
    $http.get(server+'/api/joueurs')
        .then(function(response) {
            response.data.map(function(joueur) {
                $scope.joueursPrecedents.push({
                    id: joueur._id,
                    nom: joueur.nom
                });
            });
        });


    $scope.continuer = function() {
        var id = $scope.joueurPrecedent;
        $window.location.href = '/jeu/continuer/' + id;
        /*$http.get(server+'/api/avancements/' + id)
            .then(function(response) {
                var avancement = response.data;
                //$scope.avancement = avancement;
                AvancementService.set(avancement);
                var page = avancement.page;

                $http.get(server+'/api/joueurs/' + id)
                    .then(function(response) {
                        var joueur = response.data;
                        //$scope.joueurDonnees = joueur;
                        JoueurService.set(joueur);
                        //$window.sessionStorage.setItem('joueur', JSON.stringify(joueur.id));
                        
                    });
            })*/
    };

    $scope.supprimer = function(id) {
        $http.delete(server+'/api/joueurs/' + id);
        $scope.message = "Joueur supprimé";
    };

}]);

app.controller('jeuManager', ['$scope', '$http', '$sce', '$window', '$location', '$anchorScroll', 'JoueurService', 'AvancementService', 
        function($scope, $http, $sce, $window, $location, $anchorScroll, JoueurService, AvancementService) {
        // Récupérer le joueur courant
        $http.get(server+'/jeu/joueur/')
            .then(function(response) {
                var id = response.data._id;
                // Récupérer l'avancement du joueur
                $http.get(server+'/api/avancements/' + id)
                    .then(function(response) {
                        var avancement = response.data;
                        AvancementService.set(avancement);
                        // Récupérer les informations du joueur courant
                        $http.get(server+'/api/joueurs/' + id)
                            .then(function(response) {
                                var joueur = response.data;
                                JoueurService.set(joueur);         
                                var joueurActuel = JoueurService.get();
                                var avancement = AvancementService.get();
                                $scope.joueur = joueurActuel;
                                var numeroPage = avancement.page;
                                var sectionPage = avancement.section;
                                // Récupérer les informations de la section de la page courante
                                $http.get(server+'/jeu/' + numeroPage +'/' + sectionPage)
                                    .success(function(response) {
                                        $scope.page = response;
                                       //$scope.html = response.html;
                                        //$scope.pageHTML = $sce.trustAsHtml(response.html);
                                    if(avancement['tableDeHasard'] != false){
                                        $scope.choixFait = true;
                                        $scope.pagePossible = avancement.tableDeHasard.pagePossible;
                                        $scope.chiffreAleatoire = avancement.tableDeHasard.chiffreAleatoire;
                                    } else {
                                        initialiserVariables();
                                    }
                                    });                       
                            });
                    })
            });


    // Charger les paramètres (combat, page possible, chiffre etc.)

    $scope.changerPage = function(pageSuivante, sectionSuivante) {
        var avancement = AvancementService.get();
        avancement.history = [];
        $scope.afficherSectionSuivante = false;
        $http.get(server+'/jeu/' + pageSuivante + "/" + sectionSuivante)
            .success(function(response) {
            $scope.page = response;
            //$scope.section = null;
            // Mise à jour de l'historique
            avancement.history.push($scope.getDatetime()+" : Page "+pageSuivante);
            $scope.history = avancement.history;
            avancement["page"] = pageSuivante;
            avancement["section"] = sectionSuivante;
            AvancementService.set(avancement);
            AvancementService.save(avancement._id, {"page" : pageSuivante, "section" : sectionSuivante});
            //Reach the top of the page
            $anchorScroll();
            // Guérison
            guerisonCheck();

            //Initialise les variables
            initialiserVariables();

        });        
    };

    $scope.changerSection = function(pageCourante, sectionSuivante) {
        var avancement = AvancementService.get();
        $http.get(server+'/jeu/' + pageCourante + "/" + sectionSuivante)
            .success(function(response) {
            $scope.afficherSectionSuivante = true;
            $scope.section = response;
            $scope.page.section = sectionSuivante;
            avancement["page"] = pageCourante;
            avancement["section"] = sectionSuivante;
            AvancementService.set(avancement);
            AvancementService.save(avancement._id, {"page" : pageCourante, "section" : sectionSuivante});            
        });
    };

    $scope.checkDiscipline = function(discipline){
        var disciplines = $scope.joueur.disciplines;
        for(var k=0; k<disciplines.length;k++){
            if(disciplines[k] === discipline){
                return true;
            }
        }
        return false;
    }

    $scope.checkEquipement = function(equipement){
        
    }

    $scope.checkObjet = function(objet){
        
    }

/*    function objetsAAjouter = function(page){
        if(page.numero == 57){
            $scope.page.
        }
    }*/

    $scope.ajouterObjetSpecial = function(objet){
       $scope.joueur["objets_spéciaux"].push(objet);
       JoueurService.save($scope.joueur._id, {"objets_spéciaux" : $scope.joueur["objets_spéciaux"]});
       $scope.objetAjoute = true;
       $scope.changerSection($scope.page.numero, $scope.page.section+1);  
    }

    $scope.perdreEndurance = function(points){
       $scope.joueur["endurance"] = $scope.joueur["endurance"] - points;
       $scope.fait = true;
       JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur["endurance"]});
       $scope.changerSection($scope.page.numero, $scope.page.section+1);  
    }

    $scope.ajouterObjet = function(objet){
       $scope.joueur["sac_à_dos"].push(objet);
       JoueurService.save($scope.joueur._id, {"sac_à_dos" : $scope.joueur["sac_à_dos"]});
       var index = $scope.page.objetsAjoutables.indexOf(objet);
        $scope.page.objetsAjoutables.splice(index, 1);
    }

    $scope.tableDeHasard = function(page){
         $http.get(server+'/jeu/choixAleatoire/'+page)
            .then(function(response) {
                var res = response.data
                $scope.chiffreAleatoire = res.chiffre;
                $scope.pagePossible = res.page;
                $scope.choixFait = true;
                var avancement = AvancementService.get();
                AvancementService.save(avancement._id, {"tableDeHasard": {"pagePossible": res.page, "chiffreAleatoire" : res.chiffre}});
                $scope.changerSection(page, $scope.page.section +1);
            });
    }

    function guerisonCheck(){
        if($scope.checkDiscipline("La guérison") && $scope.joueur.endurance < $scope.joueur.enduranceInitiale){
            $scope.joueur.endurance = $scope.joueur.endurance + 1;
            JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur.endurance});
            $window.alert("Guérison : vous avez gagné 1 point d'endurance.");
        }
    }

    function initialiserVariables(){
        $scope.choixFait = false;
        $scope.objetAjoute = false;
        $scope.pagePossible = 0;
    }

    $scope.choisirObjet = function(choix) {
        if(choix == true){
            $scope.choix = true;
        } else {
            $scope.choix = false;
            $scope.changerSection($scope.page.numero, $scope.page.section+1);  
        }
    } 

    $scope.getDatetime = function() {
        d = new Date();
        m = d.getMinutes();
        h = d.getHours();
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

    $scope.voirSacADos = function(choix){
        if(choix == true){
            $scope.backpack = true;
        } else {
            $scope.backpack = false;
        }
    }

}]);


app.controller('combatManager', ['$scope', '$http', '$sce', '$window', '$location', '$anchorScroll', 'JoueurService', 'AvancementService', 'CombatService', 
        function($scope, $http, $sce, $window, $location, $anchorScroll, JoueurService, AvancementService, CombatService) {
    $scope.avancement = AvancementService.get();


    // Verifie si le joueur possède ou non la Puissance psychique
    //$scope.pp = $scope.checkDiscipline("Puissance psychique");


    if ($scope.avancement['combat_en_cours'] === true) {
        $scope.combatLog =  $scope.avancement.combat.combatLog;
        $scope.numeroRound =  $scope.avancement.combat.numeroRound;
        $scope.combat = $scope.avancement.combat.ennemi;
        $scope.continuerCombat = true;
        $scope.fin = $scope.avancement.combat.fin;
        $scope.commencerCombat = true;
    } else {
        $scope.combatLog = [];
        $scope.numeroRound =  1;
        $scope.victoire = false;
        $scope.defaite = false;
        $scope.fin = false;
        $http.get(server+'/jeu/' + $scope.avancement.page +'/' + $scope.avancement.section)
                                        .success(function(response) {
                                            var combat = response.combat;
                                            CombatService.set(combat);
                                            $scope.combat = combat;
                                        });
    }

    $scope.nombreAleatoire = 0;
    $scope.quotient = 0;
    
    $scope.commencerCombat = function(commencer) {
        if(commencer == true){
            $scope.comCombat = true;
        } else {
            $scope.comCombat = false;
        }
        //AvancementService.save($scope.avancement._id, {"commencerCombat" : true});
    };

    $scope.fuirCombat = function() {

        $scope.habileteFinale = $scope.joueur['habileté'] + $scope.joueur['bonusHabilete'];
        //Calcul de la fuite                                    
        $http.get(server+'/jeu/combat/' + $scope.habileteFinale + "/" + $scope.combat['habileté'])
            .success(function(response) {
                //Données du combat 
                var res = response;
                $scope.nombreAleatoire = res["chiffre"];
                $scope.quotient = res["quotient"];

                //Modifications du joueur
                $scope.EndurancePerdueJ = res['points_joueur'];
                $scope.NouvelleEnduranceJ = $scope.joueur['endurance'] - $scope.EndurancePerdueJ;

                //Message d'informations
                $scope.combatLog.push("<span class='round'>"+$scope.joueur.nom+" tente de fuir ! Poule mouillée !</span>");
                $scope.combatLog.push("<span class='round'>Quotient d'attaque :"+$scope.quotient+"</span>");
                $scope.combatLog.push("<span class='round'>Chiffre aléatoire : "+$scope.nombreAleatoire+"</span>");
                $scope.combatLog.push("<span class='round'>Endurance perdue par "+$scope.joueur.nom+" : "+res['points_joueur']+"</span>");

                //Mise à jour des informations
                $scope.joueur['endurance'] = $scope.NouvelleEnduranceJ,
                //$scope.joueur['enduranceBonus'] = $scope.NouvelleEnduranceJB,
                $scope.combat['endurance'] = $scope.NouvelleEnduranceE;
                
                //Joueur mort
                if($scope.joueur['endurance'] + $scope.joueur['bonusEndurance'] <= 0){
                    joueurBattu(); 
                }  
                //Mise à jour de l'avancement
                else {
                    fuiteReussie();
                }
            });    
    };

    function fuiteReussie() {
        $scope.combatLog.push("<span class='round'>"+$scope.joueur.nom+" a réussi à fuir !</span>");
        $scope.victoire = true;
        $scope.fin = true;
        AvancementService.save($scope.avancement._id, {"combat_en_cours" : false, "combat": {}});
        JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur['endurance']});
        $window.alert("Fuite réussie ! Vous pouvez poursuivre votre aventure.");
        $scope.changerSection($scope.page.numero, $scope.page.section+1);                
    }

    $scope.roundCombat = function(utiliser_pp) {

        // Récupération des informations du joueur
        //joueur = JoueurService.get();
        //combat = CombatService.get();

        // Gestion des objets spéciaux
        if(utiliser_pp == true){
            $scope.pp = 2;
        } else {
            $scope.pp = 0;
        }
        $scope.habileteFinale = $scope.joueur['habileté'] + $scope.joueur['bonusHabilete'] + $scope.pp;

        //Calcul du round                                    
        $http.get(server+'/jeu/combat/' + $scope.habileteFinale + "/" + $scope.combat['habileté'])
            .success(function(response) {
                //Données du combat 
                var res = response;
                $scope.nombreAleatoire = res["chiffre"];
                $scope.quotient = res["quotient"];

                //Modifications du joueur
                $scope.EndurancePerdueJ = res['points_joueur'];
                $scope.NouvelleEnduranceJ = $scope.joueur['endurance'] - $scope.EndurancePerdueJ;
                //$scope.NouvelleEnduranceJB = $scope.NouvelleEnduranceJB + $scope.joueur["bonusEndurance"];
                //Modifications de l'ennemi
                $scope.EndurancePerdueE = res['points_ennemi'];
                $scope.NouvelleEnduranceE = $scope.combat['endurance'] - $scope.EndurancePerdueE;

                //Message d'informations
                $scope.combatLog.push("<span class='round'>Round #"+$scope.numeroRound+"</span>");
                $scope.combatLog.push("<span class='round'>Quotient d'attaque :"+$scope.quotient+"</span>");
                $scope.combatLog.push("<span class='round'>Chiffre aléatoire : "+$scope.nombreAleatoire+"</span>");
                $scope.combatLog.push("<span class='round'>Endurance perdue par "+$scope.joueur.nom+" : "+res['points_joueur']+"</span>");
                $scope.combatLog.push("<span class='round'>Endurance perdue par l'ennemi : "+res['points_ennemi']+"</span>");


                //Mise à jour des informations
                $scope.joueur['endurance'] = $scope.NouvelleEnduranceJ,
                //$scope.joueur['enduranceBonus'] = $scope.NouvelleEnduranceJB,
                $scope.combat['endurance'] = $scope.NouvelleEnduranceE;
                $scope.numeroRound ++;
                
                //Joueur mort
                if($scope.joueur['endurance'] + $scope.joueur['bonusEndurance'] <= 0){
                    joueurBattu(); 
                } 
                // Ennemi mort
                else if($scope.combat['endurance'] <= 0){
                    ennemiBattu();                
                } 
                //Mise à jour de l'avancement
                else {
                    AvancementService.save($scope.avancement._id, {"combat_en_cours" : true, "combat": {"ennemi" : $scope.combat, "combatLog" : $scope.combatLog, "numeroRound" : $scope.numeroRound, "fin" : false}});
                    JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur['endurance']});
                }

                //AvancementService.set($scope.avancement);
                //JoueurService.set($scope.joueur);
/*                if($scope.fin == true && $scope.victoire == true){
                    
                }*/
            });    
    };

    function joueurBattu(){
        $scope.joueur['endurance'] = 0;
        $scope.combatLog.push("<span class='round'>Oh non ! "+$scope.joueur.nom+" est mort ! RIP</span>");
        $scope.defaite = true;
        $scope.fin = true;
        $window.alert('Vous êtes mort. Game Over');
        $http.delete(server+'/api/joueurs/' + $scope.joueur._id);
        $window.location.href= '/jeu/creer';
    };

    function ennemiBattu(){
        $scope.combat['endurance'] = 0;
        $scope.combatLog.push("<span class='round'>"+$scope.combat.nom+" est mort !</span>");
        $scope.victoire = true;
        $scope.fin = true;
        AvancementService.save($scope.avancement._id, {"combat_en_cours" : false, "combat": {}});
        JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur['endurance']});
        $window.alert("Vous avez gagné ! Vous pouvez poursuivre votre aventure.");
        $scope.changerSection($scope.page.numero, $scope.page.section+1);
    }

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
    function get() {
        return JSON.parse($window.sessionStorage.getItem('joueur'));
    }

    function set(object) {
        $window.sessionStorage.setItem('joueur', JSON.stringify(object));
    }

    function save(id, object) {
        $http.put(server+'/api/joueurs/' + id, object);   
    }

    return {
        get: get,
        set: set,
        save: save
    }
}]);

app.factory('AvancementService', ['$window', '$http', function($window, $http) {
    function get() {
        return JSON.parse($window.sessionStorage.getItem('avancement'));
    }

    function set(object) {
        $window.sessionStorage.setItem('avancement', JSON.stringify(object));
    }

    function save(id, object) {
        $http.put(server+'/api/avancements/' + id, object);   
    }       

    return {
        get: get,
        set: set,
        save: save
    }
}]);

app.factory('CombatService', ['$window', '$http', function($window, $http) {
    function get() {
        return JSON.parse($window.sessionStorage.getItem('combat'));
    }

    function set(object) {
        $window.sessionStorage.setItem('combat', JSON.stringify(object));
    }

    return {
        get: get,
        set: set
    }
}]);


