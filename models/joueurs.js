var mongo = require('mongodb');
var client = mongo.MongoClient;
var url = 'mongodb://lonewolf:poly25@ds045644.mongolab.com:45644/lonewolf';


exports.getAll = function(req,res,callback) {
    client.connect(url, function (err, db){
	if (err) return;
	db.collection('joueurs').find().toArray(function(err,docs){ 
	    db.close();
	    callback(docs);
	});
    });
};

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

exports.insert = function(data,res,callback) {
    client.connect(url, function (err, db){
	if (err) return;
	db.collection('joueurs').insertOne(data, 
                                         function(err, docsInserted) {
                         var id = docsInserted.ops[0]._id;
					     db.close();
					     callback(id);});
    });
};;

exports.update = function(req,res,callback) {
    client.connect(url, function (err, db){
	if (err) return;
	var o_id = new mongo.ObjectID(req.body.id);
	db.collection('joueurs').updateOne({"_id": o_id},req.body.joueur, 
                                         function() {
					     db.close();
					     callback();});
    });
};;

exports.remove = function(req,res,callback){
    client.connect(url, function (err, db){
	var o_id = new mongo.ObjectID(req.body.id);
	db.collection('joueurs').deleteOne({"_id": o_id}, 
                                         function() {
					     db.close();
					     callback();});
    });
};

/*exports.insert = function(req,res,callback) {
    client.connect(url, function (err, db){
	if (err) return;
	console.log(req.param('title'));
	db.collection('joueurs').insertOne({title: req.body.title,
					     name: req.body.name}, 
                                         function() {
					     db.close();
					     callback();});
    });
};;*/
