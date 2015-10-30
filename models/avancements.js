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
	db.collection('avancements').insertOne(data, 
                                         function(err, docsInserted) {
					     db.close();
					     callback();});
    });
};;

exports.update = function(req,res,callback) {
    client.connect(url, function (err, db){
	if (err) return;
	var o_id = new mongo.ObjectID(req.body.id);
	db.collection('avancements').updateOne({"_id": o_id},req.body.avancement, 
                                         function() {
					     db.close();
					     callback();});
    });
};;

exports.remove = function(req,res,callback){
    client.connect(url, function (err, db){
	var o_id = new mongo.ObjectID(req.body.id);
	db.collection('avancements').deleteOne({"_id": o_id}, 
                                         function() {
					     db.close();
					     callback();});
    });
};

/*exports.insert = function(req,res,callback) {
    client.connect(url, function (err, db){
	if (err) return;
	console.log(req.param('title'));
	db.collection('avancements').insertOne({title: req.body.title,
					     name: req.body.name}, 
                                         function() {
					     db.close();
					     callback();});
    });
};;*/
