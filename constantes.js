exports.disciplines = {
        CAMOUFLAGE : "Le camouflage",
        CHASSE : "La chasse",
        SIXIEME_SENS : "Sixième sens",
        ORIENTATION : "L'orientation",
        GUERISON : "La guérison",
        MAITRISE_DES_ARMES : "La maîtrise des armes",
        BOUCLIER_PSYCHIQUE : "Bouclier psychique",
        PUISSANCE_PSYCHIQUE : "Puissance psychique",
        COMMUNICATION_ANIMALE : "Communication animale",
        MAITRISE_PSYCHIQUE_DE_LA_MATIERE : "Maîtrise psychique de la matière"
};

exports.équipements =
{   
    EPEE : 'Epée',
    SABRE : 'Sabre',
    LANCE : "Lance",
    MASSE_D_ARMES : "Masse d'armes",
    MARTEAU_DE_GUERRE : "Marteau de guerre",
    HACHE : "Hâche",
    BATON : "Bâton",
    GLAIVE : "Glaive",
    GILET_DE_CUIR_MATELASSE : "Gilet de cuir matelassé",
    POTION_DE_LAMPSUR : "Potion de Lampsur",
    RATIONS_SPECIALES : "Rations spéciales"
};

// Armes qui peuvent être maîtrisées
exports.armes_maîtrise = ["Poignard", "Lance", "Masse d'armes", "Sabre", "Marteau de guerre", "Epée", "Hâche", "Epée", "Bâton", "Glaive"];

// Chaque ligne du tableau représente un chiffre aléatoire (0 à 9)
// Chaque tableau de la ligne correspond à une valeur du quotient d'attaque (positif)
// Le premier élément du dernier tableau correspond aux points d'endurance perdus par l'ennemi
// Le second élément correspond aux points perdus par le joueur
exports.tableauCombatPositif = [
    [[12,0],[14,0],[16,0],[18,0],[100,0],[100,0],[100,0]],
    [[3,5],[4,5],[5,4],[6,4],[7,4],[8,3],[9,3]],
    [[4,4],[5,4],[6,3],[7,3],[8,3],[9,3],[10,2]],
    [[5,4],[6,3],[7,3],[8,3],[9,2],[10,2],[11,2]],
    [[6,3],[7,3],[8,2],[9,2],[10,2],[11,2],[12,2]],
    [[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[14,1]],  
    [[8,2],[9,2],[10,2],[11,1],[12,1],[14,1],[16,1]],
    [[9,1],[10,1],[11,1],[12,0],[14,0],[16,0],[18,0]],
    [[10,0],[11,0],[12,0],[14,0],[16,0],[18,0],[100,0]],
    [[11,0],[12,0],[14,0],[16,0],[18,0],[100,0],[100,0]] 
];

// Tableau pour le quotient d'attaque négatif
// Commence par -1, -2 etc.
exports.tableauCombatNegatif = [
    [[11,0],[10,0],[9,0],[8,0],[7,0],[6,0]],
    [[2,5],[1,6],[0,6],[0,8],[0,100],[0,100]],
    [[3,5],[2,5],[1,6],[0,7],[0,8],[0,100]],
    [[4,4],[3,5],[2,5],[1,6],[0,7],[0,8]],
    [[5,4],[4,4],[3,5],[2,6],[1,7],[0,8]],
    [[6,3],[5,4],[4,4],[3,5],[2,6],[1,7]],  
    [[7,2],[6,3],[5,4],[4,5],[3,6],[2,6]],
    [[8,2],[7,2],[6,3],[5,4],[4,5],[3,5]],
    [[9,1],[8,1],[7,2],[6,3],[5,4],[4,4]],
    [[10,0],[9,0],[8,0],[7,2],[6,3],[5,3]] 
];

