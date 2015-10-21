exports.disciplines = {
        CAMOUFLAGE : "camouflage",
        CHASSE : "chasse",
        SIXIEME_SENS : "sixième sens",
        ORIENTATION : "orientation",
        GUERISON : "guérison",
        MAITRISE_DES_ARMES : "maîtrise des armes",
        BOUCLIER_PSYCHIQUE : "bouclier psychique",
        PUISSANCE_PSYCHIQUE : "puissance psychique",
        COMMUNICATION_ANIMALE : "communication animale",
        MAITRISE_PSYCHIQUE_DE_LA_MATIERE : "maîtrise psychique de la matière"
};

exports.équipements =
{   
    EPEE : 'épée',
    SABRE : 'sabre',
    LANCE : "lance",
    MASSE_D_ARMES : "masse d'armes",
    MARTEAU_DE_GUERRE : "marteau de guerre",
    HACHE : "hâche",
    BATON : "bâton",
    GLAIVE : "glaive",
    GILET_DE_CUIR_MATELASSE : "gilet de cuir matelassé",
    POTION_DE_LAMPSUR : "potion de lampsur",
    RATIONS_SPECIALES : "rations spéciales"
};

// 0,[1 ... 9
// PUis combat ratio/2
//-11 => colonne 0
//-10/-9 => colonne 1
// -6/-5 => colonne 3
// -2/-1 => colonne 5
// 0 => colonne 6
// 1/2 => colonne 7
// 5/6 => colonne 9
// 7/8 => colonne 10
// 9/10 => colonne 11
// 11 => colonne 12
exports.tableauCombat = [
    [[6,0],[7,0],[8,0],[9,0],[10,0],[11,0],[12,0],[14,0],[16,0],[18,0],["K",0],["K",0],["K",0]],
    [[0,"K"],[0,"K"],[0,8],[0,6],[1,6],[2,5],[3,5],[4,5],[5,4],[6,4],[7,4],[8,3],[9,3]],
    [[0,"K"],[0,8],[0,7],[1,6],[2,5],[3,5],[4,4],[5,4],[6,3],[7,3],[8,3],[9,3],[10,2]],
    [[0,8],[0,7],[1,6],[2,5],[3,5],[4,4],[5,4],[6,3],[7,3],[8,3],[9,2],[10,2],[11,2]],
    [[0,8],[1,7],[2,6],[3,5],[4,4],[5,4],[6,3],[7,3],[8,2],[9,2],[10,2],[11,2],[12,2]],
    [[1,7],[2,6],[3,5],[4,4],[5,4],[6,3],[7,2],[8,2],[9,2],[10,2],[11,2],[12,2],[14,1]],  
    [[2,6],[3,6],[4,5],[5,4],[6,3],[7,2],[8,2],[9,2],[10,2],[11,1],[12,1],[14,1],[16,1]],
    [[3,5],[4,5],[5,4],[6,3],[7,2],[8,2],[9,1],[10,1],[11,1],[12,0],[14,0],[16,0],[18,0]],
    [[4,4],[5,4],[6,3],[7,2],[8,1],[9,1],[10,0],[11,0],[12,0],[14,0],[16,0],[18,0],["K",0]],
    [[5,3],[6,3],[7,2],[8,0],[9,0],[10,0],[11,0],[12,0],[14,0],[16,0],[18,0],["K",0],["K",0]] 
    ];


