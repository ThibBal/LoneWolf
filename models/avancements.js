var mongo = require('mongodb');
var client = mongo.MongoClient;
var url = 'mongodb://lonewolf:poly25@ds045644.mongolab.com:45644/lonewolf';
//Groupe25-Poly> MongoLab Account
//username : "GP25-PL"

exports.getAll = function(req,res,callback) {
    client.connect(url, function (err, db){
        if (err) return;
        db.collection('avancements').find().toArray(function(err,docs){ 
            db.close();
            callback(docs);
        });
    });
};

exports.getOne = function(req,res,callback) {
    client.connect(url, function (err, db){
        if (err) return;
        var o_id = new mongo.ObjectID(req);
        db.collection('avancements').findOne({"_id" : o_id}, function(err,docs){ 
            db.close();
            callback(docs);
        });
    });
};

exports.insert = function(data,res,callback) {
    client.connect(url, function (err, db){
        if (err) return;
        db.collection('avancements').insertOne(data, function(err, docsInserted) {
            db.close();
            callback();
        });
    });
};;

exports.update = function(id,data,callback) {
    client.connect(url, function (err, db){
        if (err) return;
        var o_id = new mongo.ObjectID(id);
        db.collection('avancements').findOneAndUpdate({"_id": o_id}, data, {"returnOriginal": false}, function(err, result) {
            db.close();
            //Retourne le document mis à jour
            callback(result.value);            
        });
    });
};;

exports.remove = function(id,callback){
    client.connect(url, function (err, db){
        var o_id = new mongo.ObjectID(id);
        db.collection('avancements').findAndRemove({"_id": o_id}, function(err, result) {
            db.close();
            // Retourne le document supprimé
            callback(result.value);
        });
    });
};
