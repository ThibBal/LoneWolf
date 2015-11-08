var mongo = require('mongodb');
var client = mongo.MongoClient;
var url = 'mongodb://lonewolf:poly25@ds045644.mongolab.com:45644/lonewolf';

// Retourne tous les joueurs.
exports.getAll = function(req,res,callback) {
    client.connect(url, function (err, db){
        if (err) return;
        db.collection('joueurs').find().toArray(function(err,docs){ 
            db.close();
            callback(docs);
        });
    });
};

// Retourne un joueur en particulier.
exports.getOne = function(req,res,callback) {
    client.connect(url, function (err, db){
        if (err) return;
        var o_id = new mongo.ObjectID(req);
        db.collection('joueurs').findOne({"_id" : o_id}, function(err,docs){ 
            db.close();
            callback(docs);
        });
    });
};

// Ajoute un joueur.
exports.insert = function(data,res,callback) {
    client.connect(url, function (err, db){
        if (err) return;
        db.collection('joueurs').insertOne(data, function(err, docsInserted) {
            var id = docsInserted.ops[0]._id;
            db.close();
            callback(id);
        });
    });
};;

// Met à jour un joueur.
exports.update = function(id,data,callback) {
    client.connect(url, function (err, db){
        if (err) return;
        var o_id = new mongo.ObjectID(id);
        db.collection('joueurs').findOneAndUpdate({"_id": o_id}, {$set : data}, {"returnOriginal": false}, function(err, result) {
            db.close();
            //Retourne le document mis à jour
            callback(result.value);            
        });
    });
};;

// Supprime un joueur.
exports.remove = function(id,callback){
    client.connect(url, function (err, db){
        var o_id = new mongo.ObjectID(id);
        db.collection('joueurs').findAndRemove({"_id": o_id}, function(err, result) {
            db.close();
            callback();
        });
    });
};
