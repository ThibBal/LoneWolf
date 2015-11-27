var app = angular.module('LoneWolf', ['ngRoute', 'ngSanitize']);

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

    $http.get('http://localhost:3000/api/joueurs')
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
        /*$http.get('http://localhost:3000/api/avancements/' + id)
            .then(function(response) {
                var avancement = response.data;
                //$scope.avancement = avancement;
                AvancementService.set(avancement);
                var page = avancement.page;

                $http.get('http://localhost:3000/api/joueurs/' + id)
                    .then(function(response) {
                        var joueur = response.data;
                        //$scope.joueurDonnees = joueur;
                        JoueurService.set(joueur);
                        //$window.sessionStorage.setItem('joueur', JSON.stringify(joueur.id));
                        
                    });
            })*/
    };

    $scope.supprimer = function() {
        var id = $scope.joueurPrecedent;
        $http.delete('http://localhost:3000/api/joueurs/' + id);
    };

}]);

app.controller('jeuManager', ['$scope', '$http', '$sce', '$window', '$location', '$anchorScroll', 'JoueurService', 'AvancementService', 
        function($scope, $http, $sce, $window, $location, $anchorScroll, JoueurService, AvancementService) {
        // Récupérer le joueur courant
        $http.get('http://localhost:3000/jeu/joueur/')
            .then(function(response) {
                var id = response.data._id;
                // Récupérer l'avancement du joueur
                $http.get('http://localhost:3000/api/avancements/' + id)
                    .then(function(response) {
                        var avancement = response.data;
                        AvancementService.set(avancement);
                        // Récupérer les informations du joueur courant
                        $http.get('http://localhost:3000/api/joueurs/' + id)
                            .then(function(response) {
                                var joueur = response.data;
                                JoueurService.set(joueur);         
                                var joueurActuel = JoueurService.get();
                                var avancement = AvancementService.get();
                                $scope.joueur = joueurActuel;
                                var numeroPage = avancement.page;
                                var sectionPage = avancement.section;
                                // Récupérer les informations de la section de la page courante
                                $http.get('http://localhost:3000/jeu/' + numeroPage +'/' + sectionPage)
                                    .success(function(response) {
                                        $scope.page = response;
                                       //$scope.html = response.html;
                                        //$scope.pageHTML = $sce.trustAsHtml(response.html);
                                    });                       
                            });
                    })
            });

    $scope.changerPage = function(pageSuivante, sectionSuivante) {
        var avancement = AvancementService.get();
        $http.get('http://localhost:3000/jeu/' + pageSuivante + "/" + sectionSuivante)
            .success(function(response) {
            $scope.page = response;
            avancement["page"] = pageSuivante;
            avancement["section"] = sectionSuivante;
            AvancementService.set(avancement);
            AvancementService.save(avancement._id, {"page" : pageSuivante, "section" : sectionSuivante});
            //Reach the top of the page
            $anchorScroll();
            
        });
    };

}]);


app.controller('combatManager', ['$scope', '$http', '$sce', '$window', '$location', '$anchorScroll', 'JoueurService', 'AvancementService', 'CombatService', 
        function($scope, $http, $sce, $window, $location, $anchorScroll, JoueurService, AvancementService, CombatService) {
    avancement = AvancementService.get();
    $http.get('http://localhost:3000/jeu/' + avancement.page +'/' + avancement.section)
                                    .success(function(response) {
                                        var combat = response.combat;
                                        CombatService.set(combat);
                                        $scope.combat = combat;

                                    });
    $scope.combatLog = [];
    $scope.commencerCombat = function() {
    };

    $scope.fuirCombat = function() {
        $http.get('http://localhost:3000/jeu/combat/123/123')
            .success(function(response) {
                $scope.points = response["points perdus par l'ennemi"];
        });
    };

    $scope.roundCombat = function() {
        joueur = JoueurService.get();
        combat = CombatService.get();
                                    
        $http.get('http://localhost:3000/jeu/combat/' + joueur['habileté'] + "/" + combat['habileté'])
            .success(function(response) {
                $scope.resultat = response;       
        });
        $scope.combatLog.push("<span class='round'>Round :"+$scope.resultat['points_ennemi']+"</span>");
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


// SERVICES

app.factory('JoueurService', ['$window', '$http', function($window, $http) {
    function get() {
        return JSON.parse($window.sessionStorage.getItem('joueur'));
    }

    function set(object) {
        $window.sessionStorage.setItem('joueur', JSON.stringify(object));
    }

    function save(id, object) {
        $http.put('http://localhost:3000/api/joueurs/' + id, object);   
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
        $http.put('http://localhost:3000/api/avancements/' + id, object);   
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


