var express = require('express');
var router = express.Router();
var mongo = require('mongodb');
var joueurs = require('../models/joueurs');
var avancements = require('../models/avancements');

// Web Services REST "joueurs" et "avancements"

// API joueurs

// POST /api/joueurs
// PAS IMPLEMENTE POUR LE MOMENT


// GET /api/joueurs/:id?
// Retourne le JSON du joueur avec l'ID "id" stocké dans la base de données
// Si :id est absent, retourne la liste de tous les joueurs
router.get('/joueurs/:id?', function(req, res, next) {
    if (req.params.id) {
        joueurs.getOne(req.params.id,res,function(docs){
            res.json(docs);
        });
    } else {
        joueurs.getAll(req,res,function(docs){
            res.json(docs);
        });
    }
});

// PUT /api/joueurs/:id
// Met à jour le joueur avec l'id "id" passé en paramètre 
//avec les informations du body.
router.put('/joueurs/:id', function(req, res, next) {
    var id = req.params.id;
    var data = req.body;
    joueurs.update(id,data,function(docs){
        res.json(docs);
    });
});

// DELETE /api/joueurs/:id 
// Supprime le joueur avec l'id passé en paramètre.
router.delete('/joueurs/:id', function(req, res, next) {
    var id = req.params.id;
    joueurs.remove(id,function(docs){
        res.json(docs);
    });
});

// API avancements

// POST /api/avancements 
// PAS IMPLEMENTE POUR LE MOMENT
 
// GET /api/avancements/:id?
// Retourne le JSON de l'avancement  avec l'ID "id" stocké dans la base de données
// Si :id est absent, retourne la liste de tous les avancements
router.get('/avancements/:id?', function(req, res, next) {
    if (req.params.id) {
        avancements.getOne(req.params.id,res,function(docs){
            res.json(docs);
        });
    } else {
        avancements.getAll(req,res,function(docs){
            res.json(docs);
        });
    }
});

// PUT /api/avancements/:id?
// Mettre à jour un avancement
router.put('/avancements/:id', function(req, res, next) {
    var id = req.params.id;
    var data = req.body;
    avancements.update(id,data,function(docs){
        res.json(docs);
    });
});

// DELETE /api/avancements/:id?
// Supprimer un avancement
router.delete('/avancements/:id', function(req, res, next) {
    var id = req.params.id;
    avancements.remove(id,function(docs){
        res.json(docs);
    });
});

module.exports = router;
