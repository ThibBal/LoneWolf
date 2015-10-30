var client = require('mongodb').MongoClient;
var url = 'mongodb://lonewolf:poly25@ds045644.mongolab.com:45644/lonewolf';


exports.getAll = function(req,res,callback) {
    client.connect(url, function (err, db){
	if (err) return;
	db.collection('employes').find().toArray(function(err,docs){ 
	    console.log(docs);
	    db.close();
	    callback(docs);
	});
    });
};

exports.insert = function(req,res,callback) {
    client.connect(url, function (err, db){
	if (err) return;
	console.log(req.param('title'));
	db.collection('employes').insertOne({title: req.body.title,
					     name: req.body.name}, 
                                         function() {
					     db.close();
					     callback();});
    });
};;


exports.remove = function(req,res,callback){
    client.connect(url, function (err, db){
	console.log('Titre: ' + req.body.title);
	console.log('Nom: ' + req.body.name);
	db.collection('employes').deleteOne(req.body, function(){
					 db.close();
					 callback();});
    });
};