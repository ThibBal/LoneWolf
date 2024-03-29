// Chaque élement contient le JSON d'une page : son id, les informations,
// les évènements qui s'y produisent (combats, choix aléatoire etc.)
// Si un choix aléatoire doit avoir lieu, nous spécifions l'intervalle et les pages accessibles
exports.pages = {
    1  : {numero : 1, 
        pagesSuivantes : [{page : 160, requis : "aucun"},
                        {page : 273, requis : "aucun"}
                        ]
    },
    4  : {numero : 4, 
        info : [{evenement : "Choix d'un objet"}],
        pagesSuivantes : [{page : 332, requis : "aucun"}
                        ]
    },
    12  : {numero : 12, objetsAjoutables : [{"nom" : "Rations spéciales", "quantite" : 3, "taille" : 3}, {"nom" : "Couvertures en Fourrure", "quantite" : 1, "taille" : 2}, {"nom" : "Corde", "quantite" : 1, "taille" : 1}],
        pagesSuivantes : [{page : 180, requis : "aucun"},
                        {page : 259, requis : "aucun"}
                        ]
    },
    57  : {numero : 57, objetsAjoutables : [{"nom" : "Épée d'Os", "quantite" : 1, "taille" : 1}, {"nom" : "Disque de Pierre Bleue", "quantite" : 1, "taille" : 1}],
        pagesSuivantes : [{page : 17, requis : "GUERISON"},
                        {page : 251, requis : "aucun"}
                        ]
    },
    62  : {numero : 62, 
        info : [{evenement : "Perte de points d'endurance", pointsPerdus : 3}],
        pagesSuivantes : [{page : 167, requis : "aucun"}
                       ]
    },
    70  : {numero : 70, 
        info : [{evenement : "Perd d'un objet", objetPerdu : "Chiens Kanu"}],
        pagesSuivantes : [{page : 209, requis : "HUILE DE BAKANAL"},
                        {page : 339, requis : "aucun"}
                        ]
    },
    78  : {numero : 78, 
        combat : {nom : "BAKANAL", habileté : 19, endurance : 30, perte : 0}, 
        pagesSuivantes : [{page : 245, requis : "victoire"}
                        ]
    },
    85  : {numero : 85, 
        pagesSuivantes : [{page : 300, requis : "aucun"}
                        ]
    },
    91  : {numero : 91, 
        pagesSuivantes : [{page : 234, requis : "aucun"}
                        ]
    },
    129  : {numero : 129, 
        info : [{evenement : "Perte de points d'endurance", pointsPerdus : 3}],
        pagesSuivantes : [{page : 155, requis : "aucun"}
                        ]
    },
    134  : {numero : 134, 
        info : [{evenement : "table de hasard"}],
        choixAleatoire : {
            intervalle : [0,9],
            choix : [
                {page : 57, intervalle : [0,3]},
                {page : 188, intervalle : [4,6]},
                {page : 331, intervalle : [7,9]}   
            ]
             
        }
    },
    155  : {numero : 155, 
        info : [{evenement : "table de hasard"}],
        choixAleatoire : {
            intervalle : [0,9],
            special : {enduranceMin : 10, impactMin : -2, enduranceMax : 20, impactMax : 1},
            choix : [
                {page : 248, intervalle : [-2,4]},
                {page : 350, intervalle : [5,11]}    
            ]
        }
    },
    160  : {numero : 160, 
        pagesSuivantes : [{page : 78, requis : "aucun"},
                        {page : 204, requis : "CHASSE"},
                        {page : 318, requis : "COMMUNICATION ANIMALE"}
                        ]
    },
    167  : {numero : 167, 
        info : [{evenement : "table de hasard"}],
        choixAleatoire : {
            intervalle : [0,9],
            choix : [
                {page : 85, intervalle : [0,6]},
                {page : 300, intervalle : [7,9]}
            ]
        }
    },
    172  : {numero : 172, 
        pagesSuivantes : [{page : 134, requis : "aucun"}
                        ]
    },
    180  : {numero : 180, 
        combat : {nom : "LANGUABARB", habileté : 11, endurance : 35, perte : 3},
        pagesSuivantes : [{page : 70, requis : "victoire parfaite"},
                        {page : 129, requis : "victoire"}
                        ]
    },
    188  : {numero : 188, 
        pagesSuivantes : [{page : 232, requis : "aucun"},
                        {page : 346, requis : "aucun"}
                        ]
    },
    204  : {numero : 204, 
        pagesSuivantes : [{page : 134, requis : "aucun"}
                        ]
    },
    209  : {numero : 209, 
        info : [{evenement : "Perte de points d'endurance", pointsPerdus : 2}],
        pagesSuivantes : [{page : 155, requis : "aucun"}
                        ]
    },
    245  : {numero : 245, 
        info : [{evenement : "Perte de points d'endurance", pointsPerdus : 2}],
        pagesSuivantes : [{page : 91, requis : "aucun"},
                        {page : 172, requis : "aucun"}
                        ]
    },
    248  : {numero : 248, gameOver : true
    },
    288  : {numero : 288, 
        pagesSuivantes : [{page : 167, requis : "aucun"}
                        ]
    },
    300  : {numero : 300, 
        pagesSuivantes : [{page : 12, requis : "aucun"},
                        {page : 238, requis : "aucun"}
                        ]
    },
    318  : {numero : 318, 
        pagesSuivantes : [{page : 134, requis : "aucun"}
                        ]
    },
    331  : {numero : 331, 
        info : [{evenement : "Perte de points d'endurance", condition : "Pas de GUERISON", pointsPerdus : 4},
        {evenement : "table de hasard"}],
        choixAleatoire : {
            intervalle : [0,9],
            choix : [
                {page : 62, intervalle : [0,4]},
                {page : 288, intervalle : [5,9]}    
            ]
        }
    },
    339  : {numero : 339, 
        gameOver : true,
    },
    350  : {numero : 350, 
        fin : true,
    }
};
