var app = angular.module('LoneWolf', ['ngRoute', 'ngSanitize']);

// Adresse du serveur pour faciliter l'usage
var server = "http://localhost:3000";

// CONTROLLERS

app.controller('validationFormulaire', function($scope) {
    $scope.joueur = {};
    $scope.invalid = true;
    $scope.joueur.nom = "";

    $scope.checkForm = function(){
        var valid1 = false;
        var valid2 = false;
        var valid3 = false;

        if($scope.joueur.nom.length >= 4){
            valid1 = true;
        } else {
            valid1 = false;
        }
        var disciplines = $scope.joueur.disciplines;
        var tailleDisciplines = 0;
        for(var key in $scope.joueur.disciplines)
        {
            if ($scope.joueur.disciplines[key])
                ++tailleDisciplines;
            if (tailleDisciplines == 5) {
                valid2 = true;
            } else {
                valid2 = false;
            }
        }

        var equipements = $scope.joueur.equipements;
        var tailleEquipements = 0;
        for(var key in $scope.joueur.equipements)
        {
            if ($scope.joueur.equipements[key])
                ++tailleEquipements;
            if (tailleEquipements == 2) {
                valid3 = true;
            } else {
                valid3 = false;
            }
        }

        if (valid1 == true && valid2 == true && valid3 == true){
            $scope.invalid = false;
        } else {
            $scope.invalid = true;
        }
    }
});


app.controller('recuperationJoueur', ['$scope', '$http', '$sce', '$window',
    function($scope, $http, $sce, $window) {

    getJoueurs();

    function getJoueurs() {
        $scope.joueursPrecedents = [];
        $scope.joueurPrecedent = '';
        $http.get(server+'/api/joueurs')
            .then(function(response) {
                response.data.map(function(joueur) {
                    $scope.joueursPrecedents.push({
                        id: joueur._id,
                        nom: joueur.nom
                    });
                });
            });
    }

    $scope.continuer = function() {
        var id = $scope.joueurPrecedent;
        $window.location.href = '/jeu/continuer/' + id;
    };

    $scope.supprimer = function(id) {
        $http.delete(server+'/api/joueurs/' + id);
        $scope.message = "Joueur supprimé";
        getJoueurs();
    };

}]);