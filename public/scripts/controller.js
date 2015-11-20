var LoneWolf = angular.module('LoneWolf', []);

LoneWolf.controller('validationFormulaire', function($scope) {
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