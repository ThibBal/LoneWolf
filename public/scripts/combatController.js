// Adresse du serveur pour faciliter l'usage
var server = "http://localhost:3000";

// CONTROLLER
app.controller('combatManager', ['$scope', '$http', '$sce', '$window', '$location', '$anchorScroll', 'JoueurService', 'AvancementService', 
        function($scope, $http, $sce, $window, $location, $anchorScroll, JoueurService, AvancementService) {

    var enduranceInitiale = $scope.joueur["endurance"];

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
                                            $scope.combat = response.combat;
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
                $scope.combatLog.push("<span class='roundnumero'>"+$scope.joueur.nom+" tente de fuir ! Poule mouillée !</span>");
                $scope.combatLog.push("<span class='round'>Quotient d'attaque : <span class='roundnumero'>"+$scope.quotient+"</span></span>");
                $scope.combatLog.push("<span class='round'>Chiffre aléatoire : <span class='roundnumero'>"+$scope.nombreAleatoire+"</span></span>");
                $scope.combatLog.push("<span class='round'>Endurance perdue par "+$scope.joueur.nom+" : <span class='roundnumero'>"+res['points_joueur']+"</span></span>");

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
        $scope.combatLog.push("<span class='roundnumero'>"+$scope.joueur.nom+" a réussi à fuir !</span>");
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
                $scope.combatLog.push("<span class='roundnumero'>Round #"+$scope.numeroRound+"</span>");
                $scope.combatLog.push("<span class='round'>Quotient d'attaque :<span class='roundnumero'>"+$scope.quotient+"</span></span>");
                $scope.combatLog.push("<span class='round'>Chiffre aléatoire : <span class='roundnumero'>"+$scope.nombreAleatoire+"</span></span>");
                $scope.combatLog.push("<span class='round'>Endurance perdue par "+$scope.joueur.nom+" : <span class='roundnumero'>"+res['points_joueur']+"</span></span>");
                $scope.combatLog.push("<span class='round'>Endurance perdue par l'ennemi : <span class='roundnumero'>"+res['points_ennemi']+"</span></span>");


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
                    AvancementService.save($scope.avancement._id,
                        {"combat_en_cours" : true, 
                         "combat": {"ennemi" : $scope.combat, 
                                    "combatLog" : $scope.combatLog,
                                    "numeroRound" : $scope.numeroRound,
                                    "fin" : false}});
                    JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur['endurance']});
                }
            });    
    };

    function joueurBattu(){
        $scope.joueur['endurance'] = 0;
        $scope.combatLog.push("<span class='roundnumero'>Oh non ! "+$scope.joueur.nom+" est mort ! RIP</span>");
        $scope.defaite = true;
        $scope.fin = true;
        $window.alert('Vous êtes mort. Game Over');
        $http.delete(server+'/api/joueurs/' + $scope.joueur._id);
        $window.location.href= '/jeu/creer';
    };

    function ennemiBattu(){
        $scope.combat['endurance'] = 0;
        $scope.combatLog.push("<span class='roundnumero'>"+$scope.combat.nom+" est mort !</span>");
        $scope.victoire = true;
        $scope.fin = true;
        if(enduranceInitiale == $scope.joueur['endurance']){
            $scope.victoireParfaite = true;
        } else {
            $scope.victoireParfaite = false;
        }
        AvancementService.save($scope.avancement._id, 
            {"combat_en_cours" : false,
            "victoireParfaite" : $scope.avancement.victoireParfaite,
            "combat": {},
        });
        JoueurService.save($scope.joueur._id, {"endurance" : $scope.joueur['endurance']});
        $window.alert("Vous avez gagné ! Vous pouvez poursuivre votre aventure.");
        $scope.changerSection($scope.page.numero, $scope.avancement.section+1);
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

