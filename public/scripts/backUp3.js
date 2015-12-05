getJoueurCourant();

    $scope.getJoueurCourant = function(){
        // Récupérer le joueur courant
        $http.get(server+'/jeu/joueur/')
            .then(function(response) {
                $scope.id = response.data._id;  
                getAvancementCourant(id);
        });
    }

    $scope.getAvancementCourant = function(id)){
        // Récupérer l'avancement du joueur
        $http.get(server+'/api/avancements/' + id)
            .then(function(response) {
                var avancement = response.data;
                AvancementService.set(avancement); 
                getJoueurCourant($scope.id, avancement);           
        })
    }

    $scope.getJoueurCourant = function(id, avancements){
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
                getPageCourante(avancement, numeroPage, sectionPage);
        });
    }

    $scope.getPageCourante = function(avancement, numeroPage, sectionPage){
        // Récupérer les informations de la section de la page courante
        $http.get(server+'/jeu/' + numeroPage +'/' + sectionPage)
            .success(function(response) {
                $scope.page = response;
                $scope.victoireParfaite = false;
               //$scope.html = response.html;
                //$scope.pageHTML = $sce.trustAsHtml(response.html);
            if(avancement['tableDeHasard'] != {}){
                $scope.choixFait = true;
                $scope.deuxiemeChoixFait = false;
                $scope.pagePossible = avancement.tableDeHasard.pagePossible;
                $scope.chiffreAleatoire = avancement.tableDeHasard.chiffreAleatoire;
            } else {
                $scope.initialiserVariables();
            }
        });  
    }